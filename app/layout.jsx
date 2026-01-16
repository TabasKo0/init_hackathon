import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Init Hackathon",
  description: "Supabase-powered Next.js starter",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="absolute z-0 inset-0 bg-gradient-to-br from-purple-900/40 via-black to-purple-950"></div>
        <div className="z-[2] relative">
          {children}
        </div>
        <Navbar />
      </body>
    </html>
  );
}
