import { GoogleGenAI } from "@google/genai";
import { ServiceResponse } from "../types";

// Initialize the API client
// Note: process.env.API_KEY is assumed to be available
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-2.5-flash-image';

/**
 * Helper to strip the data URL prefix from base64 string
 */
const stripBase64Prefix = (base64: string): string => {
  return base64.replace(/^data:image\/[a-z]+;base64,/, "");
};

/**
 * Helper to get MIME type from base64 string
 */
const getMimeType = (base64: string): string => {
  const match = base64.match(/^data:(image\/[a-z]+);base64,/);
  return match ? match[1] : 'image/jpeg';
};

/**
 * Generates a new headshot based on the uploaded image and selected style.
 */
export const generateHeadshot = async (
  base64Image: string, 
  stylePrompt: string
): Promise<ServiceResponse> => {
  try {
    const cleanBase64 = stripBase64Prefix(base64Image);
    const mimeType = getMimeType(base64Image);

    // Prompt engineering for better results
    const fullPrompt = `Transform the person in this image into a professional headshot. 
    Maintain facial identity strictly. 
    Style requirements: ${stylePrompt}. 
    Ensure high quality, sharp focus on eyes, and professional composition.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64
            }
          },
          {
            text: fullPrompt
          }
        ]
      }
    });

    return extractImageFromResponse(response);

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error occurred" };
  }
};

/**
 * Edits an existing headshot using text commands.
 */
export const editHeadshot = async (
  currentImageBase64: string,
  editInstruction: string
): Promise<ServiceResponse> => {
  try {
    const cleanBase64 = stripBase64Prefix(currentImageBase64);
    const mimeType = getMimeType(currentImageBase64);

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64
            }
          },
          {
            text: `Edit this image: ${editInstruction}. Maintain the high quality and resolution.`
          }
        ]
      }
    });

    return extractImageFromResponse(response);

  } catch (error) {
    console.error("Gemini Edit Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error occurred" };
  }
};

/**
 * Extracts the image data from the Gemini response object.
 */
const extractImageFromResponse = (response: any): ServiceResponse => {
  try {
    if (!response || !response.candidates || response.candidates.length === 0) {
      return { success: false, error: "No candidates returned from API" };
    }

    const parts = response.candidates[0].content.parts;
    
    // Iterate to find the inlineData which contains the image
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        const generatedBase64 = part.inlineData.data;
        // Construct a displayable data URL. Gemini output is usually JPEG or PNG.
        // We'll assume PNG or keep the mime type if provided, though usually it's raw bytes.
        // The API often returns 'image/jpeg' or 'image/png' in the mimeType field of inlineData.
        const responseMime = part.inlineData.mimeType || 'image/png';
        const imageUrl = `data:${responseMime};base64,${generatedBase64}`;
        return { success: true, imageUrl };
      }
    }

    // If no image part found, check for text indicating refusal or error
    const textPart = parts.find((p: any) => p.text);
    if (textPart) {
      return { success: false, error: `Model returned text instead of image: ${textPart.text}` };
    }

    return { success: false, error: "No valid image data found in response" };

  } catch (e) {
    return { success: false, error: "Failed to parse API response" };
  }
};
