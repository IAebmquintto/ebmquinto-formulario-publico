import Link from "next/link";

export default function BackToChoices() {
  return (
    <Link
      href="/"
      className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-foreground/50 transition hover:text-brand"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
        <path
          d="M19 12H5M11 18l-6-6 6-6"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Voltar
    </Link>
  );
}
