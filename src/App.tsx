import { Flex } from '@chakra-ui/layout';
import React, { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import './App.css';
import { GridCalendar } from './components/CalendarGridView';
import { Booking, BookingType, IBooking } from './types';
import { decorateBooking, markBookingConflicts, toJSON } from './utils/helpers';

const apiUrl = 'http://localhost:3001';

export const App = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [newBookings, setNewBookings] = useState<IBooking[]>([]);
  const [isConfirmBooking, setConfirmingBooking] = useState(false);

  const fetchBookings = async () => {
    return await fetch(`${apiUrl}/bookings`)
      .then((response) => response.json())
      .then((result) => {
        return result.map((item: Booking) => {
          item['status'] = BookingType.Existing;
          return item;
        });
      })
      .then((result) => decorateBooking(result))
      .then(setBookings);
  };

  useEffect(() => {
    if (bookings.length === 0) {
      fetchBookings();
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

  const confirmBooking = (e: React.MouseEvent | React.KeyboardEvent) => {
    console.log('confirming booking');
  };

  return (
    <div className="App">
      <div className="App-header">
        <Dropzone accept=".csv" onDrop={onDrop} maxFiles={1}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div className="App-dropzone" {...getRootProps()}>
                <input aria-label="Dropzone input" {...getInputProps()} />
                <p>Drop some files here, or click to select files</p>
              </div>
            </section>
          )}
        </Dropzone>
      </div>

      <div className="App-main">
        <Flex className="App-page-header">
          <h2 className="App-page-title">Bookings</h2>
          <Flex>
            {newBookings.length > 0 && (
              <>
                <Flex className="App-btn-container">
                  <button
                    className="App-btn"
                    disabled={isConfirmBooking}
                    onClick={confirmBooking}
                  >
                    Confirm bookings
                  </button>
                  <span className="btn-sub-text">
                    * Unconflicted bookings only
                  </span>
                </Flex>
                <Flex className="App-btn-container">
                  <button
                    className="App-btn"
                    disabled={isConfirmBooking}
                    onClick={() => setNewBookings([])}
                  >
                    Reset
                  </button>
                </Flex>
              </>
            )}
          </Flex>
        </Flex>

        <GridCalendar bookings={bookings} newBookings={newBookings} />
      </div>
    </div>
  );
};
