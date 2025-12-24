import { Card, Button, Input } from "@/components/ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "@/services/userService";
import type { User } from "@/types";

export default function AdminUserNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState<User>({
    id: "",
    email: "",
    name: "",
    phone: "",
    role: "student",
    avatar: "",
    bio: "",
    isActive: true,
    enrolledCourses: [],
    completedCourses: [],
    certificates: [],
    createdAt: new Date(),
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value } as any));
  };

  const handleCreate = async () => {
    if (!form.name || !form.email) return;
    try {
      setIsCreating(true);
      const newUser = { ...form, id: Date.now().toString() };
      await userService.addUser(newUser as any);
      navigate("/admin/users");
    } catch (error) {
      console.error("Failed to create user:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Create User</h2>
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
            checked={form.isActive}
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
            onClick={handleCreate}
            disabled={isCreating}
            className="flex items-center gap-2"
          >
            {isCreating ? "Creating..." : "Create"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
