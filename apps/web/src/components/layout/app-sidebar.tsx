"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@fyshe/ui";

interface AppSidebarProps {
  user: {
    name?: string | null;
    image?: string | null;
  };
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "home" },
  { href: "/catches", label: "Catches", icon: "fish" },
  { href: "/trips", label: "Trips", icon: "map" },
  { href: "/gear", label: "Gear", icon: "backpack" },
  { href: "/flies", label: "Flies & Bait", icon: "bug" },
  { href: "/articles/my", label: "Articles", icon: "file-text" },
  { href: "/explore", label: "Explore", icon: "compass" },
];

export function AppSidebar({ user: _user }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
      <div className="p-6">
        <Link href="/dashboard" className="text-xl font-bold text-primary">
          fyshe
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname.startsWith(item.href)
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <Link
          href="/profile"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Settings
        </Link>
      </div>
    </aside>
  );
}
