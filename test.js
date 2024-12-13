const bcrypt = require('bcrypt');

// Your password
const password = '123';

// Number of salt rounds (higher value = more secure but slower)
const saltRounds = 0;

// Generate the salt and hash the password
bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log('Hashed password:', hash);
});


