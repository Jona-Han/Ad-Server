// eslint-disable-next-line import/no-extraneous-dependencies
const mysql = require('mysql');
const logger = require('./config/logger');
const config = require('./config/config');
const Server = require('./Server')

const dbConnection = mysql.createConnection(config.db);
const server = new Server();

dbConnection.connect(() => {
  logger.info('Server::Connected to MySQL');

   server.start();
});

const exitHandler = () => {
  if (dbConnection) {
    dbConnection.end();
    logger.info('Server::MySQL connection closed');
  }

  if (server) {
    server.stop();
  }
  process.exit(1);
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
    server.stop();
  }
});

module.exports = dbConnection;
