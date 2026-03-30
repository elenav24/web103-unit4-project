import pool from '../config/database.js'

export const getAllOutfits = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM custom_items ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getOutfitById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM custom_items WHERE id = $1', [id])
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Outfit not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const createOutfit = async (req, res) => {
  try {
    const { name, top, bottom, shoes, accessory, total_price } = req.body
    const result = await pool.query(
      `INSERT INTO custom_items (name, top, bottom, shoes, accessory, total_price)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, top, bottom, shoes, accessory, total_price]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    if (err.code === '23502') {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const updateOutfit = async (req, res) => {
  try {
    const { id } = req.params
    const { name, top, bottom, shoes, accessory, total_price } = req.body
    const result = await pool.query(
      `UPDATE custom_items
       SET name = $1, top = $2, bottom = $3, shoes = $4, accessory = $5, total_price = $6
       WHERE id = $7
       RETURNING *`,
      [name, top, bottom, shoes, accessory, total_price, id]
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Outfit not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    if (err.code === '23502') {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const deleteOutfit = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      'DELETE FROM custom_items WHERE id = $1 RETURNING id',
      [id]
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Outfit not found' })
    }
    res.json({ message: 'Outfit deleted', id: result.rows[0].id })
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}
