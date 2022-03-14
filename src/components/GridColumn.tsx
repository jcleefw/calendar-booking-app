import { GridItem, Flex } from '@chakra-ui/layout';
import { format } from 'date-fns';
import { IBooking, BookingType } from '../types';
import { daysInMonth } from './CalendarGridView';
import styles from './calendar.module.css';
import cx from 'classnames';

export const generateGridColumn = (bookings: IBooking[]) => {
  const monthArray = Array(daysInMonth);
  bookings.forEach((booking) => {
    const itemBookingDate = booking.startTime.getDate();
    const element = (
      <GridItem
        gridColumnStart={booking.startTime.getHours() + 2}
        gridColumnEnd={booking.endTime.getHours() + 2}
        gridRowStart={1}
        alignSelf="center"
        key={`column-${booking.id}`}
      >
        <Flex
          className={cx(styles.bookings, {
            [styles.booked]: booking.status === BookingType.Existing,
            [styles.new]: booking.status === BookingType.New,
            [styles.conflict]: booking.status === BookingType.Conflict,
          })}
        >
          {booking.status === BookingType.Conflict && (
            <span>Conflict for {booking.userId}</span>
          )}
          {booking.status === BookingType.Existing && (
            <span>Booking with {booking.userId}</span>
          )}
          {booking.status === BookingType.New && (
            <span>New Booking with {booking.userId}</span>
          )}

          <span>at {format(booking.startTime, 'hh:mm aaa')}</span>
        </Flex>
      </GridItem>
    );
    if (monthArray[itemBookingDate - 1]) {
      monthArray[itemBookingDate - 1].push(element);
    } else {
      monthArray[itemBookingDate - 1] = [element];
    }
  });
  return monthArray;
};
