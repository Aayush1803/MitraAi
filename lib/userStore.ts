/**
 * In-memory user store for hackathon/demo use.
 * In production, replace with a real database (PostgreSQL, MongoDB, etc.)
 */

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  image: string | null;
  createdAt: string;
  analysisCount: number;
}

// Module-level store persists across requests in the same Node.js process
const users = new Map<string, StoredUser>();

export const userStore = {
  findByEmail(email: string): StoredUser | undefined {
    return Array.from(users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  findById(id: string): StoredUser | undefined {
    return users.get(id);
  },

  create(data: Omit<StoredUser, 'id' | 'createdAt' | 'analysisCount'>): StoredUser {
    const id = `user_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const user: StoredUser = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      analysisCount: 0,
    };
    users.set(id, user);
    return user;
  },

  incrementAnalysis(id: string) {
    const user = users.get(id);
    if (user) user.analysisCount += 1;
  },

  all(): StoredUser[] {
    return Array.from(users.values());
  },
};
