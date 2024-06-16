import { KinesisStreamEvent } from 'aws-lambda';
import axios from 'axios';
import { BookingCompletedEvent, BookingTypes } from './interfaces';
import { constants } from 'http2';

interface TransformedEvent {
  product_order_id_buyer: number;
  product_provider_buyer: string;
  timestamp: string;
}

const PUBLISH_URL = process.env.PUBLISH_URL || 'http://localhost:3000';

const transformEvent = ({
  booking_completed,
}: BookingCompletedEvent): TransformedEvent => ({
  product_order_id_buyer: booking_completed.orderId,
  product_provider_buyer: booking_completed.product_provider,
  timestamp: new Date(booking_completed.timestamp).toISOString(),
});

export const publishEvent = async (event: TransformedEvent) => {
  try {
    const response = await axios.post(PUBLISH_URL, event);
    if (response.status === constants.HTTP_STATUS_BAD_REQUEST)
      throw new Error(
        `Failed, body did not pass validation: ${event.product_order_id_buyer}`
      );
    if (response.status !== constants.HTTP_STATUS_OK)
      throw new Error(
        `Failed, to publish event: ${event.product_order_id_buyer}`
      );
    console.log(
      `Event_Id:${event.product_order_id_buyer} was successfully published`
    );
  } catch (error) {
    console.error(error);
  }
};

export const handler = async (event: KinesisStreamEvent) => {
  if (!event?.Records?.length) return;
  for (const record of event.Records) {
    if (!record?.kinesis?.data) return;
    const payload = Buffer.from(record.kinesis.data, 'base64').toString(
      'utf-8'
    );
    const bookingEvent: BookingCompletedEvent = JSON.parse(payload);
    if (bookingEvent?.type === BookingTypes.bookingCompleted) {
      const transformedEvent = transformEvent(bookingEvent);
      await publishEvent(transformedEvent);
    }
  }
};
