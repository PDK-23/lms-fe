import { Card, Button } from "@/components/ui";
import { useState } from "react";
import { MOCK_CERTIFICATES } from "@/mocks/certificates";
import { useNavigate } from "react-router-dom";

export default function AdminCertificates() {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState(MOCK_CERTIFICATES);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [certToDelete, setCertToDelete] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Certificates</h2>
        <Button onClick={() => navigate("/admin/certificates/new")}>
          New Certificate
        </Button>
      </div>

      <Card className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-500 border-b">
                <th className="py-3 px-2">Certificate #</th>
                <th className="py-3 px-2">Student</th>
                <th className="py-3 px-2">Course</th>
                <th className="py-3 px-2">Issued</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((c) => (
                <tr key={c.id} className="border-t hover:bg-neutral-50">
                  <td className="py-3 px-2 truncate font-medium">
                    {c.certificateNumber}
                  </td>
                  <td className="py-3 px-2 text-neutral-600">
                    {c.studentName}
                  </td>
                  <td className="py-3 px-2 text-neutral-600">{c.courseName}</td>
                  <td className="py-3 px-2 text-neutral-600">
                    {new Date(c.issueDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          navigate(`/admin/certificates/${c.id}/view`)
                        }
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/admin/certificates/${c.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setCertToDelete(c.id);
                          setConfirmOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {confirmOpen && certToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black opacity-40"
            onClick={() => {
              setConfirmOpen(false);
              setCertToDelete(null);
            }}
          />
          <div className="bg-white rounded-lg shadow-lg p-6 z-50 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Are you sure you want to delete this certificate? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setConfirmOpen(false);
                  setCertToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setCertificates((prev) =>
                    prev.filter((x) => x.id !== certToDelete)
                  );
                  setConfirmOpen(false);
                  setCertToDelete(null);
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
