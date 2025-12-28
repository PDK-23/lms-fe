import { Card } from "@/components/ui";
import { useTranslation } from "react-i18next";
import MOCK_PURCHASES from "@/mocks/purchases";
import {
  ShoppingBag,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

export default function PurchasesPage() {
  const { t } = useTranslation();

  // In real app, filter by current user
  const purchases = MOCK_PURCHASES;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "refunded":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "refunded":
        return "bg-red-100 text-red-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">{t("purchases.title")}</h1>

        {purchases.length === 0 ? (
          <Card className="p-6">
            <p className="text-neutral-600">{t("purchases.empty")}</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <Card key={purchase.id} className="p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={purchase.course.thumbnail}
                    alt={purchase.course.title}
                    className="w-24 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <ShoppingBag className="w-4 h-4 text-indigo-600" />
                          <h3 className="font-semibold">
                            {purchase.course.title}
                          </h3>
                        </div>
                        <div className="space-y-1 text-sm text-neutral-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Purchased:{" "}
                              {purchase.purchaseDate.toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            <span>{purchase.paymentMethod}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-lg">
                          {purchase.amount.toLocaleString("vi-VN")} ₫
                        </div>
                        <div
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs mt-1 ${getStatusColor(
                            purchase.status
                          )}`}
                        >
                          {getStatusIcon(purchase.status)}
                          <span className="capitalize">{purchase.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
