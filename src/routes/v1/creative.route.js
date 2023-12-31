const express = require('express');
const creativeController = require('../../controllers/creative.controller');

const router = express.Router();

router.get('/', creativeController.getAllCreatives);
router.get('/:id', creativeController.getCreative);
router.put('/:id', creativeController.updateCreative);
router.post('/', creativeController.createCreative);
router.delete('/:id', creativeController.deleteCreative);

module.exports = router;
