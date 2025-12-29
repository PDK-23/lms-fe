import { Card } from "@/components/ui";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import * as categoryService from "@/services/categoryService";
import * as specializationService from "@/services/specializationService";
import * as courseService from "@/services/courseService";
import type { Course, Category, Specialization, Instructor } from "@/types";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  Button as AntButton,
  message,
  Spin,
  Space,
} from "antd";

const { TextArea } = Input;

// Default instructor for courses
const defaultInstructor: Instructor = {
  id: "1",
  name: "To be assigned",
  avatar: "",
  bio: "",
  rating: 0,
  totalRatings: 0,
  students: 0,
};

export default function AdminCourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);

  const [formData, setFormData] = useState<Course | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [course, cats, specs] = await Promise.all([
        courseService.getCourseById(id),
        categoryService.getCategories(),
        specializationService.getSpecializations(),
      ]);
      setCategories(cats);
      setSpecializations(specs);

      if (course) {
        const normalized = {
          ...course,
          level: (course.level || "BEGINNER").toString().toUpperCase(),
        } as Course;
        setFormData(normalized);

        form.setFieldsValue({
          title: normalized.title,
          slug: normalized.slug,
          description: normalized.description,
          shortDescription: normalized.shortDescription,
          thumbnail: normalized.thumbnail,
          previewVideo: normalized.previewVideo,
          price: normalized.price,
          originalPrice: normalized.originalPrice,
          currency: normalized.currency || "VND",
          duration: normalized.duration,
          level: normalized.level || "BEGINNER",
          categoryId: normalized.categoryId,
          specializationId: (normalized as any).specializationId || undefined,
          tags: normalized.tags || [],
          isBestseller: normalized.isBestseller || false,
          isTrending: normalized.isTrending || false,
          isNew: normalized.isNew || false,
        });
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, [id, form]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function slugify(s: string) {
    return s
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  const handleFinish = async (values: any) => {
    if (!formData) return;
    setIsSaving(true);
    try {
      const slug =
        values.slug && values.slug.trim()
          ? values.slug.trim()
          : slugify(values.title || "");

      let tags = values.tags || [];
      if (!Array.isArray(tags)) tags = [];
      if (tags.length > 6) tags = tags.slice(0, 6);

      const payload: Partial<Course> = {
        title: values.title,
        slug,
        description: values.description,
        shortDescription: values.shortDescription,
        thumbnail: values.thumbnail,
        previewVideo: values.previewVideo,
        price: values.price,
        originalPrice: values.originalPrice,
        currency: values.currency || "VND",
        duration: values.duration,
        level: values.level || "BEGINNER",
        categoryId: values.categoryId,
        specializationId: values.specializationId || null,
        isBestseller: values.isBestseller || false,
        isTrending: values.isTrending || false,
        isNew: values.isNew || false,
        tags,
        instructorId: "75e1a40b-e629-41ec-9927-1e58f3eaeadc",
      } as Partial<Course>;

      // Basic validation
      if (!payload.categoryId) {
        message.error("Please select a category before saving.");
        setIsSaving(false);
        return;
      }

      await courseService.updateCourse(formData.id, payload);
      message.success("Course updated successfully");
    } catch (error) {
      console.error("Failed to update course:", error);
      message.error("Failed to update course");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!formData) {
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

      <div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{}}
          scrollToFirstError
          className="grid grid-cols-4 gap-4"
        >
          <Form.Item
            className="col-span-2"
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please input title" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item className="col-span-2" name="slug" label="Slug">
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please input description" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item name="shortDescription" label="Short Description">
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item name="thumbnail" label="Thumbnail URL">
            <Input />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: "Please select category" }]}
          >
            <Select>
              {categories.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="specializationId" label="Specialization (optional)">
            <Select allowClear>
              {specializations.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="level" label="Level" initialValue="BEGINNER">
            <Select>
              <Select.Option value="BEGINNER">Beginner</Select.Option>
              <Select.Option value="INTERMEDIATE">Intermediate</Select.Option>
              <Select.Option value="ADVANCED">Advanced</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="duration" label="Duration (hours)" initialValue={0}>
            <InputNumber min={0} className="w-full" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price (VND)"
            rules={[
              {
                required: true,
                type: "number",
                min: 1,
                message: "Price must be greater than 0",
              },
            ]}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>

          <Form.Item
            name="originalPrice"
            label="Original Price (VND)"
            initialValue={0}
          >
            <InputNumber min={0} className="w-full" />
          </Form.Item>

          <Form.Item name="currency" label="Currency" initialValue="VND">
            <Select>
              <Select.Option value="VND">VND</Select.Option>
              <Select.Option value="USD">USD</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Instructor">
            <Input
              value={formData.instructor?.name || "No instructor assigned"}
              disabled
            />
          </Form.Item>

          <Form.Item name="tags" label="Tags" help="Max 6 tags">
            <Select
              mode="tags"
              tokenSeparators={[",", " "]}
              onChange={(vals) => {
                if (vals.length > 6) {
                  message.warning("Max 6 tags allowed");
                  form.setFieldValue("tags", vals.slice(0, 6));
                }
              }}
            ></Select>
          </Form.Item>

          <Form.Item name="isBestseller" valuePropName="checked">
            <Switch /> <span className="ml-2">Bestseller</span>
          </Form.Item>

          <Form.Item name="isTrending" valuePropName="checked">
            <Switch /> <span className="ml-2">Trending</span>
          </Form.Item>

          <Form.Item name="isNew" valuePropName="checked">
            <Switch /> <span className="ml-2">New</span>
          </Form.Item>

          <Form.Item>
            <Space style={{ float: "right" }}>
              <AntButton onClick={() => navigate("/admin/courses")}>
                Cancel
              </AntButton>
              <AntButton type="primary" htmlType="submit" loading={isSaving}>
                Save Changes
              </AntButton>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
