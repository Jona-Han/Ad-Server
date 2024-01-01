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
  const getQuery = 'SELECT * FROM creatives WHERE id = ?';
  const result = await DbConnection.query(getQuery, [creativeId]);
  if (result.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, `Creative with id ${creativeId} not found`);
  }

  const resultInCamelCase = {
    Id: result[0].id,
    Title: result[0].title,
    IsActive: result[0].is_active === 1,
    TypeId: result[0].type_id,
    ImageName: result[0].image_name,
    ImageLink: result[0].image_link,
    ClickUrl: result[0].click_url,
    AltText: result[0].alt_text,
    AdvertiserId: result[0].advertiser_id,
  };

  return resultInCamelCase;
};

/**
 * Update creative by id
 * @param {ObjectId} creativeId
 * @param {Object} reqBody
 * @returns {Promise<>}
 */
const updateCreativeById = async (creativeId, reqBody) => {
  const getQuery = 'SELECT * FROM creatives WHERE id = ?';
  const result = await DbConnection.query(getQuery, [creativeId]);
  if (result.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, `Failed to update creative with id ${creativeId} because not found`);
  }

  const resultInCamelCase = {
    Title: reqBody.Title || result[0].title,
    IsActive: reqBody.IsActive !== undefined ? reqBody.IsActive : result[0].is_active,
    TypeId: reqBody.TypeId || result[0].type_id,
    ImageName: reqBody.ImageName || result[0].image_name,
    ImageLink: reqBody.ImageLink || result[0].image_link,
    ClickUrl: reqBody.ClickUrl || result[0].click_url,
    AltText: reqBody.AltText || result[0].alt_text,
    AdvertiserId: reqBody.AdvertiserId || result[0].advertiser_id,
  };

  const updateQuery = `UPDATE creatives 
  SET title = ?, is_active = ?, type_id = ?, image_name = ?, image_link = ?, click_url = ?, alt_text = ?, advertiser_id = ? 
  WHERE id = ?`;
  await DbConnection.query(updateQuery, Object.values(resultInCamelCase).concat([creativeId]));

  return {Id: creativeId, ...resultInCamelCase};
};

/**
 * Delete creative by id
 * @param {ObjectId} creativeId
 * @returns {Promise<>}
 */
const deleteCreativeById = async (creativeId) => {
  const getQuery = 'SELECT * FROM creatives WHERE id = ?';
  const result = await DbConnection.query(getQuery, [creativeId]);
  if (result.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, `Failed to delete creative with id ${creativeId} because not found`);
  }

  const resultInCamelCase = {
    Id: result[0].id,
    Title: result[0].title,
    IsActive: result[0].is_active === 1,
    TypeId: result[0].type_id,
    ImageName: result[0].image_name,
    ImageLink: result[0].image_link,
    ClickUrl: result[0].click_url,
    AltText: result[0].alt_text,
    AdvertiserId: result[0].advertiser_id,
  };

  const deleteQuery = `DELETE FROM creatives WHERE id = ?`;
  const afterDelete = await DbConnection.query(deleteQuery, [creativeId]);
  if (afterDelete.affectedRows !== 1) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Failed to delete creative with id ${creativeId} due to server error`,
    );
  }

  return resultInCamelCase;
};

module.exports = {
  createCreative,
  getAllCreatives,
  getCreativeById,
  updateCreativeById,
  deleteCreativeById,
};
