// Auth utilities using localStorage for user management
// Each user gets their own namespaced data storage

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

const USERS_KEY = "styleSense_users";
const SESSION_KEY = "styleSense_session";

// Simple hash for demo purposes (not for production)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Get all registered users
function getUsers(): Record<string, { name: string; email: string; passwordHash: string; createdAt: string }> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : {};
}

// Save users map
function saveUsers(users: Record<string, { name: string; email: string; passwordHash: string; createdAt: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Sign up a new user
export async function signUp(name: string, email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
  const users = getUsers();

  // Check if email already exists
  const existingUser = Object.entries(users).find(([, u]) => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return { success: false, error: "An account with this email already exists." };
  }

  const id = generateId();
  const passwordHash = await hashPassword(password);
  const createdAt = new Date().toISOString();

  users[id] = { name, email: email.toLowerCase(), passwordHash, createdAt };
  saveUsers(users);

  const user: User = { id, name, email: email.toLowerCase(), createdAt };
  setSession(user);

  return { success: true, user };
}

// Log in an existing user
export async function logIn(email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
  const users = getUsers();
  const passwordHash = await hashPassword(password);

  const entry = Object.entries(users).find(
    ([, u]) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === passwordHash
  );

  if (!entry) {
    return { success: false, error: "Invalid email or password." };
  }

  const [id, userData] = entry;
  const user: User = { id, name: userData.name, email: userData.email, createdAt: userData.createdAt };
  setSession(user);

  return { success: true, user };
}

// Session management
function setSession(user: User) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getSession(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function logOut() {
  localStorage.removeItem(SESSION_KEY);
}

// Per-user data storage — namespaced by user ID
export function getUserData(key: string): string | null {
  const user = getSession();
  if (!user) return null;
  return localStorage.getItem(`styleSense_${user.id}_${key}`);
}

export function setUserData(key: string, value: string) {
  const user = getSession();
  if (!user) return;
  localStorage.setItem(`styleSense_${user.id}_${key}`, value);
}

export function removeUserData(key: string) {
  const user = getSession();
  if (!user) return;
  localStorage.removeItem(`styleSense_${user.id}_${key}`);
}
