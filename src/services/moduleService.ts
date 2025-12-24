import MOCK_MODULES from "@/mocks/modules";
import type { Module } from "@/types";

const STORAGE_KEY = "mock_modules_v1";

function loadAll(): Module[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Module[];
      return parsed.map((m) => ({ ...m, createdAt: new Date(m.createdAt) }));
    } catch (e) {
      console.error("Failed to parse modules from storage", e);
    }
  }
  const seed = MOCK_MODULES.map((m) => ({ ...m }));
  saveAll(seed);
  return seed.map((m) => ({ ...m, createdAt: new Date(m.createdAt) }));
}

function saveAll(items: Module[]) {
  const serial = items.map((m) => ({
    ...m,
    createdAt:
      m.createdAt instanceof Date ? m.createdAt.toISOString() : m.createdAt,
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serial));
}

function getAll(): Module[] {
  return loadAll();
}

function getById(id: string): Module | undefined {
  return loadAll().find((m) => m.id === id);
}

function add(payload: Omit<Module, "id" | "createdAt">): Module {
  const all = loadAll();
  const id = `mod${Date.now()}`;
  const newModule: Module = {
    id,
    ...payload,
    createdAt: new Date(),
  };
  all.push(newModule);
  saveAll(all);
  return newModule;
}

function update(
  id: string,
  payload: Partial<Omit<Module, "id" | "createdAt">>
): Module | null {
  const all = loadAll();
  const idx = all.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...payload };
  saveAll(all);
  return all[idx];
}

function remove(id: string): boolean {
  const all = loadAll();
  const filtered = all.filter((m) => m.id !== id);
  if (filtered.length === all.length) return false;
  saveAll(filtered);
  return true;
}

function getByModuleGroupId(groupId: string): Module[] {
  return loadAll().filter((m) => m.moduleGroupId === groupId);
}

export default {
  getAll,
  getById,
  add,
  update,
  remove,
  getByModuleGroupId,
};
