import type { Metadata } from "next";
import { Bebas_Neue, Barlow_Condensed, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas", display: "swap" });
const barlow = Barlow_Condensed({ subsets: ["latin"], weight: ["400","500","600","700","800","900"], variable: "--font-barlow", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400","500","600","700"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400","700"], style: ["normal","italic"], variable: "--font-playfair", display: "swap" });

export const metadata: Metadata = {
  title: "Triple Crown Automotive — Woodland, CA",
  description: "Triple Crown Automotive offers complete auto repair, transmission service, commercial fleet maintenance, and expert diagnostics in Woodland, CA. Locally owned by Todd H. since 1993 at 320 Kentucky Ave.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bebas.variable} ${barlow.variable} ${inter.variable} ${playfair.variable}`}>
      <body style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>{children}</body>
    </html>
  );
}
