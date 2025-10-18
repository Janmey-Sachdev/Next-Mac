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

const dynamicWallpaperFlow = ai.defineFlow(
  {
    name: 'dynamicWallpaperFlow',
    inputSchema: DynamicWallpaperInputSchema,
    outputSchema: DynamicWallpaperOutputSchema,
  },
  async input => {
    // A simple hash function to generate a seed from the theme string
    const getSeed = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0; // Convert to 32bit integer
        }
        return Math.abs(hash);
    };
    
    const seed = getSeed(input.theme);
    const imageUrl = `https://picsum.photos/seed/${seed}/1920/1080`;

    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch wallpaper. Status: ${response.status}`);
    }
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    
    return {
      wallpaperDataUri: `data:${contentType};base64,${base64Image}`,
    };
  }
);
