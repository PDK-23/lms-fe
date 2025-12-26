import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Input } from "@/components/ui";
import tagService from "@/services/tagService";
import type { Tag } from "@/types";

export default function AdminTagDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tag, setTag] = useState<Tag | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#e5e7eb");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const result = await tagService.getTagById(id);
      if (result) {
        setTag(result);
        setName(result.name || "");
        setColor(result.color || "#e5e7eb");
      }
    } catch (error) {
      console.error("Failed to fetch tag:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function save() {
    if (!tag) return;
    try {
      setSaving(true);
      const updated: Tag = { id: String(tag.id), name, color };
      await tagService.updateTag(tag.id, updated);
      navigate("/admin/tags");
    } catch (error) {
      console.error("Failed to update tag:", error);
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

  if (!tag) return <div>Tag not found</div>;

  return (
    <div className="space-y-4 max-w-lg">
      <h2 className="text-lg sm:text-xl font-semibold">Edit Tag</h2>
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Color</label>
          <Input value={color} onChange={(e) => setColor(e.target.value)} />
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
