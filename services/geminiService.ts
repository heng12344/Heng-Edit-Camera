
import { GoogleGenAI, Modality } from "@google/genai";
import { AspectRatio } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const editImage = async (imageData: string, mimeType: string, prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error("No image data found in the response.");
  } catch (error) {
    console.error("Error editing image with Gemini:", error);
    throw new Error("Failed to edit image. Please check the console for details.");
  }
};

export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: aspectRatio,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages[0].image.imageBytes;
    }
    throw new Error("No images were generated.");
  } catch (error) {
    console.error("Error generating image with Imagen:", error);
    throw new Error("Failed to generate image. Please check the console for details.");
  }
};

export const analyzeImage = async (imageData: string, mimeType: string, useProModel: boolean): Promise<string> => {
  try {
    const model = useProModel ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
    const prompt = "Analyze this image in detail. Provide a comprehensive description of its contents, style, and potential meaning.";
    
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { data: imageData, mimeType: mimeType } },
          { text: prompt },
        ]
      },
      config: useProModel ? { thinkingConfig: { thinkingBudget: 32768 } } : {},
    });

    return response.text;
  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    throw new Error("Failed to analyze image. Please check the console for details.");
  }
};
