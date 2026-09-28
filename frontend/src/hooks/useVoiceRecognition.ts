import { useState, useEffect, useCallback } from 'react';

// Extend window object for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useVoiceRecognition(language: string = 'hi-IN') {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = language;

        rec.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        rec.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          if (event.error === 'not-allowed') {
            setError("Microphone access denied. Please allow microphone permissions.");
          } else {
            setError(`Error: ${event.error}`);
          }
          setIsRecording(false);
        };

        rec.onend = () => {
          setIsRecording(false);
        };

        setRecognition(rec);
      } else {
        setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      }
    }
  }, [language]);

  const startRecording = useCallback(() => {
    setError(null);
    setTranscript('');
    if (recognition) {
      try {
        recognition.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Failed to start recording", err);
      }
    }
  }, [recognition]);

  const stopRecording = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  }, [recognition]);

  return {
    isRecording,
    transcript,
    startRecording,
    stopRecording,
    error,
    isSupported: !!recognition
  };
}
