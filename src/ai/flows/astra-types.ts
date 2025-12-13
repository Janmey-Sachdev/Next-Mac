/**
 * @fileOverview Types and schemas for the Astra AI flow.
 *
 * - AstraChatInput - The input type for the astraChat function.
 * - AstraChatOutput - The return type for the astraChat function.
 * - AstraChatInputSchema - The Zod schema for the input.
 * - AstraChatOutputSchema - The Zod schema for the output.
 */

import {z} from 'genkit';

export const AstraChatInputSchema = z.object({
    history: z.array(z.object({
        role: z.enum(['user', 'model']),
        content: z.array(z.object({ text: z.string() })),
    })).describe('The conversation history.'),
    message: z.string().describe('The latest user message.'),
});
export type AstraChatInput = z.infer<typeof AstraChatInputSchema>;

export const AstraChatOutputSchema = z.object({
    response: z.string().describe('The AI\'s response message.'),
});
export type AstraChatOutput = z.infer<typeof AstraChatOutputSchema>;
