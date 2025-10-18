// src/ai/flows/dynamic-wallpaper.ts
'use server';
/**
 * @fileOverview A flow that retrieves a daily desktop wallpaper based on user preferences.
 *
 * - getDynamicWallpaper - A function that retrieves a daily desktop wallpaper based on user preferences.
 * - DynamicWallpaperInput - The input type for the getDynamicWallpaper function.
 * - DynamicWallpaperOutput - The return type for the getDynamicWallpaper function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DynamicWallpaperInputSchema = z.object({
  theme: z.string().describe('The theme or style of the wallpaper.'),
});
export type DynamicWallpaperInput = z.infer<typeof DynamicWallpaperInputSchema>;

const DynamicWallpaperOutputSchema = z.object({
  wallpaperDataUri: z
    .string()
    .describe(
      'A data URI containing the image for the wallpaper, must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'      
    ),
});
export type DynamicWallpaperOutput = z.infer<typeof DynamicWallpaperOutputSchema>;

export async function getDynamicWallpaper(input: DynamicWallpaperInput): Promise<DynamicWallpaperOutput> {
  return dynamicWallpaperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dynamicWallpaperPrompt',
  input: {schema: DynamicWallpaperInputSchema},
  output: {schema: DynamicWallpaperOutputSchema},
  prompt: `You are an expert in generating amazing desktop wallpapers.

  Based on the user's preferences for themes or styles, generate a suitable wallpaper.

  Theme/Style: {{{theme}}}

  The wallpaperDataUri should be a data URI that includes a MIME type and uses Base64 encoding.
  Return only the wallpaperDataUri in the specified format.  Do not return any other text.
  `,
});

const dynamicWallpaperFlow = ai.defineFlow(
  {
    name: 'dynamicWallpaperFlow',
    inputSchema: DynamicWallpaperInputSchema,
    outputSchema: DynamicWallpaperOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate a desktop wallpaper with the following theme: ${input.theme}`,
    });

    if (!media || !media.url) {
      throw new Error('Failed to generate wallpaper.');
    }

    return {
      wallpaperDataUri: media.url,
    };
  }
);
