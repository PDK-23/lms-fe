import { Card, Button, Input } from "@/components/ui";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import moduleGroupService from "@/services/moduleGroupService";
import type { ModuleGroup } from "@/types";

export default function AdminModuleGroupDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [group, setGroup] = useState<ModuleGroup | null>(null);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!id) return;
    const found = moduleGroupService.getById(id);
    if (!found) {
      alert("Module group not found");
      navigate("/admin/module-groups");
      return;
    }
    setGroup(found);
    setName(found.name);
    setUrl(found.url);
    setIcon(found.icon);
    setDescription(found.description || "");
  }, [id, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !group) return;
    if (!name.trim() || !url.trim() || !icon.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    moduleGroupService.update(id, {
      name: name.trim(),
      url: url.trim(),
      icon: icon.trim(),
      description: description.trim() || undefined,
    });

    navigate("/admin/module-groups");
  };

  if (!group) return null;

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/admin/module-groups")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Module Groups
      </Button>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Module Group</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Module group name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              URL <span className="text-red-500">*</span>
            </label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="/admin/example"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Icon (Lucide icon name) <span className="text-red-500">*</span>
            </label>
            <Input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="e.g., FolderOpen, UsersRound, Cog"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Module group description"
              className="w-full border rounded p-2 min-h-[100px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/module-groups")}
            >
              Cancel
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
