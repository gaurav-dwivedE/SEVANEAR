import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PincodeModal from "../ui/PincodeModal";
import { useAuth } from "../../context/AuthContext";

export default function Layout() {
  const { isAdmin, loading } = useAuth();
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" }), 80);
      return () => clearTimeout(t);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    return undefined;
  }, [pathname, hash]);

  if (loading) return <div className="grid min-h-screen place-items-center text-ivory-200">Loading…</div>;
  // Admins only ever see the admin dashboard, never the customer site.
  if (isAdmin) return <Navigate to="/admin" replace />;

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="pt-16 pb-16 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <PincodeModal />
    </div>
  );
}
