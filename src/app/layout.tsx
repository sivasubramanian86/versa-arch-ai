import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeEffect } from "@/components/theme-effect";

// Allow 60s for agent processing on Vercel Pro (Global)
export const maxDuration = 60;

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "VERSA ARCH AI - Gemini Agentic Learning",
  description: "Personalized learning with generative system diagrams and reasoning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-background text-foreground min-h-screen transition-colors duration-300`}>
        <ThemeEffect />
        {children}
      </body>
    </html>
  );
}
