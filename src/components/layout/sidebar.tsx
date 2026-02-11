"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  SmilePlus,
  BookOpen,
  Pill,
  Brain,
  Settings,
  Compass,
} from "lucide-react";
import { useTranslation } from "@/components/i18n-provider";
import type { TranslationKey } from "@/lib/i18n";

const navItems: { href: string; labelKey: TranslationKey; icon: typeof LayoutDashboard }[] = [
  { href: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { href: "/mood", labelKey: "nav.mood", icon: SmilePlus },
  { href: "/journal", labelKey: "nav.journal", icon: BookOpen },
  { href: "/medications", labelKey: "nav.medications", icon: Pill },
  { href: "/insights", labelKey: "nav.insights", icon: Brain },
  { href: "/settings", labelKey: "nav.settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-card md:block">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <Compass className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold">{t("common.appName")}</span>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive && "bg-accent text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
