import { supabase } from "@/integrations/supabase/client";

export interface TTSOptions {
  voiceId?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

class TextToSpeechService {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;

  async speak(text: string, options: TTSOptions = {}) {
    try {
      // Stop any currently playing audio
      this.stop();

      options.onStart?.();

      console.log('Calling text-to-speech function...');

      // Call edge function
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text,
          voiceId: options.voiceId || '9BWtsMINqrJLrRacOk9x' // Aria voice
        }
      });

      if (error) {
        throw error;
      }

      if (!data?.audioContent) {
        throw new Error('No audio content received');
      }

      console.log('Audio received, playing...');

      // Convert base64 to blob
      const audioBlob = this.base64ToBlob(data.audioContent, 'audio/mpeg');
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create and play audio
      this.audio = new Audio(audioUrl);
      this.isPlaying = true;

      this.audio.onended = () => {
        this.isPlaying = false;
        URL.revokeObjectURL(audioUrl);
        options.onEnd?.();
      };

      this.audio.onerror = (e) => {
        this.isPlaying = false;
        console.error('Audio playback error:', e);
        options.onError?.(new Error('Failed to play audio'));
      };

      await this.audio.play();

    } catch (error) {
      this.isPlaying = false;
      console.error('Text-to-speech error:', error);
      options.onError?.(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
      this.isPlaying = false;
    }
  }

  pause() {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  resume() {
    if (this.audio && !this.isPlaying) {
      this.audio.play();
      this.isPlaying = true;
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }
}

export const ttsService = new TextToSpeechService();
