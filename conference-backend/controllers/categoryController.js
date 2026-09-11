const pool = require('../config/db');

// GET /api/categories
// Public: the React registration form calls this to render category
// options and show the price for whichever one gets selected.
async function list(req, res) {
    try {
        const result = await pool.query(
            'SELECT id, name, price, fields FROM participant_categories ORDER BY id'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('List categories error:', err);
        res.status(500).json({ error: 'Something went wrong fetching categories' });
    }
}

// POST /api/admin/categories
// Admin only: add a category once its name/price/fields are known.
// "fields" example: [{"key": "farm_size", "label": "Farm size (acres)", "type": "text"}]
async function create(req, res) {
    const { name, price, fields } = req.body;

    if (!name || price === undefined) {
        return res.status(400).json({ error: 'name and price are required' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO participant_categories (name, price, fields)
             VALUES ($1, $2, $3) RETURNING *`,
            [name, price, fields || []]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Create category error:', err);
        res.status(500).json({ error: 'Something went wrong creating the category' });
    }
}

// PATCH /api/admin/categories/:id
// Admin only: update price/fields once the client sends the final list.
async function update(req, res) {
    const { id } = req.params;
    const { name, price, fields } = req.body;

    try {
        const result = await pool.query(
            `UPDATE participant_categories
             SET name = COALESCE($1, name),
                 price = COALESCE($2, price),
                 fields = COALESCE($3, fields)
             WHERE id = $4 RETURNING *`,
            [name, price, fields, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Update category error:', err);
        res.status(500).json({ error: 'Something went wrong updating the category' });
    }
}

module.exports = { list, create, update };
