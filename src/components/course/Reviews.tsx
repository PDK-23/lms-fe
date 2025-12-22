import { Card } from "@/components/ui";
import type { Review } from "@/types";

export default function Reviews({ reviews }: { reviews: Review[] }) {
  return (
    <div>
      <h3 className="font-semibold mb-3">Feedback</h3>
      <div className="space-y-4">
        {reviews.map((r) => (
          <Card key={r.id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="font-medium">{r.studentName}</div>
              <div className="text-sm text-neutral-500">
                {r.date.toLocaleDateString()}
              </div>
            </div>
            <div className="mt-2 text-sm">{r.comment}</div>
            <div className="mt-2 text-xs text-neutral-500">
              Rating: {r.rating} ⭐
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
