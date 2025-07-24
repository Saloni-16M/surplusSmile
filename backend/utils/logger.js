const { createLogger, format, transports } = require('winston');
const path = require('path');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: path.join(__dirname, '../logs/user-activity.log'), level: 'info' }),
    new transports.Console({ format: format.simple() }) // Optional: log to console too
  ],
});

module.exports = logger; 