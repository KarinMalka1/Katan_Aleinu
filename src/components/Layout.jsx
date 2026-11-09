import { Outlet, NavLink } from "react-router-dom";
import { Home, Trophy, UserPlus } from "lucide-react";

const items = [
  { to: "/", label: "בית", icon: Home },
  { to: "/progress", label: "התקדמות", icon: Trophy },
  { to: "/add-child", label: "ילד חדש", icon: UserPlus },
];

export default function Layout() {
  return (
    <div dir="rtl" className="min-h-screen bg-background font-body">
      <aside className="fixed inset-y-0 right-0 z-40 hidden w-60 flex-col gap-2 border-l border-border bg-card p-5 md:flex">
        <div className="mb-6 font-heading text-2xl font-bold text-primary">קטן עלינו</div>
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-base transition-colors ${
                isActive ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground hover:bg-secondary"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </aside>
      <main className="mx-auto max-w-md px-5 pb-28 pt-6 md:mr-60 md:ml-0 md:max-w-none md:px-10 md:pb-12 md:pt-10 lg:px-16">
        <Outlet />
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/90 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md justify-around px-4 py-2">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 rounded-2xl px-5 py-1.5 text-xs transition-colors ${
                  isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}