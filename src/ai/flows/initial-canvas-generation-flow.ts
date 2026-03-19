'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating an initial set of interconnected idea cards
 * based on a high-level user prompt, to kickstart brainstorming on a new canvas.
 *
 * - initialCanvasGeneration - A function that orchestrates the generation of initial idea cards.
 * - InitialCanvasGenerationInput - The input type for the initialCanvasGeneration function.
 * - InitialCanvasGenerationOutput - The return type for the initialCanvasGeneration function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const InitialCanvasGenerationInputSchema = z.object({
  prompt: z
    .string()
    .describe(
      'A high-level prompt describing the theme or goal for the new canvas/project.'
    ),
});
export type InitialCanvasGenerationInput = z.infer<
  typeof InitialCanvasGenerationInputSchema
>;

const CardSchema = z.object({
  title: z
    .string()
    .describe('A concise and descriptive title for the idea card.'),
  content: z
    .string()
    .describe(
      'Detailed content or description for the idea card, elaborating on the title and providing actionable insights.'
    ),
});

const InitialCanvasGenerationOutputSchema = z.object({
  ideas: z
    .array(CardSchema)
    .describe('A list of interconnected idea cards generated from the prompt.'),
});
export type InitialCanvasGenerationOutput = z.infer<
  typeof InitialCanvasGenerationOutputSchema
>;

export async function initialCanvasGeneration(
  input: InitialCanvasGenerationInput
): Promise<InitialCanvasGenerationOutput> {
  return initialCanvasGenerationFlow(input);
}

const initialCanvasGenerationPrompt = ai.definePrompt({
  name: 'initialCanvasGenerationPrompt',
  input: { schema: InitialCanvasGenerationInputSchema },
  output: { schema: InitialCanvasGenerationOutputSchema },
  prompt: `You are a creative brainstorming assistant specializing in generating interconnected idea cards for a digital canvas.

Based on the following high-level prompt, generate a set of 3-5 distinct yet interconnected idea cards. Each card should have a 'title' and 'content' field.

The 'title' should be concise and capture the essence of the idea.
The 'content' should provide a detailed description, expanding on the title and offering initial thoughts or potential directions for the idea.

Ensure that the generated ideas are cohesive and provide a strong foundation for a brainstorming session on the given topic. Respond only with a JSON object conforming to the specified output schema.

High-level Prompt: {{{prompt}}}`,
});

const initialCanvasGenerationFlow = ai.defineFlow(
  {
    name: 'initialCanvasGenerationFlow',
    inputSchema: InitialCanvasGenerationInputSchema,
    outputSchema: InitialCanvasGenerationOutputSchema,
  },
  async (input) => {
    const { output } = await initialCanvasGenerationPrompt(input);
    if (!output) {
      throw new Error('Failed to generate initial canvas ideas.');
    }
    return output;
  }
);
