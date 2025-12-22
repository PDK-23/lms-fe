import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header, Footer } from "@/components/common";
import {
  HomePage,
  CoursesPage,
  LoginPage,
  SignUpPage,
  SettingsPage,
  PurchasesPage,
  CertificatesPage,
  CourseDetailPage,
  VideoLearningPage,
  AdminDashboard,
  AdminCourses,
  AdminUsers,
  AdminReports,
  AdminCourseNew,
} from "@/pages";
import AdminLayout from "@/layouts/AdminLayout";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/courses/:id/learn" element={<VideoLearningPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/purchases" element={<PurchasesPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="courses/new" element={<AdminCourseNew />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
