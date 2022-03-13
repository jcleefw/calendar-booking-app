import moment from 'moment';

type TimeStamp = string;
type Seconds = number;

export enum BookingType {
  New = 'new',
  Existing = 'existing',
  Conflict = 'conflict',
}

export interface Booking {
  id: string;
  time: TimeStamp | number;
  duration: Seconds;
  userId: string;
  status: BookingType;
}

export interface IBooking extends Booking {
  title: string;
  date: string;
  startTime: moment.Moment;
  endTime: moment.Moment;
  conflictWith?: string[];
}
