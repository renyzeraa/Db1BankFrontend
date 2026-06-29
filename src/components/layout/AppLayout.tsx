import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/cadastro", label: "Cadastro" },
  { to: "/customers", label: "Clientes" },
];

export function AppLayout() {
  return (
    <div className="bg-background flex min-h-dvh flex-col">
      <header className="bg-background/85 supports-backdrop-filter:bg-background/70 sticky top-0 z-40 border-b backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground grid size-9 place-items-center rounded-md font-mono text-sm font-bold tracking-tight">
              DB1
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Bank Express</p>
              <p className="text-muted-foreground font-mono text-[11px] tracking-widest uppercase">
                Console de clientes
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <Outlet />
      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-2 px-4 py-4 sm:px-6">
          <p className="text-muted-foreground text-xs">
            DB1 Bank Express — frontend de estudo
          </p>
        </div>
      </footer>
    </div>
  );
}
