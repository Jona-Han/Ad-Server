const catchAsync = require('../utils/catchAsync');
const creativeService = require('../services/creative.service');
const logger = require('../config/logger');

const createCreative = catchAsync(async (req, res) => {
  const result = await creativeService.createCreative(req.body);
  res.send(result);
});

const getAllCreatives = catchAsync(async (req, res) => {
  res.send(await creativeService.getAllCreatives());
});

const getCreative = catchAsync(async (req, res) => {
  const result = await creativeService.getCreativeById(req.params.creativeId);
  res.send(result);
});

const updateCreative = catchAsync(async (req, res) => {
  res.send(await creativeService.updateCreativeById(req.params.creativeId, req.body));
});

const deleteCreative = catchAsync(async (req, res) => {
  res.send(await creativeService.deleteCreativeById(req.params.creativeId));
});

module.exports = {
  createCreative,
  getCreative,
  getAllCreatives,
  updateCreative,
  deleteCreative,
};
