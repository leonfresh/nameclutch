import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NameClutch - Premium Domain Names",
  description:
    "Discover and acquire premium domain names for your next big idea",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
