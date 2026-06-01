import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./components/admin/layout/AdminLayout";
import PublicLayout from "./components/layout/PublicLayout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProductsCatalogPage from "./pages/ProductsCatalogPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import VisionMissionPage from "./pages/VisionMissionPage";
import ValuesPage from "./pages/ValuesPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/admin/LoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import ProductsPage from "./pages/admin/ProductsPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import InquiriesPage from "./pages/admin/InquiriesPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<ProductsCatalogPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/vision-mission" element={<VisionMissionPage />} />
          <Route path="/values" element={<ValuesPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="inquiries" element={<InquiriesPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
