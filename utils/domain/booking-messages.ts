import { Calendar } from '../domain/calendar';

export interface BookingMessage {
    room: string;
    message: string; 
    checkInString: string;
    checkOutString: string;
    phone: string;
    email: string;
    expectedMessage: string;
  }

export function getExpectedMessages(bookings): Record<string, BookingMessage[]> {
    let expectedMessages: Record<string, BookingMessage[]> = {}; 

    bookings.forEach((booking) => {
        if (booking.expectedSuccess && !booking.fixMe) {
            const contactName = booking.firstname + ' ' + booking.lastname;

            const { checkInString, checkOutString } = Calendar.getCheckInAndCheckOutStrings(booking.monthOffset, booking.checkIn, booking.checkOut);

            const expectedMessage = `You have a new booking from ${booking.firstname} ${booking.lastname}. They have booked a room for the following dates: ${checkInString} to ${checkOutString}`;

            if (contactName in expectedMessages) {
            expectedMessages[contactName].push({
                room: booking.roomName,
                message: expectedMessage,
                checkInString: checkInString,
                checkOutString: checkOutString,
                phone: booking.phone,
                email: booking.email,
                expectedMessage: expectedMessage
            });
            } else {
            expectedMessages[contactName] = [{
                room: booking.roomName,
                message: expectedMessage, 
                checkInString: checkInString,
                checkOutString: checkOutString,
                phone: booking.phone,
                email: booking.email,
                expectedMessage: expectedMessage
            }];
            }
        }
    });
      
    return expectedMessages;
}
  
      