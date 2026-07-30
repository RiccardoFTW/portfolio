import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const caveat = localFont({
  src: "./fonts/Caveat-VariableFont_wght.ttf",
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Riccardo Ventura",
    template: "%s — Riccardo Ventura",
  },
  description: "Portfolio of Riccardo Ventura.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={caveat.variable}>
      <body>{children}</body>
    </html>
  );
}
