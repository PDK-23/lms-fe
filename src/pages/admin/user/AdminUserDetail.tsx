import { Card, Button, Input } from "@/components/ui";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userService from "@/services/userService";
import type { User } from "@/types";

export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<User>({
    id: "",
    email: "",
    name: "",
    enrolledCourses: [],
    completedCourses: [],
    certificates: [],
    createdAt: new Date(),
  } as any);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const result = await userService.getUserById(id);
      if (result) {
        setUser(result);
        setForm(result);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value } as any));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await userService.updateUser(id!, form as any);
      navigate("/admin/users");
    } catch (error) {
      console.error("Failed to update user:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-8 text-center text-neutral-600">User not found</div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Edit User</h2>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <label className="block text-sm text-neutral-700 mb-2">Name</label>
          <Input name="name" value={form.name} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm text-neutral-700 mb-2">Email</label>
          <Input name="email" value={form.email} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm text-neutral-700 mb-2">Phone</label>
          <Input
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-700 mb-2">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={(e) =>
              setForm((p) => ({ ...p, role: e.target.value as any }))
            }
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
          >
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-neutral-700 mb-2">
            Avatar URL
          </label>
          <Input
            name="avatar"
            value={form.avatar || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-700 mb-2">Bio</label>
          <Input name="bio" value={form.bio || ""} onChange={handleChange} />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!form.isActive}
            onChange={(e) =>
              setForm((p) => ({ ...p, isActive: e.target.checked }))
            }
          />
          <span className="text-sm">Active</span>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => navigate("/admin/users")}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
