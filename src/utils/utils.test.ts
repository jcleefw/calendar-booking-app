import { toJSON } from './utils';

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
