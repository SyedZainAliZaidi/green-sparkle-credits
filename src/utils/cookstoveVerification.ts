import Replicate from 'replicate';

// Initialize Replicate (you'll need API key in environment variables)
const replicate = new Replicate({
  auth: import.meta.env.VITE_REPLICATE_API_TOKEN,
});

export interface VerificationResult {
  isCleanCookstove: boolean;
  cookstoveType: string;
  confidence: number;
  efficiencyRating: number;
  details: string;
}

export async function verifyCookstove(imageBase64: string): Promise<VerificationResult> {
  try {
    // Use a vision model like CLIP or LLaVA for image classification
    const output = await replicate.run(
      "salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
      {
        input: {
          image: imageBase64,
          task: "image_captioning",
        }
      }
    );

    // For more advanced verification, use GPT-4 Vision via Replicate
    const visionOutput = await replicate.run(
      "yorickvp/llava-13b:b5f6212d032508382d61ff00469ddda3e32fd8a0e75dc39d8a4191bb742157fb",
      {
        input: {
          image: imageBase64,
          prompt: `Analyze this image and determine:
1. Is this a clean cookstove (improved biomass stove, LPG stove, electric stove, or solar cooker)?
2. What specific type of cookstove is it?
3. Estimate its efficiency rating (10-90%)
4. Is it in good working condition?

Respond in JSON format:
{
  "isCleanCookstove": true/false,
  "type": "type name",
  "efficiency": number,
  "condition": "good/fair/poor",
  "confidence": 0-100,
  "reasoning": "explanation"
}`
        }
      }
    );

    // Parse the AI response
    const result = parseAIResponse(visionOutput);
    
    return {
      isCleanCookstove: result.isCleanCookstove,
      cookstoveType: result.type,
      confidence: result.confidence,
      efficiencyRating: result.efficiency,
      details: result.reasoning,
    };
  } catch (error) {
    console.error('Cookstove verification failed:', error);
    throw new Error('Failed to verify cookstove');
  }
}

function parseAIResponse(response: any): any {
  // Extract JSON from the response
  const text = typeof response === 'string' ? response : JSON.stringify(response);
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  
  // Fallback parsing
  return {
    isCleanCookstove: false,
    type: 'unknown',
    efficiency: 0,
    confidence: 0,
    reasoning: 'Could not parse AI response'
  };
}
