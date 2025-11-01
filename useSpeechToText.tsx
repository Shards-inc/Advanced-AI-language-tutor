import React, { useState, useRef, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Language } from './types';

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = reader.result as string;
            // remove the data url prefix
            resolve(base64data.substring(base64data.indexOf(',') + 1));
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const useSpeechToText = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startRecording = useCallback(async (language?: Language) => {
        if (isRecording) return;
        setTranscript('');
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                setIsTranscribing(true);
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

                try {
                    const base64Audio = await blobToBase64(audioBlob);
                    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

                    const prompt = language
                        ? `Transcribe this audio. The user is speaking ${language.name}. Respond only with the transcribed text.`
                        : "Transcribe this audio. Respond only with the transcribed text.";

                    // Use a powerful model capable of audio transcription.
                    const response = await ai.models.generateContent({
                        model: 'gemini-2.5-pro',
                        contents: {
                            parts: [
                                { text: prompt },
                                { inlineData: { mimeType: audioBlob.type, data: base64Audio } }
                            ]
                        }
                    });
                    
                    setTranscript(response.text.trim());
                } catch (err: any) {
                    console.error("Transcription failed:", err);
                    if (err.toString().includes('quota')) {
                        setError("Transcription failed: API quota exceeded.");
                    } else {
                        setError("Sorry, speech recognition failed.");
                    }
                } finally {
                    setIsTranscribing(false);
                    // Clean up stream tracks after transcription
                    stream.getTracks().forEach(track => track.stop());
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Microphone access denied:", err);
            setError("Microphone access is required for voice input. Please enable it in your browser settings.");
            setIsRecording(false);
        }
    }, [isRecording]);

    const stopRecording = useCallback(() => {
        if (!isRecording || !mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') return;
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    }, [isRecording]);

    return { isRecording, isTranscribing, transcript, error, startRecording, stopRecording };
};
