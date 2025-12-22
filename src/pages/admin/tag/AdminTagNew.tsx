import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "@/components/ui";
import tagService from "@/services/tagService";
import type { Tag } from "@/types";

export default function AdminTagNew() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [color, setColor] = useState("#e5e7eb");

  function save() {
    const t: Tag = {
      id: Date.now().toString(),
      name: name || "tag",
      color,
    };
    tagService.addTag(t);
    navigate("/admin/tags");
  }

  return (
    <div className="space-y-4 max-w-lg">
      <h2 className="text-lg sm:text-xl font-semibold">New Tag</h2>
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
          <Button onClick={save}>Create</Button>
        </div>
      </div>
    </div>
  );
}
