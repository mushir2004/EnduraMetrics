"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gauge, Activity, FileCheck, Home, Hexagon } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { 
      name: "Home", 
      href: "/", 
      icon: <Home size={18} />,
      descLine1: "Return to the",
      descLine2: "main landing page."
    },
    { 
      name: "Digital Twin", 
      href: "/simulator", 
      icon: <Gauge size={18} />,
      descLine1: "Predict physical stress",
      descLine2: "using AI simulation."
    },
    { 
      name: "Live Telemetry", 
      href: "/dashboard", 
      icon: <Activity size={18} />,
      descLine1: "Real-time monitoring",
      descLine2: "of sensor data feed."
    },
    { 
      name: "Quality Audit", 
      href: "/audit", 
      icon: <FileCheck size={18} />,
      descLine1: "Automated compliance",
      descLine2: "and grading reports."
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Upgraded Premium Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 group-hover:scale-105 transition-all duration-300">
            {/* Layered icons for a custom 3D/Tech feel */}
            <Hexagon className="text-white/20 absolute" size={28} fill="currentColor" />
            <Activity className="text-white z-10" size={20} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center">
            <span className="text-slate-900 group-hover:text-slate-700 transition-colors duration-300">Endura</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 ml-[1px]">Metrics</span>
          </h2>
        </Link>
        
        {/* Navigation Buttons */}
        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>

                {/* Hover Tooltip (2-Line Description) */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl border border-slate-700 text-center relative">
                    {/* Little triangle pointing up */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 rotate-45 border-l border-t border-slate-700"></div>
                    <p className="font-semibold text-blue-300 mb-1">{item.name}</p>
                    <p className="text-slate-300">{item.descLine1}</p>
                    <p className="text-slate-300">{item.descLine2}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

      </div>
    </header>
  );
}