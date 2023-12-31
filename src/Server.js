const express = require('express');
const cors = require('cors');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const logger = require('./config/logger');

class Server {
  port;

  app;

  server;

  constructor() {
    this.port = config.port;
    this.app = express();
    this.setup();
  }

  /**
   * Starts the server. Returns a promise that resolves if success. Promises are used
   * here because starting the server takes some time and we want to know when it
   * is done (and if it worked).
   *
   * @returns {Promise<void>}
   */
  start() {
    return new Promise((resolve, reject) => {
      logger.info('Server::start() - start');
      if (this.server !== undefined) {
        logger.error('Server::start() - server already listening');
        reject();
      } else {
        this.server = this.app
          .listen(this.port, () => {
            logger.info(`Server::start() - server listening on port: ${this.port}`);
            resolve();
          });
      }
    });
  }

  /**
   * Stops the server. Again returns a promise so we know when the connections have
   * actually been fully closed and the port has been released.
   *
   * @returns {Promise<void>}
   */
  stop() {
    logger.info('Server::stop()');
    return new Promise((resolve, reject) => {
      if (this.app === undefined) {
        logger.error('Server::stop() - ERROR: server not started');
        reject();
      } else {
        this.app.close(() => {
          logger.info('Server::stop() - server closed');
          resolve();
        });
      }
    });
  }

  // Registers middleware to parse request before passing them to request handlers
  setup() {
    if (config.env !== 'test') {
      this.app.use(morgan.successHandler);
      this.app.use(morgan.errorHandler);
    }

    // parse json request body
    this.app.use(express.json());

    // parse urlencoded request body
    this.app.use(express.urlencoded({ extended: true }));

    // enable cors
    this.app.use(cors());
    this.app.options('*', cors());

    // v1 api routes
    this.app.use('/v1', routes);

    // send back a 404 error for any unknown api request
    this.app.use((req, res, next) => {
      next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
    });

    // convert error to ApiError, if needed
    this.app.use(errorConverter);

    // handle error
    this.app.use(errorHandler);
  }
}

module.exports = Server;
