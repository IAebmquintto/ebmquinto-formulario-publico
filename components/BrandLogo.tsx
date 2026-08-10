import Image from "next/image";

export default function BrandLogo({
  variant = "dark",
  size = "md",
}: {
  variant?: "dark" | "light";
  size?: "md" | "sm" | "lg";
}) {
  const logoHeight =
    size === "sm" ? "h-5" : size === "lg" ? "h-16 sm:h-24" : "h-9 sm:h-10";

  // "dark" (fundo claro/dourado) usa o arquivo original, preto. "light"
  // (fundo escuro) usa logo.ebm.light.png — mesmo arquivo com os pixels
  // pretos remapeados pra branco e a bolinha dourada preservada como está.
  return (
    <Image
      src={variant === "light" ? "/logo.ebm.light.png" : "/logo.ebm.png"}
      alt="EBM Quintto"
      width={3285}
      height={1006}
      priority
      className={`w-auto ${logoHeight}`}
    />
  );
}
