const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const data = require('./routes/data');
const guests = require('./routes/guests');
const parties = require('./routes/parties');

const app = express();

// Use native promises
mongoose.Promise = global.Promise;

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/data', data);
app.use('/guests', guests);
app.use('/parties', parties);

// Database connection
mongoose.connect(process.env.MONGO_URL, {
    useMongoClient: true
});

const db = mongoose.connection;
db.on('error', () => console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to database.'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
