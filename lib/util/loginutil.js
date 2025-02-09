var util = require('util')

var ldap = require('ldapjs')
var Promise = require('bluebird')
const mysql = require('mysql');
const bcrypt = require('bcrypt'); // Make sure to install this via: npm install bcrypt


// Create a connection pool to manage multiple connections efficiently.
const pool = mysql.createPool({
  connectionLimit: 10,    // Adjust as needed
  host: 'localhost',      // Your MySQL host
  user: 'admin',   // Your MySQL user
  password: 'admin', // Your MySQL password
  database: 'stf'         // Database name
});


function InvalidCredentialsError(user) {
  Error.call(this, util.format('Invalid credentials for user "%s"', user))
  this.name = 'InvalidCredentialsError'
  this.user = user
  Error.captureStackTrace(this, InvalidCredentialsError)
}

util.inherits(InvalidCredentialsError, Error)

// Export
module.exports.InvalidCredentialsError = InvalidCredentialsError

module.exports.login = function(username, password) {
  return new Promise((resolve, reject) => {
    // Get a connection from the pool.
    pool.getConnection((connErr, connection) => {
      if (connErr) {
        return reject(connErr);
      }

      // Query by username only; the password check is handled by bcrypt.
      const query = 'SELECT * FROM tbl_user WHERE username = ?';

      connection.query(query, [username], (queryErr, results) => {
        // Release the connection back to the pool.
        connection.release();

        if (queryErr) {
          return reject(queryErr);
        }

        // If no user is found, reject with an error.
        if (results.length === 0) {
          return reject(new InvalidCredentialsError(username));
        }

        // Get the user record.
        const user = results[0];

        // Compare the provided password with the hashed password stored in the database.
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            return reject(err);
          }
          if (!isMatch) {
            return reject(new InvalidCredentialsError(username));
          }

          // Credentials are valid; resolve with the user record.
          resolve(user);
        });
      });
    });
  });
};
// Export
module.exports.email = function(user) {
  return user.mail || user.email || user.userPrincipalName
}
