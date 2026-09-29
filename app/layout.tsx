import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chore Quest",
  description: "Turn your daily habits into a game.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
