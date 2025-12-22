import { Card, Button, Input } from "@/components/ui";
import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { ALL_COURSES } from "@/mocks/courses";
import { MOCK_INSTRUCTORS } from "@/mocks/instructors";
import categoryService from "@/services/categoryService";
import specializationService from "@/services/specializationService";
import type { Course } from "@/types";

export default function AdminCourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find the course
  const course = useMemo(() => ALL_COURSES.find((c) => c.id === id), [id]);

  const [formData, setFormData] = useState<Course>(
    course || {
      id: "",
      title: "",
      description: "",
      category: categoryService.getCategories()[0] || ({} as any),
      categoryId: categoryService.getCategories()[0]?.id,
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
      isBestseller: false,
      isTrending: false,
      isNew: false,
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [tagInput, setTagInput] = useState("");

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
    const selectedCategory = categoryService
      .getCategories()
      .find((c) => c.id === e.target.value);
    if (selectedCategory) {
      setFormData((prev) => ({
        ...prev,
        category: selectedCategory,
        categoryId: selectedCategory.id,
      }));
    }
  };

  const handleInstructorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedInstructor = MOCK_INSTRUCTORS.find(
      (i) => i.id === e.target.value
    );
    if (selectedInstructor) {
      setFormData((prev) => ({
        ...prev,
        instructor: selectedInstructor,
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Ensure categoryId set
    const selectedCategory = categoryService
      .getCategories()
      .find((c) => c.id === formData.category.id);
    if (selectedCategory) {
      formData.categoryId = selectedCategory.id;
      formData.category = selectedCategory;
    }
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Persist to mock list
    const i = ALL_COURSES.findIndex((c) => c.id === formData.id);
    if (i >= 0) {
      ALL_COURSES[i] = { ...formData } as Course;
    }

    setSuccessMessage("Course updated successfully!");
    setIsSaving(false);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  if (!course) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate("/admin/courses")}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="text-center py-8">
          <p className="text-neutral-600">Course not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/courses")}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-semibold">Edit Course</h2>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
          {successMessage}
        </div>
      )}

      {/* Form */}
      <Card className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Course Title
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter course title"
                className="w-full"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Course Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter a detailed course description"
                rows={4}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Thumbnail URL
              </label>
              <Input
                type="text"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className="w-full"
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
          </div>
        </div>

        {/* Category & Level */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">Classification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Category
              </label>
              <select
                value={formData.category.id}
                onChange={handleCategoryChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {categoryService.getCategories().map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Level */}
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

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Specialization (optional)
              </label>
              <select
                value={(formData as any).specializationId || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    specializationId: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">None</option>
                {specializationService.getSpecializations().map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing Information */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">Pricing Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Price (VND)
              </label>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full"
              />
            </div>

            {/* Original Price */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Original Price (VND)
              </label>
              <Input
                type="number"
                name="originalPrice"
                value={formData.originalPrice || 0}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Course Details */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">Course Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Duration (hours)
              </label>
              <Input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full"
              />
            </div>

            {/* Instructor */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Instructor
              </label>
              <select
                value={formData.instructor.id}
                onChange={handleInstructorChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {MOCK_INSTRUCTORS.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rating & Students (Read-only) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Rating
              </label>
              <Input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                max="5"
                step="0.1"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Total Ratings
              </label>
              <Input
                type="number"
                name="totalRatings"
                value={formData.totalRatings}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Students
              </label>
              <Input
                type="number"
                name="students"
                value={formData.students}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">Tags</h3>
          <div className="flex gap-2 mb-3">
            <Input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
              placeholder="Add new tag"
              className="flex-1"
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

        {/* Flags */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Course Status</h3>
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
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-4">
        <Button variant="outline" onClick={() => navigate("/admin/courses")}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving || !formData.title}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
