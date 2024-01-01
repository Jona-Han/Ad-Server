const Server = require('./Server');
const logger = require('./config/logger');
const DbConnection = require('./config/DbConnection');

const server = new Server();

server.start();

const exitHandler = async () => {
  if (DbConnection) {
    DbConnection.stopDb();
    logger.info('Server::MySQL connection closed');
  }

  if (server) {
    await server.stop();
  }
  process.exit(1);
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received');
  if (DbConnection) {
    DbConnection.stopDb();
  }

  if (server) {
    await server.stop();
  }
  process.exit(1);
});
