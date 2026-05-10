"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Play, Square, Activity, Thermometer } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<any[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Poll the API when streaming is active
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isStreaming) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`http://127.0.0.1:8000/api/stream/${currentIndex}`);
          if (!res.ok) throw new Error("End of data or fetch error");
          
          const result = await res.json();
          
          // Add new data point, keep only the last 30 points so the chart moves cleanly
          setData((prev) => {
            const newData = [...prev, { time: currentIndex, ...result.data }];
            return newData.slice(-30);
          });
          
          setCurrentIndex((prev) => prev + 1);
        } catch (error) {
          console.error("Streaming stopped:", error);
          setIsStreaming(false);
        }
      }, 1000); // Fetch a new row every 1 second
    }

    return () => clearInterval(interval);
  }, [isStreaming, currentIndex]);

  const toggleStream = () => setIsStreaming(!isStreaming);
  const resetStream = () => {
    setIsStreaming(false);
    setCurrentIndex(0);
    setData([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">EnduraMetrics</h1>
          <p className="text-slate-500">Live Telemetry Dashboard</p>
        </div>
        
        {/* Controls */}
        <div className="flex gap-3">
          <button 
            onClick={toggleStream}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors ${isStreaming ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}
          >
            {isStreaming ? <><Square size={18} /> Pause Feed</> : <><Play size={18} /> Start Feed</>}
          </button>
          <button 
            onClick={resetStream}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>
      </header>

      {/* Live Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium mb-1">Current Load</p>
          <p className="text-2xl font-bold">{data.length > 0 ? data[data.length - 1].Act_Ld_kg : "--"} <span className="text-sm text-slate-400">kg</span></p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium mb-1">Speed</p>
          <p className="text-2xl font-bold">{data.length > 0 ? data[data.length - 1].Spd_kph : "--"} <span className="text-sm text-slate-400">kph</span></p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium mb-1">Deflection</p>
          <p className="text-2xl font-bold text-blue-600">{data.length > 0 ? data[data.length - 1].Defl_mm : "--"} <span className="text-sm text-slate-400">mm</span></p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium mb-1">Test Step</p>
          <p className="text-2xl font-bold">{data.length > 0 ? data[data.length - 1].Step : "--"}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Thermal Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b pb-4 text-rose-600">
            <Thermometer size={20} />
            <h2 className="text-xl font-semibold text-slate-800">Infrared Surface Temp (°C)</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Ir_A_C" stroke="#ef4444" strokeWidth={2} dot={false} name="Zone A" />
                <Line type="monotone" dataKey="Ir_B_C" stroke="#f97316" strokeWidth={2} dot={false} name="Zone B" />
                <Line type="monotone" dataKey="Ir_C_C" stroke="#eab308" strokeWidth={2} dot={false} name="Zone C" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mechanical Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b pb-4 text-blue-600">
            <Activity size={20} />
            <h2 className="text-xl font-semibold text-slate-800">Tire Deflection (mm)</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Line type="stepAfter" dataKey="Defl_mm" stroke="#2563eb" strokeWidth={2} dot={false} name="Deflection" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}