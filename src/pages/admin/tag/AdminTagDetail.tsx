import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Input } from "@/components/ui";
import tagService from "@/services/tagService";
import type { Tag } from "@/types";

export default function AdminTagDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const tag = id ? tagService.getTagById(id) : undefined;

  const [name, setName] = useState(tag?.name || "");
  const [color, setColor] = useState(tag?.color || "#e5e7eb");

  if (!tag) return <div>Tag not found</div>;

  function save() {
    const updated: Tag = { id: String(tag!.id), name, color };
    tagService.updateTag(updated);
    navigate("/admin/tags");
  }

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
          <Button onClick={save}>Save</Button>
        </div>
      </div>
    </div>
  );
}
