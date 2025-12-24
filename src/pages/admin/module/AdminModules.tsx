import { Card, Button } from "@/components/ui";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Eye, Link } from "lucide-react";
import type { Module } from "@/types";
import moduleService from "@/services/moduleService";
import moduleGroupService from "@/services/moduleGroupService";

export default function AdminModules() {
  const navigate = useNavigate();
  const [modules, setModules] = useState<Module[]>([]);
  const [groupNames, setGroupNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<Module | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [modulesData, groups] = await Promise.all([
        moduleService.getAll(),
        moduleGroupService.getAll(),
      ]);
      setModules(modulesData);
      const names: Record<string, string> = {};
      groups.forEach((g) => {
        names[g.id] = g.name;
      });
      setGroupNames(names);
    } catch (error) {
      console.error("Failed to fetch modules:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async () => {
    if (!moduleToDelete) return;
    try {
      await moduleService.remove(moduleToDelete.id);
      fetchData();
    } catch (error) {
      console.error("Failed to delete module:", error);
    }
    setConfirmOpen(false);
    setModuleToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Modules</h2>
        <Button
          className="w-full sm:w-auto"
          onClick={() => navigate("/admin/modules/new")}
        >
          New Module
        </Button>
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-500 border-b">
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">URL</th>
                <th className="py-3 px-2">Icon</th>
                <th className="py-3 px-2">Module Group</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((m) => (
                <tr key={m.id} className="border-t hover:bg-neutral-50">
                  <td className="py-3 px-2 truncate font-medium">{m.name}</td>
                  <td className="py-3 px-2 text-neutral-600">
                    <div className="flex items-center gap-1">
                      <Link className="w-3 h-3" />
                      {m.url}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-neutral-600">
                    {m.icon || "-"}
                  </td>
                  <td className="py-3 px-2 text-neutral-600">
                    {groupNames[m.moduleGroupId] || "-"}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => navigate(`/admin/modules/${m.id}/view`)}
                      >
                        <Eye className="w-3 h-3" />
                        <span className="hidden lg:inline">View</span>
                      </Button>
                      <Button
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => navigate(`/admin/modules/${m.id}`)}
                      >
                        <Edit2 className="w-3 h-3" />
                        <span className="hidden lg:inline">Edit</span>
                      </Button>
                      <Button
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => {
                          setModuleToDelete(m);
                          setConfirmOpen(true);
                        }}
                        variant="outline"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span className="hidden lg:inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {modules.map((m) => (
          <Card key={m.id} className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-sm truncate">{m.name}</h3>
              <p className="text-xs text-neutral-600 mt-1 flex items-center gap-1">
                <Link className="w-3 h-3" />
                {m.url}
              </p>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="text-neutral-600">{m.icon || "No icon"}</span>
                <span className="mx-2">•</span>
                <span className="text-neutral-600">
                  {groupNames[m.moduleGroupId] || "No group"}
                </span>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                className="flex-1 text-xs flex items-center justify-center gap-1"
                onClick={() => navigate(`/admin/modules/${m.id}/view`)}
              >
                <Eye className="w-3 h-3" />
                View
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs flex items-center justify-center gap-1"
                onClick={() => navigate(`/admin/modules/${m.id}`)}
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs flex items-center justify-center gap-1"
                onClick={() => {
                  setModuleToDelete(m);
                  setConfirmOpen(true);
                }}
                variant="outline"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {confirmOpen && moduleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black opacity-40"
            onClick={() => {
              setConfirmOpen(false);
              setModuleToDelete(null);
            }}
          />
          <div className="bg-white rounded-lg shadow-lg p-6 z-50 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Are you sure you want to delete "{moduleToDelete.name}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setConfirmOpen(false);
                  setModuleToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
