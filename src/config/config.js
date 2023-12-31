const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? path.join(__dirname, '../../.env.test') : path.join(__dirname, '../../.env'),
});

// Validate env variables
const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MYSQL_HOST: Joi.string().required().description('the mysql host name'),
    MYSQL_USER: Joi.string().required().description('the mysql database instance username'),
    MYSQL_PASSWORD: Joi.string().required().description('the mysql database instance password'),
    MYSQL_DATABASE: Joi.string().required().description('the database name'),
    MYSQL_TEST_DATABASE: Joi.string().description('the test database name'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  db: {
    host: envVars.MYSQL_HOST,
    user: envVars.MYSQL_USER,
    password: envVars.MYSQL_PASSWORD,
    database: envVars.MYSQL_DATABASE,
  },
};
