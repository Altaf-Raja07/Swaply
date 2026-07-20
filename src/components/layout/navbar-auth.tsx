import Link from "next/link";

export function NavbarAuth() {
  return (
    <header className="w-full h-16 flex items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <Link
        href="/"
        className="text-headline-md font-headline-md font-bold text-primary"
      >
        SkillSwap
      </Link>
    </header>
  );
}
