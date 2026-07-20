import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col">
      <header className="w-full h-16 flex items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <Link
          href="/"
          className="text-headline-md font-headline-md font-bold text-primary"
        >
          SkillSwap
        </Link>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center py-stack-lg px-margin-mobile max-w-container-max mx-auto">
        <div className="w-full max-w-[480px] space-y-stack-lg">
          {/* Branding/Illustration Section */}
          <div className="text-center space-y-stack-sm">
            <div className="inline-flex items-center justify-center bg-tertiary-fixed p-stack-md rounded-xl mb-stack-md whisper-shadow">
              <span
                className="material-symbols-outlined text-on-tertiary-fixed text-[40px]"
              >
                diversity_3
              </span>
            </div>
            <h1 className="font-headline-md text-headline-md text-on-surface">
              Join the collective
            </h1>
            <p className="font-body-md text-on-surface-variant max-w-sm mx-auto">
              Every master was once a beginner. Start your skill-exchange
              journey today.
            </p>
          </div>

          {/* Sign Up Card */}
          <div className="bg-surface border-[0.5px] border-outline-variant/40 rounded-xl p-8 whisper-shadow space-y-stack-lg">
            {/* Social Auth */}
            <Button variant="secondary" className="w-full">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative flex items-center py-stack-sm">
              <div className="flex-grow border-t border-outline-variant/30" />
              <span className="flex-shrink mx-4 text-label-caps font-label-caps text-on-surface-variant uppercase">
                Or use email
              </span>
              <div className="flex-grow border-t border-outline-variant/30" />
            </div>

            {/* Form */}
            <form className="space-y-stack-md">
              <div className="space-y-unit">
                <label className="block text-label-caps font-label-caps text-on-surface-variant">
                  FULL NAME
                </label>
                <input
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-body-md focus:outline-none focus:border-primary transition-all"
                  placeholder="Your name"
                  type="text"
                />
              </div>
              <div className="space-y-unit">
                <label className="block text-label-caps font-label-caps text-on-surface-variant">
                  EMAIL ADDRESS
                </label>
                <input
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-body-md focus:outline-none focus:border-primary transition-all"
                  placeholder="name@domain.com"
                  type="email"
                />
              </div>
              <div className="space-y-unit">
                <label className="block text-label-caps font-label-caps text-on-surface-variant">
                  PASSWORD
                </label>
                <input
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-body-md focus:outline-none focus:border-primary transition-all"
                  placeholder="Create a strong password"
                  type="password"
                />
              </div>
              <Button variant="primary" type="submit" className="w-full mt-stack-lg">
                Create Account
              </Button>
            </form>
          </div>

          {/* Footer for Auth */}
          <p className="text-center text-body-md text-on-surface-variant">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-bold hover:underline"
            >
              Sign in
            </Link>
          </p>

          {/* Illustrated Concepts */}
          <div className="grid grid-cols-2 gap-gutter pt-stack-lg">
            <div className="bg-surface-container-low p-stack-md rounded-xl space-y-stack-sm border border-outline-variant/20">
              <img src="/images/illustrations/illustration-12.png" alt="Pottery hands" className="w-full h-32 object-cover rounded-lg" />
              <div className="space-y-unit">
                <p className="font-label-caps text-label-caps text-secondary uppercase">
                  Learn
                </p>
                <h3 className="font-headline-md text-[18px]">
                  Pottery Basics
                </h3>
              </div>
            </div>
            <div className="bg-surface-container-low p-stack-md rounded-xl space-y-stack-sm border border-outline-variant/20">
              <img src="/images/illustrations/illustration-16.png" alt="Architectural sketching" className="w-full h-32 object-cover rounded-lg" />
              <div className="space-y-unit">
                <p className="font-label-caps text-label-caps text-secondary uppercase">
                  Teach
                </p>
                <h3 className="font-headline-md text-[18px]">Drafting 101</h3>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
