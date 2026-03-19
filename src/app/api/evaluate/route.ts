import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildJudgePrompt, parseJudgeResponse } from '@/app/lib/judge-prompt';
import { EvaluationRequest } from '@/app/types';

/**
 * @fileOverview AI Judge Endpoint.
 * Securely calls Gemini 1.5 Flash using server-side API key.
 */

export async function POST(req: Request) {
  try {
    const body: EvaluationRequest = await req.json();

    // 1. Validation
    if (!body.bountyTitle || !body.bountyRequirements || !body.submission) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (body.submission.trim().length < 20) {
      return NextResponse.json({ error: 'Submission too short. Minimum 20 characters.' }, { status: 400 });
    }

    // 2. Configuration
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI Judge not configured. Check environment variables.' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // gemini-1.5-flash = fastest free model, ideal for structured output
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.1, // Low temperature = more deterministic, consistent verdicts
        maxOutputTokens: 1024,
      }
    });

    const startTime = Date.now();
    const prompt = buildJudgePrompt(body);

    // 3. AI Generation
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const endTime = Date.now();

    // 4. Parsing
    const evaluation = parseJudgeResponse(rawText);

    return NextResponse.json({
      ...evaluation,
      evaluatedAt: new Date().toISOString(),
      evaluationMs: endTime - startTime,
      model: 'gemini-1.5-flash',
    });

  } catch (error: any) {
    console.error('AI API Error:', error);
    return NextResponse.json({ error: 'AI evaluation service unavailable. Please retry.' }, { status: 500 });
  }
}
