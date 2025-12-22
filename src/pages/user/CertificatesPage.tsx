import { Card } from "@/components/ui";
import { useTranslation } from "react-i18next";

export default function CertificatesPage() {
  const { t } = useTranslation();
  return (
    <div className="py-12">
      <Card className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">{t("certificates.title")}</h1>
        <p className="text-neutral-600">{t("certificates.empty")}</p>
      </Card>
    </div>
  );
}
