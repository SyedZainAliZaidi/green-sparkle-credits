import { supabase } from "@/integrations/supabase/client";

export interface CookstoveAnalysis {
  detected: boolean;
  cookstove_type: string;
  confidence_score: number;
  co2_prevented: number;
  credits_earned: number;
  fallback?: boolean;
}

export async function analyzeCookstove(imageUrl: string): Promise<CookstoveAnalysis> {
  console.log('🔍 Analyzing image:', imageUrl);
  
  // Simulate AI processing delay (2 seconds)
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Smart mock: vary results based on random factors
  const random = Math.random();
  
  // Pakistani cookstove types with realistic distribution
  const types: Array<'improved biomass' | 'LPG' | 'traditional' | 'electric'> = [
    'improved biomass', // Most common in rural Pakistan
    'improved biomass', // Weighted to appear more often
    'LPG',              // Common in urban areas
    'traditional',      // Still used in many areas
    'electric'          // Rare but growing
  ];
  
  const type = types[Math.floor(random * types.length)];
  
  // CO2 reduction factors based on cookstove type (kg CO2 prevented per day)
  const co2Factors: Record<string, number> = {
    'improved biomass': 2.3,  // Standard improved chulha
    'LPG': 1.5,               // Clean but fossil fuel
    'traditional': 0.5,        // Minimal improvement
    'electric': 0.8            // Depends on grid mix
  };
  
  const co2 = co2Factors[type];
  const confidence = Math.floor(85 + random * 10); // 85-95% confidence
  const credits = Math.round(co2 * 5);
  
  const result = {
    detected: true,
    cookstove_type: type,
    confidence_score: confidence,
    co2_prevented: co2,
    credits_earned: credits
  };
  
  console.log('✅ AI Result:', result);
  console.log(`📊 Type: ${type} | Confidence: ${confidence}% | CO2: ${co2}kg | Credits: ${credits}`);
  
  return result;
}
