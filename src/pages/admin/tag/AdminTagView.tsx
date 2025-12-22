import { Card } from "@/components/ui";
import { useParams } from "react-router-dom";
import tagService from "@/services/tagService";

export default function AdminTagView() {
  const { id } = useParams();
  const tag = id ? tagService.getTagById(id) : undefined;

  if (!tag) return <div>Tag not found</div>;

  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-lg sm:text-xl font-semibold">Tag</h2>
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div style={{ width: 64, height: 64, background: tag.color }} />
          <div>
            <h3 className="font-semibold text-lg">{tag.name}</h3>
            <p className="text-sm text-neutral-600 mt-1">Color: {tag.color}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
