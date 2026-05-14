# RBAC Food Ordering System (Demo)

## 📌 Overview

This is a role-based access control (RBAC) food ordering system built as an assignment project.  
It supports different user roles with country-based data access restrictions.

---

## 👥 Roles & Access

The system includes:

- **Admin**
  - Can access all orders and users

- **Manager**
  - Can access orders of members within the same country
  - Can also access their own orders

- **Member**
  - Can access only their own orders

### 🌍 Country-Based Restriction

Users are restricted by country:

- Managers and members from one country **cannot access data from another country**

---

## 🗄️ Database Setup

All database-related files are inside the `db` folder:

- `schema.sql` → Contains all table definitions
- `seedUsers.sql` → Inserts initial users
- `seedData.sql` → Inserts sample data

---

## ⚙️ Backend Setup

### 1. Create `.env` file in backend root

PORT=5000

DB_NAME=rbac_food_ordering_db
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432

JWT_SECRET=any_random_secret

---

### 2. Install dependencies

npm init
npm install

---

### 3. Setup database

npm run db:setup

---

### 4. Start backend server

npm run dev

---

## 🎨 Frontend Setup

npm install
npm run dev

---

## 🚀 Features

- Role-based access control (Admin / Manager / Member)
- Country-based data isolation
- Order management system
- Payment method update (inline editing)
- Checkout flow
- Secure backend with parameterized queries

---

## 🧠 Notes

This project is built for demonstration purposes and showcases:

- Backend API design
- SQL relationships & joins
- RBAC implementation
- Fullstack integration (React + Node + PostgreSQL)

---

## 📎 Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
