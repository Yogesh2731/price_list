const pool = require('../db');

const getProducts = async (req, res) => {
    const { id } = req.params;

    try {
        if (id) {
            const result = await pool.query(
                'SELECT * FROM products WHERE id = $1',
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, error: 'Product not found' });
            }

            return res.status(200).json({ success: true, product: result.rows[0] });
        }

        const result = await pool.query(
            `SELECT
                id,
                product_code,
                name,
                description,
                unit,
                in_price,
                price,
                vat_percent,
                discount,
                account_number,
                in_stock,
                active,
                updated_at
            FROM products
            ORDER BY product_code ASC`
        );

        return res.status(200).json({ success: true, products: result.rows });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

const patchProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const allowedFields = [
            'product_code', 'name', 'description', 'unit',
            'in_price', 'price', 'vat_percent', 'discount',
            'account_number', 'in_stock', 'active',
        ];

        const updates = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'No valid fields to update' });
        }

        const setClauses = Object.keys(updates).map(
            (key, i) => `${key} = $${i + 1}`
        );
        setClauses.push(`updated_at = NOW()`);

        const values = [...Object.values(updates), id];
        const result = await pool.query(
            `UPDATE products
                SET ${setClauses.join(', ')}
                WHERE id = $${values.length}
                RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        return res.json({ product: result.rows[0] });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

module.exports = { getProducts, patchProducts };
