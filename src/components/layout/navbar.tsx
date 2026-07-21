"use client";

import Link from "next/link";
import { CreditBadge } from "@/components/shared/credit-badge";

interface NavLinkProps {
  href: string;
  label: string;
  active?: boolean;
}

function NavLink({ href, label, active }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`text-body-md font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary ${
        active
          ? "text-primary border-b-2 border-primary pb-1"
          : "text-on-surface-variant hover:text-primary"
      }`}
    >
      {label}
    </Link>
  );
}

interface NavbarProps {
  activeTab?: "discover" | "dashboard" | "messages";
}

export function Navbar({ activeTab }: NavbarProps) {
  return (
    <header className="bg-surface border-b border-outline-variant/30 sticky top-0 z-50">
      <nav className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-16">
        <div className="flex items-center gap-stack-lg">
          <Link
            href="/"
            className="text-headline-md font-headline-md font-bold text-primary focus-visible:ring-2 focus-visible:ring-primary"
          >
            SkillSwap
          </Link>
          <div className="hidden md:flex items-center gap-gutter">
            <NavLink
              href="/discover"
              label="Discover"
              active={activeTab === "discover"}
            />
            <NavLink
              href="/dashboard"
              label="Dashboard"
              active={activeTab === "dashboard"}
            />
            <NavLink
              href="#"
              label="Messages"
              active={activeTab === "messages"}
            />
          </div>
        </div>
        <div className="flex items-center gap-stack-md">
          <CreditBadge credits={12} />
          <button className="text-on-surface-variant hover:text-primary transition-colors duration-200 p-2 rounded-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
            <img src="/images/avatars/avatar-3.png" alt="User avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </nav>
    </header>
  );
}
