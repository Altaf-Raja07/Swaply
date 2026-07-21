"use client";

import Link from "next/link";

interface BottomNavItemProps {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
}

function BottomNavItem({ href, icon, label, active }: BottomNavItemProps) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 focus-visible:ring-2 focus-visible:ring-primary ${
        active
          ? "text-primary"
          : "text-on-surface-variant hover:text-primary transition-colors"
      }`}
      aria-label={label}
    >
      <span
        className="material-symbols-outlined"
        {...(active ? { style: { fontVariationSettings: "'FILL' 1" } } : {})}
      >
        {icon}
      </span>
      <span
        className={`text-[10px] font-bold uppercase tracking-widest ${
          active ? "border-b-2 border-primary pb-0.5" : ""
        }`}
      >
        {label}
      </span>
    </Link>
  );
}

interface BottomNavProps {
  activeTab?: "discover" | "dashboard" | "messages" | "profile";
}

export function BottomNav({ activeTab }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant/10 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] h-20 md:hidden px-6 flex justify-between items-center z-50">
      <BottomNavItem
        href="/discover"
        icon="explore"
        label="Discover"
        active={activeTab === "discover"}
      />
      <BottomNavItem
        href="/dashboard"
        icon="dashboard"
        label="Dashboard"
        active={activeTab === "dashboard"}
      />
      <BottomNavItem
        href="/messages"
        icon="chat_bubble"
        label="Messages"
        active={activeTab === "messages"}
      />
      <BottomNavItem
        href="/settings"
        icon="person"
        label="Profile"
        active={activeTab === "profile"}
      />
    </nav>
  );
}
