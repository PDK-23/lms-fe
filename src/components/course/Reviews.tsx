import { useState } from "react";
import { Card } from "@/components/ui";
import type { Review } from "@/types";
import { Star, MoreVertical, ThumbsUp, ThumbsDown } from "lucide-react";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((s) => s[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  const month = Math.floor(day / 30);
  const year = Math.floor(day / 365);

  if (year > 0) return `${year} year${year > 1 ? "s" : ""} ago`;
  if (month > 0) return `${month} month${month > 1 ? "s" : ""} ago`;
  if (day > 0) return `${day} day${day > 1 ? "s" : ""} ago`;
  if (hr > 0) return `${hr} hour${hr > 1 ? "s" : ""} ago`;
  if (min > 0) return `${min} minute${min > 1 ? "s" : ""} ago`;
  return "just now";
}

export default function Reviews({
  reviews,
  onAdd,
}: {
  reviews: Review[];
  onAdd?: (data: {
    studentName: string;
    rating: number;
    comment: string;
  }) => void;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>(
    () =>
      reviews.reduce((acc, r) => {
        acc[r.id] = r.helpful ?? 0;
        return acc;
      }, {} as Record<string, number>)
  );

  const [name, setName] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggle = (id: string) => {
    setExpanded((s) => ({ ...s, [id]: !s[id] }));
  };

  const onUpvote = (id: string) => {
    setHelpfulCounts((s) => ({ ...s, [id]: (s[id] ?? 0) + 1 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAdd) return;
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = "Name is required";
    if (!rating) nextErrors.rating = "Please select a rating";
    if (commentText.trim().length < 10)
      nextErrors.comment = "Please write at least 10 characters";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onAdd({
      studentName: name.trim(),
      rating: rating!,
      comment: commentText.trim(),
    });
    setName("");
    setRating(null);
    setCommentText("");
    setErrors({});
  };

  return (
    <div>
      <h3 className="font-semibold mb-3">Reviews</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((r) => {
          const isExpanded = !!expanded[r.id];
          const short =
            r.comment.length > 240
              ? `${r.comment.slice(0, 240)}...`
              : r.comment;
          return (
            <Card key={r.id} className="p-4 hover:shadow">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-11 h-11 rounded-full bg-neutral-900 text-white flex items-center justify-center font-semibold">
                    {getInitials(r.studentName)}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{r.studentName}</div>
                      <div className="text-sm text-neutral-500 mt-0.5">
                        {timeAgo(new Date(r.date))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < r.rating
                                ? "text-amber-400"
                                : "text-neutral-300"
                            }`}
                          />
                        ))}
                      </div>
                      <button className="p-1 rounded hover:bg-neutral-100">
                        <MoreVertical className="w-4 h-4 text-neutral-500" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-neutral-700">
                    {isExpanded ? r.comment : short}
                    {r.comment.length > 240 && (
                      <button
                        onClick={() => toggle(r.id)}
                        className="ml-2 text-sm text-indigo-600 font-medium"
                      >
                        {isExpanded ? "Show less" : "Show more"}
                      </button>
                    )}
                  </div>

                  <div className="mt-3 border-t pt-3 flex items-center justify-between">
                    <div className="text-sm text-neutral-500">Helpful?</div>
                    <div className="flex items-center gap-2 text-neutral-600">
                      <button
                        onClick={() => onUpvote(r.id)}
                        className="flex items-center gap-1 text-sm hover:text-amber-600"
                      >
                        <ThumbsUp className="w-4 h-4" />{" "}
                        <span>{helpfulCounts[r.id] ?? 0}</span>
                      </button>
                      <button className="flex items-center gap-1 text-sm hover:text-rose-600">
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
