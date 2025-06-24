'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate a representative farmer persona based on existing CRM data.
 *
 * - generateFarmerPersona - A function that generates a farmer persona.
 * - GenerateFarmerPersonaInput - The input type for the generateFarmerPersona function.
 * - GenerateFarmerPersonaOutput - The return type for the generateFarmerPersona function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFarmerPersonaInputSchema = z.object({
  farmerDataSummary: z
    .string()
    .describe(
      'A summary of the farmer data, including demographics, farm size, crop types, and challenges.'
    ),
});
export type GenerateFarmerPersonaInput = z.infer<typeof GenerateFarmerPersonaInputSchema>;

const GenerateFarmerPersonaOutputSchema = z.object({
  personaName: z.string().describe('The name of the generated farmer persona.'),
  personaDescription: z
    .string()
    .describe('A detailed description of the generated farmer persona.'),
});
export type GenerateFarmerPersonaOutput = z.infer<typeof GenerateFarmerPersonaOutputSchema>;

export async function generateFarmerPersona(
  input: GenerateFarmerPersonaInput
): Promise<GenerateFarmerPersonaOutput> {
  return generateFarmerPersonaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFarmerPersonaPrompt',
  input: {schema: GenerateFarmerPersonaInputSchema},
  output: {schema: GenerateFarmerPersonaOutputSchema},
  prompt: `You are an expert in creating representative personas based on data.

  Based on the following summary of farmer data, generate a representative farmer persona. Include a name and a detailed description of the persona, including their background, farming practices, challenges, and goals.

  Farmer Data Summary: {{{farmerDataSummary}}}
  `,
});

const generateFarmerPersonaFlow = ai.defineFlow(
  {
    name: 'generateFarmerPersonaFlow',
    inputSchema: GenerateFarmerPersonaInputSchema,
    outputSchema: GenerateFarmerPersonaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
