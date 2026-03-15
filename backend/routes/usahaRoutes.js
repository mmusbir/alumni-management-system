const express = require('express');
const router = express.Router();
const usahaController = require('../controllers/usahaController');
const { validateUsaha } = require('../middleware/validate');

// GET  /api/usaha — List businesses
router.get('/usaha', usahaController.getUsaha);

// POST /api/usaha — Create business
router.post('/usaha', validateUsaha, usahaController.createUsaha);

module.exports = router;
