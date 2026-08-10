import BrandLogo from "@/components/BrandLogo";

/** Cabeçalho de marca no topo das páginas públicas: faixa escura com o logo em destaque. */
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
        className="absolute right-4 top-4 h-3.5 w-3.5 rotate-45 border border-brand/70 sm:right-8 sm:top-8"
        aria-hidden="true"
      />

      <div className="relative flex items-center px-4 pb-16 pt-6 sm:px-8 sm:pb-20 sm:pt-8">
        <BrandLogo variant="light" />
      </div>
    </div>
  );
}
