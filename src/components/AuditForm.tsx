"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ToolName, ToolInput, AuditInput } from "@/utils/auditEngine";
import { Plus, Trash2, ArrowRight } from "lucide-react";

interface AuditFormProps {
  onComplete: (data: AuditInput) => void;
}

const AVAILABLE_TOOLS: ToolName[] = [
  "Cursor", "GitHub Copilot", "Claude", "ChatGPT", "Gemini", "Windsurf", "Anthropic API", "OpenAI API"
];

const PLANS: Record<ToolName, string[]> = {
  "Cursor": ["Hobby", "Pro", "Business", "Enterprise"],
  "GitHub Copilot": ["Individual", "Business", "Enterprise"],
  "Claude": ["Free", "Pro", "Team", "Enterprise", "API direct"],
  "ChatGPT": ["Free", "Plus", "Team", "Enterprise", "API direct"],
  "Gemini": ["Free", "Advanced", "API"],
  "Windsurf": ["Free", "Pro", "Enterprise"],
  "Anthropic API": ["API direct"],
  "OpenAI API": ["API direct"],
};

export default function AuditForm({ onComplete }: AuditFormProps) {
  const [teamSize, setTeamSize] = useState<number>(5);
  const [useCase, setUseCase] = useState<string>("coding");
  const [tools, setTools] = useState<ToolInput[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("credex_audit_form");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTeamSize(parsed.teamSize || 5);
        setUseCase(parsed.useCase || "coding");
        setTools(parsed.tools || []);
      } catch (e) {
        console.error("Failed to parse saved form state", e);
      }
    } else {
      // Default tool to get them started
      setTools([{ name: "Cursor", plan: "Pro", monthlySpend: 20, seats: 1 }]);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("credex_audit_form", JSON.stringify({ teamSize, useCase, tools }));
  }, [teamSize, useCase, tools]);

  const addTool = () => {
    setTools([...tools, { name: "ChatGPT", plan: "Plus", monthlySpend: 20, seats: 1 }]);
  };

  const removeTool = (index: number) => {
    setTools(tools.filter((_, i) => i !== index));
  };

  const updateTool = (index: number, field: keyof ToolInput, value: any) => {
    const newTools = [...tools];
    newTools[index] = { ...newTools[index], [field]: value };
    
    // Auto-update plan if tool name changes to ensure valid plan
    if (field === "name") {
      newTools[index].plan = PLANS[value as ToolName][0];
    }
    
    setTools(newTools);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tools.length === 0) return alert("Please add at least one tool.");
    onComplete({ teamSize, primaryUseCase: useCase, tools });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto glass p-8 rounded-2xl shadow-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Company Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Company Profile</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Team Size</label>
              <input 
                type="number" 
                min="1"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full bg-card border border-border rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Primary Use Case</label>
              <select 
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className="w-full bg-card border border-border rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
              >
                <option value="coding">Coding / Engineering</option>
                <option value="writing">Content / Writing</option>
                <option value="data">Data Analysis</option>
                <option value="mixed">Mixed / General</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tools */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-foreground">AI Tool Stack</h2>
            <button 
              type="button" 
              onClick={addTool}
              className="text-sm flex items-center gap-1 text-primary hover:text-blue-400 transition-colors"
            >
              <Plus size={16} /> Add Tool
            </button>
          </div>
          
          <div className="space-y-3">
            {tools.map((tool, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-3 items-end bg-card/50 p-4 rounded-xl border border-border"
              >
                <div className="flex-1">
                  <label className="block text-xs text-muted-foreground mb-1">Tool</label>
                  <select 
                    value={tool.name}
                    onChange={(e) => updateTool(index, "name", e.target.value)}
                    className="w-full bg-card border border-border rounded-md px-3 py-1.5 text-sm outline-none"
                  >
                    {AVAILABLE_TOOLS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                
                <div className="flex-1">
                  <label className="block text-xs text-muted-foreground mb-1">Plan</label>
                  <select 
                    value={tool.plan}
                    onChange={(e) => updateTool(index, "plan", e.target.value)}
                    className="w-full bg-card border border-border rounded-md px-3 py-1.5 text-sm outline-none"
                  >
                    {PLANS[tool.name].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div className="w-24">
                  <label className="block text-xs text-muted-foreground mb-1">Seats</label>
                  <input 
                    type="number" min="1"
                    value={tool.seats}
                    onChange={(e) => updateTool(index, "seats", Number(e.target.value))}
                    className="w-full bg-card border border-border rounded-md px-3 py-1.5 text-sm outline-none"
                  />
                </div>

                <div className="w-28">
                  <label className="block text-xs text-muted-foreground mb-1">Total $/mo</label>
                  <div className="relative">
                    <span className="absolute left-2 top-1.5 text-muted-foreground text-sm">$</span>
                    <input 
                      type="number" min="0"
                      value={tool.monthlySpend}
                      onChange={(e) => updateTool(index, "monthlySpend", Number(e.target.value))}
                      className="w-full bg-card border border-border rounded-md pl-6 pr-3 py-1.5 text-sm outline-none"
                    />
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={() => removeTool(index)}
                  className="p-2 text-muted-foreground hover:text-red-400 transition-colors rounded-md hover:bg-red-400/10"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-4 rounded-xl font-bold text-white bg-primary hover:bg-blue-600 transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] flex justify-center items-center gap-2"
        >
          Run Audit <ArrowRight size={20} />
        </button>

      </form>
    </motion.div>
  );
}
