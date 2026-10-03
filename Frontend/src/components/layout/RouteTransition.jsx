import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scroll to top on navigation (no blocking page-transition animation).
export default function RouteTransition() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}
