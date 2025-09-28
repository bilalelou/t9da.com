import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { HydrationErrorBoundary } from "@/components/HydrationErrorBoundary";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "t9da.com",
  description: "Your e-commerce application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <HydrationErrorBoundary>
          {children}
        </HydrationErrorBoundary>
      </body>
    </html>
  );
}
