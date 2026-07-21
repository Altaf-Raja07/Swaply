"use client";

import { useMemo } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { StarRating } from "@/components/shared/star-rating";
import { SkillChip } from "@/components/shared/skill-chip";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { ReviewCard } from "@/components/shared/review-card";

const iconForSkill = (skillName: string): string => {
  const name = skillName.toLowerCase();
  if (name.includes("photo") || name.includes("camera")) return "photo_camera";
  if (name.includes("design") || name.includes("art")) return "palette";
  if (name.includes("code") || name.includes("program") || name.includes("rust") || name.includes("python") || name.includes("javascript"))
    return "code";
  if (name.includes("cook") || name.includes("bake") || name.includes("bread"))
    return "restaurant";
  if (name.includes("music") || name.includes("guitar") || name.includes("piano"))
    return "music_note";
  if (name.includes("teach") || name.includes("mentor") || name.includes("coach"))
    return "school";
  if (name.includes("write") || name.includes("blog") || name.includes("content"))
    return "edit";
  if (name.includes("data") || name.includes("analytics")) return "analytics";
  if (name.includes("market") || name.includes("seo") || name.includes("social"))
    return "trending_up";
  if (name.includes("negotiat") || name.includes("speak") || name.includes("communicat"))
    return "record_voice_over";
  return "auto_awesome";
};

