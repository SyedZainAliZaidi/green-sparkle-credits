import { supabase } from "@/integrations/supabase/client";

let currentAudio: HTMLAudioElement | null = null;

export interface VoiceOptions {
  text: string;
  language?: 'en' | 'ur';
  voiceId?: string;
}

export async function speakText(options: VoiceOptions): Promise<HTMLAudioElement | null> {
  const { text, language = 'en', voiceId } = options;

  try {
    console.log(`Speaking text in ${language}:`, text.substring(0, 50));

    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }

    // Call edge function to generate speech
    const { data, error } = await supabase.functions.invoke('text-to-speech', {
      body: { text, language, voiceId },
    });

    if (error) {
      console.error('Text-to-speech error:', error);
      throw error;
    }

    if (!data || !data.audioContent) {
      throw new Error('No audio content returned');
    }

    // Convert base64 to blob and play
    const audioBlob = base64ToBlob(data.audioContent, 'audio/mpeg');
    const audioUrl = URL.createObjectURL(audioBlob);
    const audioElement = new Audio(audioUrl);
    
    currentAudio = audioElement;

    // Clean up URL when audio finishes
    audioElement.addEventListener('ended', () => {
      URL.revokeObjectURL(audioUrl);
      currentAudio = null;
    });

    await audioElement.play();
    return audioElement;

  } catch (error) {
    console.error('Voice service error:', error);
    
    // Fallback to browser's built-in speech synthesis
    return fallbackToWebSpeech(text, language);
  }
}

export function stopSpeaking(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  
  // Also stop web speech synthesis if active
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeaking(): boolean {
  return currentAudio !== null && !currentAudio.paused;
}

// Helper to convert base64 to Blob
function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

// Fallback to browser's built-in speech synthesis
function fallbackToWebSpeech(text: string, language: 'en' | 'ur'): null {
  if ('speechSynthesis' in window) {
    console.log('Falling back to browser speech synthesis');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'ur' ? 'ur-PK' : 'en-PK';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }
  return null;
}

// Generate narration for results page
export function generateResultsNarration(
  submission: {
    cookstove_type: string;
    credits_earned: number;
    co2_prevented: number;
  },
  language: 'en' | 'ur' = 'en'
): string {
  if (language === 'ur') {
    return `مبارک ہو! آپ کے ${submission.cookstove_type} چولہے کی تصدیق ہو گئی ہے۔ 
آپ نے ${submission.credits_earned} کاربن کریڈٹس حاصل کیے ہیں۔ 
آپ کا چولہہ سالانہ ${submission.co2_prevented} ٹن CO2 کو روکتا ہے۔
یہ ${Math.round(submission.co2_prevented * 15)} درخت لگانے کے برابر ہے۔`;
  }

  const pkrValue = Math.round(submission.credits_earned * 0.5 * 280);
  const treesEquivalent = Math.round(submission.co2_prevented * 15);

  return `Congratulations! Your ${submission.cookstove_type} cookstove has been verified. 
You have earned ${submission.credits_earned} carbon credits, worth approximately ${pkrValue} Pakistani Rupees. 
Your cookstove prevents ${submission.co2_prevented} tons of CO2 annually, 
equivalent to planting ${treesEquivalent} trees. 
This reduces indoor air pollution by 65 percent, a critical issue in Pakistani households.`;
}

// Generate narration for dashboard
export function generateDashboardNarration(
  stats: {
    totalCredits: number;
    pkrValue: number;
    totalCO2: number;
    treesPlanted: number;
    familiesBenefited: number;
  },
  language: 'en' | 'ur' = 'en'
): string {
  if (language === 'ur') {
    return `آپ کا اثر: آپ نے کل ${stats.totalCredits} کاربن کریڈٹس حاصل کیے ہیں، 
جس کی قیمت تقریباً ${stats.pkrValue} روپے ہے۔ 
آپ نے ${stats.totalCO2.toFixed(1)} ٹن CO2 کو روکا ہے، 
جو ${stats.treesPlanted} درخت لگانے کے برابر ہے۔ 
آپ کی کوششوں سے ${stats.familiesBenefited} پاکستانی خاندانوں کو فائدہ پہنچا ہے۔`;
  }

  return `Your impact summary: You have earned a total of ${stats.totalCredits} carbon credits, 
worth approximately ${stats.pkrValue} Pakistani Rupees. 
You have prevented ${stats.totalCO2.toFixed(1)} tons of CO2 emissions, 
equivalent to planting ${stats.treesPlanted} trees. 
Your efforts have benefited ${stats.familiesBenefited} Pakistani families.`;
}

// Generate instructions for upload page
export function generateUploadInstructions(language: 'en' | 'ur' = 'en'): string {
  if (language === 'ur') {
    return `ہدایات: اپنے بہتر چولہے کی صاف تصویر لیں۔ 
یقینی بنائیں کہ پورا چولہا دکھائی دے رہا ہو اور روشنی اچھی ہو۔ 
ہمارا AI چند سیکنڈ میں اس کی تصدیق کرے گا اور آپ کو فوری طور پر کاربن کریڈٹس ملیں گے۔`;
  }

  return `Instructions: Take a clear photo of your improved cookstove. 
Make sure the entire stove is visible and well-lit. 
Our AI will verify it in seconds and you'll earn carbon credits instantly.`;
}
