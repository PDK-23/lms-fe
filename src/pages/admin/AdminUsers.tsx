import { Card, Button } from "@/components/ui";

export default function AdminUsers() {
  // mock users for now
  const users = [
    { id: 1, name: "Anh Tran", email: "anh@example.com", role: "student" },
    { id: 2, name: "Minh Le", email: "minh@example.com", role: "instructor" },
    { id: 3, name: "Linh Nguyen", email: "linh@example.com", role: "student" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Users</h2>
      </div>

      <Card className="p-4">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-500">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="py-3">{u.name}</td>
                  <td className="py-3 text-neutral-600">{u.email}</td>
                  <td className="py-3 text-neutral-600">{u.role}</td>
                  <td className="py-3 text-neutral-600">
                    <div className="flex gap-2">
                      <Button size="sm">View</Button>
                      <Button size="sm" variant="outline">
                        Disable
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
