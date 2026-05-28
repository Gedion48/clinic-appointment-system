const express = require('express');
const { getAppointments, createAppointment } = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getAppointments);
router.post('/', createAppointment);

module.exports = router;