const API = process.env.NEXT_PUBLIC_API_URL;

// =========================
// Auth
// =========================
export const register = async (data) => {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const login = async (data) => {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};

// =========================
// Helpers
// =========================
const getToken = () => {
  if (typeof window === "undefined") return null;

  const user = JSON.parse(localStorage.getItem("user"));

  // 👉 fallback mock token
  return user?.token || "mock-token";
};

const authHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// =========================
// Reservations
// =========================
export const getAvailability = (data) =>
  fetch(
    `${API}/reservations/availability?date=${data.date}&time=${data.time}&guestCount=${data.guestCount}`
  ).then((r) => r.json());

export const createReservation = (data) =>
  fetch(`${API}/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const updateReservation = (id, data) =>
  fetch(`${API}/reservations/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const cancelReservation = (id) =>
  fetch(`${API}/reservations/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  }).then((r) => r.json());

// =========================
// Staff APIs (NEW)
// =========================
export const updateTableStatus = (id, status) =>
  fetch(`${API}/admin/tables/${id}/status`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  }).then((r) => r.json());

export const createWalkIn = (data) =>
  fetch(`${API}/reservations/walk-in`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const getMyReservations = () =>
  fetch(`${API}/reservations/history`, {
    headers: authHeaders(),
  }).then((r) => r.json());