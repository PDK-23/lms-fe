import { Card, Button } from "@/components/ui";
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import practiceService from "@/services/practiceService";
import type { Practice } from "@/types";

export default function AdminPracticeView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [practice, setPractice] = useState<Practice | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const p = await practiceService.getPracticeById(id);
      setPractice(p || null);
    } catch (error) {
      console.error("Failed to fetch practice:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!practice)
    return <div className="text-neutral-600">Practice not found</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">{practice.title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/practices/${practice.id}`)}
          >
            Edit
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <div className="text-sm text-neutral-600">Slug</div>
            <div className="font-medium">{practice.slug}</div>
          </div>

          <div>
            <div className="text-sm text-neutral-600">Difficulty</div>
            <div className="font-medium">{practice.difficulty || "-"}</div>
          </div>

          <div>
            <div className="text-sm text-neutral-600">Default Language</div>
            <div className="font-medium">{practice.defaultLanguage || "-"}</div>
          </div>

          <div>
            <div className="text-sm text-neutral-600">Description</div>
            <div className="font-medium">{practice.description || "-"}</div>
          </div>

          <div>
            <div className="text-sm text-neutral-600">Tags</div>
            <div className="font-medium">
              {(practice.tags || []).join(", ")}
            </div>
          </div>

          {practice.externalUrl && (
            <div>
              <div className="text-sm text-neutral-600">External URL</div>
              <div className="font-medium">
                <a
                  href={practice.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-600"
                >
                  {practice.externalUrl}
                </a>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
