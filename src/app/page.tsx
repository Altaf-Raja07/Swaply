import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { TerracottaGrain } from "@/components/ui/terracotta-grain";

export default function Home() {
  return (
    <>
      <Navbar activeTab="discover" />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 md:pt-24 pb-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg items-center">
            <div className="z-10">
              <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg text-on-surface mb-stack-md">
                Teach what you know.
                <br />
                <span className="text-primary">Learn what you don&apos;t.</span>
              </h1>
              <p className="text-body-lg font-body-lg text-on-surface-variant mb-stack-lg max-w-[500px]">
                Join a local community of creators, experts, and lifelong
                learners. Exchange skills directly through our credit-based
                bulletin, moving beyond digital noise into tactile learning.
              </p>
              <div className="flex flex-wrap gap-stack-md">
                <Button variant="primary" size="lg">
                  Start swapping skills
                </Button>
                <Button variant="secondary" size="lg">
                  How it works
                </Button>
              </div>
            </div>
            <div className="relative flex justify-center items-center h-[400px] md:h-[500px]">
              <div className="absolute inset-0 terracotta-grain opacity-30 pointer-events-none" />
              <div className="relative w-full h-full flex items-center justify-center">
                {/* TODO: Replace with actual illustration */}
                <div className="w-full h-full bg-surface-container-high rounded-2xl flex items-center justify-center text-on-surface-variant text-label-caps">
                  Illustration: The Exchange Loop
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Categories */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="mb-stack-lg flex justify-between items-end">
            <div>
              <span className="text-label-caps font-label-caps text-secondary tracking-widest">
                CURATED SKILLS
              </span>
              <h2 className="text-headline-md font-headline-md mt-2">
                Explore the Bulletin
              </h2>
            </div>
            <a
              href="#"
              className="text-primary font-button text-button flex items-center gap-1 group"
            >
              View all categories
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-gutter">
            {/* Coding: Big Card */}
            <div className="col-span-2 row-span-1 md:row-span-2 group cursor-pointer bg-white border border-outline-variant/30 rounded-xl overflow-hidden whisper-shadow active-press">
              <div className="h-48 md:h-80 relative overflow-hidden">
                {/* TODO: Replace with actual image */}
                <div className="w-full h-full bg-surface-container-high group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="bg-secondary/80 text-white text-[10px] px-2 py-0.5 rounded-full font-label-caps inline-block mb-2">
                    HOT SKILL
                  </div>
                  <h3 className="text-headline-md font-headline-md">
                    Software Engineering
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-body-md text-on-surface-variant line-clamp-2">
                  Master Python, React, or System Design through peer-to-peer
                  code reviews and pair programming sessions.
                </p>
              </div>
            </div>

            {/* Music */}
            <div className="col-span-2 md:col-span-1 group cursor-pointer bg-white border border-outline-variant/30 rounded-xl overflow-hidden whisper-shadow active-press">
              <div className="h-32 relative overflow-hidden">
                {/* TODO: Replace with actual image */}
                <div className="w-full h-full bg-surface-container-high group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h3 className="text-body-lg font-headline-md mb-2">Music</h3>
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-secondary/10 text-secondary text-[11px] px-3 py-1 rounded-full font-bold">
                    Guitar
                  </span>
                  <span className="bg-secondary/10 text-secondary text-[11px] px-3 py-1 rounded-full font-bold">
                    Theory
                  </span>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="col-span-2 md:col-span-1 group cursor-pointer bg-white border border-outline-variant/30 rounded-xl overflow-hidden whisper-shadow active-press">
              <div className="h-32 relative overflow-hidden">
                {/* TODO: Replace with actual image */}
                <div className="w-full h-full bg-surface-container-high group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h3 className="text-body-lg font-headline-md mb-2">
                  Languages
                </h3>
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-secondary/10 text-secondary text-[11px] px-3 py-1 rounded-full font-bold">
                    French
                  </span>
                  <span className="bg-secondary/10 text-secondary text-[11px] px-3 py-1 rounded-full font-bold">
                    Japanese
                  </span>
                </div>
              </div>
            </div>

            {/* Design */}
            <div className="col-span-2 md:col-span-1 group cursor-pointer bg-white border border-outline-variant/30 rounded-xl overflow-hidden whisper-shadow active-press">
              <div className="p-6 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-body-lg font-headline-md mb-2">
                    Creative Design
                  </h3>
                  <p className="text-body-md text-on-surface-variant">
                    UX, Branding, and Hand-lettering.
                  </p>
                </div>
                <div className="mt-4 flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-fixed" />
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-tertiary-fixed" />
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-secondary-fixed flex items-center justify-center text-[10px] font-bold">
                    +12
                  </div>
                </div>
              </div>
            </div>

            {/* Fitness & Cooking */}
            <div className="col-span-2 md:col-span-1 group cursor-pointer bg-white border border-outline-variant/30 rounded-xl overflow-hidden whisper-shadow active-press">
              <div className="h-full flex items-center justify-center p-6 bg-primary-container/10">
                <div className="text-center">
                  <span className="material-symbols-outlined text-primary text-4xl mb-2">
                    restaurant
                  </span>
                  <h3 className="text-body-lg font-headline-md">
                    Culinary Arts
                  </h3>
                  <span className="text-label-caps font-label-caps text-primary mt-1 block">
                    84 Active Swaps
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="bg-surface-container-low py-24">
          <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center mb-16">
            <span className="text-label-caps font-label-caps text-secondary">
              COMMUNITY VOICES
            </span>
            <h2 className="text-display-lg-mobile md:text-headline-md font-display-lg mt-4 max-w-2xl mx-auto">
              Connecting creators through mutual growth.
            </h2>
          </div>
          <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Quote 1 */}
            <div className="bg-white p-8 rounded-xl whisper-shadow relative border border-outline-variant/10">
              <div className="text-primary flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <p className="text-body-lg font-headline-md italic text-on-surface mb-6">
                &ldquo;I traded two hours of UI design coaching for a weekend
                of sourdough bread workshops. Best trade I&apos;ve ever
                made.&rdquo;
              </p>
              <div className="flex items-center gap-stack-md">
                <div className="w-10 h-10 rounded-full bg-secondary-fixed" />
                <div>
                  <p className="font-bold text-body-md">Elena Rivera</p>
                  <p className="text-label-caps font-label-caps text-on-surface-variant">
                    PRODUCT DESIGNER
                  </p>
                </div>
              </div>
            </div>

            {/* Quote 2 */}
            <div className="bg-white p-8 rounded-xl whisper-shadow relative border border-outline-variant/10 md:mt-12">
              <div className="text-primary flex gap-0.5 mb-4">
                {[...Array(4)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
                <span className="material-symbols-outlined">star</span>
              </div>
              <p className="text-body-lg font-headline-md italic text-on-surface mb-6">
                &ldquo;SkillSwap feels like the old internet&mdash;no ads, just
                people helping people learn Spanish and Python.&rdquo;
              </p>
              <div className="flex items-center gap-stack-md">
                <div className="w-10 h-10 rounded-full bg-primary-fixed" />
                <div>
                  <p className="font-bold text-body-md">Marcus Thorne</p>
                  <p className="text-label-caps font-label-caps text-on-surface-variant">
                    LANGUAGES ENTHUSIAST
                  </p>
                </div>
              </div>
            </div>

            {/* Quote 3 */}
            <div className="bg-white p-8 rounded-xl whisper-shadow relative border border-outline-variant/10">
              <div className="text-primary flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <p className="text-body-lg font-headline-md italic text-on-surface mb-6">
                &ldquo;The credit system makes it so easy. I helped fix a leaky
                faucet and now I&apos;m learning Jazz Piano.&rdquo;
              </p>
              <div className="flex items-center gap-stack-md">
                <div className="w-10 h-10 rounded-full bg-tertiary-fixed" />
                <div>
                  <p className="font-bold text-body-md">James Chen</p>
                  <p className="text-label-caps font-label-caps text-on-surface-variant">
                    CONSTRUCTION LEAD
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-margin-mobile md:px-margin-desktop text-center">
          <div className="max-w-3xl mx-auto border-t border-outline-variant pt-24">
            <h2 className="text-display-lg-mobile md:text-display-lg font-display-lg mb-8">
              Ready to grow together?
            </h2>
            <Button variant="primary" size="lg" className="inline-flex items-center gap-2">
              Start swapping skills
              <span className="material-symbols-outlined">bolt</span>
            </Button>
            <p className="mt-6 text-on-surface-variant font-label-caps text-label-caps">
              JOIN 2,400+ SWAPPERS IN YOUR AREA
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
