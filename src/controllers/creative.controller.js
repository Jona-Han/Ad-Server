const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const creativeService = require('../services/creative.service');
const logger = require('../config/logger');

const createCreative = catchAsync(async (req, res) => {
  const result = await creativeService.createCreative(req.body);
  res.send(result);
});

const getAllCreatives = catchAsync(async (req, res) => {
    logger.info('REQUEST RECEIVED')
  res.send(await creativeService.getAllCreatives());
});

const getCreative = catchAsync(async (req, res) => {
  res.send(await creativeService.getCreativeById());
});

const updateCreative = catchAsync(async (req, res) => {
  res.send(await creativeService.updateCreativeById());
});

const deleteCreative = catchAsync(async (req, res) => {
  res.send(await creativeService.deleteCreativeById());
});

module.exports = {
  createCreative,
  getCreative,
  getAllCreatives,
  updateCreative,
  deleteCreative,
};
