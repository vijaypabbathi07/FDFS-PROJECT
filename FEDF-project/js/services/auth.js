/**
 * Authentication Service
 * Manages user accounts, session storage, demo accounts, and state changes.
 */

const STORAGE_KEY_USER = "savoria_current_user";
const STORAGE_KEY_ALL_USERS = "savoria_registered_users";

const DEMO_USERS = [
  {
    id: "user-demo-1",
    name: "Alex Rivera",
    email: "demo@savoria.com",
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    role: "Home Chef & Foodie",
    bio: "Passionate sourdough baker, weeknight dinner explorer, and olive oil fanatic 🌿",
    createdAt: "2026-01-15"
  },
  {
    id: "user-demo-2",
    name: "Chef Isabella Rossi",
    email: "chef@savoria.com",
    password: "chef123",
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80",
    role: "Culinary Arts Instructor",
    bio: "Certified culinary instructor specializing in modern Mediterranean & artisan pastries 👨‍🍳✨",
    createdAt: "2025-11-20"
  }
];

class AuthService {
  constructor() {
    this.listeners = [];
    this.initUsers();
  }

  initUsers() {
    const existing = localStorage.getItem(STORAGE_KEY_ALL_USERS);
    if (!existing) {
      localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(DEMO_USERS));
    }
  }

  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_ALL_USERS)) || DEMO_USERS;
    } catch {
      return DEMO_USERS;
    }
  }

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem(STORAGE_KEY_USER);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  isLoggedIn() {
    return this.getCurrentUser() !== null;
  }

  login(email, password) {
    const users = this.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);

    if (!user) {
      throw new Error("Invalid email or password. Please try again or use the demo login.");
    }

    const sessionUser = { ...user };
    delete sessionUser.password;
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(sessionUser));
    this.notify(sessionUser);
    return sessionUser;
  }

  loginWithDemo(accountIndex = 0) {
    const demo = DEMO_USERS[accountIndex] || DEMO_USERS[0];
    return this.login(demo.email, demo.password);
  }

  register(name, email, password, role = "Enthusiastic Cook") {
    if (!name || !email || !password) {
      throw new Error("Please complete all required fields.");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    const users = this.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      throw new Error("An account with this email address already exists.");
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password: password,
      role: role,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
      bio: "Excited to share recipes and explore culinary inspirations!",
      createdAt: new Date().toISOString().split("T")[0]
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(users));

    const sessionUser = { ...newUser };
    delete sessionUser.password;
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(sessionUser));
    this.notify(sessionUser);
    return sessionUser;
  }

  updateProfile({ name, bio, role, avatar }) {
    const current = this.getCurrentUser();
    if (!current) throw new Error("No active session");

    const users = this.getUsers();
    const index = users.findIndex(u => u.id === current.id);

    const updated = {
      ...current,
      name: name ? name.trim() : current.name,
      bio: bio !== undefined ? bio.trim() : current.bio,
      role: role ? role.trim() : current.role,
      avatar: avatar || current.avatar
    };

    if (index !== -1) {
      users[index] = { ...users[index], ...updated };
      localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(users));
    }

    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
    this.notify(updated);
    return updated;
  }

  logout() {
    localStorage.removeItem(STORAGE_KEY_USER);
    this.notify(null);
  }

  onAuthStateChanged(callback) {
    this.listeners.push(callback);
    callback(this.getCurrentUser());
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify(user) {
    this.listeners.forEach(cb => {
      try {
        cb(user);
      } catch (err) {
        console.error("Auth listener error:", err);
      }
    });
  }
}

export const authService = new AuthService();
