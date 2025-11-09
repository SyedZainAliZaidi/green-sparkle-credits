export interface CookstoveAnalysis {
  detected: boolean;
  cookstove_type: string;
  confidence_score: number;
  co2_prevented: number;
  credits_earned: number;
}

export async function analyzeCookstove(imageUrl: string): Promise<CookstoveAnalysis> {
  console.log('🤖 AI analyzing:', imageUrl);
  
  // Simulate AI processing time (2 seconds)
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Use image URL hash to get consistent but varied results
  // Same image = same result, different image = different result
  const hash = imageUrl.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  console.log('📊 Hash value:', Math.abs(hash));
  
  // Pakistani cookstove types
  const types = ['improved biomass', 'LPG', 'traditional', 'electric'];
  const type = types[Math.abs(hash) % types.length];
  
  // CO2 reduction factors (kg per day) based on Pakistan context
  const co2Map: Record<string, number> = {
    'improved biomass': 2.3,  // Common in rural Pakistan
    'LPG': 1.5,               // Urban standard
    'traditional': 0.5,        // Minimal improvement
    'electric': 0.8            // Growing but rare
  };
  
  const co2 = co2Map[type];
  const confidence = 85 + (Math.abs(hash) % 10); // 85-94%
  const credits = Math.round(co2 * 5);
  
  const result: CookstoveAnalysis = {
    detected: true,
    cookstove_type: type,
    confidence_score: confidence,
    co2_prevented: co2,
    credits_earned: credits
  };
  
  console.log('✅ AI result:', result);
  console.log(`📋 Type: ${type} | Confidence: ${confidence}% | CO2: ${co2}kg | Credits: ${credits}`);
  
  return result;
}
