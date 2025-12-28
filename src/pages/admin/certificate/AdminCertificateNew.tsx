import { Card, Button, Input } from "@/components/ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_CERTIFICATES } from "@/mocks/certificates";
import type { Certificate } from "@/types";

export default function AdminCertificateNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState<Certificate>({
    id: "",
    courseId: "",
    courseName: "",
    studentName: "",
    issueDate: new Date(),
    certificateNumber: "",
    instructorName: "",
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value } as any));
  };

  const handleCreate = async () => {
    if (!form.studentName || !form.certificateNumber) return;
    setIsCreating(true);
    const newCert = { ...form, id: Date.now().toString() };
    await new Promise((r) => setTimeout(r, 300));
    // push to mock for demo
    (MOCK_CERTIFICATES as any).push(newCert);
    setIsCreating(false);
    navigate("/admin/certificates");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Create Certificate</h2>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <label className="block text-sm text-neutral-700 mb-2">
            Student Name
          </label>
          <Input
            name="studentName"
            value={form.studentName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-700 mb-2">
            Course Name
          </label>
          <Input
            name="courseName"
            value={form.courseName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-700 mb-2">
            Certificate Number
          </label>
          <Input
            name="certificateNumber"
            value={form.certificateNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-700 mb-2">
            Instructor
          </label>
          <Input
            name="instructorName"
            value={form.instructorName}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/certificates")}
          >
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
