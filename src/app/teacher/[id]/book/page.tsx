"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const dates = [14, 15, 16, 17, 18, 19, 20];
const timeSlots = [
  "09:00 AM",
  "10:30 AM",
  "01:00 PM",
  "02:30 PM",
  "04:00 PM",
  "05:30 PM",
];

export default function BookSessionPage() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(15);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const progress = (step / 3) * 100;

  return (
    <>
      <Navbar activeTab="discover" />
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
        {/* Booking Progress Header */}
        <div className="mb-stack-lg max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-headline-md font-headline-md text-on-surface">
              Book a Session
            </h1>
            <span className="text-label-caps text-on-surface-variant uppercase tracking-widest">
              Step {step} of 3
            </span>
          </div>
          <div className="h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step 1: Calendar / Slot Picker */}
        {step === 1 && (
          <section className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              {/* Expert Quick Card */}
              <div className="md:col-span-4">
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-stack-md whisper-shadow sticky top-24">
                  <div className="aspect-square rounded-lg overflow-hidden mb-stack-md bg-surface-container-high" />
                  <h2 className="text-headline-md font-headline-md mb-1">
                    Wheel Throwing
                  </h2>
                  <p className="text-label-caps text-secondary font-bold uppercase mb-4">
                    With Elias Thorne
                  </p>
                  <div className="flex items-center gap-2 text-body-md text-on-surface-variant">
                    <span className="material-symbols-outlined text-[20px]">timer</span>
                    <span>60 Minute Session</span>
                  </div>
                  <div className="flex items-center gap-2 text-body-md text-on-surface-variant mt-2">
                    <span className="material-symbols-outlined text-[20px]">payments</span>
                    <span>3 Credits</span>
                  </div>
                </div>
              </div>

              {/* Calendar Content */}
              <div className="md:col-span-8">
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-stack-lg whisper-shadow">
                  <div className="flex items-center justify-between mb-stack-lg">
                    <h3 className="text-body-lg font-bold">
                      Select Date &amp; Time
                    </h3>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <span className="material-symbols-outlined">chevron_left</span>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <span className="material-symbols-outlined">chevron_right</span>
                      </Button>
                    </div>
                  </div>

                  {/* Weekly Strip */}
                  <div className="grid grid-cols-7 gap-2 mb-stack-lg">
                    {days.map((day, i) => (
                      <div key={day} className="text-center">
                        <p className="text-label-caps text-on-surface-variant mb-2">
                          {day}
                        </p>
                        {day === "SAT" || day === "SUN" ? (
                          <Button variant="ghost" className="w-full opacity-40" disabled>
                            {dates[i]}
                          </Button>
                        ) : (
                          <Button
                            variant={selectedDate === dates[i] ? "primary" : "ghost"}
                            className="w-full"
                            onClick={() => setSelectedDate(dates[i])}
                          >
                            {dates[i]}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Slot Grid */}
                  <div className="space-y-stack-md">
                    <p className="text-label-caps text-on-surface-variant uppercase tracking-widest">
                      Available Slots (Tue, Oct 15)
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {timeSlots.map((slot) => {
                        const isUnavailable = slot === "04:00 PM";
                        return (
                          <Button
                            key={slot}
                            variant={isUnavailable ? "ghost" : selectedSlot === slot ? "primary" : "ghost"}
                            className="w-full"
                            disabled={isUnavailable}
                            onClick={() => !isUnavailable && setSelectedSlot(slot)}
                          >
                            {slot}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-stack-lg pt-stack-md border-t border-outline-variant/20 flex justify-end">
                    <Button
                      variant="primary"
                      disabled={!selectedSlot}
                      className={!selectedSlot ? "opacity-50 cursor-not-allowed" : ""}
                      onClick={() => setStep(2)}
                    >
                      Continue to Confirmation
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Step 2: Confirmation */}
        {step === 2 && (
          <section className="max-w-2xl mx-auto">
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-stack-lg whisper-shadow">
              <h3 className="text-headline-md font-headline-md mb-stack-lg">
                Review &amp; Confirm
              </h3>
              <div className="space-y-gutter">
                <div className="flex items-start gap-gutter p-4 rounded-lg bg-surface-container">
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-surface-container-high" />
                  <div>
                    <p className="text-label-caps text-primary font-bold uppercase mb-1">
                      Workshop
                    </p>
                    <h4 className="text-body-lg font-bold">
                      Wheel Throwing with Elias Thorne
                    </h4>
                    <p className="text-on-surface-variant">
                      Tuesday, October 15 &bull; {selectedSlot} &mdash; 1 hour
                    </p>
                  </div>
                </div>

                <div className="border-t border-outline-variant/30 pt-stack-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-body-md text-on-surface-variant">
                      Session Cost
                    </span>
                    <span className="text-body-lg font-bold">3 Credits</span>
                  </div>
                  <div className="flex justify-between items-center text-secondary">
                    <span className="text-body-md">Your Current Balance</span>
                    <span className="text-body-md">12 Credits</span>
                  </div>
                  <div className="mt-4 p-3 bg-secondary/5 rounded-lg flex justify-between items-center">
                    <span className="text-label-caps font-bold">
                      REMAINING AFTER BOOKING
                    </span>
                    <span className="text-body-lg font-bold text-secondary">
                      9 Credits
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container-high/50 p-4 rounded-lg flex gap-3">
                  <span className="material-symbols-outlined text-secondary">info</span>
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    Cancellations made less than 24 hours before the session
                    start time are non-refundable.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-stack-md">
                  <Button variant="secondary" onClick={() => setStep(1)}>
                    Back to Calendar
                  </Button>
                  <Button variant="primary" onClick={() => setStep(3)}>
                    Confirm Booking
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <section className="max-w-lg mx-auto text-center">
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-stack-lg whisper-shadow overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-secondary" />
              <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-stack-lg">
                <span
                  className="material-symbols-outlined text-[48px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
              <h3 className="text-display-lg-mobile md:text-display-lg font-headline-md mb-stack-sm">
                Booking Confirmed!
              </h3>
              <p className="text-body-lg text-on-surface-variant mb-stack-lg">
                You&apos;re all set to learn Wheel Throwing with Elias.
                We&apos;ve sent the details to your inbox.
              </p>
              <div className="space-y-stack-md text-left bg-surface-container p-6 rounded-xl mb-stack-lg">
                <h4 className="text-label-caps font-bold text-on-surface mb-2">
                  NEXT STEPS
                </h4>
                {[
                  "Check your Messages for the studio access code.",
                  "Complete the Safety Intro video in your dashboard.",
                  "Bring comfortable clothes that you don't mind getting a bit of clay on!",
                ].map((stepText, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-white border border-outline-variant flex items-center justify-center font-bold text-secondary">
                      {i + 1}
                    </div>
                    <p className="text-body-md">{stepText}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <Button variant="primary" className="w-full">
                  Go to Dashboard
                </Button>
                <Button variant="secondary" className="w-full">
                  Add to Calendar
                </Button>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
