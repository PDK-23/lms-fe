import { Card, Button, Input } from "@/components/ui";
import { useState, useEffect, useCallback } from "react";
import { Eye, Edit2, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import categoryService from "@/services/categoryService";
import type { Category } from "@/types";

export default function AdminCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (id: string) => {
    try {
      await categoryService.deleteCategory(id);
      setConfirmDelete(null);
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Categories</h2>
        <div className="md:flex items-center gap-3">
          <Input
            className="hidden md:block"
            value={search}
            placeholder="Search categories"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            className="flex gap-2 items-center"
            onClick={() => navigate("/admin/categories/new")}
          >
            <Plus className="w-4 h-4" />
            <span className="ml-2">New Category</span>
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-500 border-b">
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Parent</th>
                <th className="py-3 px-2">Courses</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-t hover:bg-neutral-50">
                  <td className="py-3 px-2 font-medium flex items-center gap-3">
                    <img src={c.icon} alt={c.name} className="w-8 h-8" />
                    <span>{c.name}</span>
                  </td>
                  <td className="py-3 px-2 text-neutral-600">
                    {c.parentId
                      ? categories.find((p) => p.id === c.parentId)?.name || "-"
                      : "-"}
                  </td>
                  <td className="py-3 px-2 text-neutral-600">
                    {c.courseCount}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() =>
                          navigate(`/admin/categories/${c.id}/view`)
                        }
                      >
                        <Eye className="w-3 h-3" />
                        <span className="hidden lg:inline">View</span>
                      </Button>
                      <Button
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => navigate(`/admin/categories/${c.id}`)}
                      >
                        <Edit2 className="w-3 h-3" />
                        <span className="hidden lg:inline">Edit</span>
                      </Button>
                      <Button
                        className="flex gap-2 items-center"
                        size="sm"
                        variant="outline"
                        onClick={() => setConfirmDelete(c.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                        <span className="hidden lg:inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black opacity-40"
            onClick={() => setConfirmDelete(null)}
          />
          <div className="bg-white rounded-lg p-6 z-50 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Are you sure you want to delete this category? This will not
              delete courses — you'll need to update courses manually.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => handleDelete(confirmDelete)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
