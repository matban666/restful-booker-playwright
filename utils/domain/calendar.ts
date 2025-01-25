export class Calendar {
    static getMonthYear(monthOffset: number = 0): string {
        const today = new Date();
        today.setMonth(today.getMonth() + monthOffset)
        const monthName = today.toLocaleString('default', { month: 'long' });
        const year = today.getFullYear();
        const monthYear = `${monthName} ${year}`;
        return monthYear;
    }

    static getTwoDigitDay(): string {
        const today = new Date();
        const day = today.getDate().toString().padStart(2, '0');
        return day;
    }

    static getCheckInAndCheckOutStrings(
        monthOffset: number,
        checkIn: number,
        checkOut: number
    ): { checkInString: string; checkOutString: string } {
        // There is some duplication here that could be refactored
        const today = new Date();
        today.setMonth(today.getMonth() + monthOffset);
        const year = today.getFullYear().toString();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
    
        const checkInString = `${year}-${month}-${checkIn.toString().padStart(2, '0')}`;
        const checkOutString = `${year}-${month}-${checkOut.toString().padStart(2, '0')}`;
    
        return { checkInString, checkOutString };
    }
}