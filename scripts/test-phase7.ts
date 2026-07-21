import { prisma } from "../src/lib/prisma";
import { createCallerFactory } from "../src/server/trpc";
import { appRouter } from "../src/server/routers/_app";

const createCaller = createCallerFactory(appRouter);

function caller(userId: string) {
  return createCaller({
    prisma,
    session: { user: { id: userId, name: "Test", email: "test@test.com", image: null } } as any,
  });
}

function publicCaller() {
  return createCaller({ prisma, session: null });
}

async function main() {
  console.log("=== PHASE 7: REVIEWS ===\n");

  // Create test users
  const learner = await prisma.user.create({
    data: { name: "Learner", email: `learner-${Date.now()}@test.com` },
  });
  const teacher = await prisma.user.create({
    data: { name: "Teacher", email: `teacher-${Date.now()}@test.com` },
  });

  // Give learner credits
  await prisma.creditLedgerEntry.create({
    data: { userId: learner.id, type: "SIGNUP_BONUS", amount: 5 },
  });

  // Create teach skill
  const skill = await prisma.teachSkill.create({
    data: { userId: teacher.id, skillName: "Test Skill", description: "Test", creditCost: 1 },
  });

  // Create availability
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const slotStart = new Date(tomorrow);
  slotStart.setHours(10, 0, 0, 0);
  const slotEnd = new Date(tomorrow);
  slotEnd.setHours(11, 0, 0, 0);

  const lc = caller(learner.id);
  const tc = caller(teacher.id);

  // Create + accept booking
  const booking = await lc.booking.create({
    teachSkillId: skill.id,
    teacherId: teacher.id,
    slotStart: slotStart.toISOString(),
    slotEnd: slotEnd.toISOString(),
  });

  await tc.booking.accept({ id: booking.id });

  // Complete the booking
  await lc.booking.complete({ id: booking.id });

  // ---- TEST 1: Review non-completed booking ----
  console.log("1. Attempt to review a CONFIRMED (not COMPLETED) booking...");
  const freshBooking = await lc.booking.create({
    teachSkillId: skill.id,
    teacherId: teacher.id,
    slotStart: new Date(slotStart.getTime() + 86400000).toISOString(),
    slotEnd: new Date(slotEnd.getTime() + 86400000).toISOString(),
  });
  await tc.booking.accept({ id: freshBooking.id });
  // freshBooking is CONFIRMED, not COMPLETED
  try {
    await lc.review.create({ bookingId: freshBooking.id, rating: 5, comment: "Great!" });
    console.log("  FAIL: Should have rejected non-completed booking\n");
  } catch (e: any) {
    console.log(`  PASS: Got ${e.code} — ${e.message}\n`);
  }

  // ---- TEST 2: Teacher tries to review their own teaching ----
  console.log("2. Attempt to review as the teacher (not learner)...");
  try {
    await tc.review.create({ bookingId: booking.id, rating: 5 });
    console.log("  FAIL: Should have rejected teacher review\n");
  } catch (e: any) {
    console.log(`  PASS: Got ${e.code} — ${e.message}\n`);
  }

  // ---- TEST 3: Submit a real review, then attempt duplicate ----
  console.log("3. Submit real review, then attempt duplicate on same booking...");
  const review = await lc.review.create({ bookingId: booking.id, rating: 4, comment: "Amazing session!" });
  console.log(`  First review created: id=${review.id}, rating=${review.rating}`);

  try {
    await lc.review.create({ bookingId: booking.id, rating: 5, comment: "Trying again" });
    console.log("  FAIL: Should have rejected duplicate review\n");
  } catch (e: any) {
    console.log(`  PASS: Got ${e.code} — ${e.message}\n`);
  }

  // ---- TEST 4: Teacher profile aggregate rating ----
  console.log("4. Teacher profile shows correct aggregate rating...");
  // Before (we had just created a 4-rating review)
  const before = await publicCaller().review.getForTeacher({ userId: teacher.id });
  console.log(`  Before: count=${before.aggregate.count}, average=${before.aggregate.average}`);

  // Add another review from a different learner
  const learner2 = await prisma.user.create({
    data: { name: "Learner2", email: `learner2-${Date.now()}@test.com` },
  });
  await prisma.creditLedgerEntry.create({
    data: { userId: learner2.id, type: "SIGNUP_BONUS", amount: 5 },
  });
  const skill2 = await prisma.teachSkill.create({
    data: { userId: teacher.id, skillName: "Another Skill", description: "Desc", creditCost: 1 },
  });
  const booking2 = await caller(learner2.id).booking.create({
    teachSkillId: skill2.id, teacherId: teacher.id,
    slotStart: new Date(slotStart.getTime() + 172800000).toISOString(),
    slotEnd: new Date(slotEnd.getTime() + 172800000).toISOString(),
  });
  await tc.booking.accept({ id: booking2.id });
  await caller(learner2.id).booking.complete({ id: booking2.id });
  await caller(learner2.id).review.create({ bookingId: booking2.id, rating: 5, comment: "Excellent!" });

  const after = await publicCaller().review.getForTeacher({ userId: teacher.id });
  console.log(`  After:  count=${after.aggregate.count}, average=${after.aggregate.average}`);

  if (after.aggregate.count === 2 && after.aggregate.average === 4.5) {
    console.log("  PASS: Aggregate correctly computed ((4+5)/2 = 4.5)\n");
  } else {
    console.log(`  FAIL: Expected count=2, average=4.5, got count=${after.aggregate.count}, average=${after.aggregate.average}\n`);
  }

  // ---- TEST 5: Reviewable bookings ----
  console.log("5. /dashboard/reviews (getReviewableBookings)...");

  // Create a booking for Learner 1 that is COMPLETED but NOT reviewed
  const skill3 = await prisma.teachSkill.create({
    data: { userId: teacher.id, skillName: "Third Skill", description: "Desc", creditCost: 1 },
  });
  const booking3 = await lc.booking.create({
    teachSkillId: skill3.id, teacherId: teacher.id,
    slotStart: new Date(slotStart.getTime() + 259200000).toISOString(),
    slotEnd: new Date(slotEnd.getTime() + 259200000).toISOString(),
  });
  await tc.booking.accept({ id: booking3.id });
  await lc.booking.complete({ id: booking3.id });
  // Do NOT review booking3

  // Learner 1's COMPLETED bookings: booking (reviewed), booking3 (unreviewed)
  // freshBooking is CONFIRMED (not COMPLETED) — not eligible
  const learner1Reviewable = await lc.review.getReviewableBookings();
  console.log(`  Learner 1 reviewable bookings: ${learner1Reviewable.length}`);
  console.log(`  Booking IDs: ${learner1Reviewable.map(b => b.id).join(", ")}`);

  // The reviewed booking should NOT be in the list
  const stillListed = learner1Reviewable.some(b => b.id === booking.id);
  if (stillListed) {
    console.log("  FAIL: Reviewed booking still in reviewable list\n");
  } else {
    console.log("  PASS: Reviewed booking removed from reviewable list\n");
  }

  // booking3 should be the only reviewable
  if (learner1Reviewable.length === 1 && learner1Reviewable[0].id === booking3.id) {
    console.log("  PASS: Exactly 1 unreviewed booking (booking3)\n");
  } else {
    console.log(`  FAIL: Expected 1 booking (booking3), got ${learner1Reviewable.length}\n`);
  }

  // Learner 1 also has sessions where they were the teacher — should NOT appear
  const learner1AsTeacherSkill = await prisma.teachSkill.create({
    data: { userId: learner.id, skillName: "L1 Skill", description: "Desc", creditCost: 1 },
  });
  const teachingBooking = await caller(learner2.id).booking.create({
    teachSkillId: learner1AsTeacherSkill.id, teacherId: learner.id,
    slotStart: new Date(slotStart.getTime() + 345600000).toISOString(),
    slotEnd: new Date(slotEnd.getTime() + 345600000).toISOString(),
  });
  await lc.booking.accept({ id: teachingBooking.id });
  await caller(learner2.id).booking.complete({ id: teachingBooking.id });
  // Learner 1 was the TEACHER here, should NOT appear in their reviewable

  const afterTeaching = await lc.review.getReviewableBookings();
  if (afterTeaching.length === 1 && afterTeaching[0].id === booking3.id) {
    console.log("  PASS: Teacher's own completed sessions-as-teacher not mixed in\n");
  } else {
    console.log(`  FAIL: Expected 1 reviewable (booking3), got ${afterTeaching.length}\n`);
  }

  // Learner 2 has 1 reviewable: teachingBooking (completed as learner, not reviewed)
  const learner2Reviewable = await caller(learner2.id).review.getReviewableBookings();
  console.log(`  Learner 2 reviewable bookings: ${learner2Reviewable.length}`);
  if (learner2Reviewable.length === 1 && learner2Reviewable[0].id === teachingBooking.id) {
    console.log("  PASS: Learner 2 correctly sees teachingBooking as reviewable\n");
  } else {
    console.log(`  FAIL: Learner 2 should have 1 reviewable (teachingBooking)\n`);
  }

  // ---- Cleanup ----
  await prisma.creditLedgerEntry.deleteMany({ where: { userId: { in: [learner.id, teacher.id, learner2.id] } } });
  await prisma.booking.deleteMany({ where: { teacherId: { in: [teacher.id, learner.id] } } });
  await prisma.user.deleteMany({ where: { id: { in: [learner.id, teacher.id, learner2.id] } } });

  console.log("=== ALL PHASE 7 TESTS COMPLETE ===");
}

main().catch((e) => {
  console.error("Test failed:", e);
  process.exit(1);
});
