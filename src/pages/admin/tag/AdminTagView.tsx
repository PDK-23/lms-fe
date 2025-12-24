import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui";
import { useParams } from "react-router-dom";
import tagService from "@/services/tagService";
import type { Tag } from "@/types";

export default function AdminTagView() {
  const { id } = useParams();
  const [tag, setTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const result = await tagService.getTagById(id);
      setTag(result || null);
    } catch (error) {
      console.error("Failed to fetch tag:", error);
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

  if (!tag) return <div>Tag not found</div>;

  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-lg sm:text-xl font-semibold">Tag</h2>
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div style={{ width: 64, height: 64, background: tag.color }} />
          <div>
            <h3 className="font-semibold text-lg">{tag.name}</h3>
            <p className="text-sm text-neutral-600 mt-1">Color: {tag.color}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
