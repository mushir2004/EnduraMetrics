import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar"; // Changed from Sidebar

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EnduraMetrics",
  description: "Advanced Tire Load Simulation and Telemetry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 flex flex-col min-h-screen`}>
        {/* The new top Navbar */}
        <Navbar />
        
        {/* The main content area now sits naturally below the Navbar */}
        <main className="flex-1 w-full">
          {children}
        </main>
      </body>
    </html>
  );
}