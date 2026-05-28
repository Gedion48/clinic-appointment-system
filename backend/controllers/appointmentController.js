const Appointment = require('../models/Appointment');

// @desc    Get all appointments for logged-in user
// @route   GET /api/appointments
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch appointments' });
  }
};

// @desc    Create a new appointment
// @route   POST /api/appointments
const createAppointment = async (req, res) => {
  try {
    const { patientName, appointmentDate, appointmentTime, reason } = req.body;

    if (!patientName || !appointmentDate || !appointmentTime || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const appointment = await Appointment.create({
      patientName,
      appointmentDate,
      appointmentTime,
      reason,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    res.status(500).json({ success: false, message: 'Failed to create appointment' });
  }
};

module.exports = { getAppointments, createAppointment };