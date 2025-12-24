import MOCK_MODULE_GROUPS from "@/mocks/moduleGroups";
import type { ModuleGroup } from "@/types";

const STORAGE_KEY = "mock_module_groups_v1";

function loadAll(): ModuleGroup[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as ModuleGroup[];
      return parsed.map((mg) => ({ ...mg, createdAt: new Date(mg.createdAt) }));
    } catch (e) {
      console.error("Failed to parse module groups from storage", e);
    }
  }
  const seed = MOCK_MODULE_GROUPS.map((mg) => ({ ...mg }));
  saveAll(seed);
  return seed.map((mg) => ({ ...mg, createdAt: new Date(mg.createdAt) }));
}

function saveAll(items: ModuleGroup[]) {
  const serial = items.map((mg) => ({
    ...mg,
    createdAt:
      mg.createdAt instanceof Date ? mg.createdAt.toISOString() : mg.createdAt,
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serial));
}

function getAll(): ModuleGroup[] {
  return loadAll();
}

function getById(id: string): ModuleGroup | undefined {
  return loadAll().find((mg) => mg.id === id);
}

function add(payload: Omit<ModuleGroup, "id" | "createdAt">): ModuleGroup {
  const all = loadAll();
  const id = `mg${Date.now()}`;
  const newGroup: ModuleGroup = {
    id,
    ...payload,
    createdAt: new Date(),
  };
  all.push(newGroup);
  saveAll(all);
  return newGroup;
}

function update(
  id: string,
  payload: Partial<Omit<ModuleGroup, "id" | "createdAt">>
): ModuleGroup | null {
  const all = loadAll();
  const idx = all.findIndex((mg) => mg.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...payload };
  saveAll(all);
  return all[idx];
}

function remove(id: string): boolean {
  const all = loadAll();
  const filtered = all.filter((mg) => mg.id !== id);
  if (filtered.length === all.length) return false;
  saveAll(filtered);
  return true;
}

export default {
  getAll,
  getById,
  add,
  update,
  remove,
};
