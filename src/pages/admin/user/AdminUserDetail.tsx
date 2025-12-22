import { Card, Button, Input } from "@/components/ui";
import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userService from "@/services/userService";
import type { User } from "@/types";

export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useMemo(
    () => (id ? userService.getUserById(id) : undefined),
    [id]
  );

  const [form, setForm] = useState<User>(
    user ||
      ({
        id: "",
        email: "",
        name: "",
        enrolledCourses: [],
        completedCourses: [],
        certificates: [],
        createdAt: new Date(),
      } as any)
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value } as any));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    userService.updateUser(form as any);
    setIsSaving(false);
    navigate("/admin/users");
  };

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
