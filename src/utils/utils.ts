import moment from 'moment';
import { Booking } from '../types';
import { v4 as uuidv4 } from 'uuid';

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
          obj[h.trim()] = line[i];
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

export const convertBooking = (bookings: Booking[]) => {
  return bookings.map((booking, index) => {
    return {
      ...booking,
      id: booking.id ?? uuidv4(),
      title: `Booking with user ${booking.userId}`,
      start_time: moment(booking.time),
      end_time: moment(booking.time).add(booking.duration, 'ms'),
    };
  });
};
