import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Input } from "@/components/ui";
import categoryService from "@/services/categoryService";
import type { Category } from "@/types";

export default function AdminCategoryDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [cat, setCat] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("primary");
  const [parentId, setParentId] = useState<string | "">("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [category, allCategories] = await Promise.all([
        categoryService.getCategoryById(id),
        categoryService.getCategories(),
      ]);
      if (category) {
        setCat(category);
        setName(category.name || "");
        setIcon(category.icon || "");
        setColor(category.color || "primary");
        setParentId(category.parentId || "");
      }
      setCategories(allCategories.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to fetch category:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function save() {
    if (!cat) return;
    try {
      setSaving(true);
      const updated: Category = {
        id: cat.id,
        name,
        icon,
        color,
        courseCount: cat.courseCount || 0,
        parentId: parentId || undefined,
      };
      await categoryService.updateCategory(cat.id, updated);
      navigate("/admin/categories");
    } catch (error) {
      console.error("Failed to update category:", error);
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

  if (!cat) return <div>Category not found</div>;

  return (
    <div className="space-y-4 max-w-lg">
      <h2 className="text-lg sm:text-xl font-semibold">Edit Category</h2>
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
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
