'use server';
/**
 * @fileOverview AI Judge Flow for bounty evaluation.
 * 
 * PROMPT ENGINEERING NOTES:
 * The quality of the AI judge depends entirely on the prompt.
 * 1. ROLE CLARITY: AI is told it is a judge, not an assistant.
 * 2. EXPLICIT CRITERIA: Requirements are numbered.
 * 3. LOW TEMPERATURE (0.1): Reduces randomness.
 * 4. JSON-ONLY OUTPUT: Prevents prose responses.
 * 5. ANTI-PARTIAL-CREDIT: Vague answers are rejected.
 * 6. ACTIONABLE FEEDBACK: Forces explanation of missing items.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EvaluationInputSchema = z.object({
  bountyTitle: z.string(),
  bountyDescription: z.string(),
  bountyRequirements: z.string(),
  submission: z.string(),
});

const EvaluationOutputSchema = z.object({
  verdict: z.enum(['APPROVED', 'REJECTED']),
  reason: z.string(),
  confidence: z.number().min(0).max(100),
  criteriaChecked: z.array(z.string()),
  missingCriteria: z.array(z.string()),
});

export async function evaluateSubmission(input: z.infer<typeof EvaluationInputSchema>) {
  return evaluateSubmissionFlow(input);
}

const judgePrompt = ai.definePrompt({
  name: 'judgePrompt',
  input: { schema: EvaluationInputSchema },
  output: { schema: EvaluationOutputSchema },
  config: { temperature: 0.1 },
  prompt: `You are a strict, impartial bounty judge for an onchain bounty platform. 
Your job is to evaluate whether a submission meets the stated requirements — nothing more, nothing less. 
You do not give partial credit.

=== BOUNTY INFORMATION ===
Title: {{bountyTitle}}
Description: {{bountyDescription}}
Requirements that MUST be met:
{{bountyRequirements}}

=== SUBMISSION TO EVALUATE ===
{{submission}}

=== YOUR TASK ===
Evaluate the submission against EACH requirement above.
You must check EVERY requirement individually.
APPROVED: ONLY if the submission clearly and explicitly addresses ALL listed requirements.
REJECTED: If ANY requirement is not clearly met.
A vague or partial answer does NOT qualify for approval.
The submitter must demonstrate they actually completed the work — not just described what they would do.

=== OUTPUT FORMAT ===
Respond with ONLY valid JSON matching the specified schema.`,
});

const evaluateSubmissionFlow = ai.defineFlow(
  {
    name: 'evaluateSubmissionFlow',
    inputSchema: EvaluationInputSchema,
    outputSchema: EvaluationOutputSchema,
  },
  async (input) => {
    const { output } = await judgePrompt(input);
    if (!output) {
      throw new Error('AI evaluation failed to generate output.');
    }
    return output;
  }
);
