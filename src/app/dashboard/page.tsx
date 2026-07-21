"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { SessionCard } from "@/components/shared/session-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
export default function DashboardPage() {
  const router = useRouter();
  const { data: balanceData } = trpc.ledger.getBalance.useQuery();
  const { data: historyData } = trpc.ledger.getHistory.useQuery();
  const balance = balanceData?.balance ?? 0;
  const history = historyData ?? [];

  function formatDate(d: Date) {
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function formatAmount(amount: number) {
    const sign = amount >= 0 ? "+" : "";
    return `${sign}${amount}.0`;
  }

  function amountColor(amount: number) {
    return amount > 0 ? "text-secondary" : amount < 0 ? "text-primary" : "text-on-surface-variant";
  }

  function entryLabel(entry: typeof history[0]) {
    const ctx = entry.booking;
    if (entry.type === "SIGNUP_BONUS") return "Welcome Bonus";
    if (ctx) {
      const skill = ctx.teachSkill?.skillName ?? "Session";
      const other = entry.type === "SETTLE_CREDIT" ? ctx.learner?.name : ctx.teacher?.name;
      const suffix = other ? ` — ${other}` : "";
      switch (entry.type) {
        case "HOLD": return `Held for ${skill}${suffix}`;
        case "RELEASE": return `Hold released: ${skill}${suffix}`;
        case "SETTLE_DEBIT": return `Completed: ${skill}${suffix}`;
        case "SETTLE_CREDIT": return `Earned: ${skill}${suffix}`;
      }
    }
    return entry.description ?? entry.type;
  }

  const quickMessages = [
    { name: "Liam K.", msg: '"See you at the wheel tomorrow!"', time: "2m", online: true },
    { name: "Sarah J.", msg: '"Did you get the React repo?"', time: "1h", online: false },
  ];
  const interestItems = ["Pottery", "UI Design", "Urban Gardening", "Coffee Roasting", "+ Add New"];

  return (
    <>
      <Navbar activeTab="dashboard" />
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
        {/* Desktop Header & Summary Bar */}
        <section className="mb-stack-lg">
          <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg text-on-surface mb-stack-md">
            Welcome back, Elara.
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Credits */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-stack-md whisper-shadow flex items-center gap-stack-md">
              <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center border border-tertiary/20 coin-bevel">
                <span
                  className="material-symbols-outlined text-[28px] text-tertiary-fixed-dim"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  monetization_on
                </span>
              </div>
              <div>
                <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">
                  CREDIT BALANCE
                </p>
                <p className="text-headline-md font-headline-md text-on-surface">
                  {balance}{" "}
                  <span className="text-body-md font-normal text-on-surface-variant">
                    Available
                  </span>
                </p>
              </div>
            </div>
            {/* Sessions */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-stack-md whisper-shadow flex items-center gap-stack-md">
              <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[28px]">
                  calendar_today
                </span>
              </div>
              <div>
                <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">
                  UPCOMING SESSIONS
                </p>
                <p className="text-headline-md font-headline-md text-on-surface">
                  3{" "}
                  <span className="text-body-md font-normal text-on-surface-variant">
                    This Week
                  </span>
                </p>
              </div>
            </div>
            {/* Rating */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-stack-md whisper-shadow flex items-center gap-stack-md">
              <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                <span
                  className="material-symbols-outlined text-[28px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              </div>
              <div>
                <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">
                  AVG. INSTRUCTOR RATING
                </p>
                <p className="text-headline-md font-headline-md text-on-surface">
                  4.9{" "}
                  <span className="text-body-md font-normal text-on-surface-variant">
                    / 5.0
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Desktop Sessions + Chat Sidebar */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Left: Upcoming Sessions */}
          <div className="lg:col-span-8 space-y-stack-lg">
            <header className="flex justify-between items-end">
              <div>
                <p className="text-label-caps font-label-caps text-primary mb-1">
                  SCHEDULE
                </p>
                <h2 className="text-headline-md font-headline-md text-on-surface">
                  Upcoming Sessions
                </h2>
              </div>
              <Button variant="ghost" className="text-label-caps font-label-caps text-secondary hover:underline transition-all" onClick={() => console.log("Calendar view")}>
                VIEW CALENDAR
              </Button>
            </header>
            <div className="space-y-stack-md">
              <SessionCard
                role="teaching"
                title="Advanced Wheel Throwing"
                subtitle="Pottery Basics"
                with="Liam K."
                dateTime="Tomorrow, 10:00 AM"
                actionLabel="Launch Zoom"
                actionVariant="primary"
              />
              <SessionCard
                role="learning"
                title="React Hooks Mastery"
                subtitle="Development"
                with="Sarah J."
                dateTime="Thu, Oct 24, 2:00 PM"
                actionLabel="Details"
                actionVariant="secondary"
              />
              <SessionCard
                role="learning"
                title="Indoor Jungle Care"
                subtitle="Gardening"
                with="Mark R."
                dateTime="Sat, Oct 26, 11:30 AM"
                actionLabel="Details"
                actionVariant="secondary"
              />
            </div>
          </div>

          {/* Right: Quick Chat & Credits */}
          <div className="lg:col-span-4 space-y-stack-lg">
            {/* Quick Messages */}
            <section>
              <h2 className="text-label-caps font-label-caps text-on-surface-variant mb-stack-md">
                QUICK MESSAGES
              </h2>
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden whisper-shadow">
                {quickMessages.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 block mb-stack-md">chat</span>
                    <p className="text-body-md font-body-md text-on-surface-variant">No messages yet. Start a conversation with a mentor.</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-outline-variant/30">
                    {quickMessages.map((chat) => (
                    <li key={chat.name}>
                    <Link
                      href="/messages"
                      className="flex items-center gap-stack-md p-stack-md hover:bg-surface-container-low transition-colors"
                    >
                      <div className="relative w-12 h-12">
                        <img src={chat.name === "Sarah J." ? "/images/avatars/avatar-11.png" : "/images/avatars/avatar-21.png"} alt="User" className="w-full h-full object-cover rounded-full" />
                        <div
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                            chat.online ? "bg-secondary" : "bg-outline-variant"
                          }`}
                        />
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-on-surface">{chat.name}</p>
                        <p className="text-label-caps text-on-surface-variant truncate">
                          {chat.msg}
                        </p>
                      </div>
                      <span className="text-[10px] text-on-surface-variant">
                        {chat.time}
                      </span>
                    </Link>
                    </li>
                  ))}
                  </ul>
                )}
                <Button variant="ghost" className="w-full py-3 bg-surface-container text-label-caps font-label-caps text-on-surface-variant hover:text-primary transition-colors" onClick={() => router.push("/messages")}>
                  VIEW ALL MESSAGES
                </Button>
              </div>
            </section>

            {/* Credit Activity */}
            <section>
              <h2 className="text-label-caps font-label-caps text-on-surface-variant mb-stack-md">
                CREDIT ACTIVITY
              </h2>
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-stack-md whisper-shadow">
                <div className="space-y-4">
                  {history.length === 0 ? (
                    <div className="text-center py-8 px-4">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 block mb-stack-md">receipt_long</span>
                      <p className="text-body-md font-body-md text-on-surface-variant">No credit activity yet. Start teaching to earn your first credits.</p>
                    </div>
                  ) : (
                    history.map((entry, i) => (
                    <div key={entry.id} className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-on-surface">{entryLabel(entry)}</p>
                        <p className="text-[11px] text-on-surface-variant">{formatDate(entry.createdAt)}</p>
                      </div>
                      <span className={`font-bold ${amountColor(entry.amount)}`}>{formatAmount(entry.amount)}</span>
                    </div>
                  )))}
                </div>
                <div className="mt-6 pt-4 border-t border-outline-variant/30">
                  <Button variant="secondary" className="w-full" onClick={() => console.log("Top up credits")}>
                    TOP UP CREDITS
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Mobile Dashboard Content */}
        <div className="md:hidden space-y-stack-lg">
          {/* Mobile Credit Balance Card */}
          <section className="relative overflow-hidden bg-primary-container rounded-xl p-stack-lg text-on-primary-container whisper-shadow">
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-label-caps font-label-caps opacity-90 uppercase">
                    Current Balance
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-4xl font-bold font-headline-md">{balance}</span>
                    <span className="text-lg font-medium opacity-90">Credits</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center border border-tertiary shadow-inner">
                  <span
                    className="material-symbols-outlined text-on-tertiary-fixed"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    generating_tokens
                  </span>
                </div>
              </div>
              <Button variant="primary" className="w-full bg-surface-bright text-primary font-button py-3 rounded-lg hover:opacity-90 transition-all" onClick={() => console.log("Top up credits")}>
                Top Up Credits
              </Button>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-on-primary-container/10 rounded-full blur-2xl" />
          </section>

          {/* Mobile Upcoming Sessions */}
          <section className="space-y-stack-md">
            <div className="flex justify-between items-center">
              <h2 className="text-headline-md font-headline-md">Next Sessions</h2>
              <a href="#" onClick={(e) => { e.preventDefault(); console.log("View all"); }} className="text-label-caps font-label-caps text-primary">
                VIEW ALL
              </a>
            </div>
            <div className="grid grid-cols-1 gap-gutter">
              {/* Session 1 */}
              <div className="bg-surface border border-outline-variant/30 rounded-xl p-gutter whisper-shadow flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-secondary-container">palette</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">
                        Advanced Watercolor
                      </h3>
                      <p className="text-on-surface-variant text-sm">
                        with Elena Rossi
                      </p>
                    </div>
                  </div>
                  <span className="bg-tertiary-container/20 text-on-tertiary-container text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                    Today
                  </span>
                </div>
                <div className="flex items-center gap-4 py-2 border-y border-outline-variant/20">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                    <span className="text-sm font-medium">18:30 - 20:00</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-sm">video_chat</span>
                    <span className="text-sm font-medium">Zoom</span>
                  </div>
                </div>
                <Button variant="primary" className="w-full bg-primary text-on-primary font-button py-3 rounded-lg">
                  Join Meeting
                </Button>
              </div>

              {/* Session 2 */}
              <div className="bg-surface border border-outline-variant/30 rounded-xl p-gutter whisper-shadow flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                  <img src="/images/illustrations/illustration-13.png" alt="Session" className="w-full h-full object-cover rounded-xl" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-md leading-tight">Sourdough Mastery</h3>
                  <p className="text-on-surface-variant text-xs">Tomorrow at 10:00 AM</p>
                  <div className="mt-2 flex gap-1">
                    <span className="text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-bold uppercase">
                      1 Credit
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline">chevron_right</span>
              </div>
            </div>
          </section>

          {/* Mobile Growth Stats */}
          <section className="space-y-stack-md">
            <h2 className="text-headline-md font-headline-md">Your Growth</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-low p-gutter rounded-xl border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary mb-2">school</span>
                <p className="text-2xl font-bold font-headline-md">8</p>
                <p className="text-label-caps font-label-caps text-on-surface-variant">
                  SKILLS LEARNED
                </p>
              </div>
              <div className="bg-surface-container-low p-gutter rounded-xl border border-outline-variant/20">
                <span className="material-symbols-outlined text-tertiary mb-2">stars</span>
                <p className="text-2xl font-bold font-headline-md">14</p>
                <p className="text-label-caps font-label-caps text-on-surface-variant">
                  SESSIONS GIVEN
                </p>
              </div>
            </div>
          </section>

          {/* Mobile Interests */}
          <section className="space-y-stack-md">
            <h2 className="text-headline-md font-headline-md">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {interestItems.length === 0 ? (
                <div className="text-center py-8 px-4 col-span-full">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 block mb-stack-md">interests</span>
                  <p className="text-body-md font-body-md text-on-surface-variant">No interests selected yet. Explore sessions to find what inspires you.</p>
                </div>
              ) : (
                interestItems.map((interest) => (
                <span
                  key={interest}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                    interest === "+ Add New"
                      ? "border border-secondary text-secondary"
                      : "bg-secondary/10 text-secondary"
                  }`}
                >
                  {interest}
                </span>
              )))}
            </div>
          </section>
        </div>
      </main>

      {/* Mobile FAB */}
      <Button variant="primary" className="fixed bottom-24 right-margin-mobile w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 md:bottom-8" onClick={() => console.log("Quick action")}>
        <span className="material-symbols-outlined text-2xl">add</span>
      </Button>

      <BottomNav activeTab="dashboard" />
      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  );
}
