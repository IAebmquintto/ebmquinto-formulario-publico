import PublicApplicationForm from "@/components/PublicApplicationForm";
import BrandBanner from "@/components/BrandBanner";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <BrandBanner />
      <div className="px-4 pb-16">
        <div className="-mt-14 sm:-mt-16">
          <PublicApplicationForm />
        </div>
      </div>
    </main>
  );
}
