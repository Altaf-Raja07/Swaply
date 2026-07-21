"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { StarRating } from "@/components/shared/star-rating";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SessionDetailPage() {
  return (
    <>
      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <Navbar activeTab="dashboard" />
      </div>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between h-16 px-4 bg-surface border-b border-outline-variant/30 z-20">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 -ml-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors inline-flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img src="/images/avatars/avatar-24.png" alt="Mentor" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-body-md font-bold text-on-surface leading-none">
                Elena Woodworking
              </h1>
              <span className="text-label-caps text-secondary font-label-caps mt-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-secondary" /> Online
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-tertiary-container px-3 py-1 rounded-full border border-tertiary/20 flex items-center gap-1.5 shadow-sm">
            <span
              className="material-symbols-outlined text-[18px] text-on-tertiary-container"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              stars
            </span>
            <span className="text-label-caps text-on-tertiary-container font-label-caps">
              12 Credits
            </span>
          </div>
        </div>
      </header>

      {/* Mobile Status Strip */}
      <div className="md:hidden bg-primary-container/10 px-4 py-2 border-b border-primary/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">
            event_upcoming
          </span>
          <span className="text-label-caps text-on-surface-variant font-medium">
            Session: Today at 4:00 PM
          </span>
        </div>
        <button type="button" className="text-primary font-bold text-label-caps active:scale-[0.98] transition-transform focus-visible:ring-2 focus-visible:ring-primary" onClick={() => console.log("Reschedule session")}>RESCHEDULE</button>
      </div>

      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
        {/* Desktop Session Header */}
        <div className="hidden md:block">
          <section className="mb-stack-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-gutter">
            <div className="flex flex-col gap-2">
              <nav className="flex items-center gap-2 text-on-surface-variant mb-2">
                <Link href="/dashboard" className="text-label-caps font-label-caps hover:text-primary">
                  Dashboard
                </Link>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <span className="text-label-caps font-label-caps">Session Details</span>
              </nav>
              <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg text-on-surface">
                Pottery Wheel Basics
              </h1>
              <p className="text-on-surface-variant font-body-md">
                Session with{" "}
                <span className="font-bold text-on-surface">Elena Moretti</span>{" "}
                &bull; Oct 24, 2:00 PM
              </p>
            </div>
            <div className="flex flex-col items-end gap-stack-md">
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary-container text-on-secondary-container rounded-full border border-secondary/10">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="text-label-caps font-label-caps">Confirmed</span>
              </div>
              <div className="flex gap-stack-sm">
                <Button variant="secondary" onClick={() => console.log("Reschedule session")}>Reschedule</Button>
                <Button variant="primary" onClick={() => console.log("Join call")}>Join Call</Button>
              </div>
            </div>
          </section>
        </div>

        {/* Desktop Bento Layout: Details & Chat */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Details Column */}
          <div className="lg:col-span-4 flex flex-col gap-gutter">
            {/* Session Info Card */}
            <div className="bg-surface-container-lowest p-stack-lg rounded-xl editorial-border whisper-shadow">
              <h2 className="text-headline-md font-headline-md mb-stack-md">
                The Exchange
              </h2>
              <div className="space-y-stack-md">
                <div className="flex items-start gap-stack-md p-3 rounded-lg bg-surface">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img src="/images/illustrations/illustration-4.png" alt="Wheel throwing" className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div>
                    <p className="text-label-caps font-label-caps text-on-surface-variant">
                      Skill Offered
                    </p>
                    <p className="font-bold text-on-surface">
                      Pottery Wheel Basics
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
                      Digital Marketing 101
                    </p>
                  </div>
                </div>
                <hr className="border-outline-variant/30" />
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">Duration</span>
                  <span className="font-bold">90 Minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">Location</span>
                  <span className="font-bold">Studio 4B, Arts District</span>
                </div>
              </div>
            </div>

            {/* Instructor Card */}
            <div className="bg-surface-container-lowest p-stack-lg rounded-xl editorial-border whisper-shadow">
              <div className="flex items-center gap-stack-md mb-stack-md">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img src="/images/avatars/avatar-13.png" alt="Elena" className="w-full h-full object-cover rounded-full" />
                </div>
                <div>
                  <p className="font-bold text-on-surface">Elena Moretti</p>
                  <StarRating rating={4.9} size="sm" reviewCount={124} />
                </div>
              </div>
              <p className="text-body-md text-on-surface-variant mb-stack-md">
                &ldquo;Excited to show you the ropes! Please bring an apron or
                clothes you don&apos;t mind getting a bit dusty.&rdquo;
              </p>
              <Button variant="secondary" className="w-full" asChild>
                <Link href="/teacher/1">View Profile</Link>
              </Button>
            </div>

            {/* Action List */}
            <div className="flex flex-col gap-2">
              <Button variant="danger" className="flex items-center justify-between p-4 rounded-xl editorial-border bg-white hover:bg-error-container/10 transition-all text-error w-full" onClick={() => console.log("Cancel session")}>
                <span className="font-bold text-label-caps">Cancel Session</span>
                <span className="material-symbols-outlined">block</span>
              </Button>
              <Button variant="ghost" className="flex items-center justify-between p-4 rounded-xl editorial-border bg-white hover:bg-surface-container-high transition-all text-on-surface-variant w-full" onClick={() => console.log("Report issue")}>
                <span className="font-bold text-label-caps">Report an Issue</span>
                <span className="material-symbols-outlined">flag</span>
              </Button>
            </div>
          </div>

          {/* Chat Panel */}
          <div className="lg:col-span-8 h-[600px] flex flex-col bg-surface-container-lowest rounded-xl editorial-border whisper-shadow overflow-hidden">
            <div className="px-stack-lg py-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container">
              <div className="flex items-center gap-stack-md">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <h3 className="font-bold text-on-surface">Chat with Elena</h3>
              </div>
              <div className="flex gap-stack-sm">
                <Button variant="ghost" className="p-2 rounded-full hover:bg-white" aria-label="Start video call" onClick={() => console.log("Start video call")}>
                  <span className="material-symbols-outlined">videocam</span>
                </Button>
                <Button variant="ghost" className="p-2 hover:bg-white rounded-full transition-colors" aria-label="More options" onClick={() => console.log("More options")}>
                  <span className="material-symbols-outlined">more_vert</span>
                </Button>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-stack-lg flex flex-col gap-stack-md bg-surface/50">
              <div className="flex justify-center">
                <span className="text-label-caps font-label-caps bg-surface-container-high px-3 py-1 rounded-full text-on-surface-variant">
                  Today
                </span>
              </div>
              {/* Incoming */}
              <div className="flex gap-stack-md max-w-[80%]">
                <div className="w-8 h-8 rounded-full flex-shrink-0 mt-1 overflow-hidden">
                  <img src="/images/avatars/avatar-8.png" alt="Avatar" className="w-full h-full object-cover rounded-full" />
                </div>
                <div className="bg-surface-container-high p-4 rounded-xl rounded-tl-none">
                  <p className="text-body-md text-on-surface">
                    Hi! I just confirmed our session. Really looking forward to
                    learning some digital marketing from you.
                  </p>
                  <span className="text-[10px] text-on-surface-variant mt-1 block">
                    10:42 AM
                  </span>
                </div>
              </div>
              {/* Outgoing */}
              <div className="flex flex-row-reverse gap-stack-md max-w-[80%] self-end">
                <div className="bg-primary p-4 rounded-xl rounded-tr-none text-on-primary">
                  <p className="text-body-md">
                    Me too! I&apos;ve prepped a few slides to walk you through
                    the                     basics. Should I bring a laptop or do you have one available?
                  </p>
                  <span className="text-[10px] text-on-primary mt-1 block">
                    10:45 AM
                  </span>
                </div>
              </div>
              {/* Incoming */}
              <div className="flex gap-stack-md max-w-[80%]">
                <div className="w-8 h-8 rounded-full flex-shrink-0 mt-1 overflow-hidden">
                  <img src="/images/avatars/avatar-22.png" alt="Elena" className="w-full h-full object-cover rounded-full" />
                </div>
                <div className="bg-surface-container-high p-4 rounded-xl rounded-tl-none">
                  <p className="text-body-md text-on-surface">
                    A laptop would be great. I have a projector we can use if
                    that helps!
                  </p>
                  <span className="text-[10px] text-on-surface-variant mt-1 block">
                    10:47 AM
                  </span>
                </div>
              </div>
              <div className="flex justify-center my-2">
                <div className="flex items-center gap-2 text-label-caps font-label-caps text-on-surface-variant/60 italic">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  End-to-end encrypted
                </div>
              </div>
            </div>

            <div className="p-stack-lg border-t border-outline-variant/30 bg-white">
              <div className="flex items-end gap-stack-md bg-surface rounded-xl p-2 border border-outline-variant/20 focus-within:border-primary transition-all">
                <Button variant="ghost" className="p-2 text-on-surface-variant hover:text-primary transition-colors" aria-label="Add attachment" onClick={() => console.log("Add attachment")}>
                  <span className="material-symbols-outlined">add_circle</span>
                </Button>
                <label htmlFor="chat-input" className="sr-only">Type a message</label>
                <textarea
                  id="chat-input"
                  className="flex-grow bg-transparent border-none focus:ring-0 resize-none py-2 px-1 text-body-md"
                  placeholder="Type a message..."
                  rows={1}
                />
                <button type="button" className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center whisper-shadow active:scale-[0.98] transition-all focus-visible:ring-2 focus-visible:ring-primary" aria-label="Send message" onClick={() => console.log("Send message")}>
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Chat Canvas */}
        <div className="md:hidden flex-1 flex flex-col -mx-margin-mobile px-margin-mobile">
          <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6 bg-surface" id="chat-container">
            <div className="flex justify-center">
              <span className="px-4 py-1 rounded-full bg-surface-container-high text-label-caps text-on-surface-variant uppercase tracking-widest">
                Today
              </span>
            </div>

            {/* Incoming */}
            <div className="flex flex-col gap-1 max-w-[85%] self-start">
              <div className="bg-surface-container-high text-on-surface p-4 rounded-[16px_16px_16px_4px] whisper-shadow border border-outline-variant/10">
                <p className="text-body-md">
                  Hi there! I&apos;ve prepared the syllabus for our session
                  today. We&apos;ll start with wood grain identification and then
                  move to basic joinery techniques.
                </p>
              </div>
              <span className="text-[10px] text-on-surface-variant font-medium ml-1">
                09:42 AM
              </span>
            </div>

            {/* File Card */}
            <div className="bg-white border border-outline-variant/30 rounded-xl p-4 whisper-shadow flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-secondary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  description
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-body-md font-bold text-on-surface">
                  Intro_to_Joinery.pdf
                </h3>
                <p className="text-label-caps text-on-surface-variant mt-0.5">
                  2.4 MB &bull; Syllabus
                </p>
                <Button variant="ghost" className="mt-3 text-secondary font-bold text-label-caps flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  DOWNLOAD
                </Button>
              </div>
            </div>

            {/* Outgoing */}
            <div className="flex flex-col gap-1 max-w-[85%] self-end">
              <div className="bg-primary text-on-primary p-4 rounded-[16px_16px_4px_16px] whisper-shadow">
                <p className="text-body-md">
                  That sounds perfect! I&apos;ve got my kit ready. Should I also
                  bring the cedar blocks I bought last week?
                </p>
              </div>
              <div className="flex items-center justify-end gap-1 mt-0.5 mr-1">
                <span className="text-[10px] text-on-surface-variant font-medium">
                  10:15 AM
                </span>
                <span className="material-symbols-outlined text-[14px] text-primary">
                  done_all
                </span>
              </div>
            </div>

            {/* Incoming */}
            <div className="flex flex-col gap-1 max-w-[85%] self-start">
              <div className="bg-surface-container-high text-on-surface p-4 rounded-[16px_16px_16px_4px] whisper-shadow border border-outline-variant/10">
                <p className="text-body-md">
                  Yes, please! Cedar is great for practicing dovetails because of
                  its softness. I&apos;m looking forward to it!
                </p>
              </div>
              <span className="text-[10px] text-on-surface-variant font-medium ml-1">
                10:18 AM
              </span>
            </div>

            {/* Reminder Card */}
            <div className="bg-surface-container-lowest border-2 border-dashed border-tertiary/30 rounded-xl p-5 text-center flex flex-col items-center gap-3">
              <div className="w-10 h-10 bg-tertiary/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary">timer</span>
              </div>
              <div>
                <h4 className="text-headline-md font-headline-md text-on-surface">
                  Session starts in 2 hours
                </h4>
                <p className="text-body-md text-on-surface-variant mt-1">
                  Ensure you have a stable internet connection and your camera is
                  set up.
                </p>
              </div>
              <Button variant="primary" className="w-full h-12" onClick={() => console.log("Join virtual room")}>
                JOIN VIRTUAL ROOM
              </Button>
            </div>
            <div className="h-4" />
          </div>
        </div>

        {/* Mobile Chat Input */}
        <div className="md:hidden p-4 bg-surface border-t border-outline-variant/20">
          <div className="flex items-end gap-2">
            <Button variant="ghost" className="mb-1 w-10 h-10 shrink-0 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors" aria-label="Add attachment" onClick={() => console.log("Add attachment")}>
              <span className="material-symbols-outlined">add_circle</span>
            </Button>
            <div className="flex-1 bg-surface-container-low border border-outline-variant/40 rounded-xl min-h-[48px] py-2 px-4 flex items-center">
              <label htmlFor="chat-input-mobile" className="sr-only">Type a message</label>
              <textarea
                id="chat-input-mobile"
                className="w-full bg-transparent border-none focus:ring-0 text-body-md placeholder:text-on-surface-variant/50 resize-none max-h-32 overflow-y-auto"
                placeholder="Type a message..."
                rows={1}
              />
            </div>
            <Button variant="ghost" className="mb-1 w-10 h-10 shrink-0 flex items-center justify-center bg-primary text-on-primary rounded-full shadow-lg transition-transform" aria-label="Send message" onClick={() => console.log("Send message")}>
              <span className="material-symbols-outlined">send</span>
            </Button>
          </div>
          <div className="mt-4 h-1 w-1/3 bg-on-surface/10 mx-auto rounded-full" />
        </div>

        {/* Mobile spacer for bottom nav */}
        <div className="md:hidden h-24" />
      </main>

      <BottomNav activeTab="dashboard" />
      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  );
}
