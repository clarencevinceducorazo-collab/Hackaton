import { NextResponse } from 'next/server';
import { evaluateSubmission } from '@/ai/flows/evaluate-submission-flow';
import { EvaluationRequest } from '@/app/types/evaluation';

/**
 * Gemini 1.5 Flash free tier = 15 requests/minute, 1M tokens/day.
 * For a hackathon demo this is more than enough.
 * For production: add request queuing or upgrade to paid tier.
 */

export async function POST(req: Request) {
  try {
    const body: EvaluationRequest = await req.json();

    // Validation before AI call
    if (!body.bountyTitle || !body.bountyRequirements || !body.submission) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (body.submission.trim().length < 20) {
      return NextResponse.json({ error: 'Submission too short to evaluate' }, { status: 400 });
    }

    // Performance tracking
    const startTime = performance.now();
    
    // gemini-1.5-flash = fastest free model, ideal for structured output
    const result = await evaluateSubmission({
      bountyTitle: body.bountyTitle,
      bountyDescription: body.bountyDescription,
      bountyRequirements: body.bountyRequirements,
      submission: body.submission,
    });

    const endTime = performance.now();

    return NextResponse.json({
      ...result,
      evaluatedAt: new Date().toISOString(),
      model: 'gemini-1.5-flash',
      evaluationMs: Math.round(endTime - startTime),
    });
  } catch (error: any) {
    console.error('AI Evaluation Error:', error);
    return NextResponse.json(
      { error: error.message || 'AI evaluation service unavailable. Please retry.' },
      { status: 500 }
    );
  }
}
