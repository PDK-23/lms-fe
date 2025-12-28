import { Card, Button, Input } from "@/components/ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import practiceService from "@/services/practiceService";
import type { Practice } from "@/types";

export default function AdminPracticeNew() {
  const navigate = useNavigate();
  const [practice, setPractice] = useState<Practice>({
    id: Date.now().toString(),
    title: "",
    slug: "",
  } as Practice);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    try {
      setSaving(true);
      await practiceService.addPractice(practice);
      navigate("/admin/practices");
    } catch (error) {
      console.error("Failed to create practice:", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">New Practice</h2>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-700 mb-1">Title</label>
            <Input
              value={practice.title}
              onChange={(e) =>
                setPractice({ ...practice, title: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-700 mb-1">Slug</label>
            <Input
              value={practice.slug}
              onChange={(e) =>
                setPractice({ ...practice, slug: e.target.value })
              }
              placeholder="two-sum"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-700 mb-1">
              Difficulty
            </label>
            <select
              value={practice.difficulty || ""}
              onChange={(e) =>
                setPractice({
                  ...practice,
                  difficulty: (e.target.value as any) || undefined,
                })
              }
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Select difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-neutral-700 mb-1">
              Default Language
            </label>
            <Input
              value={practice.defaultLanguage || ""}
              onChange={(e) =>
                setPractice({
                  ...practice,
                  defaultLanguage: e.target.value || undefined,
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-700 mb-1">
              Description
            </label>
            <Input
              value={practice.description || ""}
              onChange={(e) =>
                setPractice({
                  ...practice,
                  description: e.target.value || undefined,
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-700 mb-1">
              Tags (comma separated)
            </label>
            <Input
              value={(practice.tags || []).join(", ")}
              onChange={(e) =>
                setPractice({
                  ...practice,
                  tags: e.target.value
                    ? e.target.value.split(",").map((t) => t.trim())
                    : [],
                })
              }
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/practices")}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
