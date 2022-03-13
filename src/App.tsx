import { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import './App.css';
import { GridCalendar } from './components/CalendarGridView';
import { Booking, BookingType } from './types';
import { convertBooking, toJSON } from './utils/utils';

const apiUrl = 'http://localhost:3001';

export const App = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [newBookings, setNewBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetch(`${apiUrl}/bookings`)
      .then((response) => response.json())
      .then((result) => {
        return result.map((item: Booking) => {
          item['status'] = BookingType.Existing;
          return item;
        });
      })
      .then((result) => convertBooking(result))
      .then(setBookings);
  }, []);

  const onDrop = (files: File[]) => {
    if (files.length > 0) {
      // TODO support multiple files upload at one go
      console.log(files);
      const reader = new FileReader();

      try {
        reader.onload = () => {
          if (reader.result) {
            const csvFileRead = reader.result;
            const data = toJSON(csvFileRead);
            const parsedBookings = data?.map((item: Booking) => {
              item['status'] = BookingType.New;
              return item;
            });
            if (parsedBookings) setNewBookings(parsedBookings);
          }
        };
        reader.readAsBinaryString(files[0]);
      } catch (err) {
        console.log('err reading file', err, files[0]);
      }
    }
  };

  return (
    <div className="App">
      <div className="App-header">
        <Dropzone accept=".csv" onDrop={onDrop} maxFiles={1}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drop some files here, or click to select files</p>
              </div>
            </section>
          )}
        </Dropzone>
      </div>
      <GridCalendar bookings={bookings} newBookings={newBookings} />
      <div className="App-main">
        <p>Existing bookings:</p>
        {/* {bookings.map((booking, i) => {
          const date = new Date(booking.time);
          const duration = booking.duration / (60 * 1000);
          return (
            <p key={i} className="App-booking">
              <span className="App-booking-time">{date.toString()}</span>
              <span className="App-booking-duration">
                {duration.toFixed(1)}
              </span>
              <span className="App-booking-user">{booking.userId}</span>
            </p>
          );
        })} */}
      </div>
    </div>
  );
};
