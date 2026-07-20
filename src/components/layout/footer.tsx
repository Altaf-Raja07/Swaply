import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-inverse-surface w-full mt-stack-lg">
      <div className="w-full py-stack-lg px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center max-w-container-max mx-auto gap-gutter">
        <div className="flex flex-col items-center md:items-start gap-stack-sm">
          <span className="text-headline-md font-headline-md text-primary-fixed-dim">
            SkillSwap
          </span>
          <p className="text-body-md font-body-md text-surface-variant opacity-80 text-center md:text-left">
            &copy; 2024 SkillSwap. Built for the community. A tactile space for human knowledge.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-stack-lg">
          <Link
            href="#"
            className="text-label-caps font-label-caps text-surface-variant hover:text-primary-fixed transition-colors duration-200"
          >
            Community Guidelines
          </Link>
          <Link
            href="#"
            className="text-label-caps font-label-caps text-surface-variant hover:text-primary-fixed transition-colors duration-200"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-label-caps font-label-caps text-surface-variant hover:text-primary-fixed transition-colors duration-200"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-label-caps font-label-caps text-surface-variant hover:text-primary-fixed transition-colors duration-200"
          >
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
