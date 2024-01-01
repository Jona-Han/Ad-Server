const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const DbConnection = require('../config/DbConnection');
const logger = require('../config/logger')

/**
 * Create a Creative
 * @param {Object} body
 * @returns {Promise<Creative>}
 */
const createCreative = async (body) => {
    logger.info('---------creatCreative')
  // Check if required fields are in body
  const requiredFields = ['title', 'isActive', 'typeId', 'advertiserId'];
  const missingFields = requiredFields.filter((field) => !(field in body));
  const dbConnection = DbConnection.getInstance();

  if (missingFields.length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Missing required fields: ${missingFields.join(', ')}`);
  }

  // Check if advertiserId is valid
  const checkAdvertiserQuery = 'SELECT COUNT(*) AS count FROM advertisers WHERE id = ?';
  const [advertiserCountResult] = await dbConnection.query(checkAdvertiserQuery, [body.advertiserId]);

  if (advertiserCountResult[0].count === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Invalid advertiserId: ${body.advertiserId}`);
  }

  // Insert into creatives table
  const insertCreativeQuery = `
    INSERT INTO creatives (title, is_active, type_id, image_name, image_link, click_url, alt_text, advertiser_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    body.title,
    body.isActive,
    body.typeId,
    body.imageName || null,
    body.imageLink || null,
    body.clickUrl || null,
    body.altText || null,
    body.advertiserId,
  ];

  const [result] = await dbConnection.query(insertCreativeQuery, values);
  return result.insertId;
};

/**
 * Get all creatives
 * @param {ObjectId} advertiserId
 * @returns {Promise<>}
 */
const getAllCreatives = async (advertiserId) => {
    logger.info('GETALLCREATIVES_---------------');
  throw new ApiError(httpStatus.BAD_REQUEST, 'NOT IMPLEMENTED');
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<>}
 */
const getCreativeById = async (creativeId) => {
  throw new ApiError(httpStatus.BAD_REQUEST, 'NOT IMPLEMENTED');
};

/**
 * Update creative by id
 * @param {ObjectId} creativeId
 * @param {Object} reqBody
 * @returns {Promise<>}
 */
const updateCreativeById = async (creativeId, reqBody) => {
  throw new ApiError(httpStatus.BAD_REQUEST, 'NOT IMPLEMENTED');
};

/**
 * Delete creative by id
 * @param {ObjectId} creativeId
 * @returns {Promise<>}
 */
const deleteCreativeById = async (userId) => {
  throw new ApiError(httpStatus.BAD_REQUEST, 'NOT IMPLEMENTED');
};

module.exports = {
  createCreative,
  getAllCreatives,
  getCreativeById,
  updateCreativeById,
  deleteCreativeById,
};
