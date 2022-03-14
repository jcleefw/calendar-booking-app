import { Booking, BookingType, IBooking } from '../types';
import { v4 as uuidv4 } from 'uuid';
import groupBy from 'lodash.groupby';
import { format, add, areIntervalsOverlapping } from 'date-fns';

// TODO test data ... make sure no white spce
export const toJSON = (csv: string | null | any): Booking[] | null => {
  if (csv && csv !== '') {
    const lines = csv.split('\n');
    const result: any = [];
    const headers = lines[0].split(',');
    const content = lines.splice(1, lines.length);

    content.forEach((l: string) => {
      const obj: any = {};
      const line = l.split(',');

      headers.forEach((h: string, i: number) => {
        if (line[i]) {
          obj[h.trim()] = line[i].trim();
        }
      });

      // do not add empty line to array
      if (Object.keys(obj).length !== 0) {
        result.push(obj);
      }
    });

    return JSON.parse(JSON.stringify(result));
  }
  return null;
};

// TODO do we need this? write test, also double check typings for Ibooking
export const decorateBooking = (bookings: Booking[] | IBooking[]) => {
  return bookings.map((booking) => {
    const startTime = new Date(booking.time);
    return {
      ...booking,
      duration: Number(booking.duration),
      time: startTime.getTime(),
      date: format(startTime, 'yyyy-MM-dd'),
      id: booking.id ?? uuidv4(),
      title: `Booking with user ${booking.userId}`,
      startTime: startTime,
      endTime: add(startTime, { minutes: Number(booking.duration) }),
    };
  });
};

export const markBookingConflicts = (
  existingBookings: IBooking[],
  newBookings: IBooking[]
) => {
  // group bookings into dates with the id as ref
  const keyedExistingObject = groupBy(
    existingBookings,
    (object: IBooking) => object.date
  );
  console.log(keyedExistingObject);

  const something = newBookings.map((newBook: IBooking) => {
    const bookingDate = newBook.date;
    const existingMatchingBookingDate = keyedExistingObject[bookingDate];
    console.log(existingMatchingBookingDate);
    const overlapped: string[] = [];

    if (existingMatchingBookingDate) {
      existingMatchingBookingDate.forEach((bookingToCheck) => {
        const isOverlapped = areIntervalsOverlapping(
          { start: newBook.startTime, end: newBook.endTime },
          { start: bookingToCheck.startTime, end: bookingToCheck.endTime }
        );
        if (isOverlapped) {
          overlapped.push(bookingToCheck.id);
        }
      });
    }

    if (overlapped.length) {
      newBook.status = BookingType.Conflict;
      newBook.conflictWith = overlapped;
    }
    return newBook;
  });

  return something;
};
