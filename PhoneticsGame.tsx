import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Lesson, Language, MasteryLevel } from './types';

// --- AUDIO HELPERS & ICONS ---
function decode(base64: string) { const binaryString = atob(base64); const len = binaryString.length; const bytes = new Uint8Array(len); for (let i = 0; i < len; i++) { bytes[i] = binaryString.charCodeAt(i); } return bytes; }
async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> { const dataInt16 = new Int16Array(data.buffer); const frameCount = dataInt16.length / numChannels; const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate); for (let channel = 0; channel < numChannels; channel++) { const channelData = buffer.getChannelData(channel); for (let i = 0; i < frameCount; i++) { channelData[i] = dataInt16[i * numChannels + channel] / 32768.0; } } return buffer; }
const Spinner = () => (<svg className="animate-spin h-6 w-6 text-accent-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);
const SpeakerIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28 .53v15.88a.75.75 0 01-1.28 .53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>);

interface PhoneticsGameProps {
    lesson: Lesson | MasteryLevel;
    onComplete: () => void;
    learningLanguage: Language;
}

type MinimalPair = { word1: string; word2: string; };

const PhoneticsGame: React.FC<PhoneticsGameProps> = ({ lesson, onComplete, learningLanguage }) => {
    const [pairs, setPairs] = useState<MinimalPair[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentRound, setCurrentRound] = useState(0);
    const [correctWord, setCorrectWord] = useState<string | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [status, setStatus] = useState<'playing' | 'correct' | 'incorrect'>('playing');
    const [score, setScore] = useState(0);
    const [ttsLoading, setTtsLoading] = useState(false);

    const totalRounds = 5;

    const generatePairs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Generate ${totalRounds} minimal pairs for a ${learningLanguage.name} learner. These are pairs of words that differ by only one sound, useful for pronunciation practice. Provide a JSON array of objects, each with "word1" and "word2".`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { word1: { type: Type.STRING }, word2: { type: Type.STRING } } } }
                }
            });
            const generatedPairs = JSON.parse(response.text);
            if (generatedPairs.length < totalRounds) throw new Error("Not enough pairs generated.");
            setPairs(generatedPairs);
            setCorrectWord(Math.random() < 0.5 ? generatedPairs[0].word1 : generatedPairs[0].word2);
        } catch (err: any) {
            console.error('Failed to generate minimal pairs:', err);
            setError(err.toString().includes('quota') ? 'API quota exceeded.' : 'Could not load exercise.');
        } finally {
            setLoading(false);
        }
    }, [learningLanguage.name]);

    useEffect(() => {
        generatePairs();
    }, [generatePairs]);

    const playSound = async () => {
        if (!correctWord || ttsLoading) return;
        setTtsLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text: `In ${learningLanguage.name}, say: ${correctWord}` }] }],
                config: { responseModalities: [Modality.AUDIO], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } } },
            });
            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (!base64Audio) throw new Error("No audio data received.");
            const outputAudioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
            const source = outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputAudioContext.destination);
            source.start();
        } catch (error: any) {
            console.error('Failed to play TTS:', error);
            if (error.toString().includes('quota')) alert('Could not play audio: API quota exceeded.');
        } finally {
            setTtsLoading(false);
        }
    };
    
    const handleAnswer = (option: string) => {
        if (status !== 'playing') return;
        setSelectedAnswer(option);
        if (option === correctWord) {
            setStatus('correct');
            setScore(s => s + 1);
        } else {
            setStatus('incorrect');
        }
    };

    const handleNext = () => {
        if (currentRound < totalRounds - 1) {
            const nextRound = currentRound + 1;
            setCurrentRound(nextRound);
            setCorrectWord(Math.random() < 0.5 ? pairs[nextRound].word1 : pairs[nextRound].word2);
            setSelectedAnswer(null);
            setStatus('playing');
        } else {
            onComplete();
        }
    };
    
    if (loading) return <div className="flex justify-center items-center h-48"><Spinner /></div>;
    if (error) return <div className="flex justify-center items-center h-48 text-red-400">{error}</div>;
    if (pairs.length === 0) return <div>Could not load exercise.</div>;

    const currentPair = pairs[currentRound];
    return (
        <div className="text-center flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm font-semibold text-text-secondary">Round {currentRound + 1} of {totalRounds}</p>
                <p className="text-sm font-semibold text-accent-secondary">Score: {score}</p>
            </div>
            <div className="w-full bg-background-tertiary rounded-full h-1.5 mb-8">
                <div className="bg-accent-primary h-1.5 rounded-full" style={{ width: `${((currentRound + 1) / totalRounds) * 100}%`}}></div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
                <p className="text-lg text-text-secondary mb-4">Listen carefully and choose the word you hear.</p>
                <button onClick={playSound} disabled={ttsLoading} className="p-4 bg-accent-primary text-background-primary rounded-full hover:bg-accent-primary-dark transition-colors disabled:opacity-50">
                    {ttsLoading ? <Spinner /> : <SpeakerIcon />}
                </button>
                
                <div className="grid grid-cols-2 gap-4 my-8 w-full max-w-md">
                    {[currentPair.word1, currentPair.word2].map((word, i) => (
                        <button key={i} onClick={() => handleAnswer(word)} disabled={status !== 'playing'}
                            className={`p-4 rounded-lg border-2 text-xl font-semibold transition-all
                                ${status === 'playing' ? 'border-background-tertiary hover:border-accent-primary' : ''}
                                ${selectedAnswer === word && status === 'correct' ? 'bg-green-500/20 border-green-500 text-white' : ''}
                                ${selectedAnswer === word && status === 'incorrect' ? 'bg-red-500/20 border-red-500 text-white' : ''}
                                ${status !== 'playing' && word === correctWord ? 'bg-green-500/20 border-green-500' : ''}
                            `}
                        >
                            {word}
                        </button>
                    ))}
                </div>
            </div>

            {status !== 'playing' && (
                <div className="h-24">
                    <p className={`text-xl font-bold ${status === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                        {status === 'correct' ? 'Correct!' : `Nice try! The correct word was "${correctWord}".`}
                    </p>
                    <button onClick={handleNext} className="mt-4 bg-accent-primary text-background-primary font-bold py-2 px-8 rounded-lg hover:bg-accent-primary-dark">
                        {currentRound < totalRounds - 1 ? 'Next' : 'Finish'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default PhoneticsGame;
