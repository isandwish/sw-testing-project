export function getUser() {
  if (typeof window === "undefined") return null;
  return JSON.parse(localStorage.getItem("user"));
}

export function setUser(user) {
  // 👉 FORCE mock token ถ้าไม่มี
  const safeUser = {
    ...user,
    token: user.token || "mock-token"
  };

  localStorage.setItem("user", JSON.stringify(safeUser));
}

export function logout() {
  localStorage.removeItem("user");
}