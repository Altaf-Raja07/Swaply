"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { ReviewModal } from "@/components/shared/review-modal";

const pastSessions = [
  {
    id: 1,
    title: "Morning Wheel Session",
    category: "Pottery Basics",
    mentor: "Clara M.",
    description:
      "Guided by Clara M. in her East Side studio. You spent 2 hours learning centering techniques.",
    imagePosition: "left",
  },
  {
    id: 2,
    title: "Handmade Pasta Workshop",
    category: "Culinary Arts",
    mentor: "Marco Rossi",
    description:
      "A 3-hour deep dive into semolina flour and egg-based doughs. You mastered the tajarin cut.",
    imagePosition: "right",
  },
];

export default function ReviewsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState("");

  const openReview = (mentor: string) => {
    setSelectedMentor(mentor);
    setModalOpen(true);
  };

  return (
    <>
      <Navbar activeTab="dashboard" />
      <main className="pt-24 pb-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-screen">
        <div className="flex flex-col gap-stack-lg">
          <section className="flex flex-col gap-unit">
            <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg text-on-surface">
              Your Recent Exchanges
            </h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl">
              Reflect on the skills you&apos;ve gained and the people
              you&apos;ve met. Every review helps our community grow stronger.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            {/* Session Card 1 */}
            <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant/20 whisper-shadow flex flex-col md:flex-row gap-stack-lg">
              <img src="/images/illustrations/illustration-2.png" alt="Pasta ingredients" className="w-full h-full object-cover rounded-lg" />
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-unit mb-2">
                    <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-label-caps font-label-caps">
                      {pastSessions[0].category}
                    </span>
                  </div>
                  <h3 className="text-headline-md font-headline-md text-on-surface mb-2">
                    {pastSessions[0].title}
                  </h3>
                  <p className="text-body-md font-body-md text-on-surface-variant">
                    {pastSessions[0].description}
                  </p>
                </div>
                <Button
                  variant="primary"
                  className="mt-stack-md w-fit"
                  onClick={() => openReview(pastSessions[0].mentor)}
                >
                  Review Session
                </Button>
              </div>
            </div>

            {/* Sidebar Card */}
            <div className="md:col-span-4 bg-tertiary-container/10 rounded-xl p-stack-lg border border-tertiary-container/30 flex flex-col justify-center items-center text-center">
              <span
                className="material-symbols-outlined text-tertiary text-5xl mb-stack-md"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                volunteer_activism
              </span>
              <h4 className="text-headline-md font-headline-md text-on-tertiary-container">
                Community Impact
              </h4>
              <p className="text-body-md font-body-md text-on-tertiary-container/80 mt-2">
                You&apos;ve shared 48 hours of knowledge this year.
              </p>
            </div>

            {/* Session Card 2 */}
            <div className="md:col-span-12 bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant/20 whisper-shadow flex flex-col md:flex-row-reverse gap-stack-lg">
              <img src="/images/illustrations/illustration-9.png" alt="Terracotta clay" className="w-full h-full object-cover rounded-lg" />
              <div className="flex flex-col justify-center flex-1">
                <div className="flex items-center gap-unit mb-2">
                  <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-label-caps font-label-caps">
                    {pastSessions[1].category}
                  </span>
                </div>
                <h3 className="text-headline-md font-headline-md text-on-surface mb-2">
                  {pastSessions[1].title}
                </h3>
                <p className="text-body-md font-body-md text-on-surface-variant">
                  {pastSessions[1].description}
                </p>
                <Button
                  variant="secondary"
                  className="mt-stack-md w-fit"
                  onClick={() => openReview(pastSessions[1].mentor)}
                >
                  Write Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ReviewModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mentorName={selectedMentor}
      />

      <BottomNav activeTab="dashboard" />
      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  );
}
