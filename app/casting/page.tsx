import type { Metadata } from "next";
import CastingForm from "@/components/CastingForm";
import BrandBanner from "@/components/BrandBanner";

export const metadata: Metadata = {
  title: "Cadastro para Casting — EBM Quintto",
  description: "Cadastro público para casting da EBM Quintto",
};

export default function CastingPage() {
  return (
    <main className="min-h-screen bg-background">
      <BrandBanner />
      <div className="px-4 pb-20 sm:pb-28">
        <div className="-mt-14 sm:-mt-16">
          <CastingForm />
        </div>
      </div>
    </main>
  );
}
