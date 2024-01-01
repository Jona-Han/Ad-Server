// eslint-disable-next-line import/no-extraneous-dependencies
const mysql = require('mysql');
const config = require('./config');
const logger = require('./logger');

class DbConnection {
  // Static property to hold the singleton instance
  static instance;

  connection;

  // Private constructor to prevent multiple instances
  constructor() {
    this.connection = mysql.createConnection(config.db);
  }

  // Method to get the singleton instance
  static getInstance() {
    if (!DbConnection.instance) {
      DbConnection.instance = new DbConnection();
    }
    return DbConnection.instance;
  }

  startDb() {
    this.connection.connect(() => {
      logger.info('Server::Connected to MySQL');
    });
  }

  stopDb() {
    this.connection.end(() => {
      logger.info('Server::Disconnected from MySQL');
    });
  }

  query(queryString, values) {
    return new Promise((resolve, reject) => {
      this.connection.query(queryString, values, (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }
}

module.exports = DbConnection.getInstance();
