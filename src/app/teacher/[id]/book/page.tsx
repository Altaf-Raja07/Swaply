"use client";

import { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";

const timeToEnd: Record<string, string> = {
  "08:00": "10:00",
  "10:00": "12:00",
  "12:00": "14:00",
  "14:00": "16:00",
  "16:00": "18:00",
};

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function BookSessionPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = params.id as string;

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  const { data: teacher } = trpc.profile.getByUserId.useQuery(
    { userId: teacherId },
    { enabled: !!teacherId }
  );

  const { data: availability, isLoading: loadingAvailability } =
    trpc.availability.getForTeacher.useQuery(
      { teacherId },
      { enabled: !!teacherId }
    );

  const createBooking = trpc.booking.create.useMutation();

  const weekDays = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }, []);

  const dateAvailability = useMemo(() => {
    if (!availability) return [];
    const { slots, activeBookings } = availability;
    return weekDays.map((date) => {
      const dayOfWeek = date.getDay();
      const dateStr = date.toISOString().split("T")[0];
      const specificSlots = slots.filter(
        (s) =>
          !s.isRecurring &&
          s.specificDate &&
          new Date(s.specificDate).toISOString().split("T")[0] === dateStr
      );
      const daySlots = specificSlots.length > 0 ? specificSlots : slots.filter((s) => s.isRecurring && s.dayOfWeek === dayOfWeek);

      const availableStarts = daySlots
        .map((slot) => {
          const slotStart = new Date(`${dateStr}T${slot.startTime}:00`);
          const slotEnd = new Date(`${dateStr}T${slot.endTime}:00`);
          const isBooked = activeBookings.some((b) => {
            const bStart = new Date(b.slotStart);
            const bEnd = new Date(b.slotEnd);
            return bStart < slotEnd && bEnd > slotStart;
          });
          return { start: slot.startTime, end: slot.endTime, available: !isBooked };
        })
        .filter((s) => s.available);

      return { date, slots: availableStarts, count: availableStarts.length };
    });
  }, [availability, weekDays]);

  const selectedDateData = dateAvailability.find(
    (d) => d.date.toISOString().split("T")[0] === selectedDate
  );

  const selectedSkill = teacher?.teachSkills.find((s) => s.id === selectedSkillId);

  const progress = Math.round((step / 3) * 100);

  const handleConfirm = () => {
    if (!selectedDate || !selectedSlot || !selectedSkillId || !teacher) return;

    const slotEnd = timeToEnd[selectedSlot] || (() => {
      const [h, m] = selectedSlot.split(":").map(Number);
      return `${String(h + 1).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    })();

    createBooking.mutate(
      {
        teachSkillId: selectedSkillId,
        teacherId,
        slotStart: `${selectedDate}T${selectedSlot}:00.000Z`,
        slotEnd: `${selectedDate}T${slotEnd}:00.000Z`,
      },
      { onSuccess: () => setStep(3) }
    );
  };

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
              <div className="md:col-span-4">
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-stack-md whisper-shadow sticky top-24">
                  <div className="aspect-square rounded-lg overflow-hidden mb-stack-md">
                    <img
                      src={teacher?.image || "/images/illustrations/illustration-1.png"}
                      alt="Teacher"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <h2 className="text-headline-md font-headline-md mb-1">
                    {teacher?.name || "Teacher"}
                  </h2>
                  <p className="text-label-caps text-secondary font-bold uppercase mb-4">
                    {teacher?.teachSkills?.length ? `${teacher.teachSkills.length} skills available` : "No skills listed"}
                  </p>
                </div>
              </div>

              <div className="md:col-span-8">
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-stack-lg whisper-shadow">
                  <h3 className="text-body-lg font-bold mb-stack-lg">
                    Select Date &amp; Time
                  </h3>

                  {loadingAvailability ? (
                    <p className="text-on-surface-variant">Loading availability...</p>
                  ) : availability && dateAvailability.every((d) => d.count === 0) ? (
                    <p className="text-on-surface-variant">This teacher has no availability set.</p>
                  ) : (
                    <>
                      {/* Weekly Strip */}
                      <div className="grid grid-cols-7 gap-2 mb-stack-lg">
                        {dateAvailability.map(({ date, count }) => {
                          const dateStr = date.toISOString().split("T")[0];
                          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                          return (
                            <div key={dateStr} className="text-center">
                              <p className="text-label-caps text-on-surface-variant mb-2">
                                {dayNames[date.getDay()]}
                              </p>
                              <Button
                                variant={selectedDate === dateStr ? "primary" : "ghost"}
                                className="w-full"
                                disabled={count === 0 || isWeekend}
                                onClick={() => {
                                  setSelectedDate(dateStr);
                                  setSelectedSlot(null);
                                }}
                              >
                                {date.getDate()}
                              </Button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Slot Grid */}
                      {selectedDate && selectedDateData && (
                        <div className="space-y-stack-md">
                          <p className="text-label-caps text-on-surface-variant uppercase tracking-widest">
                            Available Slots ({dayNames[new Date(selectedDate).getDay()]}, {new Date(selectedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })})
                          </p>
                          {selectedDateData.slots.length === 0 ? (
                            <p className="text-on-surface-variant">No available slots for this date.</p>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {selectedDateData.slots.map((slot) => (
                                <Button
                                  key={slot.start}
                                  variant={selectedSlot === slot.start ? "primary" : "ghost"}
                                  className="w-full"
                                  onClick={() => setSelectedSlot(slot.start)}
                                >
                                  {slot.start}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Skill Selector */}
                      {selectedSlot && teacher?.teachSkills && (
                        <div className="mt-stack-lg pt-stack-md border-t border-outline-variant/20">
                          <p className="text-label-caps text-on-surface-variant uppercase tracking-widest mb-3">
                            Select a Skill
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {teacher.teachSkills.map((skill) => (
                              <Button
                                key={skill.id}
                                variant={selectedSkillId === skill.id ? "primary" : "secondary"}
                                size="sm"
                                onClick={() => setSelectedSkillId(skill.id)}
                              >
                                {skill.skillName} ({skill.creditCost} cr)
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div className="mt-stack-lg pt-stack-md border-t border-outline-variant/20 flex justify-end">
                    <Button
                      variant="primary"
                      disabled={!selectedSlot || !selectedSkillId}
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
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={teacher?.image || "/images/illustrations/illustration-15.png"}
                      alt="Skill"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <p className="text-label-caps text-primary font-bold uppercase mb-1">
                      {selectedSkill?.proficiency || "Session"}
                    </p>
                    <h4 className="text-body-lg font-bold">
                      {selectedSkill?.skillName || "Skill"} with {teacher?.name || "Teacher"}
                    </h4>
                    <p className="text-on-surface-variant">
                      {selectedDate && selectedSlot
                        ? `${new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at ${selectedSlot}`
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="border-t border-outline-variant/30 pt-stack-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-body-md text-on-surface-variant">
                      Session Cost
                    </span>
                    <span className="text-body-lg font-bold">
                      {selectedSkill?.creditCost || 0} Credits
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-secondary">
                    <span className="text-body-md">Your Current Balance</span>
                    <span className="text-body-md">-- Credits</span>
                  </div>
                  <div className="mt-4 p-3 bg-secondary/5 rounded-lg flex justify-between items-center">
                    <span className="text-label-caps font-bold">
                      REMAINING AFTER BOOKING
                    </span>
                    <span className="text-body-lg font-bold text-secondary">
                      -- Credits
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

                {createBooking.isError && (
                  <p className="text-xs text-red-500">
                    {createBooking.error.message}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-stack-md">
                  <Button
                    variant="secondary"
                    onClick={() => setStep(1)}
                    disabled={createBooking.isPending}
                  >
                    Back to Calendar
                  </Button>
                  <Button
                    variant="primary"
                    disabled={createBooking.isPending}
                    onClick={handleConfirm}
                  >
                    {createBooking.isPending ? "Booking..." : "Confirm Booking"}
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <section className="max-w-lg mx-auto text-center">
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-stack-lg whisper-shadow overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-secondary" />
              <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-stack-lg">
                <span
                  className="material-symbols-outlined text-[48px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
              <h3 className="text-display-lg-mobile md:text-headline-md font-headline-md mb-stack-sm">
                Booking Confirmed!
              </h3>
              <p className="text-body-lg text-on-surface-variant mb-stack-lg">
                You&apos;re all set to learn {selectedSkill?.skillName || "your skill"} with {teacher?.name || "your mentor"}.
              </p>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => router.push("/dashboard")}
                >
                  Go to Dashboard
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
