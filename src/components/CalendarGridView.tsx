import { useEffect } from 'react';
import moment from 'moment';
import { Box, Container, Flex, Grid, GridItem } from '@chakra-ui/layout';
import { generateCalendarHeader } from './CalendarHeader';
import { Booking, BookingType } from '../types';
import cssStyles from './calendar.module.css';
import cx from 'classnames';

interface CalendarProps {
  bookings: Booking[];
}

const startMonth = '2020-03';
const daysInMonth = moment(startMonth).daysInMonth();

export const GridCalendar = ({ bookings }: CalendarProps) => {
  const generateMonthRow = () => {
    const rows = [];
    const generatedColumns = generateTableColumn(bookings);

    for (let day = 0; day < daysInMonth; day++) {
      const labelColumn = (
        <GridItem className={cssStyles.row}>
          {moment(`${startMonth}-${day + 1}`).format('DD/MM')}
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

  const generateTableColumn = (bookings: Booking[]) => {
    const monthArray = Array(daysInMonth);
    bookings.forEach((booking) => {
      const itemBookingDate = moment(booking.time).date();
      const element = (
        <GridItem
          gridColumnStart={moment(booking.time).hour()}
          gridColumnEnd={moment(booking.time)
            .add(booking.duration, 'ms')
            .hour()}
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
            <span>at {moment(booking.time).format('hh:mm a')}</span>
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
      <h2>I am calendar</h2>
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
