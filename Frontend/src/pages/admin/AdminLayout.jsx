import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Icon from "../../components/ui/Icon";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  ["overview", "Overview", "home"], ["bookings", "Bookings", "calendar"], ["services", "Services", "tag"],
  ["categories", "Categories", "list"], ["partners", "Partners", "shield"], ["applications", "Applications", "plus"], ["users", "Users", "user"],
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const out = () => { logout(); navigate("/login"); };
  const link = ({ isActive }) => `flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? "bg-brand-600 text-white" : "text-ivory-200 hover:bg-ink-700 hover:text-brand-600"}`;
  return (
    <div className="min-h-screen bg-ink-900 lg:flex">
      <aside className="border-b border-ink-700 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-4 py-3 lg:block lg:px-5 lg:py-6">
          <div><span className="font-display text-2xl">ServiceHome</span><span className="ml-2 rounded bg-brand-600 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">Admin</span></div>
          <button onClick={out} className="text-sm font-semibold underline lg:hidden">Log out</button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3" aria-label="Admin">
          {NAV.map(([to, l, ic]) => <NavLink key={to} to={to} className={link}><Icon name={ic} size={18} />{l}</NavLink>)}
        </nav>
        <div className="absolute bottom-0 hidden w-60 border-t border-ink-700 p-4 lg:static lg:mt-auto lg:block lg:border-0">
          <p className="truncate text-sm font-semibold">{user?.name}</p>
          <p className="truncate text-xs text-ivory-200">{user?.email}</p>
          <button onClick={out} className="mt-3 flex items-center gap-2 text-sm font-semibold hover:underline"><Icon name="logout" size={16} />Log out</button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8"><Outlet /></main>
    </div>
  );
}
