"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gauge, Activity, FileCheck } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Digital Twin", href: "/", icon: <Gauge size={20} /> },
    { name: "Live Telemetry", href: "/dashboard", icon: <Activity size={20} /> },
    { name: "Quality Audit", href: "/audit", icon: <FileCheck size={20} /> }, // We will build this next!
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Endura<span className="text-blue-600">Metrics</span></h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 text-sm text-slate-400">
        <p>System Status: <span className="text-emerald-500 font-medium">Online</span></p>
      </div>
    </div>
  );
}