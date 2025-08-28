import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Math Curriculum",
  description: "Search and browse parsed PDF curriculum",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-dvh bg-slate-900 text-slate-100">{children}</body>
    </html>
  );
}
