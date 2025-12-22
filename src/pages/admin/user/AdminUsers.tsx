import { Card, Button } from "@/components/ui";
import { useState } from "react";
import { Eye, Lock, Edit2, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import userService from "@/services/userService";
import type { User } from "@/types";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(userService.getUsers());
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function refresh() {
    setUsers(userService.getUsers());
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Users</h2>
        <Button
          className="flex gap-2 items-center"
          onClick={() => navigate("/admin/users/new")}
        >
          <Plus className="w-4 h-4" />
          <span className="ml-2">New User</span>
        </Button>
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-500 border-b">
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2">Phone</th>
                <th className="py-3 px-2">Role</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t hover:bg-neutral-50">
                  <td className="py-3 px-2 font-medium">{u.name}</td>
                  <td className="py-3 px-2 text-neutral-600 truncate text-xs sm:text-sm">
                    {u.email}
                  </td>
                  <td className="py-3 px-2 text-neutral-600 truncate text-xs sm:text-sm">
                    {u.phone || "-"}
                  </td>
                  <td className="py-3 px-2 text-neutral-600">
                    <span className="inline-block px-2 py-1 bg-neutral-100 rounded text-xs">
                      {u.role || "student"}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs ${
                        u.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      {" "}
                      <Button
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => navigate(`/admin/users/${u.id}/view`)}
                      >
                        <Eye className="w-3 h-3" />
                        <span className="hidden lg:inline">View</span>
                      </Button>
                      <Button
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => navigate(`/admin/users/${u.id}`)}
                      >
                        <Edit2 className="w-3 h-3" />
                        <span className="hidden lg:inline">Edit</span>
                      </Button>
                      <Button
                        className="flex gap-2 items-center"
                        size="sm"
                        variant="outline"
                        onClick={() => setConfirmDelete(u.id)}
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
        {users.map((u) => (
          <Card key={u.id} className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-sm">{u.name}</h3>
              <p className="text-xs text-neutral-600 mt-1 truncate">
                {u.email}
              </p>
              <p className="text-xs text-neutral-500 mt-1">{u.phone || "-"}</p>
              <div className="mt-2">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs ${
                    u.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {u.isActive ? "Active" : "Disabled"}
                </span>
                <span className="ml-2 inline-block px-2 py-1 bg-neutral-100 rounded text-xs">
                  {u.role || "student"}
                </span>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                className="flex-1 text-xs flex items-center justify-center gap-1"
                onClick={() => navigate(`/admin/users/${u.id}/view`)}
              >
                <Eye className="w-3 h-3" />
                View
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs flex items-center justify-center gap-1"
                onClick={() => navigate(`/admin/users/${u.id}`)}
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs flex items-center justify-center gap-1"
                variant="outline"
                onClick={() => setConfirmDelete(u.id)}
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black opacity-40"
            onClick={() => setConfirmDelete(null)}
          />
          <div className="bg-white rounded-lg p-6 z-50 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Are you sure you want to delete this user?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  userService.deleteUser(confirmDelete);
                  setConfirmDelete(null);
                  refresh();
                }}
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
