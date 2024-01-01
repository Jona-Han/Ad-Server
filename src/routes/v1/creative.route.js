const express = require('express');
const creativeController = require('../../controllers/creative.controller');

const router = express.Router();

router.get('/', creativeController.getAllCreatives);
router.get('/:creativeId', creativeController.getCreative);
router.put('/:creativeId', creativeController.updateCreative);
router.post('/', creativeController.createCreative);
router.delete('/:creativeId', creativeController.deleteCreative);

module.exports = router;
