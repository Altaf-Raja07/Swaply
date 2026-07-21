"use client";

import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

const SOCKET_URL = process.env.NEXT_PUBLIC_REALTIME_URL || "http://localhost:3001";

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const utils = trpc.useUtils();

  const { data: session } = trpc.auth.getSession.useQuery();
  const { data: booking, isLoading, error } = trpc.booking.getById.useQuery(
    { id },
    { enabled: !!id }
  );

  const acceptBooking = trpc.booking.accept.useMutation({
    onSuccess: () => utils.booking.getById.invalidate(),
  });
  const declineBooking = trpc.booking.decline.useMutation({
    onSuccess: () => utils.booking.getById.invalidate(),
  });
  const cancelBooking = trpc.booking.cancel.useMutation({
    onSuccess: () => utils.booking.getById.invalidate(),
  });
  const completeBooking = trpc.booking.complete.useMutation({
    onSuccess: () => utils.booking.getById.invalidate(),
  });

  const { data: initialMessages } = trpc.chat.getHistory.useQuery(
    { bookingId: id },
    { enabled: !!id }
  );
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMessages) setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    const socket = io(SOCKET_URL, { withCredentials: true });
    socket.on("connect", () => socket.emit("join:booking", id));
    socket.on("newMessage", (msg: any) => {
      setMessages((prev) => {
        if (!prev) return [msg];
        if (prev.some((m: any) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });
    socket.on("error", (err: string) => console.error("Socket error:", err));
    return () => {
      socket.emit("leave:booking", id);
      socket.disconnect();
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendMessageMutation.mutate(
      { bookingId: id, content: chatInput.trim() },
      { onSuccess: () => setChatInput("") }
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-on-surface-variant">Loading session...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface gap-4">
        <span className="material-symbols-outlined text-[64px] text-outline">
          event_busy
        </span>
        <h1 className="text-headline-md text-on-surface">Session not found</h1>
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const userId = session?.user?.id;
  const isLearner = userId === booking.learner.id;
  const isTeacher = userId === booking.teacher.id;
  const statusColors: Record<string, string> = {
    REQUESTED: "bg-amber-500",
    CONFIRMED: "bg-secondary",
    COMPLETED: "bg-green-500",
    DECLINED: "bg-red-500",
    CANCELLED: "bg-gray-500",
  };
  const statusBg: Record<string, string> = {
    REQUESTED: "bg-amber-50 text-amber-700 border-amber-200",
    CONFIRMED: "bg-secondary/10 text-secondary border-secondary/20",
    COMPLETED: "bg-green-50 text-green-700 border-green-200",
    DECLINED: "bg-red-50 text-red-700 border-red-200",
    CANCELLED: "bg-gray-50 text-gray-500 border-gray-200",
  };

  const slotDate = new Date(booking.slotStart);
  const slotEnd = new Date(booking.slotEnd);
  const dateStr = slotDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = slotDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const durationMs = slotEnd.getTime() - slotDate.getTime();
  const durationMin = Math.round(durationMs / 60000);

  return (
    <>
      <div className="hidden md:block">
        <Navbar activeTab="dashboard" />
      </div>

      <header className="md:hidden flex items-center justify-between h-16 px-4 bg-surface border-b border-outline-variant/30 z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 -ml-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors inline-flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={isLearner ? booking.teacher.image || "/images/avatars/avatar-24.png" : booking.learner.image || "/images/avatars/avatar-24.png"}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-body-md font-bold text-on-surface leading-none">
                {isLearner ? booking.teacher.name : booking.learner.name}
              </h1>
              <span className="text-label-caps text-secondary font-label-caps mt-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-secondary" />{" "}
                {booking.status === "CONFIRMED" ? "Confirmed" : booking.status === "REQUESTED" ? "Pending" : booking.status.toLowerCase()}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
        {/* Desktop Session Header */}
        <div className="hidden md:block">
          <section className="mb-stack-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-gutter">
            <div className="flex flex-col gap-2">
              <nav className="flex items-center gap-2 text-on-surface-variant mb-2">
                <Link
                  href="/dashboard"
                  className="text-label-caps font-label-caps hover:text-primary"
                >
                  Dashboard
                </Link>
                <span className="material-symbols-outlined text-sm">
                  chevron_right
                </span>
                <span className="text-label-caps font-label-caps">
                  Session Details
                </span>
              </nav>
              <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg text-on-surface">
                {booking.teachSkill.skillName}
              </h1>
              <p className="text-on-surface-variant font-body-md">
                Session with{" "}
                <span className="font-bold text-on-surface">
                  {isLearner ? booking.teacher.name : booking.learner.name}
                </span>{" "}
                &bull; {dateStr}, {timeStr}
              </p>
            </div>
            <div className="flex flex-col items-end gap-stack-md">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full border ${statusBg[booking.status] || "bg-gray-100"}`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${statusColors[booking.status] || "bg-gray-400"} ${booking.status === "REQUESTED" || booking.status === "CONFIRMED" ? "animate-pulse" : ""}`}
                />
                <span className="text-label-caps font-label-caps">
                  {booking.status}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Desktop Bento Layout */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Details Column */}
          <div className="lg:col-span-4 flex flex-col gap-gutter">
            <div className="bg-surface-container-lowest p-stack-lg rounded-xl editorial-border whisper-shadow">
              <h2 className="text-headline-md font-headline-md mb-stack-md">
                The Exchange
              </h2>
              <div className="space-y-stack-md">
                <div className="flex items-start gap-stack-md p-3 rounded-lg bg-surface">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src="/images/illustrations/illustration-4.png"
                      alt="Skill"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <p className="text-label-caps font-label-caps text-on-surface-variant">
                      Skill Offered
                    </p>
                    <p className="font-bold text-on-surface">
                      {booking.teachSkill.skillName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-stack-md p-3 rounded-lg bg-surface">
                  <div className="w-12 h-12 rounded-lg bg-tertiary-container/20 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-tertiary">
                      swap_horiz
                    </span>
                  </div>
                  <div>
                    <p className="text-label-caps font-label-caps text-on-surface-variant">
                      In Exchange For
                    </p>
                    <p className="font-bold text-on-surface">
                      {booking.creditCost} Credits
                    </p>
                  </div>
                </div>
                <hr className="border-outline-variant/30" />
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">Duration</span>
                  <span className="font-bold">{durationMin} Minutes</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-stack-lg rounded-xl editorial-border whisper-shadow">
              <div className="flex items-center gap-stack-md mb-stack-md">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={(isLearner ? booking.teacher.image : booking.learner.image) || "/images/avatars/avatar-13.png"}
                    alt="Person"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <p className="font-bold text-on-surface">
                    {isLearner ? booking.teacher.name : booking.learner.name}
                  </p>
                  <p className="text-label-caps text-on-surface-variant">
                    {isLearner ? "Teacher" : "Learner"}
                  </p>
                </div>
              </div>
              <Button variant="secondary" className="w-full" asChild>
                <Link href={`/teacher/${isLearner ? booking.teacher.id : booking.learner.id}`}>
                  View Profile
                </Link>
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {isTeacher && booking.status === "REQUESTED" && (
                <>
                  <Button
                    variant="primary"
                    className="w-full"
                    disabled={acceptBooking.isPending}
                    onClick={() => acceptBooking.mutate({ id })}
                  >
                    {acceptBooking.isPending ? "Accepting..." : "Accept Booking"}
                  </Button>
                  <Button
                    variant="danger"
                    className="w-full"
                    disabled={declineBooking.isPending}
                    onClick={() => declineBooking.mutate({ id })}
                  >
                    {declineBooking.isPending ? "Declining..." : "Decline Booking"}
                  </Button>
                </>
              )}

              {(isLearner || isTeacher) && booking.status === "CONFIRMED" && (
                <Button
                  variant="danger"
                  className="w-full"
                  disabled={cancelBooking.isPending}
                  onClick={() => cancelBooking.mutate({ id })}
                >
                  {cancelBooking.isPending ? "Cancelling..." : "Cancel Session"}
                </Button>
              )}

              {isLearner && booking.status === "CONFIRMED" && (
                <Button
                  variant="primary"
                  className="w-full"
                  disabled={completeBooking.isPending}
                  onClick={() => completeBooking.mutate({ id })}
                >
                  {completeBooking.isPending ? "Completing..." : "Mark as Complete"}
                </Button>
              )}

              {(acceptBooking.isError || declineBooking.isError || cancelBooking.isError || completeBooking.isError) && (
                <p className="text-xs text-red-500 mt-2">
                  {acceptBooking.error?.message ||
                    declineBooking.error?.message ||
                    cancelBooking.error?.message ||
                    completeBooking.error?.message}
                </p>
              )}
            </div>
          </div>

          {/* Chat Panel */}
          <div className="lg:col-span-8 h-[600px] flex flex-col bg-surface-container-lowest rounded-xl editorial-border whisper-shadow overflow-hidden">
            <div className="px-stack-lg py-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container">
              <div className="flex items-center gap-stack-md">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <h3 className="font-bold text-on-surface">
                  Chat with {isLearner ? booking.teacher.name : booking.learner.name}
                </h3>
              </div>
            </div>
            <div className="flex-grow overflow-y-auto p-stack-lg space-y-3">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-on-surface-variant">
                  <p>No messages yet. Say hello!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.sender.id === userId;
                  return (
                    <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] flex gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mt-1">
                          <img
                            src={msg.sender.image || "/images/avatars/avatar-24.png"}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div
                            className={`px-4 py-2 rounded-2xl text-sm ${
                              isMine
                                ? "bg-primary text-on-primary rounded-br-sm"
                                : "bg-surface-container-high text-on-surface rounded-bl-sm"
                            }`}
                          >
                            {msg.content}
                          </div>
                          <p className={`text-[10px] text-on-surface-variant mt-1 ${isMine ? "text-right" : "text-left"}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="flex items-center gap-2 p-stack-lg border-t border-outline-variant/30 bg-surface-container">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow px-4 py-2 rounded-full bg-surface text-on-surface border border-outline-variant/50 outline-none focus:border-primary text-sm"
                disabled={sendMessageMutation.isPending}
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || sendMessageMutation.isPending}
                className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center disabled:opacity-40 transition-opacity hover:opacity-90"
              >
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Spacer */}
        <div className="md:hidden h-24" />
      </main>

      <BottomNav activeTab="dashboard" />
      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  );
}
