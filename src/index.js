// eslint-disable-next-line import/no-extraneous-dependencies
const mysql = require('mysql');
const app = require('./app');
const logger = require('./config/logger');
const config = require('./config/config');

const dbConnection = mysql.createConnection(config.db);

dbConnection.connect(() => {
    logger.info('Connected to MySQL');
});

const server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
});

const exitHandler = () => {
  if (dbConnection) {
    dbConnection.end();
    logger.info('MySQL connection closed');
  }

  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (dbConnection) {
    dbConnection.end();
  }
  
  if (server) {
    server.close();
  }
});
