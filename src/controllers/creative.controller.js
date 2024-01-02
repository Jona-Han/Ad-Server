const catchAsync = require('../utils/catchAsync');
const creativeService = require('../services/creative.service');

const createCreative = catchAsync(async (req, res) => {
  res.send(await creativeService.createCreative(req.body));
});

const getAllCreatives = catchAsync(async (req, res) => {
  res.send(await creativeService.getAllCreatives(req.body));
});

const getCreative = catchAsync(async (req, res) => {
  res.send(await creativeService.getCreativeById(req.params.creativeId));
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
