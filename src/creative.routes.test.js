
const request = require('supertest');

// eslint-disable-next-line import/no-extraneous-dependencies
const mysql = require('mysql');
const httpStatus = require('http-status');
const Server = require("./Server");
const config = require('./config/config');
const logger = require('./config/logger');

describe('Creative Service Integration Tests', () => {
  let dbConnection;
  let server;
  const API_URL = `http://localhost.com:${config.port}`;

  beforeAll(async (done) => {
    // Create a MySQL connection before all tests
    dbConnection = mysql.createConnection(config.db);

    dbConnection.connect(async (err) => {
      if (err) {
        logger.error('Error connecting to MySQL:', err);
        done(err);
      } else {
        logger.info('Connected to MySQL');
      }
    });

    server = new Server();
    await server.start();

    done();

  });

  afterAll(async (done) => {
    // Close the MySQL connection after all tests
    dbConnection.end((err) => {
      if (err) {
        logger.error('Error closing MySQL connection:', err);
        done(err);
      } else {
        logger.info('Closed MySQL connection');
      }
    });

    if (server) {
      await server.stop();
    }

    done();
  });

  beforeEach(async () => {
    // Clear the database or perform setup as needed
    await dbConnection.query('DELETE FROM creatives');
    await dbConnection.query('DELETE FROM advertisers');
    await dbConnection.query("INSERT INTO advertisers(name) VALUES ('nike')");
  });

  it('should create a creative', async () => {
    
    const creativeData = {
      title: 'Sample Creative',
      isActive: true,
      typeId: 2,
      imageName: 'sample_image.jpg',
      imageLink: 'https://example.com/sample_image.jpg',
      clickUrl: 'https://example.com/click',
      altText: 'Sample Alt Text',
      advertiserId: 1,
    };


    const response = await request(API_URL).post('/v1/creative').send(creativeData);

    // Ensure the response status is 200
    expect(response.status).toBe(200);

    // Ensure the response body is defined
    expect(response.body).toBeDefined();

    // Ensure the properties of the created creative match the input data
    expect(response.body.title).toBe(creativeData.title);
    expect(response.body.isActive).toBe(creativeData.isActive);
    expect(response.body.typeId).toBe(creativeData.typeId);
    expect(response.body.imageName).toBe(creativeData.imageName);
    expect(response.body.imageLink).toBe(creativeData.imageLink);
    expect(response.body.clickUrl).toBe(creativeData.clickUrl);
    expect(response.body.altText).toBe(creativeData.altText);
    expect(response.body.advertiserId).toBe(creativeData.advertiserId);
  });

  //   it('should return BAD_REQUEST for invalid creative data', async () => {
  //     const invalidCreativeData = {
  //       // Missing required fields
  //     };

  //     const response = await request(app).post('/v1/creative').send(invalidCreativeData);

  //     expect(response.status).toBe(httpStatus.BAD_REQUEST);
  //     expect(response.body.code).toBe(httpStatus.BAD_REQUEST);
  //     expect(response.body.message).toBe('Missing required fields in request body');
  //   });
});
