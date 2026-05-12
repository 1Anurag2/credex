import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { CheckCircle2, AlertTriangle, Bot } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy'
);

// Dynamic OG Tags
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = await params;
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://dummy.supabase.co') {
    const { data } = await supabase.from('leads').select('result_data').eq('id', id).single();
    if (data) {
      const savings = data.result_data.totalAnnualSavings.toLocaleString();
      return {
        title: `AI Spend Audit: $${savings}/yr Savings Found`,
        description: `This startup found $${savings} in annual savings on their AI tool spend. Run your own free audit.`,
        openGraph: {
          title: `AI Spend Audit: $${savings}/yr Savings Found`,
          description: `This startup found $${savings} in annual savings on their AI tool spend. Run your own free audit.`,
          images: [`https://via.placeholder.com/1200x630/09090b/3b82f6?text=Saved+$${savings}+on+AI+Spend`]
        },
        twitter: {
          card: 'summary_large_image',
        }
      };
    }
  }

  return {
    title: 'AI Spend Audit Results',
  };
}

export default async function SharePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  // Mock data if no DB connected
  let data = {
    summary: "Based on the team size of 5, there is potential to save $1,200/mo by consolidating ChatGPT and Claude subscriptions and moving bulk operations to the Anthropic API. Reviewing Enterprise tiers vs Pro tiers yields significant runway extensions.",
    result_data: {
      totalMonthlySavings: 1200,
      totalAnnualSavings: 14400,
      recommendations: [
        { tool: "Claude", recommendedAction: "Switch to Pro (Individual)", savings: 110, reason: "Team plan requires 5 minimum seats." },
        { tool: "ChatGPT", recommendedAction: "Consolidate subscriptions", savings: 100, reason: "Paying for both ChatGPT and Claude." }
      ]
    }
  };

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://dummy.supabase.co') {
    const { data: dbData } = await supabase.from('leads').select('*').eq('id', id).single();
    if (dbData) data = dbData;
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden pb-24">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-primary/20 blur-[120px] -z-10 rounded-full" />
      
      <header className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10 border-b border-white/5">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <Bot className="text-primary" />
          Credex<span className="text-muted-foreground">Audit</span>
        </div>
        <a href="/" className="text-sm font-medium text-primary hover:underline">Run Your Own Audit</a>
      </header>

      <div className="container mx-auto px-6 pt-16 relative z-10 max-w-3xl space-y-8">
        
        <div className="text-center space-y-4">
          <div className="inline-block bg-green-400/10 text-green-400 font-medium px-4 py-1.5 rounded-full text-sm mb-4 border border-green-400/20">
            Audit Completed Successfully
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight">
            Found <span className="gradient-text">${data.result_data.totalAnnualSavings.toLocaleString()}</span> in Savings
          </h1>
        </div>

        {/* AI Summary Block */}
        <div className="glass p-8 rounded-2xl border-l-4 border-l-primary relative">
          <Bot className="absolute top-8 right-8 text-white/5" size={100} />
          <h3 className="text-lg font-bold mb-3 text-primary">AI Consultant Summary</h3>
          <p className="text-muted-foreground leading-relaxed text-lg relative z-10">
            {data.summary}
          </p>
        </div>

        {/* Tool Breakdown */}
        <div className="glass rounded-2xl overflow-hidden border border-white/5">
          <div className="p-6 border-b border-border bg-white/[0.02]">
            <h3 className="text-xl font-semibold">Recommendations</h3>
          </div>
          <div className="divide-y divide-border">
            {data.result_data.recommendations.map((rec: any, i: number) => (
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

        {/* CTA */}
        {data.result_data.totalMonthlySavings > 500 && (
          <div className="glass p-8 rounded-2xl border border-primary/30 text-center bg-primary/5 mt-8">
            <h3 className="text-2xl font-bold mb-2">Claim Your Savings</h3>
            <p className="text-muted-foreground mb-6">
              You are eligible for discounted AI infrastructure credits. Book a free consultation with Credex to implement these changes and unlock up to 30% off Anthropic and Cursor.
            </p>
            <a href="https://credex.rocks" target="_blank" className="inline-block bg-primary hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              Book Credex Consultation
            </a>
          </div>
        )}

      </div>
    </main>
  );
}
