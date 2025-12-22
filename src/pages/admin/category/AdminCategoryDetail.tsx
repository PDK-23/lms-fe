import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Input } from "@/components/ui";
import categoryService from "@/services/categoryService";
import type { Category } from "@/types";

export default function AdminCategoryDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const cat = id ? categoryService.getCategoryById(id) : undefined;

  const [name, setName] = useState(cat?.name || "");
  const [icon, setIcon] = useState(cat?.icon || "");
  const [color, setColor] = useState(cat?.color || "primary");
  const [parentId, setParentId] = useState<string | "">(cat?.parentId || "");

  const categories = categoryService.getCategories().filter((c) => c.id !== id);

  if (!cat) return <div>Category not found</div>;

  function save() {
    const updated: Category = {
      id: cat!.id,
      name,
      icon,
      color,
      courseCount: cat!.courseCount || 0,
      parentId: parentId || undefined,
    };
    categoryService.updateCategory(updated);
    navigate("/admin/categories");
  }

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
          <Button onClick={save}>Save</Button>
        </div>
      </div>
    </div>
  );
}
