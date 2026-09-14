const EBM_SITE_URL = "https://web-production-ec44b.up.railway.app";

export default function BackToSite() {
  return (
    <a
      href={EBM_SITE_URL}
      aria-label="Voltar pro site"
      title="Voltar pro site"
      className="mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-line text-foreground/60 transition hover:border-brand/40 hover:text-brand"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
        <path
          d="M19 12H5M11 18l-6-6 6-6"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
