const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
// create application/json parser
const jsonParser = bodyParser.json();

const app = express();
app.use(cors()); // so that app can access

var localStorage = require('localStorage');

const bookings = JSON.parse(fs.readFileSync('./server/bookings.json')).map(
  (bookingRecord) => ({
    id: uuidv4(),
    time: Date.parse(bookingRecord.time),
    duration: bookingRecord.duration,
    userId: bookingRecord.user_id,
  })
);

app.get('/bookings', (_, res) => {
  if (localStorage.getItem('bookings')) {
    const storageBookings = localStorage.getItem('bookings');
    console.log('already exist');
    res.send(storageBookings);
  } else {
    const bookingsData = bookings;
    localStorage.setItem('bookings', JSON.stringify(bookingsData));
    res.json(bookings);
  }
});

app.get('/reset-bookings', (_, res) => {
  localStorage.removeItem('bookings');
  res.send('reset');
});

app.post('/bookings', jsonParser, (req, res) => {
  console.log('received something...', req.body.length);
  localStorage.setItem('bookings', JSON.stringify(req.body));
  res.sendStatus(200);
});

app.listen(3001);
