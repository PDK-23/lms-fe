import { Card, Button, Input } from "@/components/ui";
import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MOCK_CERTIFICATES } from "@/mocks/certificates";
import type { Certificate } from "@/types";

export default function AdminCertificateDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cert = useMemo(() => MOCK_CERTIFICATES.find((c) => c.id === id), [id]);

  const [form, setForm] = useState<Certificate>(
    cert || {
      id: "",
      courseId: "",
      courseName: "",
      studentName: "",
      issueDate: new Date(),
      certificateNumber: "",
      instructorName: "",
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value } as any));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    // update mock
    const idx = MOCK_CERTIFICATES.findIndex((c) => c.id === form.id);
    if (idx >= 0) MOCK_CERTIFICATES[idx] = { ...form } as any;
    setIsSaving(false);
    setSuccessMessage("Saved");
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  if (!cert) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate("/admin/certificates")}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="text-center py-8">
          <p className="text-neutral-600">Certificate not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/certificates")}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-semibold">Edit Certificate</h2>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-800">
          {successMessage}
        </div>
      )}

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
