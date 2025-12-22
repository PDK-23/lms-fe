import { Card, Button } from "@/components/ui";
import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import userService from "@/services/userService";

export default function AdminUserView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const user = useMemo(
    () => (id ? userService.getUserById(id) : undefined),
    [id]
  );

  if (!user) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate("/admin/users")}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="text-center py-8">
          <p className="text-neutral-600">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/users")}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-semibold">{user.name}</h2>
      </div>

      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-neutral-600">Name</div>
            <div className="font-medium">{user.name}</div>
          </div>
          <div>
            <div className="text-neutral-600">Email</div>
            <div className="font-medium">{user.email}</div>
          </div>
          <div>
            <div className="text-neutral-600">Phone</div>
            <div className="font-medium">{user.phone || "-"}</div>
          </div>
          <div>
            <div className="text-neutral-600">Role</div>
            <div className="font-medium">{user.role || "student"}</div>
          </div>
          <div>
            <div className="text-neutral-600">Status</div>
            <div className="font-medium">
              {user.isActive ? "Active" : "Disabled"}
            </div>
          </div>
          <div>
            <div className="text-neutral-600">Last Login</div>
            <div className="font-medium">
              {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "-"}
            </div>
          </div>
          <div>
            <div className="text-neutral-600">Joined</div>
            <div className="font-medium">
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="text-neutral-600">Location</div>
            <div className="font-medium">{user.location || "-"}</div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/users/${user.id}`)}
          >
            Edit User
          </Button>
        </div>
      </Card>
    </div>
  );
}
