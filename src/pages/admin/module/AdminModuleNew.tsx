import { Card, Button, Input } from "@/components/ui";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import moduleService from "@/services/moduleService";
import moduleGroupService from "@/services/moduleGroupService";

export default function AdminModuleNew() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("");
  const [description, setDescription] = useState("");
  const [moduleGroupId, setModuleGroupId] = useState("");
  const [moduleGroups, setModuleGroups] = useState<
    Array<{ id: string; name: string }>
  >([]);

  useEffect(() => {
    setModuleGroups(moduleGroupService.getAll());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim() || !moduleGroupId) {
      alert("Please fill in all required fields");
      return;
    }

    moduleService.add({
      name: name.trim(),
      url: url.trim(),
      icon: icon.trim() || undefined,
      description: description.trim() || undefined,
      moduleGroupId,
      createdById: "user1", // TODO: Use actual logged-in user
    });

    navigate("/admin/modules");
  };

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/admin/modules")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Modules
      </Button>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Create New Module</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Module name"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Icon (Lucide icon name)
              </label>
              <Input
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="e.g., BookOpen, Users, Settings"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Module Group <span className="text-red-500">*</span>
              </label>
              <select
                value={moduleGroupId}
                onChange={(e) => setModuleGroupId(e.target.value)}
                className="w-full border rounded p-2"
                required
              >
                <option value="">Select a group</option>
                {moduleGroups.map((mg) => (
                  <option key={mg.id} value={mg.id}>
                    {mg.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Module description"
              className="w-full border rounded p-2 min-h-[100px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/modules")}
            >
              Cancel
            </Button>
            <Button type="submit">Create Module</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
