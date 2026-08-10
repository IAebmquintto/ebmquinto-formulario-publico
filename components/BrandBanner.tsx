/** Faixa escura decorativa usada no topo das páginas públicas, no estilo da identidade da EBM Quintto. */
export default function BrandBanner() {
  return (
    <div className="relative h-28 w-full overflow-hidden bg-ink sm:h-32">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(201,150,43,0.35) 0px, rgba(201,150,43,0.35) 1px, transparent 1px, transparent 16px)",
        }}
        aria-hidden="true"
      />
      <span
        className="absolute left-4 top-4 h-4 w-4 rotate-45 border border-brand/60 sm:left-8 sm:top-6"
        aria-hidden="true"
      />
      <span
        className="absolute right-4 top-4 h-4 w-4 rotate-45 border border-brand/60 sm:right-8 sm:top-6"
        aria-hidden="true"
      />
    </div>
  );
}
