export interface Booking {
    forEach(arg0: (currentBooking: Booking) => void): unknown;
    description: string;
    roomName: string;
    monthOffset: number;
    checkIn: number;
    checkOut: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    fixMe: boolean;
    expectedSuccess: boolean;
    expectedMessage: string;
  }