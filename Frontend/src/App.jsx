import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { ProtectedRoute, AdminRoute, GuestOnlyRoute } from "./components/layout/RouteGuards";
import Home from "./pages/Home";
import Services from "./pages/Services";
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const BecomePartner = lazy(() => import("./pages/BecomePartner"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const Invoice = lazy(() => import("./pages/Invoice"));
const Addresses = lazy(() => import("./pages/Addresses"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const Overview = lazy(() => import("./pages/admin/Overview"));
const Bookings = lazy(() => import("./pages/admin/Bookings"));
const AdminServices = lazy(() => import("./pages/admin/Services"));
const Categories = lazy(() => import("./pages/admin/Categories"));
const Partners = lazy(() => import("./pages/admin/Partners"));
const Applications = lazy(() => import("./pages/admin/Applications"));
const Users = lazy(() => import("./pages/admin/Users"));

export default function App() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center text-ivory-200">Loading…</div>}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:id" element={<ServiceDetail />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="become-a-partner" element={<BecomePartner />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<GuestOnlyRoute><Login /></GuestOnlyRoute>} />
          <Route path="signup" element={<GuestOnlyRoute><Signup /></GuestOnlyRoute>} />
          <Route path="bookings" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="bookings/:id/invoice" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />
          <Route path="addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />
          <Route path="dashboard" element={<Navigate to="/bookings" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="categories" element={<Categories />} />
          <Route path="partners" element={<Partners />} />
          <Route path="applications" element={<Applications />} />
          <Route path="users" element={<Users />} />
          <Route path="*" element={<Navigate to="overview" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
