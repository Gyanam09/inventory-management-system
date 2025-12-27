const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/inventory', (req, res) => {
  const rows = db.prepare('SELECT * FROM inventory').all();
  res.json(rows);
});

app.post('/api/inventory', (req, res) => {
  const { sku, name, category, quantity, reorderLevel, unitPrice } = req.body;

  if (!sku || !name) {
    return res.status(400).json({ error: 'SKU and name are required' });
  }

  const stmt = db.prepare(`
    INSERT INTO inventory (sku, name, category, quantity, reorderLevel, unitPrice, lastSold)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    sku,
    name,
    category || '',
    Number(quantity) || 0,
    Number(reorderLevel) || 0,
    Number(unitPrice) || 0,
    new Date().toISOString().split('T')[0]
  );

  res.status(201).json({ id: info.lastInsertRowid });
});

app.put('/api/inventory/:id', (req, res) => {
  const id = Number(req.params.id);
  const updates = req.body;

  if (!Object.keys(updates).length) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  const values = Object.values(updates);

  const result = db.prepare(`UPDATE inventory SET ${fields} WHERE id = ?`).run(...values, id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Item not found' });
  }

  res.json({ success: true });
});

app.delete('/api/inventory/:id', (req, res) => {
  const id = Number(req.params.id);
  const result = db.prepare('DELETE FROM inventory WHERE id = ?').run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Item not found' });
  }

  res.json({ success: true });
});

app.get('/api/alerts', (req, res) => {
  const items = db.prepare('SELECT * FROM inventory').all();
  const today = new Date();
  const alerts = [];

  items.forEach(item => {
    if (item.quantity <= item.reorderLevel) {
      alerts.push({
        type: 'low',
        item: item.name,
        message: `Only ${item.quantity} left. Reorder soon.`,
      });
    }

    if (item.lastSold) {
      const lastSold = new Date(item.lastSold);
      const diffDays = (today - lastSold) / (1000 * 60 * 60 * 24);

      if (diffDays > 60) {
        alerts.push({
          type: 'dead',
          item: item.name,
          message: `Not sold in ${Math.floor(diffDays)} days. Consider discounting.`,
        });
      }
    }
  });

  res.json(alerts);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
