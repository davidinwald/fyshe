"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button, cn } from "@fyshe/ui";

interface AppHeaderProps {
  user: {
    name?: string | null;
    image?: string | null;
  };
}

const mobileNavItems = [
  { href: "/dashboard", label: "Home" },
  { href: "/catches", label: "Catches" },
  { href: "/trips", label: "Trips" },
  { href: "/gear", label: "Gear" },
  { href: "/flies", label: "Flies" },
];

export function AppHeader({ user }: AppHeaderProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop header */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="md:hidden">
          <Link href="/dashboard" className="text-lg font-bold text-primary">
            fyshe
          </Link>
        </div>
        <div className="hidden md:block" />
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{user.name}</span>
          <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
            Sign Out
          </Button>
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card">
        <div className="flex justify-around">
          {mobileNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors",
                pathname.startsWith(item.href)
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
