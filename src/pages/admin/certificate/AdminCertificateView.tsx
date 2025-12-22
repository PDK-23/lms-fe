import { Card, Button } from "@/components/ui";
import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MOCK_CERTIFICATES } from "@/mocks/certificates";

export default function AdminCertificateView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const cert = useMemo(() => MOCK_CERTIFICATES.find((c) => c.id === id), [id]);

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
        <h2 className="text-2xl font-semibold">
          Certificate {cert.certificateNumber}
        </h2>
      </div>

      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-neutral-600">Student</div>
            <div className="font-medium">{cert.studentName}</div>
          </div>
          <div>
            <div className="text-neutral-600">Course</div>
            <div className="font-medium">{cert.courseName}</div>
          </div>
          <div>
            <div className="text-neutral-600">Issued</div>
            <div className="font-medium">
              {new Date(cert.issueDate).toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="text-neutral-600">Instructor</div>
            <div className="font-medium">{cert.instructorName}</div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/certificates/${cert.id}`)}
          >
            Edit
          </Button>
        </div>
      </Card>
    </div>
  );
}
