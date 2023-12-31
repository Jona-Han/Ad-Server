const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const creativeService = require('../services/creative.service');

const createCreative = catchAsync(async (req, res) => {
  const result = await creativeService.createCreative(req.body);
  res.send(result);
});

const getAllCreatives = catchAsync(async (req, res) => {
  res.send(creativeService.getAllCreatives());
});

const getCreative = catchAsync(async (req, res) => {
  res.send(creativeService.getCreativeById());
});

const updateCreative = catchAsync(async (req, res) => {
  res.send(creativeService.updateCreativeById());
});

const deleteCreative = catchAsync(async (req, res) => {
  res.send(creativeService.deleteCreativeById());
});

module.exports = {
  createCreative,
  getCreative,
  getAllCreatives,
  updateCreative,
  deleteCreative,
};
