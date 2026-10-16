import type { Metadata } from "next";
import localFont from "next/font/local";
import { AppThemeProvider } from "@/components/theme";
import { InkShow } from "@/components/InkShow";
import "./globals.css";
import "./main.css";

const inter = localFont({
  src: "../public/fonts/InterVariable.ttf",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const caveat = localFont({
  src: "../public/fonts/Caveat-VariableFont_wght.ttf",
  variable: "--font-caveat",
  weight: "400 700",
  display: "swap",
  preload: false,
});

const baskerville = localFont({
  src: "../public/fonts/Baskervville-VariableFont_wght.ttf",
  variable: "--font-baskerville",
  weight: "100 900",
  display: "swap",
});

const baskervilleItalic = localFont({
  src: "../public/fonts/Baskervville-Italic-VariableFont_wght.ttf",
  variable: "--font-italic",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Riccardo Ventura",
    template: "%s — Riccardo Ventura",
  },
  description: "Riccardo Ventura - Design Engineer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      suppressHydrationWarning
      className={`${inter.variable} ${caveat.variable} ${baskerville.variable} ${baskervilleItalic.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col antialiased bg-background text-foreground">
        <AppThemeProvider>
          <InkShow>{children}</InkShow>
        </AppThemeProvider>
      </body>
    </html>
  );
}
