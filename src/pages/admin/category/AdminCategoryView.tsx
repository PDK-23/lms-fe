import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui";
import { useParams } from "react-router-dom";
import categoryService from "@/services/categoryService";
import type { Category } from "@/types";

export default function AdminCategoryView() {
  const { id } = useParams();
  const [cat, setCat] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const result = await categoryService.getCategoryById(id);
      setCat(result || null);
    } catch (error) {
      console.error("Failed to fetch category:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!cat) return <div>Category not found</div>;

  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-lg sm:text-xl font-semibold">Category</h2>
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <img src={cat.icon} alt={cat.name} className="w-16 h-16" />
          <div>
            <h3 className="font-semibold text-lg">{cat.name}</h3>
            <p className="text-sm text-neutral-600 mt-1">Color: {cat.color}</p>
            <p className="text-sm text-neutral-600 mt-1">
              Courses: {cat.courseCount}
            </p>
            <p className="text-sm text-neutral-600 mt-1">
              Parent: {cat.parentId || "-"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
