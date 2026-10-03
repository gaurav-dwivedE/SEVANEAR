import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import RouteTransition from "./RouteTransition";

export default function Layout() {
  return (
    <div className="relative min-h-screen">
      <RouteTransition />
      <Navbar />
      <main className="pt-16 pb-16 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
