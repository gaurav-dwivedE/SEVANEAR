import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
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
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

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

        <Route
          path="login"
          element={
            <GuestOnlyRoute>
              <Login />
            </GuestOnlyRoute>
          }
        />
        <Route
          path="signup"
          element={
            <GuestOnlyRoute>
              <Signup />
            </GuestOnlyRoute>
          }
        />

        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    </Suspense>
  );
}
