import { useEffect } from 'react';
import { Box, Container, Flex, Grid, GridItem } from '@chakra-ui/layout';
import { generateCalendarHeader } from './CalendarHeader';
import { IBooking } from '../types';
import cssStyles from './calendar.module.css';
import { format, getDaysInMonth } from 'date-fns';
import { generateGridColumn } from './GridColumn';

interface CalendarProps {
  bookings: IBooking[];
  newBookings: IBooking[];
}

const startMonth = new Date(2020, 2);
export const daysInMonth = getDaysInMonth(startMonth);

export const GridCalendar = ({ bookings, newBookings }: CalendarProps) => {
  const generateMonthRow = () => {
    const rows = [];
    const generatedColumns = generateGridColumn([...bookings, ...newBookings]);

    for (let day = 0; day < daysInMonth; day++) {
      const labelColumn = (
        <GridItem key={`month-label-${day}`} className={cssStyles.row}>
          {format(new Date(2020, 2, day + 1), 'dd-MM')}
        </GridItem>
      );
      const columns = [labelColumn, generatedColumns[day]];
      rows.push(
        <GridItem key={`month-row-${day}`} className={cssStyles.row}>
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

  useEffect(() => {
    console.log('bookings are:', bookings);
  }, [bookings]);
  return (
    <Container style={{ width: '100%' }}>
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
