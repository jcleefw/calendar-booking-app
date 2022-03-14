type TimeStamp = string;
type Minutes = number | string;

export enum BookingType {
  New = 'new',
  Existing = 'existing',
  Conflict = 'conflict',
}

export interface Booking {
  id?: string;
  time: TimeStamp | number;
  duration: Minutes;
  userId: string;
  status: string;
}

export interface IBooking extends Exclude<Booking, 'duration'> {
  id: string;
  date: string;
  duration: number;
  startTime: Date;
  endTime: Date;
  conflictWith?: string[];
}
