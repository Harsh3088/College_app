const pool = require('../config/db'); // Replace with your database connection file

// Fetch a professor by empid
const getProfessorByempid = async (empid) => {
  try {
    const result = await pool.query(
      'SELECT * FROM professor WHERE empid = $1',
      [empid]
    );
    return result.rows[0]; // Return the first row if it exists
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Fetch subjects assigned to a professor
const getSubjectsByProfessor = async (professorId) => {
    try {
      const result = await pool.query(
        'SELECT id, name, code FROM subjects WHERE profempid = $1',
        [professorId]
      );
      return result.rows;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  };
  
  module.exports = {getSubjectsByProfessor , getProfessorByempid };
