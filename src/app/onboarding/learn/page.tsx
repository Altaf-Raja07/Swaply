import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function OnboardingLearnPage() {
  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col selection:bg-primary-fixed selection:text-on-primary-fixed">
      <main className="flex-grow flex items-center justify-center px-margin-mobile md:px-margin-desktop py-stack-lg max-w-container-max mx-auto">
        <div className="w-full max-w-container-max flex flex-col md:flex-row items-center gap-gutter lg:gap-32">
          {/* Left Column: Context & Intent */}
          <div className="w-full md:w-1/2 space-y-stack-md order-2 md:order-1">
            <div className="space-y-unit">
              <span className="text-label-caps font-label-caps text-primary tracking-widest">
                STEP 2 OF 4
              </span>
              <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg text-on-surface">
                What do you want to learn?
              </h1>
            </div>
            <p className="text-body-lg font-body-lg text-on-surface-variant max-w-lg">
              SkillSwap is built on precise semantic matching. Tell us exactly
              what&apos;s on your mind&mdash;the more specific you are, the
              better we can find your ideal mentor.
            </p>

            {/* Recommendation Preview (Desktop only) */}
            <div className="pt-stack-lg space-y-stack-md hidden md:block">
              <span className="text-label-caps font-label-caps text-outline">
                POPULAR RIGHT NOW
              </span>
              <div className="flex flex-wrap gap-stack-sm">
                {[
                  "Generative AI",
                  "Bread Baking",
                  "Rust Programming",
                  "Negotiation Tactics",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="bg-secondary/10 text-secondary px-stack-md py-unit rounded-full text-label-caps font-label-caps cursor-pointer hover:bg-secondary-container transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: The Search Canvas */}
          <div className="w-full md:w-1/2 order-1 md:order-2">
            <div className="relative group">
              {/* Atmospheric Glow Effect */}
              <div className="absolute -inset-4 bg-primary/5 rounded-[32px] blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="relative bg-surface-container-lowest border border-outline-variant/30 rounded-[24px] p-stack-lg whisper-shadow transition-all">
                <div className="flex items-start gap-stack-md mb-stack-md">
                  <span
                    className="material-symbols-outlined text-primary text-[32px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    auto_awesome
                  </span>
                  <div className="flex-grow">
                    <label className="text-label-caps font-label-caps text-outline mb-unit block">
                      SMART SEARCH
                    </label>
                    <textarea
                      className="w-full bg-transparent border-0 p-0 text-headline-md font-headline-md text-on-surface placeholder:text-outline-variant focus:ring-0 resize-none overflow-hidden"
                      placeholder="I want to get better at explaining my DSA solutions in interviews"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Match Feedback UI */}
                <div className="flex items-center gap-stack-sm py-stack-sm border-t border-outline-variant/10 opacity-0 transition-opacity duration-300">
                  <span className="material-symbols-outlined text-secondary text-sm">
                    check_circle
                  </span>
                  <span className="text-label-caps font-label-caps text-secondary">
                    WE&apos;VE FOUND 14 MENTORS MATCHING THIS DESCRIPTION
                  </span>
                </div>

                <div className="flex justify-between items-center mt-stack-md">
                  <div className="flex -space-x-2">
                    <img src="/images/avatars/avatar-25.png" alt="Mentor" className="w-8 h-8 rounded-full border-2 border-surface object-cover" />
                    <img src="/images/avatars/avatar-7.png" alt="Mentor" className="w-8 h-8 rounded-full border-2 border-surface object-cover" />
                    <div className="w-8 h-8 rounded-full border-2 border-surface bg-tertiary-fixed flex items-center justify-center text-[10px] font-bold text-on-tertiary-fixed">
                      +12
                    </div>
                  </div>
                  <Button>
                    Continue
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </Button>
                </div>
              </div>

              {/* Floating Credit Badge */}
              <div className="absolute -top-4 -right-4 bg-tertiary-container text-on-tertiary-container w-16 h-16 rounded-full flex flex-col items-center justify-center whisper-shadow border border-tertiary/20 transform rotate-12">
                <span className="text-label-caps font-label-caps text-[10px]">
                  GET
                </span>
                <span className="font-bold text-lg leading-none">12</span>
                <span className="text-label-caps font-label-caps text-[8px]">
                  CREDITS
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
