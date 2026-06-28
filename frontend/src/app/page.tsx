"use client";
import VehicleAnimation from "../components/VehicleAnimation";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Activity, Gauge, FileCheck, CircleDashed } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 selection:bg-blue-500/30">
      
      {/* HERO SECTION */}
      <div className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        
        {/* Background Grid & Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>

        <div className="z-10 text-center max-w-4xl px-6 flex flex-col items-center">
          
          {/* Animated Vehicle/Tire Graphic */}
          <div className="mb-4 w-full">
            <VehicleAnimation />
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400"
          >
            Next-Generation <br/> Tire Analytics.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-light"
          >
            EnduraMetrics is an AI-powered engineering portal designed to simulate, monitor, and audit heavy-duty tire endurance without physical hardware.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/simulator" className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-[0_0_40px_8px_rgba(37,99,235,0.3)] hover:shadow-[0_0_60px_12px_rgba(37,99,235,0.4)]">
              Launch Application
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 text-slate-500 text-sm flex flex-col items-center gap-2"
        >
          <p>Scroll to explore</p>
          <div className="w-[1px] h-12 bg-gradient-to-b from-slate-500 to-transparent"></div>
        </motion.div>
      </div>

      {/* FEATURES SECTION */}
      <div className="py-24 bg-slate-900 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">A Complete Digital Ecosystem</h2>
            <p className="text-slate-400">Everything you need to predict failure and ensure compliance.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl hover:bg-slate-800 transition-colors"
            >
              <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                <Gauge size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Digital Twin</h3>
              <p className="text-slate-400 leading-relaxed">
                Input requested loads and speeds into our trained Random Forest Regressor to instantly predict tire deflection and thermal stress before ever running a physical test.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl hover:bg-slate-800 transition-colors"
            >
              <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-6">
                <Activity size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Live Telemetry</h3>
              <p className="text-slate-400 leading-relaxed">
                Connect to live testing data or simulate historical runs. Watch Recharts dynamically plot infrared zone temperatures and mechanical deformation in real-time.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl hover:bg-slate-800 transition-colors"
            >
              <div className="w-14 h-14 bg-rose-500/20 rounded-xl flex items-center justify-center text-rose-400 mb-6">
                <FileCheck size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Quality Audit</h3>
              <p className="text-slate-400 leading-relaxed">
                Upload raw machine datasets (CSV/XLSX). Our Python backend instantly scrubs thousands of rows to generate a compliance report, flagging safety deviations.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

    </div>
  );
}