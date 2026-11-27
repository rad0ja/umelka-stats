import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import {SeasonProvider} from "@/app/context/SeasonContext";
import AppNav from "@/app/components/AppNav";

const body = Barlow({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

const display = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Umelka League",
  description: "Weekly football stats: tables, matchdays and player cards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${body.variable} ${display.variable} antialiased`}
      >
            <SeasonProvider>
                <AppNav />
                {children}
            </SeasonProvider>
        <Analytics />
      </body>
    </html>
  );
}
