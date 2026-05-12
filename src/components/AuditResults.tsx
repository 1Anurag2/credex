"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AuditResult, AuditInput } from "@/utils/auditEngine";
import { CheckCircle2, AlertTriangle, ArrowRight, Lock, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

interface AuditResultsProps {
  result: AuditResult;
  input: AuditInput;
}

export default function AuditResults({ result, input }: AuditResultsProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, input, result }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate report");
      
      toast.success("Email Delivered Successfully!");
      
      // Delay redirection to allow user to see the toast
      setTimeout(() => {
        window.location.href = `/share/${data.id}`;
      }, 1500);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      {/* Hero Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-2xl text-center border-t border-t-white/10">
          <p className="text-muted-foreground text-sm uppercase tracking-wider font-semibold mb-2">Total Monthly Savings</p>
          <h2 className="text-6xl font-bold gradient-text">${result.totalMonthlySavings.toLocaleString()}</h2>
        </div>
        <div className="glass p-8 rounded-2xl text-center border-t border-t-white/10">
          <p className="text-muted-foreground text-sm uppercase tracking-wider font-semibold mb-2">Total Annual Savings</p>
          <h2 className="text-6xl font-bold text-white">${result.totalAnnualSavings.toLocaleString()}</h2>
        </div>
      </div>

      {/* Tool Breakdown */}
      <div className="glass rounded-2xl overflow-hidden border-t border-t-white/10">
        <div className="p-6 border-b border-border">
          <h3 className="text-xl font-semibold">Spend Breakdown</h3>
        </div>
        <div className="divide-y divide-border">
          {result.recommendations.map((rec, i) => (
            <div key={i} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
              <div>
                <h4 className="font-bold text-lg">{rec.tool}</h4>
                <p className="text-muted-foreground text-sm mt-1">{rec.reason}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="font-semibold text-primary">{rec.recommendedAction}</div>
                {rec.savings > 0 ? (
                  <div className="text-sm text-green-400 mt-1 flex items-center justify-end gap-1">
                    <CheckCircle2 size={14} /> Save ${rec.savings}/mo
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground mt-1 flex items-center justify-end gap-1">
                    <CheckCircle2 size={14} /> Optimal
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Capture Gate */}
      <div className="relative glass p-8 rounded-2xl border border-primary/30 text-center overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/10 blur-3xl -z-10 rounded-full" />
        
        <Lock className="mx-auto text-primary mb-4" size={32} />
        <h3 className="text-2xl font-bold mb-2">Unlock Your Full AI Audit Report</h3>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          We've found <strong>${result.totalAnnualSavings.toLocaleString()}</strong> in annual savings. 
          Enter your email to get a personalized AI analysis, a shareable link for your team, and a free consultation to implement these savings.
        </p>

        <form onSubmit={handleCapture} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input 
            type="email" 
            required
            placeholder="you@startup.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary outline-none"
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Get Full Report"}
          </button>
        </form>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>

    </motion.div>
  );
}
