"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { ReviewModal } from "@/components/shared/review-modal";
import { trpc } from "@/lib/trpc/client";

export default function ReviewsPage() {
  const utils = trpc.useUtils();
  const { data: reviewableBookings, isLoading } =
    trpc.review.getReviewableBookings.useQuery();
  const reviewMutation = trpc.review.create.useMutation({
    onSuccess: () => {
      utils.review.getReviewableBookings.invalidate();
    },
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<{
    id: string;
    mentorName: string;
  } | null>(null);

  const openReview = (bookingId: string, mentorName: string) => {
    setSelectedBooking({ id: bookingId, mentorName });
    setModalOpen(true);
  };

  const handleSubmitReview = async (data: {
    rating: number;
    comment: string;
  }) => {
    if (!selectedBooking) return;
    await reviewMutation.mutateAsync({
      bookingId: selectedBooking.id,
      rating: data.rating,
      comment: data.comment,
    });
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

          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-body-md text-on-surface-variant">
                Loading...
              </p>
            </div>
          ) : !reviewableBookings || reviewableBookings.length === 0 ? (
            <div className="text-center py-16 px-4">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-stack-md block">
                rate_review
              </span>
              <h2 className="text-headline-md font-headline-md text-on-surface mb-2">
                No exchanges to review yet
              </h2>
              <p className="text-body-md font-body-md text-on-surface-variant max-w-md mx-auto">
                You haven&apos;t completed any sessions yet. Book your first
                session and come back here to share your experience.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              {reviewableBookings.map((booking, i) => {
                const isLeftImage = i % 2 === 0;
                return (
                  <article
                    key={booking.id}
                    className={
                      isLeftImage
                        ? "md:col-span-8 bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant/20 whisper-shadow flex flex-col md:flex-row gap-stack-lg"
                        : "md:col-span-12 bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant/20 whisper-shadow flex flex-col md:flex-row-reverse gap-stack-lg"
                    }
                  >
                    <img
                      src={`/images/illustrations/illustration-${(i % 12) + 1}.png`}
                      alt={booking.teachSkill.skillName}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div
                      className={
                        isLeftImage
                          ? "flex flex-col justify-between"
                          : "flex flex-col justify-center flex-1"
                      }
                    >
                      <div>
                        <div className="flex items-center gap-unit mb-2">
                          <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-label-caps font-label-caps">
                            {booking.teachSkill.proficiency ?? "Skill"}
                          </span>
                        </div>
                        <h3 className="text-headline-md font-headline-md text-on-surface mb-2">
                          {booking.teachSkill.skillName}
                        </h3>
                        <p className="text-body-md font-body-md text-on-surface-variant">
                          Session with{" "}
                          <span className="font-semibold">
                            {booking.teacher.name ?? "your mentor"}
                          </span>
                        </p>
                      </div>
                      <Button
                        variant={isLeftImage ? "primary" : "secondary"}
                        className="mt-stack-md w-fit"
                        onClick={() =>
                          openReview(
                            booking.id,
                            booking.teacher.name ?? "your mentor",
                          )
                        }
                      >
                        Review Session
                      </Button>
                    </div>
                  </article>
                );
              })}

              <div className="md:col-span-4 bg-tertiary-container/10 rounded-xl p-stack-lg border border-tertiary-container/30 flex flex-col justify-center items-center text-center">
                <span
                  className="material-symbols-outlined text-tertiary text-5xl mb-stack-md"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  volunteer_activism
                </span>
                <h3 className="text-headline-md font-headline-md text-on-tertiary-container">
                  Community Impact
                </h3>
                <p className="text-body-md font-body-md text-on-tertiary-container/80 mt-2">
                  You&apos;ve shared knowledge and grown together.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <ReviewModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setSelectedBooking(null);
        }}
        mentorName={selectedBooking?.mentorName ?? ""}
        onSubmit={handleSubmitReview}
      />

      <BottomNav activeTab="dashboard" />
      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  );
}
