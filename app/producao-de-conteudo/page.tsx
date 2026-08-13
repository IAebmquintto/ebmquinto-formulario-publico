import type { Metadata } from "next";
import ProducaoDeConteudoForm from "@/components/ProducaoDeConteudoForm";
import BrandBanner from "@/components/BrandBanner";

export const metadata: Metadata = {
  title: "Produção de Conteúdo — EBM Quintto",
  description: "Cadastro público para produção de conteúdo da EBM Quintto",
};

export default function ProducaoDeConteudoPage() {
  return (
    <main className="min-h-screen bg-background">
      <BrandBanner />
      <div className="px-4 pb-20 sm:pb-28">
        <div className="-mt-14 sm:-mt-16">
          <ProducaoDeConteudoForm />
        </div>
      </div>
    </main>
  );
}
