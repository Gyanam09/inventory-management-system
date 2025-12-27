# Inventory Management System

A full-stack inventory visibility and optimization system for material-based businesses.  
It provides real-time inventory tracking, alerts for low stock and dead stock, and a clean dashboard interface.

---

## 🚀 Live Demo

- Frontend: https://inventory-management-system-bice-psi.vercel.app/
- Backend API: https://inventory-management-system-production-8866.up.railway.app/api/inventory

---

## ✨ Features

- Add, update, and delete inventory items
- Low stock and dead stock alerts
- Inventory value calculation
- Persistent storage using SQLite
- Responsive dashboard with dark/light mode
- REST API backend

---

## 🛠 Tech Stack

| Layer | Technology |
|------|------------|
Frontend | Next.js, Tailwind CSS |
Backend | Node.js, Express |
Database | SQLite |
Hosting | Vercel (frontend), Railway (backend) |

---

## 📊 Business Logic

- **Low stock** → quantity ≤ reorder level  
- **Dead stock** → not sold in the last 60 days

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|-----------|------------|
GET | `/api/inventory` | Get all inventory items |
POST | `/api/inventory` | Add a new inventory item |
PUT | `/api/inventory/:id` | Update an item |
DELETE | `/api/inventory/:id` | Delete an item |
GET | `/api/alerts` | Get stock alerts |

---

## 💻 Run Locally

### Backend
```bash
cd backend
npm install
npm start
