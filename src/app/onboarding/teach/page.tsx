"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";

export default function OnboardingTeachPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addSkill = trpc.teachSkill.add.useMutation({
    onSuccess: () => router.push("/onboarding/learn"),
  });

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col selection:bg-primary-fixed selection:text-on-primary-fixed">
      <main className="flex-grow flex items-center justify-center px-margin-mobile md:px-margin-desktop py-stack-lg max-w-container-max mx-auto">
        <div className="max-w-[800px] w-full grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
          {/* Branding/Identity Anchor */}
          <div className="md:col-span-12 mb-stack-lg">
            <div className="flex items-center gap-stack-sm mb-stack-md">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-on-primary">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  school
                </span>
              </div>
              <span className="text-headline-md font-headline-md font-bold text-primary">
                SkillSwap
              </span>
            </div>
            <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-primary w-1/2 transition-all duration-700 ease-out" />
            </div>
            <p className="mt-stack-sm text-label-caps font-label-caps text-on-surface-variant">
              Step 1 of 2: The Teacher&apos;s Journey
            </p>
          </div>

          {/* Left Editorial Column (Desktop only) */}
          <div className="hidden md:flex md:col-span-4 flex-col gap-stack-md sticky top-stack-lg">
            <h1 className="text-display-lg font-display-lg text-on-surface leading-tight">
              What can you teach?
            </h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant">
              Your expertise is a gift. Whether it&apos;s heirloom gardening or
              architectural drafting, there&apos;s someone in our community
              waiting to learn from you.
            </p>
            <div className="mt-stack-lg p-stack-md bg-secondary-container rounded-xl border border-outline-variant/20">
              <div className="flex items-start gap-stack-sm">
                <span className="material-symbols-outlined text-on-secondary-container">
                  tips_and_updates
                </span>
                <div>
                  <p className="text-label-caps font-label-caps text-on-secondary-container mb-unit">
                    PRO TIP
                  </p>
                  <p className="text-body-md font-body-md text-on-secondary-container">
                    Be specific! Instead of just &ldquo;Cooking,&rdquo; try
                    &ldquo;Traditional Sourdough Baking.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Canvas */}
          <div className="md:col-span-8 w-full">
            <form
              className="bg-white p-stack-lg rounded-[16px] border border-outline-variant/30 whisper-shadow flex flex-col gap-stack-lg"
              onSubmit={(e) => {
                e.preventDefault();
                const newErrors: Record<string, string> = {};
                const skillName = (
                  document.getElementById("skill-name") as HTMLInputElement
                )?.value.trim();
                const description = (
                  document.getElementById("skill-description") as HTMLTextAreaElement
                )?.value.trim();
                const proficiencyInput = document.querySelector(
                  'input[name="proficiency"]:checked'
                ) as HTMLInputElement;
                const proficiency = proficiencyInput?.value || "Beginner";
                if (!skillName || skillName.length < 2)
                  newErrors.skillName =
                    "Skill name must be at least 2 characters";
                if (!description || description.length < 10)
                  newErrors.description =
                    "Description must be at least 10 characters";
                setErrors(newErrors);
                if (Object.keys(newErrors).length > 0) return;

                addSkill.mutate({
                  skillName,
                  description,
                  proficiency: proficiency as "Beginner" | "Intermediate" | "Advanced" | "Expert",
                });
              }}
            >
              {/* Mobile Header */}
              <div className="md:hidden">
                <h2 className="text-display-lg-mobile font-display-lg-mobile text-on-surface mb-stack-sm">
                  What can you teach?
                </h2>
              </div>

              {/* Input: Skill Name */}
              <div className="flex flex-col gap-unit">
                <label
                  htmlFor="skill-name"
                  className="text-label-caps font-label-caps text-on-surface-variant"
                >
                  SKILL NAME
                </label>
                <input
                  id="skill-name"
                  className="w-full bg-transparent border-0 border-b-2 border-outline-variant py-stack-sm px-0 text-headline-md font-headline-md focus:ring-0 focus:border-primary transition-colors placeholder:text-surface-variant"
                  placeholder="e.g., Landscape Photography"
                  type="text"
                  required
                  minLength={2}
                />
                {errors.skillName && (
                  <p className="text-xs text-red-500">{errors.skillName}</p>
                )}
              </div>

              {/* Segmented Control: Proficiency */}
              <div className="flex flex-col gap-stack-md">
                <label className="text-label-caps font-label-caps text-on-surface-variant">
                  PROFICIENCY LEVEL
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-stack-sm bg-surface-container-low p-unit rounded-lg">
                  {["Beginner", "Intermediate", "Advanced", "Expert"].map(
                    (level) => (
                      <label
                        key={level}
                        className="relative flex items-center justify-center cursor-pointer group"
                      >
                        <input
                          className="peer sr-only"
                          name="proficiency"
                          type="radio"
                          value={level}
                          defaultChecked={level === "Beginner"}
                        />
                        <div className="w-full py-stack-sm px-stack-md rounded-lg text-center font-medium text-on-surface-variant peer-checked:bg-white peer-checked:text-primary peer-checked:shadow-sm transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-primary">
                          {level}
                        </div>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Free Text Description */}
              <div className="flex flex-col gap-unit">
                <label
                  htmlFor="skill-description"
                  className="text-label-caps font-label-caps text-on-surface-variant"
                >
                  TELL US MORE
                </label>
                <textarea
                  id="skill-description"
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-stack-md text-body-md font-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:italic placeholder:opacity-50"
                  placeholder="Example: I've been a nature photographer for 10 years. I can teach you how to master manual settings..."
                  rows={5}
                  required
                  minLength={10}
                />
                {errors.description && (
                  <p className="text-xs text-red-500">{errors.description}</p>
                )}
              </div>

              {addSkill.isError && (
                <p className="text-xs text-red-500">
                  {addSkill.error.message}
                </p>
              )}

              {/* Call to Action Footer */}
              <div className="flex items-center justify-between mt-stack-md border-t border-outline-variant/20 pt-stack-lg">
                <Button type="button" variant="ghost" onClick={() => router.push("/login")}>
                  Back
                </Button>
                <Button type="submit" disabled={addSkill.isPending}>
                  {addSkill.isPending ? "Saving..." : "Next Step"}
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </Button>
              </div>
            </form>

            {/* Decorative Asset */}
            <div className="mt-stack-lg w-full aspect-[21/9] rounded-[16px] overflow-hidden grayscale-[50%] hover:grayscale-0 transition-all duration-1000">
              <img src="/images/illustrations/illustration-11.png" alt="Communal workshop" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
