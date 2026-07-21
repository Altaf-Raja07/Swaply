"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Command {
  id: string;
  label: string;
  icon: string;
  action: () => void;
}

const commands: Command[] = [
  { id: "discover", label: "Go to Discover", icon: "explore", action: null as unknown as () => void },
  { id: "dashboard", label: "Go to Dashboard", icon: "dashboard", action: null as unknown as () => void },
  { id: "reviews", label: "Go to Reviews", icon: "reviews", action: null as unknown as () => void },
  { id: "settings", label: "Go to Settings", icon: "settings", action: null as unknown as () => void },
  { id: "messages", label: "Go to Messages", icon: "chat", action: null as unknown as () => void },
  { id: "profile", label: "View Profile", icon: "person", action: null as unknown as () => void },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  const commandActions: Command[] = commands.map((cmd) => {
    switch (cmd.id) {
      case "discover":
        return { ...cmd, action: () => navigate("/discover") };
      case "dashboard":
        return { ...cmd, action: () => navigate("/dashboard") };
      case "reviews":
        return { ...cmd, action: () => navigate("/dashboard/reviews") };
      case "settings":
        return { ...cmd, action: () => navigate("/settings") };
      case "messages":
        return { ...cmd, action: () => console.log("Navigate to messages") };
      case "profile":
        return { ...cmd, action: () => console.log("View profile") };
      default:
        return cmd;
    }
  });

  const filtered = query.trim()
    ? commandActions.filter((cmd) =>
        cmd.label.toLowerCase().includes(query.toLowerCase()),
      )
    : commandActions;

  const execute = useCallback(
    (index: number) => {
      if (filtered[index]) {
        filtered[index].action();
        setQuery("");
        setSelectedIndex(0);
      }
    },
    [filtered],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filtered.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        execute(selectedIndex);
        return;
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, filtered, selectedIndex, execute]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-[200]"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div
        className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[201] w-full max-w-lg mx-4"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div className="bg-surface border border-outline-variant/30 rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 border-b border-outline-variant/20">
            <span className="material-symbols-outlined text-on-surface-variant">
              search
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages & actions…"
              className="flex-1 h-12 bg-transparent text-body-md text-on-surface placeholder:text-on-surface-variant outline-none"
              aria-label="Search commands"
            />
            <kbd className="text-label-caps text-on-surface-variant bg-surface-container-high px-1.5 py-0.5 rounded">
              ESC
            </kbd>
          </div>
          <ul className="py-2 max-h-72 overflow-y-auto" role="listbox">
            {filtered.length === 0 ? (
              <li className="px-4 py-8 text-center text-body-md text-on-surface-variant">
                No results found
              </li>
            ) : (
              filtered.map((cmd, i) => (
                <li key={cmd.id} role="option" aria-selected={i === selectedIndex}>
                  <button
                    type="button"
                    className={cn(
                      "flex items-center gap-3 w-full px-4 py-3 text-left text-body-md transition-colors",
                      i === selectedIndex
                        ? "bg-surface-container-high text-primary"
                        : "text-on-surface hover:bg-surface-container-high",
                    )}
                    onClick={() => execute(i)}
                    onMouseEnter={() => setSelectedIndex(i)}
                  >
                    <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
                      {cmd.icon}
                    </span>
                    {cmd.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
