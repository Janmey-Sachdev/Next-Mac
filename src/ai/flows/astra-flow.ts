'use server';
/**
 * @fileOverview A conversational AI flow for the Astra assistant.
 *
 * - astraChat - A function that handles the chat conversation.
 */

import {ai} from '@/ai/genkit';
import type { AstraChatInput, AstraChatOutput } from '@/ai/flows/astra-types';
import { AstraChatInputSchema, AstraChatOutputSchema } from '@/ai/flows/astra-types';


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
