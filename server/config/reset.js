import pool from './database.js'

await pool.query(`DROP TABLE IF EXISTS custom_item;`)

await pool.query(`
  CREATE TABLE IF NOT EXISTS custom_item (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    top         VARCHAR(50)  NOT NULL,
    bottom      VARCHAR(50)  NOT NULL,
    shoes       VARCHAR(50)  NOT NULL,
    accessory   VARCHAR(50)  NOT NULL,
    total_price NUMERIC(8,2) NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
  );
`)

console.log('custom_item table reset successfully.')

await pool.end()
