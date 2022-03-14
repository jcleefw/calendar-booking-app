const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors()); // so that app can access

const bookings = JSON.parse(fs.readFileSync('./server/bookings.json')).map(
  (bookingRecord) => ({
    id: uuidv4(),
    time: Date.parse(bookingRecord.time),
    duration: bookingRecord.duration, // * 60 * 1000, // mins into ms
    userId: bookingRecord.user_id,
  })
);

app.get('/bookings', (_, res) => {
  res.json(bookings);
});

app.listen(3001);
