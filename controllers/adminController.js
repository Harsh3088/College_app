const { fetchsubjects } = require('../models/adminModel');

// Fetch all admins
const getSubjects = async (req, res) => {
    const hallticketno = req.query.hallticketno; // Get query parameter
  try {
    const subjects = await fetchsubjects(hallticketno);
    res.status(200).json(subjects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
};


module.exports = {getSubjects};
