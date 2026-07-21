import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/lib/toast";
import { Toaster } from "@/components/ui/toaster";

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
      <body>
        <ToastProvider>
          {children}
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  );
}
