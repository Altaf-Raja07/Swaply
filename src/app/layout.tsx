import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/lib/toast";
import { Toaster } from "@/components/ui/toaster";
import { CommandPalette } from "@/components/ui/command-palette";

export const metadata: Metadata = {
  title: "SkillSwap | Teach & Learn Community",
  description:
    "Join a local community of creators, experts, and lifelong learners. Exchange skills directly through our credit-based bulletin.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ToastProvider>
          {children}
          <Toaster />
          <CommandPalette />
        </ToastProvider>
      </body>
    </html>
  );
}
