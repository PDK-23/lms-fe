import { MOCK_USERS as SEED } from "@/mocks/users";
import type { User } from "@/types";

const STORAGE_KEY = "mock_users_v1";

function load(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as User[];
  } catch (e) {
    console.warn("Failed to read users from localStorage", e);
  }
  return JSON.parse(JSON.stringify(SEED)) as User[];
}

function save(users: User[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn("Failed to write users to localStorage", e);
  }
}

let users = load();

export function getUsers(): User[] {
  return users;
}

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function addUser(user: User) {
  users.push(user);
  save(users);
}

export function updateUser(updated: User) {
  const i = users.findIndex((u) => u.id === updated.id);
  if (i >= 0) {
    users[i] = updated;
    save(users);
  }
}

export function deleteUser(id: string) {
  users = users.filter((u) => u.id !== id);
  save(users);
}

export default { getUsers, getUserById, addUser, updateUser, deleteUser };
