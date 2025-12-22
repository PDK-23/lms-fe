import { Card } from "@/components/ui";

export default function AdminReports() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Reports</h2>
      </div>

      <Card className="p-4">
        <p className="text-neutral-600">
          Reports and analytics will appear here. You can integrate Chart.js or
          other visualization libraries.
        </p>
      </Card>
    </div>
  );
}
