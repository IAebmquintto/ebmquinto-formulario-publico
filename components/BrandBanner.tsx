import BrandLogo from "@/components/BrandLogo";

/** Cabeçalho de marca no topo das páginas públicas: faixa escura com o logo e a chamada da candidatura. */
export default function BrandBanner() {
  return (
    <div className="relative w-full overflow-hidden bg-ink">
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(201,150,43,0.4) 0px, rgba(201,150,43,0.4) 1px, transparent 1px, transparent 22px)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/20 to-transparent"
        aria-hidden="true"
      />

      <span
        className="absolute left-4 top-4 h-3.5 w-3.5 rotate-45 border border-brand/70 sm:left-8 sm:top-8"
        aria-hidden="true"
      />
      <span
        className="absolute right-4 top-4 h-3.5 w-3.5 rotate-45 border border-brand/70 sm:right-8 sm:top-8"
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-center px-4 pb-20 pt-12 text-center sm:pb-24 sm:pt-16">
        <BrandLogo variant="light" size="lg" />
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-brand sm:text-xs">
          EBM Quintto &middot; Recrutamento
        </p>
        <h1 className="mt-3 max-w-xl text-balance font-display text-3xl font-medium text-background sm:text-4xl">
          Venha fazer parte do nosso time
        </h1>
        <p className="mt-3 max-w-md text-balance text-sm text-ink-soft sm:text-base">
          Preencha o formulário abaixo e conte pra gente qual vaga ou área desperta o seu
          interesse.
        </p>
      </div>
    </div>
  );
}
