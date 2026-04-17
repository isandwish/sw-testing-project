# 📌 API Endpoints List

## 🔐 Authentication
* POST /auth/register
* POST /auth/login

## 🪑 Reservation
* GET /reservations/availability
* POST /reservations
* PUT /reservations/:id
* DELETE /reservations/:id
* POST /reservations/walk-in
* GET /reservations/history
* GET /reservations/all

## 👨‍🍳 Admin
* GET /admin/reservations
* GET /admin/notifications
* PUT /admin/tables/:id/status
* PUT /admin/restaurant
* GET /admin/tables
* POST /admin/tables
* PUT /admin/tables/:id
* DELETE /admin/tables/:id

## 👤 User
* GET /users/profile

## 🌍 Public
* GET /restaurant