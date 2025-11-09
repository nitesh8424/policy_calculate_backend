const Pool = require('pg')

const pool = new Pool({
  database: 'postgres',
  user: 'postgres',
  password: 'secret!',
  port: 5432,
  max: 100,
  idleTimeoutMillis: 1000, 
  connectionTimeoutMillis: 1000,
  maxUses: 7500, 
})

module.exports = pool;
