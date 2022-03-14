import { Booking, BookingType, IBooking } from '../types';
import { v4 as uuidv4 } from 'uuid';
import groupBy from 'lodash.groupby';
import { format, add, areIntervalsOverlapping } from 'date-fns';

/**
 * Converts a csv string file into JSON object.
 * This function will trim off white space from key and value.
 *
 * @param csv
 * @returns Booking[] | null
 *
 */
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

/**
 *
 * Decorate the booking object with all additional calculation for usage
 *
 * @param bookings
 * @returns IBooking[]
 */

export const decorateBooking = (
  bookings: Booking[] | IBooking[]
): IBooking[] => {
  return bookings.map((booking) => {
    const startTime = new Date(booking.time);
    return {
      ...booking,
      duration: Number(booking.duration),
      time: startTime.getTime(),
      date: format(startTime, 'yyyy-MM-dd'),
      id: booking.id ?? uuidv4(),
      startTime: startTime,
      endTime: add(startTime, { minutes: Number(booking.duration) }),
    };
  });
};

/**
 * Repopulate the new bookings and mark bookings as conflict if it overlaps with existing booking.
 *
 * If conflict is found, this function will update new booking with the following props
 * - status: BookingType.New => BookingType.Conflict
 * - conflictWith: Will provide array of existing ids that booking is in conflict with
 *
 * @param existingBookings
 * @param newBookings
 * @returns
 */
export const markBookingConflicts = (
  existingBookings: IBooking[],
  newBookings: IBooking[]
): IBooking[] => {
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
