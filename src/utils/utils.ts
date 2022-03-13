import * as Moment from 'moment';
import { Booking, BookingType, IBooking } from '../types';
import { v4 as uuidv4 } from 'uuid';
import keyBy from 'lodash.keyby';
import groupBy from 'lodash.groupby';

import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

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

      headers.map((h: string, i: number) => {
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
export const convertBooking = (bookings: Booking[] | IBooking[]) => {
  return bookings.map((booking, index) => {
    return {
      ...booking,
      // convert time to ensure matches Date.parse value
      time: moment(booking.time).unix() * 1000,
      date: moment(booking.time).format('YYYY-MM-DD'),
      id: booking.id ?? uuidv4(),
      title: `Booking with user ${booking.userId}`,
      startTime: moment(booking.time),
      // TODO clean this up in the toJSON cleanup
      endTime:
        booking.status === BookingType.New
          ? moment(booking.time).add(booking.duration, 'm')
          : moment(booking.time).add(booking.duration, 'ms'),
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
    const newBookRange = moment.range(newBook.startTime, newBook.endTime);
    const bookingDate = newBook.date;
    const existingMatchingBookingDate = keyedExistingObject[bookingDate];
    console.log(existingMatchingBookingDate);
    const overlapped: string[] = [];

    if (existingMatchingBookingDate) {
      existingMatchingBookingDate.forEach((bookingToCheck) => {
        const existingBookRange = moment.range(
          bookingToCheck.startTime,
          bookingToCheck.endTime
        );
        if (newBookRange.overlaps(existingBookRange)) {
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
