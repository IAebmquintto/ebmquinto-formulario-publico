import type { Metadata } from "next";
import { Krona_One, Space_Grotesk } from "next/font/google";
import "./globals.css";

const kronaOne = Krona_One({
  variable: "--font-krona-one",
  weight: "400",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Candidatura — EBM Quintto",
  description: "Formulário público de candidatura da EBM Quintto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${kronaOne.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
