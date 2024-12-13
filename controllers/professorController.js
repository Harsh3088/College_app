const bcrypt = require('bcrypt');
const { getProfessorByempid, getSubjectsByProfessor } = require('../models/professorModel');

// Login Controller
const loginProfessor = async (req, res) => {
  const { empid, password } = req.body;

  try {
    // Fetch professor details from the database
    const professor = await getProfessorByempid(empid);

    if (!professor) {
      return res.status(401).json({ error: 'Invalid empid or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, professor.passwordhash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid empid or password' });
    }

    // Create a session for the professor
    req.session.professor = {
        empid: professor.empid,
      name: professor.name,
    };

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Logout Controller
const logoutProfessor = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to log out' });
    }
    res.clearCookie('connect.sid'); // Clear session cookie
    res.status(200).json({ message: 'Logout successful' });
  });
};

const getProfessorSubjects = async (req, res) => {
    if (!req.session.professor) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    try {
      const subjects = await getSubjectsByProfessor(req.session.professor.empid);
      res.status(200).json(subjects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  

module.exports = { getProfessorSubjects, loginProfessor, logoutProfessor };
