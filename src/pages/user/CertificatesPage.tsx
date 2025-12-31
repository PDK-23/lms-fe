import { Card } from "@/components/ui";
import { useTranslation } from "react-i18next";
import MOCK_CERTIFICATES from "@/mocks/certificates";
import { Award, Calendar, User } from "lucide-react";

export default function CertificatesPage() {
  const { t } = useTranslation();

  // In real app, filter by current user
  const certificates = MOCK_CERTIFICATES;

  return (
    <div className="py-12">
      <div className="mx-auto px-4">
        <h1 className="text-xl font-bold mb-6">{t("certificates.title")}</h1>

        {certificates.length === 0 ? (
          <Card className="p-6">
            <p className="text-neutral-600">{t("certificates.empty")}</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {certificates.map((cert) => (
              <Card key={cert.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <img
                      src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://d2j5ihb19pt1hq.cloudfront.net/certificates/cert-specialization.png?auto=format%2Ccompress&dpr=2&h=72"
                      alt=""
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-indigo-600" />
                      <h3 className="font-semibold text-lg">
                        {cert.courseName}
                      </h3>
                    </div>
                    <div className="space-y-1 text-sm text-neutral-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Student: {cert.studentName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Issued: {cert.issueDate.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-500 mt-2">
                        Certificate #{cert.certificateNumber}
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    View Certificate
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
