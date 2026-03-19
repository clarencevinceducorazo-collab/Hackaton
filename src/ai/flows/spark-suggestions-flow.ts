'use server';
/**
 * @fileOverview A Genkit flow for generating creative spark suggestions based on user content.
 *
 * - sparkSuggestions - A function that handles the AI spark suggestion process.
 * - SparkSuggestionsInput - The input type for the sparkSuggestions function.
 * - SparkSuggestionsOutput - The return type for the sparkSuggestions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SparkSuggestionsInputSchema = z
  .string()
  .describe('The content the user is currently working on in a card.');
export type SparkSuggestionsInput = z.infer<typeof SparkSuggestionsInputSchema>;

const SparkSuggestionsOutputSchema = z
  .string()
  .describe('Creative prompts, relevant ideas, or expanded thoughts.');
export type SparkSuggestionsOutput = z.infer<
  typeof SparkSuggestionsOutputSchema
>;

export async function sparkSuggestions(
  input: SparkSuggestionsInput
): Promise<SparkSuggestionsOutput> {
  return sparkSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sparkSuggestionsPrompt',
  input: { schema: SparkSuggestionsInputSchema },
  output: { schema: SparkSuggestionsOutputSchema },
  prompt: `You are an AI assistant designed to help users overcome creative blocks and generate new ideas.
Based on the following content, provide creative prompts, relevant ideas, or expanded thoughts.
Focus on sparking creativity and offering diverse perspectives.

Content: {{{this}}}`,
});

const sparkSuggestionsFlow = ai.defineFlow(
  {
    name: 'sparkSuggestionsFlow',
    inputSchema: SparkSuggestionsInputSchema,
    outputSchema: SparkSuggestionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
