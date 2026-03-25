import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Omorfia | Beauty DNA AI",
  description: "High-end AI beauty concierge for Naturals Salons",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-midnight-purple min-h-screen w-full`}>
        {/* Full-width layout with no constraints */}
        <div className="w-full min-h-screen relative overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
