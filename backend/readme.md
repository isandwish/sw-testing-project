# 🍽️ Restaurant Reservation System (Backend)

## 📌 Overview

Backend API for Restaurant Table Reservation System
ใช้สำหรับจัดการการจองโต๊ะในร้านอาหาร (Mock API for testing)

Features:

* User Authentication (Register / Login)
* Reservation Management
* Table Management
* Admin Dashboard
* Security Testing (SQLi, XSS, JWT)

---

## ⚙️ Tech Stack

* Node.js
* Express.js
* Nodemon (dev)
* JWT (Authentication)

---

## 📁 Project Structure

```
backend/
│── routes/
│   ├── auth.routes.js
│   ├── reservation.routes.js
│   ├── admin.routes.js
│
│── middleware/
│   ├── auth.middleware.js
│   ├── validate.middleware.js
│
│── data/
│   ├── mockDB.js
│
│── server.js
│── package.json
```

---

## 🚀 Setup & Installation

### 1. Clone project

```
git clone <your-repo>
cd backend
```

### 2. Install dependencies

```
npm install
```

### 3. Run server (dev mode)

```
npm run dev
```

Server will run at:

```
http://localhost:3000
```

---

## 🔐 Authentication

ใช้ JWT Token (mock)

### Login Example

```
POST /auth/login
```

Response:

```json
{
  "token": "mock-jwt-token",
  "role": "customer"
}
```

👉 ใช้ token ใน header:

```
Authorization: Bearer <token>
```

---

## 📌 API Endpoints

### 🟢 Auth

* POST `/auth/register`
* POST `/auth/login`

---

### 🔵 Reservation

* GET `/reservations/availability`
* POST `/reservations`
* PUT `/reservations/:id`
* DELETE `/reservations/:id`
* POST `/reservations/walk-in` (staff)

---

### 🟡 Admin / Staff

* GET `/admin/reservations`
* GET `/admin/notifications`
* PUT `/admin/tables/:id/status`
* PUT `/admin/restaurant`
* GET `/admin/restaurant`

---

## 👥 Roles

| Role     | Permission              |
| -------- | ----------------------- |
| Customer | Book / Modify / Cancel  |
| Staff    | Manage tables / Walk-in |
| Admin    | Full access             |

---

## 🔒 Security Features

* SQL Injection validation
* XSS protection
* JWT Authentication
* Role-based access control
* Basic brute force protection

---

## 🧪 Testing API

ใช้ tools:

* Postman / Bruno
* Thunder Client

### Example Test Flow

1. Register user
2. Login → get token
3. Check availability
4. Create reservation
5. Modify / Cancel

---

## ⚠️ Notes

* This is a **mock backend** (no real database)
* Data stored in memory (reset when server restart)
* JWT is simplified (for testing only)