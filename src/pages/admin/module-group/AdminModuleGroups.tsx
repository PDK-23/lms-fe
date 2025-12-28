import { Card, Button } from "@/components/ui";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Eye, Link } from "lucide-react";
import type { ModuleGroup } from "@/types";
import moduleGroupService from "@/services/moduleGroupService";
import moduleService from "@/services/moduleService";

export default function AdminModuleGroups() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<ModuleGroup[]>([]);
  const [moduleCounts, setModuleCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<ModuleGroup | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const loadedGroups = await moduleGroupService.getAll();
      setGroups(loadedGroups);
      // Count modules for each group
      const counts: Record<string, number> = {};
      for (const g of loadedGroups) {
        const modules = await moduleService.getByModuleGroupId(g.id);
        counts[g.id] = modules.length;
      }
      setModuleCounts(counts);
    } catch (error) {
      console.error("Failed to fetch module groups:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async () => {
    if (!groupToDelete) return;
    try {
      await moduleGroupService.remove(groupToDelete.id);
      fetchData();
    } catch (error) {
      console.error("Failed to delete module group:", error);
    }
    setConfirmOpen(false);
    setGroupToDelete(null);
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
        <h2 className="text-lg sm:text-xl font-semibold">Module Groups</h2>
        <Button
          className="w-full sm:w-auto"
          onClick={() => navigate("/admin/module-groups/new")}
        >
          New Module Group
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
                <th className="py-3 px-2">Modules</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <tr key={g.id} className="border-t hover:bg-neutral-50">
                  <td className="py-3 px-2 truncate font-medium">{g.name}</td>
                  <td className="py-3 px-2 text-neutral-600">
                    <div className="flex items-center gap-1">
                      <Link className="w-3 h-3" />
                      {g.url}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-neutral-600">{g.icon}</td>
                  <td className="py-3 px-2 text-neutral-600">
                    {moduleCounts[g.id] || 0} modules
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() =>
                          navigate(`/admin/module-groups/${g.id}/view`)
                        }
                      >
                        <Eye className="w-3 h-3" />
                        <span className="hidden lg:inline">View</span>
                      </Button>
                      <Button
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => navigate(`/admin/module-groups/${g.id}`)}
                      >
                        <Edit2 className="w-3 h-3" />
                        <span className="hidden lg:inline">Edit</span>
                      </Button>
                      <Button
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => {
                          setGroupToDelete(g);
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
        {groups.map((g) => (
          <Card key={g.id} className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-sm truncate">{g.name}</h3>
              <p className="text-xs text-neutral-600 mt-1 flex items-center gap-1">
                <Link className="w-3 h-3" />
                {g.url}
              </p>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="text-neutral-600">{g.icon}</span>
                <span className="mx-2">•</span>
                <span className="text-neutral-600">
                  {moduleCounts[g.id] || 0} modules
                </span>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                className="flex-1 text-xs flex items-center justify-center gap-1"
                onClick={() => navigate(`/admin/module-groups/${g.id}/view`)}
              >
                <Eye className="w-3 h-3" />
                View
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs flex items-center justify-center gap-1"
                onClick={() => navigate(`/admin/module-groups/${g.id}`)}
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs flex items-center justify-center gap-1"
                onClick={() => {
                  setGroupToDelete(g);
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

      {confirmOpen && groupToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black opacity-40"
            onClick={() => {
              setConfirmOpen(false);
              setGroupToDelete(null);
            }}
          />
          <div className="bg-white rounded-lg shadow-lg p-6 z-50 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Are you sure you want to delete "{groupToDelete.name}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setConfirmOpen(false);
                  setGroupToDelete(null);
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
