'use server';
/**
 * @fileOverview A conversational AI flow for the Astra assistant.
 *
 * - astraChat - A function that handles the chat conversation.
 * - AstraChatInput - The input type for the astraChat function.
 * - AstraChatOutput - The return type for the astraChat function.
 */

import {ai} from '@/ai/genkit';
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


export async function astraChat(input: AstraChatInput): Promise<AstraChatOutput> {
  return astraChatFlow(input);
}

const astraChatFlow = ai.defineFlow(
  {
    name: 'astraChatFlow',
    inputSchema: AstraChatInputSchema,
    outputSchema: AstraChatOutputSchema,
  },
  async (input) => {
    const { history, message } = input;
    
    const augmentedHistory = [
        ...history,
        { role: 'user' as const, content: [{ text: message }] },
    ];

    const { output } = await ai.generate({
      prompt: 'You are Astra, a helpful AI assistant integrated into NextMac OS. Keep your responses concise and helpful. Your personality is friendly and curious.',
      history: augmentedHistory,
    });
    
    return {
      response: output?.text || "I'm sorry, I couldn't generate a response.",
    };
  }
);
