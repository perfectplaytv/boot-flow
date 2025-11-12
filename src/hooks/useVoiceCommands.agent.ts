import { useCallback, useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
}

export interface VoiceCommand {
  pattern: RegExp;
  handler: (phrase: string) => void | Promise<void>;
}

export interface VoiceCommandsOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export const useVoiceCommands = (commands: VoiceCommand[], options?: VoiceCommandsOptions) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const SpeechRecognitionImpl = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognitionImpl) return;

    const recognition = new SpeechRecognitionImpl();
    recognition.lang = options?.lang ?? 'pt-BR';
    recognition.continuous = options?.continuous ?? false;
    recognition.interimResults = options?.interimResults ?? false;
    recognitionRef.current = recognition;
    setIsSupported(true);

    recognition.onresult = async (event) => {
      const phrase = event.results[event.results.length - 1][0].transcript.trim();
      setTranscript(phrase);
      for (const command of commands) {
        if (command.pattern.test(phrase)) {
          await command.handler(phrase);
        }
      }
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    return () => {
      recognition.stop();
    };
  }, [commands, options?.continuous, options?.interimResults, options?.lang]);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.start();
    setIsListening(true);
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    start,
    stop,
  };
};
