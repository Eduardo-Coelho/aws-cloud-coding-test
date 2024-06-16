export enum BookingTypes {
  bookingCompleted = 'booking_completed',
}

export interface BookingCompletedEvent {
  id: string;
  partitionKey: string;
  timestamp: number;
  type: BookingTypes.bookingCompleted;
  booking_completed: {
    orderId: number;
    product_provider: string;
    timestamp: number;
  };
}