const colorForSkill = (index: number) => {
  const variants = [
    { bg: "bg-secondary-container", color: "text-secondary" },
    { bg: "bg-tertiary-container/30", color: "text-tertiary" },
    { bg: "bg-primary-container/20", color: "text-primary" },
  ];
  return variants[index % variants.length];
};

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dayNamesShort = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function TeacherProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const { data: teacher, isLoading, error } = trpc.profile.getByUserId.useQuery(
    { userId: id },
    { enabled: !!id }
  );

  const { data: availability } = trpc.availability.getForTeacher.useQuery(
    { teacherId: id },
    { enabled: !!id }
  );

  const { data: reviewData } = trpc.review.getForTeacher.useQuery(
    { userId: id },
    { enabled: !!id }
  );

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

  const slotsForDay = useMemo(() => {
    if (!availability) return [];
    const { slots, activeBookings } = availability;
    return weekDays.map((date) => {
      const dayOfWeek = date.getDay();
      const dateStr = date.toISOString().split("T")[0];

      const specificSlots = slots.filter(
        (s) => !s.isRecurring && s.specificDate && new Date(s.specificDate).toISOString().split("T")[0] === dateStr
      );
      const recurringSlots = slots.filter(
        (s) => s.isRecurring && s.dayOfWeek === dayOfWeek
      );

      const active = specificSlots.length > 0 ? specificSlots : recurringSlots;

      const available = active.filter((slot) => {
        const slotStart = new Date(`${dateStr}T${slot.startTime}:00`);
        const slotEnd = new Date(`${dateStr}T${slot.endTime}:00`);
        return !activeBookings.some((b) => {
          const bStart = new Date(b.slotStart);
          const bEnd = new Date(b.slotEnd);
          return bStart < slotEnd && bEnd > slotStart;
        });
      });

      return { date, slots: available, count: available.length };
    });
  }, [availability, weekDays]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-on-surface-variant">Loading profile...</p>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface gap-4">
        <span className="material-symbols-outlined text-[64px] text-outline">
          person_off
        </span>
        <h1 className="text-headline-md text-on-surface">User not found</h1>
        <Button asChild>
          <Link href="/discover">Browse Teachers</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Navbar activeTab="discover" />
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
        {/* Header / Bio Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-stack-lg">
          <div className="md:col-span-8 flex flex-col md:flex-row gap-stack-lg items-start">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-xl overflow-hidden editorial-border whisper-shadow flex-shrink-0">
              <img
                src={teacher.image || "/images/avatars/avatar-15.png"}
                alt={teacher.name || "Teacher"}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="flex flex-col gap-unit">
              <div className="flex items-center gap-stack-sm mb-unit">
                <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg text-on-surface">
                  {teacher.name || "Anonymous Teacher"}
                </h1>
                {teacher.teachSkills.length > 0 && (
                  <span
                    className="material-symbols-outlined text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                )}
              </div>
              <p className="text-body-lg text-on-surface-variant max-w-2xl mb-stack-md">
                {teacher.bio || "This teacher hasn't written a bio yet."}
              </p>
              <div className="flex flex-wrap gap-stack-md text-on-surface-variant">
                {teacher.timezone && (
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">
                      schedule
                    </span>
                    <span className="text-label-caps">{teacher.timezone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="md:col-span-4 flex flex-col gap-stack-md items-end justify-start">
            <Button variant="primary" className="w-full md:w-auto" asChild>
              <Link href={`/teacher/${id}/book`}>Book a session</Link>
            </Button>
            <Button variant="secondary" className="w-full md:w-auto" asChild>
              <Link href={`/messages`}>Message {teacher.name?.split(" ")[0] || "teacher"}</Link>
            </Button>
          </div>
        </section>

        {/* Skills Bento Grid */}
        <section className="mb-stack-lg">
          <div className="flex items-center justify-between mb-stack-md">
            <h2 className="text-headline-md font-headline-md text-on-surface">
              Skills to Learn
            </h2>
            {teacher.teachSkills.length > 0 && (
              <button
                type="button"
                className="text-label-caps text-primary cursor-pointer hover:underline focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => console.log("View all curriculum")}
              >
                View All Curriculum
              </button>
            )}
          </div>
          {teacher.teachSkills.length === 0 ? (
            <div className="text-center py-stack-lg bg-surface-container-low rounded-xl">
              <span className="material-symbols-outlined text-[48px] text-outline">
                school
              </span>
              <p className="text-body-md text-on-surface-variant mt-2">
                This teacher hasn&apos;t listed any skills yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {teacher.teachSkills.map((skill, index) => {
                const { bg, color } = colorForSkill(index);
                const icon = iconForSkill(skill.skillName);
                return (
                  <div
                    key={skill.id}
                    className="group p-stack-lg bg-surface-container-low rounded-xl editorial-border whisper-shadow cursor-pointer transition-all hover:bg-surface-container duration-300"
                    onClick={() => console.log("View skill details")}
                  >
                    <div className="flex justify-between items-start mb-stack-md">
                      <div className={`p-2 ${bg} rounded-lg`}>
                        <span className={`material-symbols-outlined ${color}`}>
                          {icon}
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-outline transition-transform group-hover:rotate-45">
                        arrow_outward
                      </span>
                    </div>
                    <h3 className="text-headline-md font-headline-md text-on-surface mb-stack-sm">
                      {skill.skillName}
                    </h3>
                    <p className="text-body-md text-on-surface-variant mb-stack-md">
                      {skill.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <SkillChip label={skill.proficiency} />
                      <SkillChip label={`${skill.creditCost} credit${skill.creditCost > 1 ? "s" : ""}`} variant="secondary" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Availability & Reviews Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* Calendar Preview */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl editorial-border whisper-shadow p-stack-lg overflow-hidden">
            <div className="flex justify-between items-center mb-stack-lg">
              <h2 className="text-headline-md font-headline-md text-on-surface">
                Weekly Availability
              </h2>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center mb-stack-sm">
              {dayNames.map((d) => (
                <div key={d} className="text-label-caps text-outline">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {slotsForDay.map(({ date, count }) => {
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                return (
                  <div
                    key={date.toISOString()}
                    className={`h-24 rounded-lg flex flex-col items-center justify-center gap-1 ${
                      count > 0
                        ? "bg-primary-container/5 border border-primary/20 relative overflow-hidden"
                        : isWeekend
                        ? "bg-surface-container-highest/20"
                        : "bg-surface-container rounded-lg opacity-50"
                    }`}
                  >
                    {count > 0 && (
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-primary" />
                    )}
                    <span className="text-label-caps text-on-surface">
                      {date.getDate()}
                    </span>
                    {count > 0 && (
                      <div className="px-1 py-0.5 bg-primary text-[10px] text-on-primary rounded font-bold uppercase">
                        {count > 1 ? `${count} Slots` : "1 Slot"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {slotsForDay.some((s) => s.count > 0) && (
              <p className="mt-stack-md text-label-caps text-on-surface-variant italic text-center">
                {(() => {
                  const first = slotsForDay.find((s) => s.count > 0);
                  if (!first) return "";
                  const slot = first.slots[0];
                  if (!slot) return "";
                  return `Next available: ${dayNames[first.date.getDay()]} at ${slot.startTime}`;
                })()}
              </p>
            )}
            {slotsForDay.every((s) => s.count === 0) && availability && (
              <p className="mt-stack-md text-label-caps text-on-surface-variant italic text-center">
                No availability in the next 7 days
              </p>
            )}
          </div>

          {/* Reviews */}
          <div className="lg:col-span-5 flex flex-col gap-stack-md">
            <div className="flex items-center gap-stack-sm">
              <h2 className="text-headline-md font-headline-md text-on-surface">
                Reviews
              </h2>
              {reviewData && reviewData.aggregate.count > 0 && (
                <StarRating
                  rating={reviewData.aggregate.average}
                  size="md"
                  showValue
                  reviewCount={reviewData.aggregate.count}
                />
              )}
            </div>
            {reviewData && reviewData.reviews.length > 0 ? (
              <div className="flex flex-col gap-stack-md">
                {reviewData.reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    authorName={review.reviewer.name ?? "Anonymous"}
                    rating={review.rating}
                    text={review.comment ?? ""}
                    avatarSrc={review.reviewer.image ?? undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-stack-lg text-on-surface-variant">
                <span className="material-symbols-outlined text-[32px]">
                  rate_review
                </span>
                <p className="text-body-md mt-2">
                  No reviews yet
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
