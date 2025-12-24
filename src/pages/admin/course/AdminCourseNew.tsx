import { Card, Button, Input } from "@/components/ui";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Course, Category, Specialization, Instructor } from "@/types";
import * as categoryService from "@/services/categoryService";
import * as specializationService from "@/services/specializationService";
import * as courseService from "@/services/courseService";

// Default instructor for new courses
const defaultInstructor: Instructor = {
  id: "1",
  name: "To be assigned",
  avatar: "",
  bio: "",
  rating: 0,
  totalRatings: 0,
  students: 0,
};

export default function AdminCourseNew() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<Course>({
    id: "",
    title: "",
    description: "",
    category: {} as Category,
    categoryId: "",
    instructor: defaultInstructor,
    price: 0,
    originalPrice: 0,
    rating: 0,
    totalRatings: 0,
    students: 0,
    thumbnail: "",
    duration: 0,
    level: "Beginner",
    tags: [],
    specializationId: "",
    isBestseller: false,
    isTrending: false,
    isNew: false,
  });

  const [tagInput, setTagInput] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [cats, specs] = await Promise.all([
        categoryService.getCategories(),
        specializationService.getSpecializations(),
      ]);
      setCategories(cats);
      setSpecializations(specs);
      if (cats.length > 0) {
        setFormData((prev) => ({
          ...prev,
          category: cats[0],
          categoryId: cats[0].id,
        }));
      }
      if (specs.length > 0) {
        setFormData((prev) => ({
          ...prev,
          specializationId: specs[0].id,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const handleCategoryChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selected = categories.find((c) => c.id === e.target.value);
    if (selected)
      setFormData((prev) => ({
        ...prev,
        category: selected,
        categoryId: selected.id,
      }));
  };

  // Instructor selection removed - backend handles instructors differently
  // Using defaultInstructor for all new courses

  const handleCreate = async () => {
    if (!formData.title.trim()) return;
    setIsCreating(true);

    const selectedCategory =
      categories.find((c) => c.id === formData.category.id) ||
      categories[0] ||
      ({} as Category);

    const newCourse: Omit<Course, "id"> = {
      ...formData,
      rating: 0,
      totalRatings: 0,
      students: 0,
      category: selectedCategory,
      categoryId: selectedCategory.id,
    };

    try {
      await courseService.createCourse(newCourse);
      setSuccessMessage("Course created successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/admin/courses");
      }, 800);
    } catch (error) {
      console.error("Failed to create course:", error);
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
            <Input
              value={formData.instructor.name}
              disabled
              placeholder="Instructor will be assigned"
              className="bg-neutral-100"
            />
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
