const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const DbConnection = require('../config/DbConnection');
const logger = require('../config/logger');

/**
 * Create a Creative
 * @param {Object} body
 * @returns {Promise<Creative>}
 */
const createCreative = async (body) => {
  // Check if required fields are in body
  const requiredFields = ['Title', 'IsActive', 'TypeId', 'AdvertiserId'];
  const missingFields = requiredFields.filter((field) => !(field in body));

  if (missingFields.length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Missing required fields: ${missingFields.join(', ')}`);
  }

  // Check if advertiserId is valid
  const checkAdvertiserQuery = 'SELECT COUNT(*) AS count FROM advertisers WHERE id = ?';
  const advertiserCountResult = await DbConnection.query(checkAdvertiserQuery, [body.AdvertiserId]);

  if (advertiserCountResult[0].count === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Invalid advertiserId: ${body.advertiserId}`);
  }

  // Insert into creatives table
  const insertCreativeQuery = `
    INSERT INTO creatives (title, is_active, type_id, image_name, image_link, click_url, alt_text, advertiser_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    body.Title,
    body.IsActive,
    body.TypeId,
    body.ImageName || null,
    body.ImageLink || null,
    body.ClickUrl || null,
    body.AltText || null,
    body.AdvertiserId,
  ];

  const result = await DbConnection.query(insertCreativeQuery, values);

  const entryJustAdded = {
    Id: result.insertId,
    Title: body.Title,
    IsActive: body.IsActive,
    TypeId: body.TypeId,
    ImageName: body.ImageName || null,
    ImageLink: body.ImageLink || null,
    ClickUrl: body.ClickUrl || null,
    AltText: body.AltText || null,
    AdvertiserId: body.AdvertiserId,
  };

  return entryJustAdded;
};

/**
 * Get all creatives
 * @param {ObjectId} advertiserId
 * @returns {Promise<>}
 */
const getAllCreatives = async (advertiserId) => {
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
