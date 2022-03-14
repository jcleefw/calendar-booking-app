import { Booking, BookingType, IBooking } from '../../types';
import { decorateBooking, markBookingConflicts, toJSON } from '../helpers';

describe('#toJSON', () => {
  it('should parse csv to JSON object', () => {
    const data =
      'time, duration, userId\n01 Mar 2020 11:00:00 GMT+1000, 300, 0001\n02 Mar 2020 14:00:00 GMT+1000, 300, 0001\n03 Mar 2020 11:00:00 GMT+1000, 180, 0001\n04 Mar 2020 11:00:00 GMT+1000, 180, 0001\n06 Mar 2020 14:00:00 GMT+1000, 300, 0001\n03 Mar 2020 16:00:00 GMT+1000, 300, 0002\n06 Mar 2020 03:00:00 GMT+1000, 480, 0002\n03 Mar 2020 06:00:00 GMT+1000, 180, 0003\n';
    const result = toJSON(data) as Booking[];
    expect(result).toHaveLength(8);
    expect(result[3]).toEqual({
      time: '04 Mar 2020 11:00:00 GMT+1000',
      duration: '180',
      userId: '0001',
    });
    expect(result[7]).toEqual({
      time: '03 Mar 2020 06:00:00 GMT+1000',
      duration: '180',
      userId: '0003',
    });
  });

  it('should return null when empty string is passed in', () => {
    const data = '';
    expect(toJSON(data)).toEqual(null);
  });

  it('should return null when empty string is passed in', () => {
    const data = null;
    expect(toJSON(data)).toEqual(null);
  });
});

describe('#markBookingConflicts', () => {
  const existing: IBooking[] = [
    {
      time: 1583024400000,
      duration: 180,
      userId: '0001',
      status: 'existing',
      date: '2020-03-01',
      id: '11f49962-c221-40fe-ad71-184ed684729b',
      startTime: new Date('2020-03-01T01:00:00.000Z'),
      endTime: new Date('2020-03-01T04:00:00.000Z'),
    },
  ];
  it('when 2 bookings are overlapped, mark new booking as conflict', () => {
    const newBookings: IBooking[] = [
      {
        time: 1583024400000,
        duration: 300,
        userId: '0001',
        status: 'new',
        date: '2020-03-01',
        id: '334ff507-4bba-436c-b230-213f1f59ce56',
        startTime: new Date('2020-03-01T01:00:00.000Z'),
        endTime: new Date('2020-03-01T01:00:00.300Z'),
      },
    ];
    expect(markBookingConflicts(existing, newBookings)).toEqual([
      {
        ...newBookings[0],
        status: BookingType.Conflict,
        conflictWith: [existing[0].id],
      },
    ]);
  });

  it('when 2 bookings are NOT overlapped', () => {
    const newBookings: IBooking[] = [
      {
        time: 1583024400000,
        duration: 300,
        userId: '0001',
        status: 'new',
        date: '2020-03-02',
        id: '334ff507-4bba-436c-b230-213f1f59ce56',
        startTime: new Date('2020-03-01T01:00:00.000Z'),
        endTime: new Date('2020-03-01T01:00:00.300Z'),
      },
    ];
    expect(markBookingConflicts(existing, newBookings)).toEqual([
      {
        ...newBookings[0],
        status: BookingType.New,
      },
    ]);
  });

  it('when 3 bookings are overlapped', () => {
    const newBookings: IBooking[] = [
      {
        time: 1583024400000,
        duration: 300,
        userId: '0001',
        status: 'new',
        date: '2020-03-02',
        id: '334ff507-4bba-436c-b230-213f1f59ce56',
        startTime: new Date('2020-03-01T01:00:00.000Z'),
        endTime: new Date('2020-03-01T01:00:00.300Z'),
      },
      {
        time: 1583024400000,
        duration: 300,
        userId: '0001',
        status: 'new',
        date: '2020-03-01',
        id: '334ff507-4bba-436c-b230-213f1f59sdfwe',
        startTime: new Date('2020-03-01T01:00:00.000Z'),
        endTime: new Date('2020-03-01T01:00:00.300Z'),
      },
    ];
    expect(markBookingConflicts(existing, newBookings)).toEqual([
      {
        ...newBookings[0],
        status: BookingType.New,
      },
      {
        ...newBookings[1],
        conflictWith: [existing[0].id],
        status: BookingType.Conflict,
      },
    ]);
  });
});

describe('#decorateBooking', () => {
  it('will decorate existing bookings to what is required', () => {
    const dataFromServer: Booking[] = [
      {
        id: 'f7980171-d6bd-4dea-8c2c-91717e8f77fb',
        time: 1583024400000,
        duration: 180,
        userId: '0001',
        status: 'existing',
      },
    ];

    expect(decorateBooking(dataFromServer)).toEqual([
      {
        date: '2020-03-01',
        duration: 180,
        endTime: new Date('2020-03-01T04:00:00.000Z'),
        id: 'f7980171-d6bd-4dea-8c2c-91717e8f77fb',
        startTime: new Date(1583024400000),
        status: 'existing',
        time: 1583024400000,
        title: 'Booking with user 0001',
        userId: '0001',
      },
    ]);
  });

  it('will decorate new bookings to what is required', () => {
    const dataFromServer: Booking[] = [
      {
        time: '01 Mar 2020 11:00:00 GMT+1000',
        duration: '300',
        userId: '0001',
        status: 'new',
      },
    ];

    expect(decorateBooking(dataFromServer)).toEqual([
      {
        date: '2020-03-01',
        duration: 300,
        endTime: new Date('2020-03-01T06:00:00.000Z'),
        id: expect.anything(),
        startTime: new Date('01 Mar 2020 11:00:00 GMT+1000'),
        status: 'new',
        time: new Date('01 Mar 2020 11:00:00 GMT+1000').getTime(),
        title: 'Booking with user 0001',
        userId: '0001',
      },
    ]);
  });
});
