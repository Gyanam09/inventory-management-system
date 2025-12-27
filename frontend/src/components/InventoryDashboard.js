'use client';
import { useEffect, useState } from 'react';

export default function InventoryDashboard() {
  const [inventory, setInventory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [dark, setDark] = useState(false);
  const [view, setView] = useState('dashboard');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory`).then(r => r.json()).then(setInventory);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alerts`).then(r => r.json()).then(setAlerts);
  }, []);

  return (
    <div className={dark ? 'dark app' : 'app'}>
      <aside className="sidebar">
        <h2>📦 Inventory</h2>
        {['dashboard','products','reports','settings'].map(v => (
          <div
            key={v}
            className={`nav-item ${view === v ? 'active' : ''}`}
            onClick={() => setView(v)}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </div>
        ))}
      </aside>

      <main className="main">
        <div className="topbar">
          <h1>{view.charAt(0).toUpperCase() + view.slice(1)}</h1>
          <div className="toggle" onClick={() => setDark(!dark)}>
            {dark ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </div>
        </div>

        {view === 'dashboard' && <Dashboard inventory={inventory} alerts={alerts} />}
        {view === 'products' && <Products inventory={inventory} />}
        {view === 'reports' && <Reports inventory={inventory} />}
        {view === 'settings' && <Settings />}
      </main>
    </div>
  );
}

/* Views */

function Dashboard({ inventory, alerts }) {
  const totalUnits = inventory.reduce((s, i) => s + i.quantity, 0);
  const totalValue = inventory.reduce((s, i) => s + i.quantity * i.unitPrice, 0);

  return (
    <>
      <div className="stats">
        <Stat title="Total Units" value={totalUnits} />
        <Stat title="Inventory Value" value={`₹${(totalValue / 100000).toFixed(2)}L`} />
        <Stat title="Low Stock" value={alerts.filter(a => a.type === 'low').length} />
        <Stat title="Dead Stock" value={alerts.filter(a => a.type === 'dead').length} />
      </div>

      <InventoryTable inventory={inventory} alerts={alerts} />

      <div className="bottom">
        <div className="card">
          <h3>Alerts</h3>
          {alerts.length === 0 && <p>No alerts 🎉</p>}
          {alerts.map((a, i) => (
            <div key={i} className={`alert ${a.type}`}>
              <strong>{a.item}</strong>
              <div>{a.message}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3>Insights</h3>
          <ul>
            <li>Fast-moving items should never go out of stock.</li>
            <li>Review dead stock monthly and consider discounts.</li>
            <li>Align reorder levels with demand.</li>
          </ul>
        </div>
      </div>
    </>
  );
}

function Products({ inventory }) {
  const [form, setForm] = useState({
    sku: '', name: '', category: '', quantity: '', reorderLevel: '', unitPrice: ''
  });

  const addProduct = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    window.location.reload();
  };

  return (
    <>
      <div className="card">
        <h3>Add Product</h3>

        <div className="form-grid">
          {Object.entries(form).map(([key, value]) => (
            <div key={key} className="form-group">
              <label>{key}</label>
              <input
                value={value}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={key}
              />
            </div>
          ))}
        </div>

        <button className="button-primary" onClick={addProduct}>
          Add Product
        </button>
      </div>

      <InventoryTable inventory={inventory} alerts={[]} />
    </>
  );
}



function Settings() {
  return (
    <div className="card">
      <h3>Settings</h3>
      <p>Settings UI placeholder</p>
    </div>
  );
}

/* Shared components */

function InventoryTable({ inventory, alerts }) {
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th>SKU</th><th>Name</th><th>Category</th><th>Qty</th><th>Price</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => {
            const alert = alerts.find(a => a.item === item.name);
            const status = alert?.type || 'healthy';
            return (
              <tr key={item.id}>
                <td>{item.sku}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>₹{item.unitPrice.toLocaleString()}</td>
                <td><span className={`status ${status}`}>{status}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div className="card-value">{value}</div>
    </div>
  );
}
