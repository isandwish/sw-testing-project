const API = process.env.NEXT_PUBLIC_API_URL;

// auth
export const login = (data) =>
  fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const register = (data) =>
  fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

// reservations
export const getAvailability = (data) =>
  fetch(`${API}/reservations/availability`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const createReservation = (data) =>
  fetch(`${API}/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const updateReservation = (id, data) =>
  fetch(`${API}/reservations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const cancelReservation = (id) =>
  fetch(`${API}/reservations/${id}`, {
    method: "DELETE",
  }).then((r) => r.json());