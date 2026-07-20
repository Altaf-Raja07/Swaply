"use client";

import { useState, useCallback } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";

const timeLabels = ["08:00", "10:00", "12:00", "14:00", "16:00"];
const dayHeaders = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const preselected = [0, 1, 2, 8, 15, 16, 23, 30, 31, 32];

const initialGrid = Array.from({ length: 7 * 5 }, (_, i) =>
  preselected.includes(i)
);

interface SkillChipProps {
  label: string;
  variant: "teach" | "learn";
  onRemove: () => void;
}

function SkillChip({ label, variant, onRemove }: SkillChipProps) {
  const bg =
    variant === "teach"
      ? "bg-secondary/10 text-secondary"
      : "bg-tertiary/10 text-tertiary";

  return (
    <span
      className={`inline-flex items-center gap-1 ${bg} px-3 py-1.5 rounded-full text-body-md font-medium`}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="material-symbols-outlined text-[16px] leading-none hover:opacity-70"
      >
        close
      </button>
    </span>
  );
}

export default function SettingsPage() {
  const [grid, setGrid] = useState<boolean[]>(initialGrid);

  const toggleSlot = useCallback((index: number) => {
    setGrid((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }, []);

  const defaultSkills = [
    "Wheel Throwing",
    "Glaze Chemistry",
    "Hand Building",
  ];
  const defaultGoals = ["UI Design", "Photography"];

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-screen">
        {/* Header */}
        <div className="mb-stack-lg flex flex-col md:flex-row md:items-end justify-between gap-stack-md">
          <div>
            <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg text-on-surface">
              Account Settings
            </h1>
            <p className="text-on-surface-variant font-body-md mt-1">
              Manage your community presence and learning preferences.
            </p>
          </div>
          <div className="flex gap-stack-sm">
            <Button variant="secondary">Cancel</Button>
            <Button variant="primary">Save Changes</Button>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* Left Column: Identity & Bio */}
          <div className="lg:col-span-4 space-y-stack-lg">
            <section className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/20 whisper-shadow">
              <div className="flex flex-col items-center mb-stack-lg">
                <div className="relative group cursor-pointer">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary-fixed-dim">
                    <img src="/images/avatars/avatar-12.png" alt="Profile photo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="material-symbols-outlined text-white">
                      photo_camera
                    </span>
                  </div>
                </div>
                <h2 className="text-headline-md font-headline-md mt-4 text-on-surface">
                  Elena Rossi
                </h2>
                <span className="text-label-caps font-label-caps text-secondary uppercase tracking-widest mt-1">
                  Pottery &amp; Design
                </span>
              </div>

              <div className="space-y-stack-md">
                <div>
                  <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">
                    BIO
                  </label>
                  <textarea
                    className="w-full bg-surface border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-body-md transition-colors resize-none py-2 outline-none"
                    placeholder="Tell the community about yourself..."
                    rows={4}
                    defaultValue="Lover of clay, traditional Italian cooking, and architectural sketching. I've been teaching pottery for 5 years and want to learn more about UI design to help with my studio's website."
                  />
                </div>
                <div>
                  <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">
                    TIMEZONE
                  </label>
                  <select className="w-full bg-surface border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-body-md py-2 outline-none cursor-pointer">
                    <option>Europe/Rome (GMT+1)</option>
                    <option>Europe/London (GMT+0)</option>
                    <option>America/New_York (GMT-5)</option>
                    <option>Asia/Tokyo (GMT+9)</option>
                  </select>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Skills & Availability */}
          <div className="lg:col-span-8 space-y-stack-lg">
            {/* Skill Management Bento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {/* Teaching Skills */}
              <section className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/20 whisper-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-headline-md font-headline-md flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      school
                    </span>
                    Skills to Teach
                  </h3>
                  <button
                    type="button"
                    className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors"
                  >
                    add_circle
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {defaultSkills.map((s) => (
                    <SkillChip
                      key={s}
                      label={s}
                      variant="teach"
                      onRemove={() => {}}
                    />
                  ))}
                </div>
              </section>

              {/* Learning Goals */}
              <section className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/20 whisper-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-headline-md font-headline-md flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary">
                      rocket_launch
                    </span>
                    Learning Goals
                  </h3>
                  <button
                    type="button"
                    className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors"
                  >
                    add_circle
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {defaultGoals.map((g) => (
                    <SkillChip
                      key={g}
                      label={g}
                      variant="learn"
                      onRemove={() => {}}
                    />
                  ))}
                </div>
              </section>
            </div>

            {/* Weekly Availability */}
            <section className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/20 whisper-shadow">
              <div className="flex items-center justify-between mb-stack-lg">
                <h3 className="text-headline-md font-headline-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">
                    calendar_month
                  </span>
                  Weekly Availability
                </h3>
                <div className="flex items-center gap-2 text-label-caps font-label-caps text-on-surface-variant">
                  <div className="w-3 h-3 bg-primary rounded-sm" />
                  Available
                </div>
              </div>

              <div className="overflow-x-auto pb-4">
                <div className="grid grid-cols-8 gap-1 min-w-[600px]">
                  {/* Time labels */}
                  <div className="col-span-1 space-y-[20px] pt-8">
                    {timeLabels.map((t) => (
                      <div
                        key={t}
                        className="h-10 flex items-center justify-end pr-4 text-label-caps font-label-caps text-on-surface-variant"
                      >
                        {t}
                      </div>
                    ))}
                  </div>

                  {/* Day columns */}
                  <div className="col-span-7 grid grid-cols-7 gap-1">
                    {dayHeaders.map((d) => (
                      <div
                        key={d}
                        className="text-center font-label-caps text-label-caps text-on-surface-variant mb-2"
                      >
                        {d}
                      </div>
                    ))}

                    <div className="col-span-7 grid grid-cols-7 auto-rows-[40px] gap-1">
                      {grid.map((isActive, i) => (
                        <div
                          key={i}
                          onClick={() => toggleSlot(i)}
                          className={`h-10 rounded-sm cursor-pointer transition-all active:scale-[0.97] border border-outline-variant/10 ${
                            isActive
                              ? "bg-primary"
                              : "bg-surface-container-high"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-label-caps font-label-caps text-on-surface-variant mt-4 italic">
                Click blocks to toggle your available meeting hours. All times
                are synced to your current timezone.
              </p>
            </section>

            {/* Account Privacy */}
            <section className="bg-surface-container-low rounded-xl p-6 border border-error/10">
              <h3 className="text-headline-md font-headline-md text-error flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined">warning</span>
                Account Privacy
              </h3>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <p className="text-body-md text-on-surface-variant">
                  Your profile is currently public. You can switch to private
                  mode to hide your profile from search.
                </p>
                <Button variant="danger">Deactivate Account</Button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <BottomNav activeTab="profile" />
      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  );
}
