const express = require('express');
const router = express.Router();
const alumniController = require('../controllers/alumniController');
const { validateRegister } = require('../middleware/validate');

// POST /api/register — Register new alumni
router.post('/register', validateRegister, alumniController.register);

// GET  /api/alumni   — List alumni
router.get('/alumni', alumniController.getAlumni);

module.exports = router;
