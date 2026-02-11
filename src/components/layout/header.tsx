"use client";

import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, LogOut, Compass } from "lucide-react";
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

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { t, locale, setLocale } = useTranslation();
  const user = session?.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
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
        </SheetContent>
      </Sheet>

      <div className="hidden md:block" />

      <div className="flex items-center gap-2">
        {/* Language toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
          className="text-xs"
        >
          {locale === "ko" ? "EN" : "KO"}
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src={user?.image ?? undefined} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm sm:inline-block">
                {user?.name ?? user?.email ?? t("common.account")}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/sign-in" })}>
              <LogOut className="mr-2 h-4 w-4" />
              {t("common.signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
