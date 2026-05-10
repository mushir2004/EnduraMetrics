"use client";

import { useState } from "react";
import { Activity, Thermometer, Gauge, Settings2 } from "lucide-react";

export default function SimulatorPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Req_Ld_kg: 3500,
    Spd_kph: 72,
    Step: 3,
  });
  const [results, setResults] = useState<{
    predicted_deflection_mm: number;
    predicted_Ir_A_C: number;
    predicted_Ir_B_C: number;
    predicted_Ir_C_C: number;
  } | null>(null);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Simulation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">EnduraMetrics</h1>
        <p className="text-slate-500">Digital Twin Load Simulation</p>
      </header>

      <div className="grid gap-8 md:grid-cols-2 max-w-5xl">
        
        {/* Controls Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <Settings2 className="text-blue-600" />
            <h2 className="text-xl font-semibold">Test Parameters</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Requested Load (kg)</label>
              <input 
                type="number" 
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.Req_Ld_kg}
                onChange={(e) => setFormData({...formData, Req_Ld_kg: Number(e.target.value)})}
              />
              <p className="text-xs text-slate-400 mt-1">Typical range: 2300 - 5000 kg</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Speed (kph)</label>
              <input 
                type="number" 
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.Spd_kph}
                onChange={(e) => setFormData({...formData, Spd_kph: Number(e.target.value)})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Testing Step</label>
              <input 
                type="number" 
                min="1" max="7"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.Step}
                onChange={(e) => setFormData({...formData, Step: Number(e.target.value)})}
              />
            </div>

            <button 
              onClick={handleSimulate}
              disabled={loading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-blue-300"
            >
              {loading ? "Running Simulation..." : "Run Digital Twin"}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          {results ? (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 text-blue-800 mb-2">
                  <Activity size={20} />
                  <h3 className="font-semibold">Predicted Deflection</h3>
                </div>
                <p className="text-4xl font-bold text-blue-900">{results.predicted_deflection_mm} <span className="text-lg text-blue-600 font-normal">mm</span></p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-rose-600 mb-4">
                  <Thermometer size={20} />
                  <h3 className="font-semibold text-slate-800">Thermal Profile (Infrared Sensors)</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-rose-50 p-4 rounded-lg border border-rose-100 text-center">
                    <p className="text-sm text-rose-600 font-medium mb-1">Zone A</p>
                    <p className="text-2xl font-bold text-rose-900">{results.predicted_Ir_A_C}°C</p>
                  </div>
                  <div className="bg-rose-50 p-4 rounded-lg border border-rose-100 text-center">
                    <p className="text-sm text-rose-600 font-medium mb-1">Zone B</p>
                    <p className="text-2xl font-bold text-rose-900">{results.predicted_Ir_B_C}°C</p>
                  </div>
                  <div className="bg-rose-50 p-4 rounded-lg border border-rose-100 text-center">
                    <p className="text-sm text-rose-600 font-medium mb-1">Zone C</p>
                    <p className="text-2xl font-bold text-rose-900">{results.predicted_Ir_C_C}°C</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-400 flex flex-col items-center">
              <Gauge size={48} className="mb-4 opacity-50" />
              <p>Awaiting simulation parameters...</p>
              <p className="text-sm mt-2">Adjust controls and click "Run" to generate predictions.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}