import "./globals.css";
import type { ReactNode } from "react";
import Script from 'next/script';

export const metadata = {
  title: "Math Curriculum",
  description: "Search and browse parsed PDF curriculum",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="min-h-dvh bg-slate-900 text-slate-100">
        {children}
        {/* DISABLED: GeoGebra integration removed by user request
        <Script
          src="https://www.geogebra.org/apps/deployggb.js"
          strategy="afterInteractive"
        />
        */}
      </body>
    </html>
  );
}
