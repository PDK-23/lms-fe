import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "@/components/ui";
import categoryService from "@/services/categoryService";
import type { Category } from "@/types";

export default function AdminCategoryNew() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("primary");
  const [parentId, setParentId] = useState<string | "">("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const result = await categoryService.getCategories();
      setCategories(result);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  async function save() {
    try {
      setSaving(true);
      const newCat: Category = {
        id: Date.now().toString(),
        name: name || "Untitled",
        icon:
          icon ||
          `https://placehold.co/80x80?text=${encodeURIComponent(
            name || "Cat"
          )}`,
        color,
        courseCount: 0,
        parentId: parentId || undefined,
      };
      await categoryService.addCategory(newCat);
      navigate("/admin/categories");
    } catch (error) {
      console.error("Failed to create category:", error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-lg">
      <h2 className="text-lg sm:text-xl font-semibold">New Category</h2>
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Icon URL</label>
          <Input value={icon} onChange={(e) => setIcon(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Color</label>
          <select
            className="mt-1 block w-full rounded border p-2"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">
            Parent Category (optional)
          </label>
          <select
            className="mt-1 block w-full rounded border p-2"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
