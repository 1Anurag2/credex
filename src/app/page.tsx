"use client";

import { useState } from "react";
import AuditForm from "@/components/AuditForm";
import AuditResults from "@/components/AuditResults";
import { runAudit, AuditInput, AuditResult } from "@/utils/auditEngine";
import { Bot, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [input, setInput] = useState<AuditInput | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleAudit = (data: AuditInput) => {
    setIsAuditing(true);
    setInput(data);
    
    // Fake a small delay for dramatic effect
    setTimeout(() => {
      const res = runAudit(data);
      setResult(res);
      setIsAuditing(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  };

  return (
    <main className="min-h-screen relative overflow-hidden pb-24">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-primary/20 blur-[120px] -z-10 rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[100px] -z-10 rounded-full" />

      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <Bot className="text-primary" />
          Credex<span className="text-muted-foreground">Audit</span>
        </div>
      </header>

      <div className="container mx-auto px-6 pt-12 pb-24 relative z-10">
        
        {!result && !isAuditing && (
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight"
            >
              Stop Overpaying for <span className="gradient-text">AI Tools</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Most startups waste thousands a year on duplicate subscriptions and wrong tiers. 
              See exactly where you're bleeding cash in 60 seconds.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="flex justify-center gap-6 text-sm font-medium text-muted-foreground pt-4"
            >
              <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-green-400"/> 100% Free</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-green-400"/> No Bank Login</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-green-400"/> Instant Results</span>
            </motion.div>
          </div>
        )}

        {isAuditing && (
          <div className="py-32 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <h2 className="text-2xl font-bold">Analyzing your stack...</h2>
            <p className="text-muted-foreground text-sm">Cross-referencing pricing tiers & enterprise rules</p>
          </div>
        )}

        {!isAuditing && !result && <AuditForm onComplete={handleAudit} />}

        {!isAuditing && result && input && <AuditResults result={result} input={input} />}
      </div>
    </main>
  );
}
