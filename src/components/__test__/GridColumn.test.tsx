import { render, screen } from '@testing-library/react';
import { GridColumn } from '../GridColumn';
import '@testing-library/jest-dom/extend-expect';

describe('GridColumn', () => {
  it('expect to generate dom with new booking', () => {
    const booking = {
      time: 1583024400000,
      duration: 300,
      userId: '0001',
      status: 'new',
      date: '2020-03-02',
      id: '334ff507-4bba-436c-b230-213f1f59ce56',
      startTime: new Date('2020-03-01T01:00:00.000Z'),
      endTime: new Date('2020-03-01T06:00:00.300Z'),
    };
    render(<GridColumn data-testid={'grid-column'} booking={booking} />);
    expect(screen.getByTestId('grid-column')).toHaveTextContent(
      'New Booking with 0001at 12:00 pm'
    );
    expect(screen.getByTestId('grid-column')).toHaveStyle(
      'grid-column-start: 14'
    );

    expect(screen.getByTestId('grid-column')).toHaveStyle(
      'grid-column-end: 19'
    );
  });

  it('expect to generate dom with new booking', () => {
    const booking = {
      time: 1583024400000,
      duration: 300,
      userId: '0001',
      status: 'existing',
      date: '2020-03-02',
      id: '334ff507-4bba-436c-b230-213f1f59ce56',
      startTime: new Date('2020-03-01T01:00:00.000Z'),
      endTime: new Date('2020-03-01T06:00:00.300Z'),
    };
    render(<GridColumn data-testid={'grid-column'} booking={booking} />);
    expect(screen.getByTestId('grid-column')).toHaveTextContent(
      'Booking with 0001at 12:00 pm'
    );
    expect(screen.getByTestId('grid-column')).toHaveStyle(
      'grid-column-start: 14'
    );

    expect(screen.getByTestId('grid-column')).toHaveStyle(
      'grid-column-end: 19'
    );
  });

  it('expect to generate dom with new booking', () => {
    const booking = {
      time: 1583024400000,
      duration: 300,
      userId: '0001',
      status: 'conflict',
      date: '2020-03-02',
      id: '334ff507-4bba-436c-b230-213f1f59ce56',
      startTime: new Date('2020-03-01T01:00:00.000Z'),
      endTime: new Date('2020-03-01T06:00:00.300Z'),
    };
    render(<GridColumn data-testid={'grid-column'} booking={booking} />);
    expect(screen.getByTestId('grid-column')).toHaveTextContent(
      'Conflict for 0001at 12:00 pm'
    );
    expect(screen.getByTestId('grid-column')).toHaveStyle(
      'grid-column-start: 14'
    );

    expect(screen.getByTestId('grid-column')).toHaveStyle(
      'grid-column-end: 19'
    );
  });
});
