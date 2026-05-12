import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { z } from 'zod';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || 'dummy' });
const resend = new Resend(process.env.RESEND_API_KEY || 'dummy');

// Using the service role key if available, otherwise anon key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy'
);

const RequestSchema = z.object({
  email: z.string().email(),
  input: z.any(),
  result: z.any(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, input, result } = RequestSchema.parse(body);

    // Generate Summary with Anthropic
    let summary = "";
    try {
      const toolBreakdown = result.recommendations.map((r: any) => 
        `- ${r.tool}: Spend $${r.currentSpend}/mo. Rec: ${r.recommendedAction} (Save $${r.savings}/mo)`
      ).join('\n');

      const prompt = `
Team Size: ${input.teamSize}
Primary Use Case: ${input.primaryUseCase}

Current Stack & Spend:
${toolBreakdown}

Total Current Spend: $${result.totalCurrentSpend}/mo
Optimized Spend: $${result.totalOptimizedSpend}/mo
Potential Savings: $${result.totalMonthlySavings}/mo ($${result.totalAnnualSavings}/yr)

Write a personalized ~100-word summary addressing the founder or engineering manager. Focus on the most impactful change they can make today. Be direct and professional. Do not manufacture savings. Keep it to a single paragraph.
`;

      if (process.env.ANTHROPIC_API_KEY) {
        const msg = await anthropic.messages.create({
          model: "claude-3-haiku-20240307",
          max_tokens: 300,
          system: "You are an expert SaaS finance optimization consultant. Your job is to analyze a startup's AI tool spend and provide a concise, hard-hitting, ~100-word personalized summary of where they are wasting money and what they should do next.",
          messages: [{ role: "user", content: prompt }]
        });
        
        // Handle ContentBlock text extraction properly based on Anthropic SDK types
        if (msg.content[0].type === 'text') {
          summary = msg.content[0].text;
        }
      } else {
        // Fallback if no API key is provided
        summary = `Based on your team size of ${input.teamSize}, you have the potential to save $${result.totalMonthlySavings}/mo. The highest impact change is addressing your ${result.recommendations[0]?.tool} spend by choosing to ${result.recommendations[0]?.recommendedAction.toLowerCase()}. Please review the detailed breakdown to implement these savings.`;
      }
    } catch (e) {
      console.error("Anthropic Error:", e);
      // Fallback
      summary = `Based on your inputs, you have the potential to save $${result.totalAnnualSavings}/year. Please review the detailed breakdown below.`;
    }

    //  Save to DB (mocking an ID if DB isn't configured)
    let shareId = crypto.randomUUID();
    
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://dummy.supabase.co') {
      const { data, error } = await supabase
        .from('leads')
        .insert([{ email, input_data: input, result_data: result, summary }])
        .select()
        .single();
        
      if (error) {
        // We log it but don't fail the user request if it's just a missing table setup locally
        console.error("Supabase Error:", error);
      } else if (data) {
        shareId = data.id;
      }
    }

    //  Send Email
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'dummy') {
      const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: `Your AI Spend Audit: $${result.totalAnnualSavings} in Savings Found`,
        html: `
          <h2>Your AI Spend Audit is Ready</h2>
          <p>${summary}</p>
          <p><strong>Total Annual Savings:</strong> $${result.totalAnnualSavings}</p>
          <p>View your full report here: <a href="https://credex.rocks/share/${shareId}">View Report</a></p>
        `
      });

      if (error) {
        console.error("Resend API Error:", error);
        return NextResponse.json({ error: "Failed to send email: " + error.message }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true, id: shareId });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
