import { Card, Button } from "@/components/ui";
import { Eye, Lock } from "lucide-react";

export default function AdminUsers() {
  // mock users for now
  const users = [
    { id: 1, name: "Anh Tran", email: "anh@example.com", role: "student" },
    { id: 2, name: "Minh Le", email: "minh@example.com", role: "instructor" },
    { id: 3, name: "Linh Nguyen", email: "linh@example.com", role: "student" },
    {
      id: 4,
      name: "Tùng Nguyễn",
      email: "tung@example.com",
      role: "instructor",
    },
    { id: 5, name: "Thu Tran", email: "thu@example.com", role: "student" },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Users</h2>
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-500 border-b">
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2">Role</th>
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
                  <td className="py-3 px-2 text-neutral-600">
                    <span className="inline-block px-2 py-1 bg-neutral-100 rounded text-xs">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      <Button size="sm" className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span className="hidden lg:inline">View</span>
                      </Button>
                      <Button
                        size="sm"
                        className="flex items-center gap-1"
                        variant="outline"
                      >
                        <Lock className="w-3 h-3" />
                        <span className="hidden lg:inline">Disable</span>
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
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-block px-2 py-1 bg-neutral-100 rounded text-xs">
                {u.role}
              </span>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                className="flex-1 text-xs flex items-center justify-center gap-1"
              >
                <Eye className="w-3 h-3" />
                View
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs flex items-center justify-center gap-1"
                variant="outline"
              >
                <Lock className="w-3 h-3" />
                Disable
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
