"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { TeacherCard } from "@/components/shared/teacher-card";
import { CreditBadge } from "@/components/shared/credit-badge";
import { Button } from "@/components/ui/button";

const teachers = [
  {
    name: "Elena Moretti",
    avatarSrc: "/images/avatars/avatar-2.png",
    rating: 4.9,
    reviewCount: 128,
    skills: ["Pottery", "Sculpting", "Glazing"],
    matchNote:
      "\"Match for your interest in **Hand-built Ceramics**. Elena specializes in the rustic aesthetic you mentioned in your profile.\"",
  },
  {
    name: "Julian Chen",
    avatarSrc: "/images/avatars/avatar-23.png",
    rating: 5.0,
    reviewCount: 42,
    skills: ["Python", "Data Science"],
    matchNote:
      "\"Match for your **Recent Search**. Julian focuses on beginner-friendly automation, perfect for your career transition.\"",
  },
  {
    name: "Sarah Jenkins",
    avatarSrc: "/images/avatars/avatar-9.png",
    rating: 4.8,
    reviewCount: 95,
    skills: ["Gardening", "Herbalism", "Composting"],
    matchNote:
      "\"Match for your **Location**. Sarah lives only 2 miles away and hosts weekend workshops at the community garden.\"",
  },
  {
    name: "Marco Rossi",
    avatarSrc: "/images/avatars/avatar-17.png",
    rating: 4.9,
    reviewCount: 210,
    skills: ["Bread Making", "Pasta"],
    matchNote:
      "\"Match for **Sourdough Search**. Marco is highly rated for teaching the 'No-Knead' method you were looking for.\"",
  },
];

const mobileTeachers = [
  {
    name: "Elena Moretti",
    avatarSrc: "/images/avatars/avatar-1.png",
    subtitle: "Master Potter & Ceramicist",
    rating: 4.9,
    skills: ["Pottery", "Sculpting"],
    location: "Florence, Italy",
    rate: "1 Credit / hr",
  },
  {
    name: "Arthur Vance",
    avatarSrc: "/images/avatars/avatar-23.png",
    subtitle: "Creative Writing & Philology",
    rating: 5.0,
    skills: ["Writing", "Latin"],
    location: "Oxford, UK",
    rate: "2 Credits / hr",
  },
];

const popularTopics = [
  { name: "Culinary Arts", icon: "restaurant", bg: "bg-surface-container", color: "text-secondary" },
  { name: "Fine Painting", icon: "brush", bg: "bg-tertiary-fixed", color: "text-on-tertiary-fixed" },
  { name: "Web Dev", icon: "code", bg: "bg-primary-fixed", color: "text-on-primary-fixed" },
  { name: "Philosophy", icon: "psychology", bg: "bg-surface-container-high", color: "text-on-surface-variant" },
];

