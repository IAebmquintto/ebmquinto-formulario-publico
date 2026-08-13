import type { Metadata } from "next";
import CurriculoForm from "@/components/CurriculoForm";
import BrandBanner from "@/components/BrandBanner";

export const metadata: Metadata = {
  title: "Envie seu currículo — EBM Quintto",
  description: "Formulário público de candidatura da EBM Quintto",
};

export default function CurriculoPage() {
  return (
    <main className="min-h-screen bg-background">
      <BrandBanner />
      <div className="px-4 pb-20 sm:pb-28">
        <div className="-mt-14 sm:-mt-16">
          <CurriculoForm />
        </div>
      </div>
    </main>
  );
}
