const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vueon',
  port: process.env.DB_PORT || 3306
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
  console.log('Connection details:', {
    host: connection.config.host,
    port: connection.config.port,
    database: connection.config.database,
    user: connection.config.user
  });
  
  // Test query to see what tables exist
  connection.query('SHOW TABLES', (err, results) => {
    if (err) {
      console.error('Error showing tables:', err);
    } else {
      console.log('Tables in database:', results);
    }
  });
});

module.exports = connection;