import { Booking } from '../App';
import moment from 'moment';
import { Box, Container, Flex, Grid, GridItem } from '@chakra-ui/layout';

interface CalendarProps {
  bookings: Booking[];
}

const startMonth = '2020-03';
const daysInMonth = moment(startMonth).daysInMonth();

export const GridCalendar = ({ bookings }: CalendarProps) => {
  const BookingType = {
    existing: { id: 1, title: 'Existing bookings' },
    new: { id: 2, title: 'new booking' },
  };

  const convertBooking = (bookings: Booking[]) => {
    return bookings.map((booking, index) => {
      return {
        id: index,
        group: BookingType.existing.id,
        title: `Booking with user ${booking.userId}`,
        userId: booking.userId,
        start_time: moment(booking.time),
        end_time: moment(booking.time).add(booking.duration, 'ms'),
      };
    });
  };

  const generateTableHeader = () => {
    const headers = [];
    for (let count = 0; count < 24; count++) {
      const hour = count.toString().length === 1 ? `0${count}` : count;
      headers.push(<th className="column">{`${hour}:00`}</th>);
    }
    return [<th></th>, headers];
  };

  const generateMonthRow = () => {
    const rows = [];
    const generatedColumns = generateTableColumn();

    for (let day = 0; day < daysInMonth; day++) {
      const labelColumn = (
        <GridItem sx={{ ...styles.row }}>
          {moment(`${startMonth}-${day + 1}`).format('DD/MM')}
        </GridItem>
      );
      const columns = [labelColumn, generatedColumns[day]];

      rows.push(
        <GridItem sx={{ ...styles.row }}>
          <Grid
            templateColumns="100px repeat(24, 1fr)"
            templateRows="repeat(3, 1fr)"
          >
            {columns}
          </Grid>
        </GridItem>
      );
    }
    return rows;
  };

  const styles = {
    row: {
      height: '150px',
      background: '#85838361',
    },
  };

  const generateTableColumn = () => {
    const monthArray = Array(daysInMonth);
    bookings.forEach((item, index) => {
      const itemBookingDate = moment(item.time).date();
      console.log('item', item);
      const element = (
        <GridItem
          height="30px"
          bg="tomato"
          gridColumnStart={moment(item.time).hour()}
          gridColumnEnd={moment(item.time).add(item.duration, 'ms').hour()}
          gridRowStart={1}
          alignSelf="center"
        >
          {item.userId},{moment(item.time).format('hh:mm')}
        </GridItem>
      );
      if (monthArray[itemBookingDate - 1]) {
        monthArray[itemBookingDate - 1].push(element);
      } else {
        monthArray[itemBookingDate - 1] = [element];
      }
    });
    console.log('monthArray', monthArray);
    return monthArray;
  };

  console.log(convertBooking(bookings));
  return (
    <Container style={{ width: '100%' }}>
      <h2>I am calendar</h2>
      <Flex flexDirection={'column'}>
        <Box flexDirection={'column'}>
          <Grid
            // templateColumns="100px repeat(24, 1fr)"
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
