import { TAGS as SEED } from "@/mocks/tags";
import type { Tag } from "@/types";

const STORAGE_KEY = "mock_tags_v1";

function load(): Tag[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Tag[];
  } catch (e) {
    console.warn("Failed to read tags from localStorage", e);
  }
  return JSON.parse(JSON.stringify(SEED)) as Tag[];
}

function save(tags: Tag[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
  } catch (e) {
    console.warn("Failed to write tags to localStorage", e);
  }
}

let tags = load();

export function getTags(): Tag[] {
  return tags;
}

export function getTagById(id: string): Tag | undefined {
  return tags.find((t) => t.id === id);
}

export function addTag(tag: Tag) {
  tags.push(JSON.parse(JSON.stringify(tag)));
  save(tags);
}

export function updateTag(updated: Tag) {
  const i = tags.findIndex((t) => t.id === updated.id);
  if (i >= 0) {
    tags[i] = JSON.parse(JSON.stringify(updated));
    save(tags);
  }
}

export function deleteTag(id: string) {
  tags = tags.filter((t) => t.id !== id);
  save(tags);
}

export default {
  getTags,
  getTagById,
  addTag,
  updateTag,
  deleteTag,
};
