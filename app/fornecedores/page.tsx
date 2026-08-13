import type { Metadata } from "next";
import FornecedoresForm from "@/components/FornecedoresForm";
import BrandBanner from "@/components/BrandBanner";

export const metadata: Metadata = {
  title: "Cadastro de fornecedor — EBM Quintto",
  description: "Cadastro público de fornecedores da EBM Quintto",
};

export default function FornecedoresPage() {
  return (
    <main className="min-h-screen bg-background">
      <BrandBanner />
      <div className="px-4 pb-20 sm:pb-28">
        <div className="-mt-14 sm:-mt-16">
          <FornecedoresForm />
        </div>
      </div>
    </main>
  );
}
