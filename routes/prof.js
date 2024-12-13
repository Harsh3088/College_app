const express = require('express');
const { loginProfessor, logoutProfessor, getProfessorSubjects } = require('../controllers/professorController');

const router = express.Router();

// Routes
router.post('/login', loginProfessor);
router.post('/logout', logoutProfessor);
router.get('/subjects', getProfessorSubjects);

module.exports = router;
