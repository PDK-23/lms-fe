import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  HomePage,
  CoursesPage,
  LoginPage,
  SignUpPage,
  ForgotPasswordPage,
  SettingsPage,
  PurchasesPage,
  CertificatesPage,
  CourseDetailPage,
  AdminDashboard,
  AdminCourses,
  AdminCourseDetail,
  AdminCourseView,
  AdminUsers,
  AdminUserView,
  AdminUserNew,
  AdminUserDetail,
  AdminReports,
  AdminCourseNew,
  AdminCertificates,
  AdminCertificateView,
  AdminCertificateNew,
  AdminCertificateDetail,
  AdminCategories,
  AdminCategoryNew,
  AdminCategoryDetail,
  AdminCategoryView,
  AdminTags,
  AdminTagNew,
  AdminTagDetail,
  AdminTagView,
  AdminSpecializations,
  AdminSpecializationNew,
  AdminSpecializationDetail,
  AdminSpecializationView,
  AdminQuizzes,
  AdminQuizNew,
  AdminQuizDetail,
  AdminQuizView,
  AdminPractices,
  AdminPracticeNew,
  AdminPracticeDetail,
  AdminPracticeView,
  AdminModules,
  AdminModuleNew,
  AdminModuleDetail,
  AdminModuleView,
  AdminModuleGroups,
  AdminModuleGroupNew,
  AdminModuleGroupDetail,
  AdminModuleGroupView,
  QuizPage,
  CodePracticePage,
  ChatPage,
  CartPage,
  LessonPage,
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
          <Route path="/cart" element={<CartPage />} />
          <Route path="/certificates" element={<CertificatesPage />} />
        </Route>
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/courses/:id/learn" element={<LessonPage />} />
        <Route
          path="/courses/:id/learn/lesson/:lessonId"
          element={<LessonPage />}
        />
        <Route path="/courses/:id/learn/*" element={<LessonPage />} />
        <Route
          path="/courses/:id/learn/lesson/:lessonId/quiz"
          element={<QuizPage />}
        />
        <Route
          path="/courses/:id/learn/lesson/:lessonId/practice/:slug"
          element={<CodePracticePage />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/purchases" element={<PurchasesPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="courses/:id" element={<AdminCourseDetail />} />
          <Route path="courses/:id/view" element={<AdminCourseView />} />
          <Route path="courses/new" element={<AdminCourseNew />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/new" element={<AdminUserNew />} />
          <Route path="users/:id" element={<AdminUserDetail />} />
          <Route path="users/:id/view" element={<AdminUserView />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="certificates" element={<AdminCertificates />} />
          <Route path="certificates/new" element={<AdminCertificateNew />} />
          <Route path="certificates/:id" element={<AdminCertificateDetail />} />
          <Route
            path="certificates/:id/view"
            element={<AdminCertificateView />}
          />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="categories/new" element={<AdminCategoryNew />} />
          <Route path="categories/:id" element={<AdminCategoryDetail />} />
          <Route path="categories/:id/view" element={<AdminCategoryView />} />
          <Route path="tags" element={<AdminTags />} />
          <Route path="tags/new" element={<AdminTagNew />} />
          <Route path="tags/:id" element={<AdminTagDetail />} />
          <Route path="tags/:id/view" element={<AdminTagView />} />
          <Route path="specializations" element={<AdminSpecializations />} />
          <Route
            path="specializations/new"
            element={<AdminSpecializationNew />}
          />
          <Route
            path="specializations/:id"
            element={<AdminSpecializationDetail />}
          />
          <Route
            path="specializations/:id/view"
            element={<AdminSpecializationView />}
          />
          <Route path="quizzes" element={<AdminQuizzes />} />
          <Route path="quizzes/new" element={<AdminQuizNew />} />
          <Route path="quizzes/:id" element={<AdminQuizDetail />} />
          <Route path="quizzes/:id/view" element={<AdminQuizView />} />
          <Route path="practices" element={<AdminPractices />} />
          <Route path="practices/new" element={<AdminPracticeNew />} />
          <Route path="practices/:id" element={<AdminPracticeDetail />} />
          <Route path="practices/:id/view" element={<AdminPracticeView />} />
          <Route path="modules" element={<AdminModules />} />
          <Route path="modules/new" element={<AdminModuleNew />} />
          <Route path="modules/:id" element={<AdminModuleDetail />} />
          <Route path="modules/:id/view" element={<AdminModuleView />} />
          <Route path="module-groups" element={<AdminModuleGroups />} />
          <Route path="module-groups/new" element={<AdminModuleGroupNew />} />
          <Route
            path="module-groups/:id"
            element={<AdminModuleGroupDetail />}
          />
          <Route
            path="module-groups/:id/view"
            element={<AdminModuleGroupView />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
