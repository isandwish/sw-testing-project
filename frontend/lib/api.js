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
  return user?.token || null;
};

const authHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return {
    "Content-Type": "application/json",
    "x-role": user?.role,
    "x-user-id": user?.userId,
    "x-email": user?.email
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
    headers: authHeaders(),
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

export const getTables = async () => {
  const res = await fetch(`${API}/admin/tables`, {
    headers: authHeaders()
  });

  return res.json();
};

export const createTable = async (data) => {
  const res = await fetch(`${API}/admin/tables`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  return res.json();
};

export const updateTable = async (id, data) => {
  const res = await fetch(`${API}/admin/tables/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  return res.json();
};

export const deleteTable = async (id) => {
  const res = await fetch(`${API}/admin/tables/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  return res.json();
};

export const getRestaurant = async () => {
  const res = await fetch(`${API}/restaurant`, {
    headers: authHeaders(),
  });

  return res.json();
};

export const updateRestaurant = async (data) => {
  const res = await fetch(`${API}/admin/restaurant`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  return res.json();
};

export const getAllReservations = async () => {
  const res = await fetch(`${API}/admin/reservations`, {
    headers: authHeaders(),
  });

  return res.json();
};

export const getNotifications = async () => {
  const res = await fetch(`${API}/admin/notifications`, {
    headers: authHeaders(),
  });

  return res.json();
};