import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { handler, publishEvent } from 'src';
import { constants } from 'http2';

vi.mock('axios');

const mockedAxios = vi.mocked(axios, true);

const mockKinesisRecord = (mockedBookingEvent: any) => ({
  Records: [
    {
      kinesis: {
        data: Buffer.from(JSON.stringify(mockedBookingEvent)).toString(
          'base64'
        ),
      },
    },
  ],
});

describe('handler', () => {
  it('should transform and publish event if booking type is booking_completed', async () => {
    const mockedBookingEvent = {
      type: 'booking_completed',
      booking_completed: {
        orderId: 123,
        product_provider: 'P&O Ferries',
        timestamp: '2024-06-13T12:00:00Z',
      },
    };
    const mockedTransformedEvent = {
      product_order_id_buyer: 123,
      timestamp: '2024-06-13T12:00:00.000Z',
      product_provider_buyer: 'P&O Ferries',
    };

    const event = mockKinesisRecord(mockedBookingEvent);

    mockedAxios.post.mockResolvedValue({ status: 200 });

    await handler(event as any);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:3000',
      mockedTransformedEvent
    );
  });

  it('should not transform and publish event if booking type is not booking_completed', async () => {
    const mockedBookingEvent = {
      type: 'not_booked',
      booking_completed: {
        orderId: 123,
        product_provider: 'P&O Ferries',
        timestamp: '2024-06-13T12:00:00Z',
      },
    };

    const event = mockKinesisRecord(mockedBookingEvent);
    await handler(event as any);
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });
});

describe('publishEvent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    console.error = vi.fn();
    console.log = vi.fn();
  });

  it('should publish event successfully', async () => {
    const mockedTransformedEvent = {
      product_order_id_buyer: 123,
      timestamp: '2024-06-13T12:00:00.000Z',
      product_provider_buyer: 'P&O Ferries',
    };

    mockedAxios.post.mockResolvedValue({ status: constants.HTTP_STATUS_OK });

    await publishEvent(mockedTransformedEvent);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:3000',
      mockedTransformedEvent
    );
    expect(console.log).toHaveBeenCalledWith(
      `Event_Id:${mockedTransformedEvent.product_order_id_buyer} was successfully published`
    );
  });

  it('should handle body validation failure', async () => {
    const mockedTransformedEvent = {
      product_order_id_buyer: 123,
      timestamp: undefined,
      product_provider_buyer: undefined,
    };

    mockedAxios.post.mockResolvedValue({
      status: constants.HTTP_STATUS_BAD_REQUEST,
    });

    await publishEvent(mockedTransformedEvent as any);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:3000',
      mockedTransformedEvent
    );
    expect(console.error).toHaveBeenCalledWith(
      new Error(
        `Failed, body did not pass validation: ${mockedTransformedEvent.product_order_id_buyer}`
      )
    );
  });

  it('should handle publish event failure', async () => {
    const mockedTransformedEvent = {
      product_order_id_buyer: 123,
      timestamp: '2024-06-13T12:00:00.000Z',
      product_provider_buyer: 'P&O Ferries',
    };

    mockedAxios.post.mockResolvedValue({
      status: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
    });

    await publishEvent(mockedTransformedEvent);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:3000',
      mockedTransformedEvent
    );
    expect(console.error).toHaveBeenCalledWith(
      new Error(
        `Failed to publish event: ${mockedTransformedEvent.product_order_id_buyer}`
      )
    );
  });
});