export default function DiscoverPage() {
  const [gridView, setGridView] = useState(true);

  return (
    <>
      <Navbar activeTab="discover" />
      <main className="pt-24 pb-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        {/* Desktop Hero Search */}
        <section className="mb-stack-lg hidden md:block">
          <div className="max-w-3xl mx-auto text-center mb-stack-lg">
            <h1 className="text-display-lg font-display-lg mb-4 text-on-surface">
              Find your next mentor
            </h1>
            <p className="text-body-lg text-on-surface-variant">
              Connect with community experts to learn skills through direct,
              human interaction.
            </p>
          </div>
          <div className="max-w-2xl mx-auto relative flex items-center gap-3">
            <span className="material-symbols-outlined text-primary/60 shrink-0">
              auto_awesome
            </span>
            <label className="sr-only">Search mentors</label>
            <input
              className="w-full bg-transparent focus:ring-0 text-body-md py-3 placeholder:text-outline/60 border-b border-outline-variant/20 focus:border-primary/60 transition-colors"
              placeholder="I want to learn sourdough baking..."
              type="text"
              autoComplete="off"
            />
            <Button variant="primary" onClick={() => console.log("Search")}>
              Search
            </Button>
          </div>
        </section>

        {/* Mobile Search Header */}
        <section className="md:hidden mb-stack-lg space-y-4">
          <h1 className="text-display-lg-mobile font-display-lg-mobile text-on-surface">
            Find your next <br />
            <span className="text-primary italic">breakthrough</span>.
          </h1>
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-primary">search</span>
            </div>
            <label className="sr-only">Search mentors</label>
            <input
              className="w-full h-14 pl-12 pr-4 bg-surface-container-low border-b-2 border-outline-variant focus:border-primary focus:ring-0 transition-all text-body-lg font-body-lg placeholder-on-surface-variant/40 rounded-t-lg"
              placeholder="I want to learn acoustic guitar theory..."
              type="text"
              autoComplete="off"
            />
            <Button variant="secondary" size="sm" className="absolute right-2 top-2" onClick={() => console.log("Ask AI")}>
              ASK AI
            </Button>
          </div>
          {/* Mobile Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scroll-hide">
            {["All Skills", "Gardening", "Pottery", "Web Design", "Baking"].map(
              (chip) => (
                <Button
                  key={chip}
                  variant={chip === "All Skills" ? "secondary-container" : "ghost"}
                  className={`flex-shrink-0 rounded-full border text-label-caps font-label-caps ${
                    chip === "All Skills"
                      ? "border-secondary/10"
                      : "border-outline-variant/30 bg-surface-container-high"
                  }`}
                  onClick={() => console.log(`Filter by ${chip}`)}
                >
                  {chip}
                </Button>
              )
            )}
          </div>
        </section>

        {/* Desktop Filters and View Toggle */}
        <section className="hidden md:flex flex-col md:flex-row justify-between items-start md:items-center gap-gutter mb-stack-lg border-b border-outline-variant/20 pb-stack-md">
          <div className="flex flex-wrap gap-stack-sm items-center">
            <span className="text-label-caps text-outline uppercase mr-2">
              Filter by:
            </span>
            {["Skill: All", "Rating", "Credits", "Availability"].map(
              (filter) => (
                <Button
                  key={filter}
                  variant={filter === "Skill: All" ? "secondary-container" : "ghost"}
                  className={`rounded-full text-label-caps flex items-center gap-1 ${
                    filter === "Skill: All"
                      ? ""
                      : "bg-surface-container-high"
                  }`}
                  onClick={() => console.log(`Filter by ${filter}`)}
                >
                  {filter}{" "}
                  <span className="material-symbols-outlined text-[16px]">
                    expand_more
                  </span>
                </Button>
              )
            )}
          </div>
          <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant/30 self-end md:self-auto">
            <Button
              variant={gridView ? "primary" : "ghost"}
              className={`p-2 rounded-md material-symbols-outlined ${
                gridView ? "bg-white shadow-sm text-primary" : ""
              }`}
              onClick={() => setGridView(true)}
            >
              grid_view
            </Button>
            <Button
              variant={!gridView ? "primary" : "ghost"}
              className={`p-2 rounded-md material-symbols-outlined ${
                !gridView ? "bg-white shadow-sm text-primary" : ""
              }`}
              onClick={() => setGridView(false)}
            >
              view_list
            </Button>
          </div>
        </section>

        {/* Teacher Grid - Desktop */}
        {teachers.length > 0 ? (
          <ul
            className={`hidden md:grid gap-gutter list-none ${
              gridView
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {teachers.map((teacher) => (
              <li key={teacher.name}>
                <TeacherCard {...teacher} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="hidden md:block text-center text-on-surface-variant py-8">No mentors found. Try adjusting your search.</p>
        )}

        {/* Mobile Teacher List */}
        <section className="md:hidden space-y-stack-md">
          <div className="flex justify-between items-end">
            <h2 className="text-headline-md font-headline-md text-on-surface">
              Recommended for you
            </h2>
            <Button variant="ghost" size="sm" className="underline text-secondary" onClick={() => console.log("View map")}>
              View Maps
            </Button>
          </div>

          {mobileTeachers.length > 0 ? (
            <ul className="space-y-stack-md">
              {mobileTeachers.map((t) => (
                <li key={t.name}>
                  <article className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-stack-md whisper-shadow flex flex-col gap-4">
                    <div className="flex gap-4">
                      <img src={t.avatarSrc || "/images/avatars/avatar-1.png"} alt={t.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-headline-md font-headline-md text-on-surface leading-tight">
                            {t.name}
                          </h3>
                          <div className="flex items-center gap-1 text-tertiary">
                            <span
                              className="material-symbols-outlined text-[16px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              star
                            </span>
                            <span className="text-label-caps font-label-caps">
                              {t.rating}
                            </span>
                          </div>
                        </div>
                        <p className="text-body-md font-body-md text-on-surface-variant">
                          {t.subtitle}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {t.skills.map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 bg-secondary/10 text-secondary rounded-full text-[10px] font-bold uppercase tracking-wider"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-outline-variant/20 pt-4 flex justify-between items-center">
                      <div className="flex items-center gap-1 text-on-surface-variant">
                        <span className="material-symbols-outlined text-lg">location_on</span>
                        <span className="text-label-caps font-label-caps">{t.location}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-label-caps font-label-caps text-on-surface-variant">
                          Exchange Rate
                        </span>
                        <span className="text-primary font-bold">{t.rate}</span>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-on-surface-variant py-8">No mentors found.</p>
          )}

          {/* Featured Masterclass Card */}
          <div className="relative bg-inverse-surface rounded-xl p-6 text-white overflow-hidden whisper-shadow">
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-label-caps font-label-caps bg-primary/20 text-primary-fixed-dim px-2 py-1 rounded">
                    MASTERCLASS
                  </span>
                  <h3 className="text-headline-md font-headline-md mt-2">
                    Organic Gardening with Marcus
                  </h3>
                </div>
                <div className="bg-tertiary w-10 h-10 rounded-full flex items-center justify-center border border-white/20">
                  <span className="material-symbols-outlined text-white">local_florist</span>
                </div>
              </div>
              <p className="text-body-md text-outline-variant line-clamp-2">
                Learn the secrets of soil health and seasonal rotations in this
                intensive 1-on-1 series.
              </p>
              <Button variant="primary" className="w-full shadow-lg" onClick={() => console.log("Request session")}>
                Request Session
              </Button>
            </div>
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
              <div className="w-full h-full bg-gradient-to-l from-primary to-transparent" />
            </div>
          </div>
        </section>

        {/* Popular Topics - Mobile */}
        <section className="md:hidden mt-stack-lg space-y-stack-md">
          <h2 className="text-headline-md font-headline-md text-on-surface">
            Popular Topics
          </h2>
          {popularTopics.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3">
              {popularTopics.map((topic) => (
                <li key={topic.name}>
                  <article className={`${topic.bg} h-32 rounded-xl p-4 flex flex-col justify-between border border-outline-variant/20`}>
                    <span
                      className={`material-symbols-outlined text-3xl ${topic.color}`}
                    >
                      {topic.icon}
                    </span>
                    <span className="text-label-caps font-label-caps text-on-surface">
                      {topic.name}
                    </span>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-on-surface-variant py-8">No topics available.</p>
          )}
        </section>

        {/* Load More - Desktop */}
        <div className="mt-stack-lg flex justify-center hidden md:flex">
          <Button variant="link" className="px-8 py-3 border border-secondary text-secondary hover:bg-secondary/5" onClick={() => console.log("Load more")}>
            Load More Mentors
          </Button>
        </div>
      </main>
      <BottomNav activeTab="discover" />
      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  );
}
