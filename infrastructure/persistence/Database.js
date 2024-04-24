const { Pool } = require ('pg')

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '1574',
    database: 'tech_challenge_fiap'
})

module.exports = pool