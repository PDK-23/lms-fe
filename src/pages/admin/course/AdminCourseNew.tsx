import { Card, Button, Input } from "@/components/ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_INSTRUCTORS } from "@/mocks/instructors";
import { ALL_COURSES } from "@/mocks/courses";
import type { Course } from "@/types";
import categoryService from "@/services/categoryService";
import specializationService from "@/services/specializationService";

export default function AdminCourseNew() {
  const navigate = useNavigate();

  const categories = categoryService.getCategories();
  const specializations = specializationService.getSpecializations();

  const [formData, setFormData] = useState<Course>({
    id: "",
    title: "",
    description: "",
    category: categories[0] || ({} as any),
    categoryId: categories[0]?.id,
    instructor: MOCK_INSTRUCTORS[0],
    price: 0,
    originalPrice: 0,
    rating: 0,
    totalRatings: 0,
    students: 0,
    thumbnail: "",
    duration: 0,
    level: "Beginner",
    tags: [],
    specializationId: specializations[0]?.id,
    isBestseller: false,
    isTrending: false,
    isNew: false,
  });

  const [tagInput, setTagInput] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (!tag) return;
    if (formData.tags.length >= 6) return; // max 6 tags
    if (!formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = categoryService
      .getCategories()
      .find((c) => c.id === e.target.value);
    if (selected)
      setFormData((prev) => ({
        ...prev,
        category: selected,
        categoryId: selected.id,
      }));
  };

  const handleInstructorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = MOCK_INSTRUCTORS.find((i) => i.id === e.target.value);
    if (selected) setFormData((prev) => ({ ...prev, instructor: selected }));
  };

  const handleCreate = async () => {
    if (!formData.title.trim()) return;
    setIsCreating(true);

    const selectedCategory =
      categoryService
        .getCategories()
        .find((c) => c.id === formData.category.id) ||
      categoryService.getCategories()[0] ||
      ({} as any);

    const newCourse: Course = {
      ...formData,
      id: Date.now().toString(),
      rating: 0,
      totalRatings: 0,
      students: 0,
      category: selectedCategory,
      categoryId: selectedCategory.id,
    };

    // Simulate API and add to mock list so it appears in AdminCourses
    await new Promise((r) => setTimeout(r, 500));
    ALL_COURSES.push(newCourse);

    setSuccessMessage("Course created successfully!");
    setIsCreating(false);

    setTimeout(() => {
      setSuccessMessage("");
      navigate("/admin/courses");
    }, 800);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Create New Course</h2>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-800 mb-4">
          {successMessage}
        </div>
      )}

      <Card className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Title
          </label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Thumbnail URL
          </label>
          <Input
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleInputChange}
          />
          {formData.thumbnail && (
            <div className="mt-2">
              <img
                src={formData.thumbnail}
                alt="Preview"
                className="w-40 h-24 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Category
            </label>
            <select
              value={formData.category.id}
              onChange={handleCategoryChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Specialization (optional)
            </label>
            <select
              value={formData.specializationId || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  specializationId: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">None</option>
              {specializations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Level
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Price (VND)
            </label>
            <Input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Original Price (VND)
            </label>
            <Input
              name="originalPrice"
              type="number"
              value={formData.originalPrice || 0}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Duration (hours)
            </label>
            <Input
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Instructor
            </label>
            <select
              value={formData.instructor.id}
              onChange={handleInstructorChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {MOCK_INSTRUCTORS.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Tags
          </label>
          <div className="flex gap-2 mb-3">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddTag())
              }
              placeholder="Add tag and press Enter"
            />
            <Button onClick={handleAddTag}>Add</Button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <div
                  key={tag}
                  className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-primary-900"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isBestseller"
              checked={formData.isBestseller || false}
              onChange={handleInputChange}
              className="rounded"
            />
            <span className="text-sm">Bestseller</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isTrending"
              checked={formData.isTrending || false}
              onChange={handleInputChange}
              className="rounded"
            />
            <span className="text-sm">Trending</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isNew"
              checked={formData.isNew || false}
              onChange={handleInputChange}
              className="rounded"
            />
            <span className="text-sm">New</span>
          </label>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => navigate("/admin/courses")}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isCreating || !formData.title}
            className="flex items-center gap-2"
          >
            {isCreating ? "Creating..." : "Create Course"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
