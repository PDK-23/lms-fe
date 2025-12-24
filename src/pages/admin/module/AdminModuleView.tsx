import { Card, Button } from "@/components/ui";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit2, Link } from "lucide-react";
import moduleService from "@/services/moduleService";
import moduleGroupService from "@/services/moduleGroupService";
import type { Module } from "@/types";

export default function AdminModuleView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [module, setModule] = useState<Module | null>(null);
  const [groupName, setGroupName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const found = await moduleService.getById(id);
      if (!found) {
        alert("Module not found");
        navigate("/admin/modules");
        return;
      }
      setModule(found);

      if (found.moduleGroupId) {
        const group = await moduleGroupService.getById(found.moduleGroupId);
        if (group) {
          setGroupName(group.name);
        }
      }
    } catch (error) {
      console.error("Failed to fetch module:", error);
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

  if (!module) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/admin/modules")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Modules
        </Button>
        <Button size="sm" onClick={() => navigate(`/admin/modules/${id}`)}>
          <Edit2 className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">{module.name}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-1">URL</h3>
              <p className="text-neutral-900 flex items-center gap-2">
                <Link className="w-4 h-4" />
                {module.url}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-1">
                Description
              </h3>
              <p className="text-neutral-900">
                {module.description || "No description"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-1">
                Icon
              </h3>
              <p className="text-neutral-900">{module.icon || "None"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-1">
                Module Group
              </h3>
              <p className="text-neutral-900">{groupName || "None"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-1">
                Created At
              </h3>
              <p className="text-neutral-900">
                {new Date(module.createdAt).toLocaleDateString()}
              </p>
            </div>

            {module.updatedAt && (
              <div>
                <h3 className="text-sm font-medium text-neutral-500 mb-1">
                  Last Updated
                </h3>
                <p className="text-neutral-900">
                  {new Date(module.updatedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
