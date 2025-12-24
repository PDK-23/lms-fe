import { Card, Button } from "@/components/ui";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit2, Link } from "lucide-react";
import moduleGroupService from "@/services/moduleGroupService";
import moduleService from "@/services/moduleService";
import type { ModuleGroup, Module } from "@/types";

export default function AdminModuleGroupView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [group, setGroup] = useState<ModuleGroup | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [found, groupModules] = await Promise.all([
        moduleGroupService.getById(id),
        moduleService.getByModuleGroupId(id),
      ]);
      if (!found) {
        alert("Module group not found");
        navigate("/admin/module-groups");
        return;
      }
      setGroup(found);
      setModules(groupModules);
    } catch (error) {
      console.error("Failed to fetch module group:", error);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

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

  if (!group) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/admin/module-groups")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Module Groups
        </Button>
        <Button
          size="sm"
          onClick={() => navigate(`/admin/module-groups/${id}`)}
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">{group.name}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-1">URL</h3>
              <p className="text-neutral-900 flex items-center gap-2">
                <Link className="w-4 h-4" />
                {group.url}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-1">
                Description
              </h3>
              <p className="text-neutral-900">
                {group.description || "No description"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-1">
                Icon
              </h3>
              <p className="text-neutral-900">{group.icon}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-1">
                Created At
              </h3>
              <p className="text-neutral-900">
                {new Date(group.createdAt).toLocaleDateString()}
              </p>
            </div>

            {group.updatedAt && (
              <div>
                <h3 className="text-sm font-medium text-neutral-500 mb-1">
                  Last Updated
                </h3>
                <p className="text-neutral-900">
                  {new Date(group.updatedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Modules in this Group</h3>
        {modules.length === 0 ? (
          <p className="text-neutral-500 text-sm">
            No modules in this group yet
          </p>
        ) : (
          <div className="space-y-2">
            {modules.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-3 border rounded hover:bg-neutral-50"
              >
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-sm text-neutral-600 flex items-center gap-1">
                    <Link className="w-3 h-3" />
                    {m.url}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/admin/modules/${m.id}/view`)}
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
