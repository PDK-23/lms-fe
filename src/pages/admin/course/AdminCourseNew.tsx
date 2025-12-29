import { Card } from "@/components/ui";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Course, Category, Specialization, Instructor } from "@/types";
import * as categoryService from "@/services/categoryService";
import * as specializationService from "@/services/specializationService";
import * as courseService from "@/services/courseService";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  Button,
  Space,
  message,
  Spin,
} from "antd";

const { TextArea } = Input;

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
  const [form] = Form.useForm();

  const [categories, setCategories] = useState<Category[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [cats, specs] = await Promise.all([
        categoryService.getCategoriesPaginated(),
        specializationService.getSpecializations(),
      ]);
      setCategories(cats.content);
      setSpecializations(specs);

      // set initial form values
      form.setFieldsValue({
        title: "",
        description: "",
        thumbnail: "",
        price: 0,
        originalPrice: 0,
        duration: 0,
        level: "BEGINNER",
        tags: [],
        isBestseller: false,
        isTrending: false,
        isNew: false,
        specializationId: specs.length ? specs[0].id : undefined,
        categoryId: cats?.content.length ? cats?.content[0].id : undefined,
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, [form]);

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
    setIsCreating(true);
    try {
      const slug =
        values.slug && values.slug.trim()
          ? values.slug.trim()
          : slugify(values.title || "");

      // enforce tags limit
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
        instructorId: defaultInstructor.id,
        isPublished: values.isPublished || false,
        isBestseller: values.isBestseller || false,
        isTrending: values.isTrending || false,
        isNew: values.isNew || false,
        tags,
        //@ts-ignore
        instructorId: "75e1a40b-e629-41ec-9927-1e58f3eaeadc",
      } as Partial<Course>;
      console.log("Creating course with payload:", payload);
      // return;
      await courseService.createCourse(payload as any);
      message.success("Course created successfully");
      setTimeout(() => navigate("/admin/courses"), 600);
    } catch (err) {
      console.error("Failed to create course:", err);
      message.error("Failed to create course");
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Create New Course</h2>
      </div>

      <div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
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
            className="col-span-2"
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please input description" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            className="col-span-2"
            name="shortDescription"
            label="Short Description"
          >
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item name="thumbnail" label="Thumbnail URL">
            <Input />
          </Form.Item>

          <Form.Item name="previewVideo" label="Preview Video URL">
            <Input />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true }]}
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

          <Form.Item
            name="duration"
            label="Duration (hours)"
            initialValue={0}
            rules={[
              { type: "number", min: 0, message: "Duration must be >= 0" },
            ]}
          >
            <InputNumber min={0} className="w-full" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price (VND)"
            initialValue={0}
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
            <Input value={defaultInstructor.name} disabled />
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
          <div></div>

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
              <Button onClick={() => navigate("/admin/courses")}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={isCreating}>
                Create Course
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
