import { useEffect } from 'react';
import { Box, Container, Flex, Grid, GridItem } from '@chakra-ui/layout';
import { generateCalendarHeader } from './CalendarHeader';
import { BookingType, IBooking } from '../types';
import cssStyles from './calendar.module.css';
import cx from 'classnames';
import { format, getDaysInMonth } from 'date-fns';

interface CalendarProps {
  bookings: IBooking[];
  newBookings: IBooking[];
}

const startMonth = new Date(2020, 2);
const daysInMonth = getDaysInMonth(startMonth);

export const GridCalendar = ({ bookings, newBookings }: CalendarProps) => {
  const generateMonthRow = () => {
    const rows = [];
    const generatedColumns = generateTableColumn([...bookings, ...newBookings]);

    for (let day = 0; day < daysInMonth; day++) {
      const labelColumn = (
        <GridItem className={cssStyles.row}>
          {format(new Date(2020, 2, day + 1), 'dd-MM')}
        </GridItem>
      );
      const columns = [labelColumn, generatedColumns[day]];

      rows.push(
        <GridItem className={cssStyles.row}>
          <Grid
            templateColumns="100px repeat(24, 1fr)"
            templateRows="repeat(3, 1fr)"
            gridColumnGap="1px"
          >
            {columns}
          </Grid>
        </GridItem>
      );
    }
    return [generateCalendarHeader(), rows];
  };

  const generateTableColumn = (bookings: IBooking[]) => {
    const monthArray = Array(daysInMonth);
    bookings.forEach((booking) => {
      const itemBookingDate = booking.startTime.getDate();
      debugger;
      const element = (
        <GridItem
          gridColumnStart={booking.startTime.getHours() + 2}
          gridColumnEnd={booking.endTime.getHours() + 2}
          gridRowStart={1}
          alignSelf="center"
        >
          <Flex
            className={cx(cssStyles.bookings, {
              [cssStyles.booked]: booking.status === BookingType.Existing,
              [cssStyles.new]: booking.status === BookingType.New,
              [cssStyles.conflict]: booking.status === BookingType.Conflict,
            })}
          >
            <span>Booking with {booking.userId}</span>
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

  useEffect(() => {
    console.log('bookings are:', bookings);
  }, [bookings]);
  return (
    <Container style={{ width: '100%' }}>
      <h2>Bookings</h2>
      <Flex flexDirection={'column'}>
        <Box flexDirection={'column'}>
          <Grid
            templateRows="100% repeat(31, 1fr}"
            gap={6}
            border={'1px solid: #ccc'}
          >
            {generateMonthRow()}
          </Grid>
        </Box>
      </Flex>
    </Container>
  );
};
