import Link from "next/link";

const CHOICES = [
  {
    href: "/curriculo",
    title: "Quero enviar meu currículo",
    icon: (
      <path
        d="M8 3h6l4 4v13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm5 0v5h5M9 12h6M9 15.5h6M9 8.5h2"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    href: "/casting",
    title: "Quero participar de\nproduções de vídeo\ncomo casting",
    icon: (
      <path
        d="M3 8.5 21 8.5M3 8.5v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-10M3 8.5l2-4.5h14l2 4.5M7.5 4l1.3 4.5M12 4l1 4.5M16.5 4l1.3 4.5"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    href: "/fornecedores",
    title: "Quero oferecer meus produtos ou serviços como fornecedor(a)",
    icon: (
      <path
        d="M4 21V8l8-4 8 4v13M4 21h16M9 21v-6h6v6M9 12h.01M15 12h.01M12 12h.01M9 9h.01M15 9h.01M12 9h.01"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    href: "/producao-de-conteudo",
    title: "Quero atuar como produtor de conteúdo, captando ou editando material audiovisual",
    icon: (
      <path
        d="M3 7a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7ZM14 10l6-3.5v11L14 14"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export default function ContactChoices() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {CHOICES.map((choice, index) => (
        <Link
          key={choice.href}
          href={choice.href}
          style={{ animationDelay: `${index * 90}ms` }}
          className="animate-rise-in group flex flex-col rounded-2xl border border-line bg-white/[0.04] p-6 opacity-0 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-brand/40 hover:bg-white/[0.07] active:translate-y-0 active:scale-[0.98]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand transition-all duration-200 ease-out group-hover:scale-110 group-hover:bg-brand group-hover:text-ink">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
              {choice.icon}
            </svg>
          </span>
          <span className="mt-4 whitespace-pre-line font-display text-base font-medium text-foreground">
            {choice.title}
          </span>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-brand">
            Começar
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 transition group-hover:translate-x-0.5">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Link>
      ))}
    </div>
  );
}
