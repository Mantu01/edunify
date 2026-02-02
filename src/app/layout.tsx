import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Provider from "@/contexts/Provider";
import { Navigation } from "@/components/layout/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduNify - AI-Native Learning Platform",
  description: "An AI-native workspace that builds personalized dashboards for students, educators, and companies",
  icons:'https://res.cloudinary.com/dqznmhhtv/image/upload/v1769211087/edunify-logo_ntnwbi.png'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          <Navigation/>
          {children}
        </Provider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
