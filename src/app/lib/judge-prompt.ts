import { EvaluationRequest, EvaluationResult } from '../types';

/**
 * @fileOverview AI Judge Prompt Engineering & Parsing.
 * Logic used to transform submissions into structured AI verdicts.
 */

/**
 * PROMPT ENGINEERING NOTES:
 * 1. ROLE CLARITY: AI is a judge, not an assistant.
 * 2. EXPLICIT CRITERIA: Requirements are numbered for per-item checking.
 * 3. ANTI-PARTIAL-CREDIT: Vague answers are rejected explicitly.
 */
export function buildJudgePrompt(request: EvaluationRequest): string {
  const requirements = request.bountyRequirements
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map((line, i) => `${i + 1}. ${line}`)
    .join('\n');

  return `You are a strict, impartial bounty judge for an onchain bounty platform. 
Your job is to evaluate whether a submission meets ALL stated requirements — nothing more, nothing less. 
You do not give partial credit.

=== BOUNTY INFORMATION ===
Title: ${request.bountyTitle}
Description: ${request.bountyDescription}
Requirements that MUST be met:
${requirements}

=== SUBMISSION TO EVALUATE ===
${request.submission}

=== YOUR TASK ===
Evaluate the submission against EACH requirement above.
You must check EVERY requirement individually.
APPROVED: ONLY if the submission clearly and explicitly addresses ALL listed requirements.
REJECTED: If ANY requirement is not clearly met.
A vague or partial answer does NOT qualify for approval.
The submitter must demonstrate they actually completed the work — not just described what they would do.

=== OUTPUT FORMAT ===
Respond with ONLY valid JSON. No explanation outside JSON. No markdown. No backticks. 
Just raw JSON matching this schema:
{
  "verdict": "APPROVED" | "REJECTED",
  "reason": "2-3 sentence plain English explanation of your decision",
  "confidence": number between 0 and 100,
  "criteriaChecked": ["requirement 1 - met/not met", "requirement 2 - met/not met"...],
  "missingCriteria": ["what exactly was missing or empty array if approved"]
}`;
}

export function parseJudgeResponse(rawText: string): Omit<EvaluationResult, 'evaluationMs' | 'evaluatedAt' | 'model'> {
  try {
    // Strip markdown JSON fences if Gemini includes them
    const cleanJson = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      verdict: parsed.verdict === 'APPROVED' ? 'APPROVED' : 'REJECTED',
      reason: parsed.reason || 'No reason provided by AI.',
      confidence: parsed.confidence || 0,
      criteriaChecked: parsed.criteriaChecked || [],
      missingCriteria: parsed.missingCriteria || [],
    };
  } catch (error) {
    console.error('AI Parse Error:', error);
    return {
      verdict: 'REJECTED',
      reason: 'AI evaluation failed to generate a parseable response. This is usually due to an internal formatting error.',
      confidence: 0,
      criteriaChecked: [],
      missingCriteria: ['AI Parsing Error'],
    };
  }
}
