"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";

const timeLabels = ["08:00", "10:00", "12:00", "14:00", "16:00"];
const dayHeaders = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const timeToEnd: Record<string, string> = {
  "08:00": "10:00",
  "10:00": "12:00",
  "12:00": "14:00",
  "14:00": "16:00",
  "16:00": "18:00",
};

function emptyGrid(): boolean[] {
  return Array.from({ length: 7 * 5 }, () => false);
}

export default function SettingsPage() {
  const utils = trpc.useUtils();
  const [grid, setGrid] = useState<boolean[]>(emptyGrid);
  const [bio, setBio] = useState("");
  const [timezone, setTimezone] = useState("");
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);

  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillDescription, setNewSkillDescription] = useState("");
  const [newSkillProficiency, setNewSkillProficiency] = useState("Beginner");

  const [newGoalSkillName, setNewGoalSkillName] = useState("");
  const [newGoalText, setNewGoalText] = useState("");

  const { data: profile } = trpc.profile.get.useQuery();
  const { data: session } = trpc.auth.getSession.useQuery();
  const { data: mySlots } = trpc.availability.getMyAvailability.useQuery();

  const updateProfile = trpc.profile.update.useMutation({
    onSuccess: () => utils.profile.get.invalidate(),
  });
  const setSlots = trpc.availability.setSlots.useMutation({
    onSuccess: () => utils.availability.getMyAvailability.invalidate(),
  });

  const addSkill = trpc.teachSkill.add.useMutation({
    onSuccess: () => {
      utils.profile.get.invalidate();
      setShowAddSkill(false);
      setNewSkillName("");
      setNewSkillDescription("");
      setNewSkillProficiency("Beginner");
    },
  });
  const deleteSkill = trpc.teachSkill.delete.useMutation({
    onSuccess: () => utils.profile.get.invalidate(),
  });
  const addGoal = trpc.learnGoal.add.useMutation({
    onSuccess: () => {
      utils.profile.get.invalidate();
      setShowAddGoal(false);
      setNewGoalSkillName("");
      setNewGoalText("");
    },
  });
  const deleteGoal = trpc.learnGoal.delete.useMutation({
    onSuccess: () => utils.profile.get.invalidate(),
  });

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || "");
      setTimezone(profile.timezone || "");
    }
  }, [profile]);

  useEffect(() => {
    if (mySlots && mySlots.length > 0) {
      const newGrid = emptyGrid();
      for (const slot of mySlots) {
        if (!slot.isRecurring) continue;
        const day = slot.dayOfWeek;
        const hourIndex = timeLabels.indexOf(slot.startTime);
        if (hourIndex === -1) continue;
        const idx = hourIndex * 7 + day;
        if (idx >= 0 && idx < newGrid.length) {
          newGrid[idx] = true;
        }
      }
      setGrid(newGrid);
    }
  }, [mySlots]);

  const toggleSlot = (index: number) => {
    setGrid((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleSave = () => {
    const slots: {
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      isRecurring: boolean;
    }[] = [];
    for (let h = 0; h < 5; h++) {
      for (let d = 0; d < 7; d++) {
        const idx = h * 7 + d;
        if (grid[idx]) {
          slots.push({
            dayOfWeek: d,
            startTime: timeLabels[h],
            endTime: timeToEnd[timeLabels[h]],
            isRecurring: true,
          });
        }
      }
    }
    updateProfile.mutate({ bio, timezone });
    if (slots.length > 0 || mySlots?.length) {
      setSlots.mutate({ slots });
    }
  };

  const teachSkills = profile?.teachSkills ?? [];
  const learnGoals = profile?.learnGoals ?? [];
  const userName = session?.user?.name || profile?.name || "User";
  const userImage = session?.user?.image || profile?.image || "/images/avatars/avatar-12.png";

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-screen">
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
            <Button
              variant="secondary"
              onClick={() => {
                if (profile) {
                  setBio(profile.bio || "");
                  setTimezone(profile.timezone || "");
                }
                if (mySlots) {
                  const newGrid = emptyGrid();
                  for (const slot of mySlots) {
                    if (!slot.isRecurring) continue;
                    const day = slot.dayOfWeek;
                    const hourIndex = timeLabels.indexOf(slot.startTime);
                    if (hourIndex === -1) continue;
                    const idx = hourIndex * 7 + day;
                    if (idx >= 0 && idx < newGrid.length) newGrid[idx] = true;
                  }
                  setGrid(newGrid);
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={updateProfile.isPending || setSlots.isPending}
              onClick={handleSave}
            >
              {updateProfile.isPending || setSlots.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {(updateProfile.isError || setSlots.isError) && (
          <p className="text-xs text-red-500 mb-stack-md">
            {updateProfile.error?.message || setSlots.error?.message}
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          <div className="lg:col-span-4 space-y-stack-lg">
            <section className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/20 whisper-shadow">
              <div className="flex flex-col items-center mb-stack-lg">
                <div className="relative group cursor-pointer">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary-fixed-dim">
                    <img
                      src={userImage}
                      alt="Profile photo"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="material-symbols-outlined text-white">
                      photo_camera
                    </span>
                  </div>
                </div>
                <h2 className="text-headline-md font-headline-md mt-4 text-on-surface">
                  {userName}
                </h2>
                <span className="text-label-caps font-label-caps text-secondary uppercase tracking-widest mt-1">
                  {session?.user?.email || profile?.email || ""}
                </span>
              </div>

              <div className="space-y-stack-md">
                <div>
                  <label
                    htmlFor="user-bio"
                    className="block text-label-caps font-label-caps text-on-surface-variant mb-2"
                  >
                    BIO
                  </label>
                  <textarea
                    id="user-bio"
                    className="w-full bg-surface border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-body-md transition-colors resize-none py-2 outline-none"
                    placeholder="Tell the community about yourself..."
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="user-timezone"
                    className="block text-label-caps font-label-caps text-on-surface-variant mb-2"
                  >
                    TIMEZONE
                  </label>
                  <select
                    id="user-timezone"
                    className="w-full bg-surface border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-body-md py-2 outline-none cursor-pointer"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                  >
                    <option value="">Select timezone</option>
                    <option value="Europe/Rome (GMT+1)">Europe/Rome (GMT+1)</option>
                    <option value="Europe/London (GMT+0)">Europe/London (GMT+0)</option>
                    <option value="America/New_York (GMT-5)">America/New_York (GMT-5)</option>
                    <option value="Asia/Tokyo (GMT+9)">Asia/Tokyo (GMT+9)</option>
                  </select>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-8 space-y-stack-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
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
                    aria-label="Add skill"
                    onClick={() => setShowAddSkill(true)}
                    className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors p-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    add_circle
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {teachSkills.length === 0 && !showAddSkill && (
                    <p className="text-body-md text-on-surface-variant italic">
                      No teaching skills yet
                    </p>
                  )}
                  {teachSkills.map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1 bg-secondary/10 text-secondary px-3 py-1.5 rounded-full text-body-md font-medium"
                    >
                      {s.skillName}
                      <button
                        type="button"
                        aria-label={`Remove ${s.skillName}`}
                        onClick={() => deleteSkill.mutate({ id: s.id })}
                        className="material-symbols-outlined text-[16px] leading-none hover:opacity-70 p-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      >
                        close
                      </button>
                    </span>
                  ))}
                </div>

                {showAddSkill && (
                  <div className="mt-4 p-4 bg-surface rounded-lg border border-outline-variant/20 space-y-3">
                    <input
                      className="w-full bg-transparent border-0 border-b-2 border-outline-variant py-2 text-body-md focus:border-primary focus:ring-0 outline-none"
                      placeholder="Skill name"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                    />
                    <select
                      className="w-full bg-surface border-0 border-b-2 border-outline-variant text-body-md py-2 outline-none cursor-pointer"
                      value={newSkillProficiency}
                      onChange={(e) => setNewSkillProficiency(e.target.value)}
                    >
                      {["Beginner", "Intermediate", "Advanced", "Expert"].map(
                        (p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        )
                      )}
                    </select>
                    <textarea
                      className="w-full bg-surface border border-outline-variant/30 rounded-lg p-3 text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                      placeholder="Tell us more about your expertise..."
                      rows={3}
                      value={newSkillDescription}
                      onChange={(e) => setNewSkillDescription(e.target.value)}
                    />
                    {addSkill.isError && (
                      <p className="text-xs text-red-500">
                        {addSkill.error.message}
                      </p>
                    )}
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowAddSkill(false);
                          setNewSkillName("");
                          setNewSkillDescription("");
                          setNewSkillProficiency("Beginner");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        disabled={
                          addSkill.isPending ||
                          newSkillName.length < 2 ||
                          newSkillDescription.length < 10
                        }
                        onClick={() =>
                          addSkill.mutate({
                            skillName: newSkillName,
                            description: newSkillDescription,
                            proficiency: newSkillProficiency as
                              | "Beginner"
                              | "Intermediate"
                              | "Advanced"
                              | "Expert",
                          })
                        }
                      >
                        {addSkill.isPending ? "Adding..." : "Add"}
                      </Button>
                    </div>
                  </div>
                )}
              </section>

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
                    aria-label="Add learning goal"
                    onClick={() => setShowAddGoal(true)}
                    className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors p-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    add_circle
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {learnGoals.length === 0 && !showAddGoal && (
                    <p className="text-body-md text-on-surface-variant italic">
                      No learning goals yet
                    </p>
                  )}
                  {learnGoals.map((g) => (
                    <span
                      key={g.id}
                      className="inline-flex items-center gap-1 bg-tertiary/10 text-tertiary px-3 py-1.5 rounded-full text-body-md font-medium"
                    >
                      {g.skillName}
                      <button
                        type="button"
                        aria-label={`Remove ${g.skillName}`}
                        onClick={() => deleteGoal.mutate({ id: g.id })}
                        className="material-symbols-outlined text-[16px] leading-none hover:opacity-70 p-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      >
                        close
                      </button>
                    </span>
                  ))}
                </div>

                {showAddGoal && (
                  <div className="mt-4 p-4 bg-surface rounded-lg border border-outline-variant/20 space-y-3">
                    <input
                      className="w-full bg-transparent border-0 border-b-2 border-outline-variant py-2 text-body-md focus:border-primary focus:ring-0 outline-none"
                      placeholder="What do you want to learn?"
                      value={newGoalSkillName}
                      onChange={(e) => setNewGoalSkillName(e.target.value)}
                    />
                    <textarea
                      className="w-full bg-surface border border-outline-variant/30 rounded-lg p-3 text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                      placeholder="Describe your learning goal..."
                      rows={3}
                      value={newGoalText}
                      onChange={(e) => setNewGoalText(e.target.value)}
                    />
                    {addGoal.isError && (
                      <p className="text-xs text-red-500">
                        {addGoal.error.message}
                      </p>
                    )}
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowAddGoal(false);
                          setNewGoalSkillName("");
                          setNewGoalText("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        disabled={
                          addGoal.isPending ||
                          newGoalSkillName.length < 2 ||
                          newGoalText.length < 1
                        }
                        onClick={() =>
                          addGoal.mutate({
                            skillName: newGoalSkillName,
                            goalText: newGoalText,
                          })
                        }
                      >
                        {addGoal.isPending ? "Adding..." : "Add"}
                      </Button>
                    </div>
                  </div>
                )}
              </section>
            </div>

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
                      {grid.map((isActive, i) => {
                        const day = dayHeaders[i % 7];
                        const time = timeLabels[Math.floor(i / 7)];
                        return (
                          <button
                            key={i}
                            type="button"
                            aria-label={`Toggle ${day} at ${time}`}
                            onClick={() => toggleSlot(i)}
                            className={`h-10 rounded-sm transition-all active:scale-[0.97] border border-outline-variant/10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                              isActive
                                ? "bg-primary"
                                : "bg-surface-container-high"
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-label-caps font-label-caps text-on-surface-variant mt-4 italic">
                Click blocks to toggle your available meeting hours. All times
                are synced to your current timezone.
              </p>
            </section>

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
                <Button
                  variant="danger"
                  onClick={() => console.log("Account deactivation requested")}
                >
                  Deactivate Account
                </Button>
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
