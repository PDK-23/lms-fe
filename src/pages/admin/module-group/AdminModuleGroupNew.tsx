import { Card, Button, Input } from "@/components/ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import moduleGroupService from "@/services/moduleGroupService";

export default function AdminModuleGroupNew() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim() || !icon.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    moduleGroupService.add({
      name: name.trim(),
      url: url.trim(),
      icon: icon.trim(),
      description: description.trim() || undefined,
      createdById: "user1", // TODO: Use actual logged-in user
    });

    navigate("/admin/module-groups");
  };

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
        <h2 className="text-xl font-semibold mb-4">Create New Module Group</h2>
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
            <Button type="submit">Create Module Group</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
