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
} from "@/pages";
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
      </Routes>
    </Router>
  );
}

export default App;
