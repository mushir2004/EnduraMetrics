"use client";

import { useState } from "react";
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";

export default function AuditPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    setReport(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/audit", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to process file.");
      }

      const data = await res.json();
      setReport(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Quality Audit</h1>
        <p className="text-slate-500">Automated Endurance Compliance Checking</p>
      </header>

      <div className="grid gap-8 md:grid-cols-2 max-w-5xl">
        
        {/* Upload Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <UploadCloud className="text-blue-600" />
            <h2 className="text-xl font-semibold">Upload Test Data</h2>
          </div>

          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
            <FileSpreadsheet className="mx-auto text-slate-400 mb-3" size={32} />
            <p className="text-sm text-slate-600 mb-4">Select a raw machine output file (.xlsx, .csv)</p>
            <input 
              type="file" 
              accept=".xlsx, .xls, .csv"
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4 cursor-pointer"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            />
            <button 
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:bg-blue-300"
            >
              {loading ? "Analyzing Data..." : "Run Compliance Audit"}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        </div>

        {/* Report Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
           <h2 className="text-xl font-semibold mb-6 border-b pb-4">Audit Report</h2>
           
           {report ? (
             <div className="space-y-6">
                <div className={`p-4 rounded-lg flex items-center gap-3 ${report.status === 'PASS' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                   {report.status === 'PASS' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                   <div>
                     <h3 className="font-bold text-lg">Test Status: {report.status}</h3>
                     <p className="text-sm opacity-90">{report.notes}</p>
                   </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500">File Analyzed</span>
                    <span className="font-medium text-sm truncate max-w-[200px]">{report.filename}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500">Rows Processed</span>
                    <span className="font-medium">{report.metrics.total_rows_analyzed.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500">Avg Speed (kph)</span>
                    <span className="font-medium">{report.metrics.average_speed_kph}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500">Max Load Achieved (kg)</span>
                    <span className="font-medium">{report.metrics.maximum_load_achieved_kg}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500">Peak Thermal Limit (°C)</span>
                    <span className="font-medium text-rose-600">{report.metrics.peak_surface_temp_C}</span>
                  </div>
                </div>
             </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
               <AlertCircle size={48} className="mb-4 opacity-50" />
               <p>Awaiting file upload...</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}