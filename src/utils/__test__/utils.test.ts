import moment from 'moment';
import { BookingType } from '../../types';
import { markBookingConflicts, toJSON } from '../utils';

describe('#toJSON', () => {
  it('should parse csv to JSON object', () => {
    const data =
      'time, duration, userId\n01 Mar 2020 11:00:00 GMT+1000, 300, 0001\n02 Mar 2020 14:00:00 GMT+1000, 300, 0001\n03 Mar 2020 11:00:00 GMT+1000, 180, 0001\n04 Mar 2020 11:00:00 GMT+1000, 180, 0001\n06 Mar 2020 14:00:00 GMT+1000, 300, 0001\n03 Mar 2020 16:00:00 GMT+1000, 300, 0002\n06 Mar 2020 03:00:00 GMT+1000, 480, 0002\n03 Mar 2020 06:00:00 GMT+1000, 180, 0003\n';
    expect(toJSON(data)).toHaveLength(8);
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
  const existing = [
    {
      time: 1583024400000,
      duration: 10800000,
      userId: '0001',
      status: 'existing',
      date: '2020-03-01',
      id: '11f49962-c221-40fe-ad71-184ed684729b',
      title: 'Booking with user 0001',
      startTime: moment('2020-03-01T01:00:00.000Z'),
      endTime: moment('2020-03-01T04:00:00.000Z'),
    },
  ];
  const newBookings = [
    {
      time: 1583024400000,
      duration: '300',
      userId: '0001',
      status: 'new',
      date: '2020-03-01',
      id: '334ff507-4bba-436c-b230-213f1f59ce56',
      title: 'Booking with user 0001',
      startTime: moment('2020-03-01T01:00:00.000Z'),
      endTime: moment('2020-03-01T01:00:00.300Z'),
    },
  ];

  it('expect to detect and mark new booking as conflict', () => {
    expect(markBookingConflicts(existing, newBookings)).toEqual([
      {
        ...newBookings[0],
        status: BookingType.Conflict,
        conflictWith: [existing[0].id],
      },
    ]);
  });

  // TODO more test
});
