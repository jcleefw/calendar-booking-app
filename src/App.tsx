import { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import './App.css';
import { GridCalendar } from './components/CalendarGridView';
import { Booking, BookingType, IBooking } from './types';
import { decorateBooking, markBookingConflicts, toJSON } from './utils/utils';

const apiUrl = 'http://localhost:3001';

export const App = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [newBookings, setNewBookings] = useState<IBooking[]>([]);

  useEffect(() => {
    if (bookings.length === 0) {
      fetch(`${apiUrl}/bookings`)
        .then((response) => response.json())
        .then((result) => {
          return result.map((item: Booking) => {
            item['status'] = BookingType.Existing;
            return item;
          });
        })
        .then((result) => decorateBooking(result))
        .then(setBookings);
    }
  }, [bookings, newBookings]);

  const onDrop = (files: File[]) => {
    if (files.length > 0) {
      // TODO support multiple files upload at one go
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
            if (parsedBookings) {
              console.log(JSON.stringify(parsedBookings));
              const convertedBookings = decorateBooking(parsedBookings);
              const sanitizeBookings = markBookingConflicts(
                bookings,
                convertedBookings
              );
              // console.log(sanitizeBookings);
              setNewBookings(sanitizeBookings);
            }
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

      <div className="App-main">
        <GridCalendar bookings={bookings} newBookings={newBookings} />
      </div>
    </div>
  );
};
