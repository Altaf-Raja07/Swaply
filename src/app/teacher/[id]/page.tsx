import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { StarRating } from "@/components/shared/star-rating";
import { SkillChip } from "@/components/shared/skill-chip";
import { ReviewCard } from "@/components/shared/review-card";
import { Button } from "@/components/ui/button";

const skillsToLearn = [
  {
    title: "Editorial Layouts",
    description:
      "Master the grid systems and typography used in high-end digital and print magazines.",
    icon: "brush",
    iconBg: "bg-secondary-container",
    iconColor: "text-secondary",
    tags: ["Typography", "InDesign"],
  },
  {
    title: "Design Systems",
    description:
      "Building scalable components, tokenization, and documentation for growing teams.",
    icon: "data_object",
    iconBg: "bg-tertiary-container/30",
    iconColor: "text-tertiary",
    tags: ["Figma", "Architecture"],
  },
  {
    title: "Ceramic Forms",
    description:
      "Basics of wheel-throwing and hand-building. Understanding clay as a creative medium.",
    icon: "potted_plant",
    iconBg: "bg-primary-container/20",
    iconColor: "text-primary",
    tags: ["Tactile Craft", "Art"],
  },
];

const reviews = [
  {
    authorName: "Marcus Thorne",
    rating: 5,
    text: "Elena's approach to grid systems completely changed how I think about layout. She doesn't just teach tools; she teaches the philosophy behind the design.",
  },
  {
    authorName: "Sarah Chen",
    rating: 4,
    text: "Highly recommend for anyone wanting to mix digital design with physical craft. Super patient and insightful!",
  },
];

export default function TeacherProfilePage() {
  return (
    <>
      <Navbar activeTab="discover" />
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
        {/* Header / Bio Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-stack-lg">
          <div className="md:col-span-8 flex flex-col md:flex-row gap-stack-lg items-start">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-xl overflow-hidden editorial-border whisper-shadow flex-shrink-0 bg-surface-container-high" />
            <div className="flex flex-col gap-unit">
              <div className="flex items-center gap-stack-sm mb-unit">
                <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg text-on-surface">
                  Elena Vance
                </h1>
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </div>
              <p className="text-body-lg text-on-surface-variant max-w-2xl mb-stack-md">
                Digital Product Designer and Potter. I help creators bridge the
                gap between physical craft and digital systems. Over 10 years of
                experience in editorial design and brand identity.
              </p>
              <div className="flex flex-wrap gap-stack-md text-on-surface-variant">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">
                    schedule
                  </span>
                  <span className="text-label-caps">GMT+2 (Berlin)</span>
                </div>
                <StarRating rating={4.9} size="sm" showValue reviewCount={124} />
              </div>
            </div>
          </div>
          <div className="md:col-span-4 flex flex-col gap-stack-md items-end justify-start">
            <Button variant="primary" className="w-full md:w-auto">
              Book a session
            </Button>
            <Button variant="secondary" className="w-full md:w-auto">
              Message Elena
            </Button>
          </div>
        </section>

        {/* Skill Bento Grid */}
        <section className="mb-stack-lg">
          <div className="flex items-center justify-between mb-stack-md">
            <h2 className="text-headline-md font-headline-md text-on-surface">
              Skills to Learn
            </h2>
            <span className="text-label-caps text-primary cursor-pointer hover:underline">
              View All Curriculum
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {skillsToLearn.map((skill) => (
              <div
                key={skill.title}
                className="group p-stack-lg bg-surface-container-low rounded-xl editorial-border whisper-shadow cursor-pointer transition-all hover:bg-surface-container duration-300"
              >
                <div className="flex justify-between items-start mb-stack-md">
                  <div
                    className={`p-2 ${skill.iconBg} rounded-lg`}
                  >
                    <span
                      className={`material-symbols-outlined ${skill.iconColor}`}
                    >
                      {skill.icon}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-outline transition-transform group-hover:rotate-45">
                    arrow_outward
                  </span>
                </div>
                <h3 className="text-headline-md font-headline-md text-on-surface mb-stack-sm">
                  {skill.title}
                </h3>
                <p className="text-body-md text-on-surface-variant mb-stack-md">
                  {skill.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {skill.tags.map((tag) => (
                    <SkillChip key={tag} label={tag} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Availability & Reviews Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* Calendar Preview */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl editorial-border whisper-shadow p-stack-lg overflow-hidden">
            <div className="flex justify-between items-center mb-stack-lg">
              <h2 className="text-headline-md font-headline-md text-on-surface">
                Weekly Availability
              </h2>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="rounded-full">
                  <span className="material-symbols-outlined">chevron_left</span>
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full">
                  <span className="material-symbols-outlined">chevron_right</span>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center mb-stack-sm">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} className="text-label-caps text-outline">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }, (_, i) => {
                const day = 12 + i;
                const hasSlot = [13, 15].includes(day);
                const slotCount = day === 13 ? 2 : day === 15 ? 1 : 0;
                const isWeekend = i >= 5;
                return (
                  <div
                    key={day}
                    className={`h-24 rounded-lg flex flex-col items-center justify-center gap-1 ${
                      isWeekend
                        ? "bg-surface-container-highest/20"
                        : hasSlot
                        ? "bg-primary-container/5 border border-primary/20 relative overflow-hidden"
                        : "bg-surface-container rounded-lg opacity-50"
                    }`}
                  >
                    {hasSlot && (
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-primary" />
                    )}
                    <span className="text-label-caps text-on-surface">
                      {day}
                    </span>
                    {slotCount > 0 && (
                      <div className="px-1 py-0.5 bg-primary text-[10px] text-on-primary rounded font-bold uppercase">
                        {slotCount} {slotCount === 1 ? "Slot" : "Slots"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-stack-md text-label-caps text-on-surface-variant italic text-center">
              Next available session: Tomorrow at 14:00 (GMT+2)
            </p>
          </div>

          {/* Reviews */}
          <div className="lg:col-span-5 flex flex-col gap-stack-md">
            <h2 className="text-headline-md font-headline-md text-on-surface">
              Recent Reviews
            </h2>
            {reviews.map((review) => (
              <ReviewCard key={review.authorName} {...review} />
            ))}
            <Button variant="ghost" className="w-full">
              Read all 124 reviews
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
