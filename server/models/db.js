const { Pool } = require('pg');

const pool = new Pool({
  user: 'ioslpg@ioslpg',
  host: 'ioslpg.postgres.database.azure.com',
  database: 'ioslbackendDB',
  password: 'Wcdima2@123456',
  port: 5432,
  ssl: true,
});


// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'ioslbackendDB',
//     password: 123,
//     port: 5432,
// })

module.exports = {
  pool,
};
