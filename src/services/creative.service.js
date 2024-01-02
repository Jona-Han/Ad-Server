const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const DbConnection = require('../config/DbConnection');
const logger = require('../config/logger');
const convertKeysToCamelCase = require('../utils/convertKeysToCamel');

/**
 * Create a Creative
 * @param {Object} body
 * @returns {Promise<Creative>}
 */
const createCreative = async (body) => {
  // Check if required fields are in body
  const requiredFields = ['title', 'isActive', 'typeId', 'advertiserId'];
  const missingFields = requiredFields.filter((field) => !(field in body));

  if (missingFields.length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Missing required fields: ${missingFields.join(', ')}`);
  }

  // Check if advertiserId is valid
  const checkAdvertiserQuery = 'SELECT COUNT(*) AS count FROM advertisers WHERE id = ?';
  const advertiserCountResult = await DbConnection.query(checkAdvertiserQuery, [body.advertiserId]);

  if (advertiserCountResult[0].count === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Invalid advertiserId: ${body.advertiserId}`);
  }

  // Insert into creatives table
  const insertCreativeQuery = `
    INSERT INTO creatives (title, is_active, type_id, image_name, image_link, click_url, alt_text, advertiser_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const valuesToAdd = {
    title: body.title,
    isActive: body.isActive,
    typeId: body.typeId,
    imageName: body.imageName || null,
    imageLink: body.imageLink || null,
    clickUrl: body.clickUrl || null,
    altText: body.altText || null,
    advertiserId: body.advertiserId,
  };

  const result = await DbConnection.query(insertCreativeQuery, Object.values(valuesToAdd));

  return {id: result.insertId, ...valuesToAdd};
};

/**
 * Get all creatives
 * @param {ObjectId} advertiserId
 * @returns {Promise<>}
 */
const getAllCreatives = async (reqBody) => {
    if (reqBody.AdvertiserId === undefined) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to get creatives due to missing AdvertiserId in body');
    }

    const getQuery = 'SELECT * FROM creatives WHERE advertiser_id = ?';

    const result = await DbConnection.query(getQuery, [reqBody.dvertiserId]);

    return result;
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

  const resultInCamelCase = convertKeysToCamelCase(result[0])
  resultInCamelCase.isActive = resultInCamelCase.isActive === 1;

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
    title: reqBody.title || result[0].title,
    isActive: reqBody.isActive !== undefined ? reqBody.isActive : result[0].is_active,
    typeId: reqBody.typeId || result[0].type_id,
    imageName: reqBody.imageName || result[0].image_name,
    imageLink: reqBody.imageLink || result[0].image_link,
    clickUrl: reqBody.clickUrl || result[0].click_url,
    altText: reqBody.altText || result[0].alt_text,
    advertiserId: reqBody.advertiserId || result[0].advertiser_id,
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

 
  const resultInCamelCase = convertKeysToCamelCase(result[0]);
  resultInCamelCase.isActive = resultInCamelCase.isActive === 1;

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
