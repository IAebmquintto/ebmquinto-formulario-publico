import BrandBanner from "@/components/BrandBanner";
import ContactChoices from "@/components/ContactChoices";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <BrandBanner />
      <div className="px-4 pb-20 sm:pb-28">
        <div className="-mt-14 sm:-mt-16">
          <div className="animate-rise-in relative mx-auto max-w-3xl space-y-8 rounded-3xl border border-line bg-ink p-6 shadow-xl shadow-black/30 sm:p-12">
            <div>
              <h1 className="font-display text-2xl font-medium text-foreground sm:text-3xl">
                Envie seu contato
              </h1>
              <p className="mt-2 text-sm text-foreground/60">
                Escolha a opção que combina com você.
              </p>
              <div className="mt-6 border-t border-line" />
            </div>

            <ContactChoices />
          </div>
        </div>
      </div>
    </main>
  );
}
