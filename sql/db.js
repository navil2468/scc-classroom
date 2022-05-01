const pg = require("pg");

const pool = new pg.Pool({
  connectionString: process.env.DB_URI,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
