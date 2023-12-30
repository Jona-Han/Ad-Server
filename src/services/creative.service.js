const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

/**
 * Create a Creative
 * @param {Object} body
 * @returns {Promise<Creative>}
 */
const createCreative = async (body) => {
  throw new ApiError(httpStatus.BAD_REQUEST, 'NOT IMPLEMENTED');
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
