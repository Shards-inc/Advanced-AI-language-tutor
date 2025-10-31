import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { Language } from './types';

// --- ICONS ---
const Spinner = () => (<div className="w-full flex justify-center"><svg className="animate-spin h-10 w-10 text-accent-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>);
const SendIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.949a.75.75 0 00.95.539l2.842-.947a.75.75 0 01.503 1.362l-2.035 2.035a.75.75 0 00-.323 1.028l1.414 4.949a.75.75 0 00.95.539l14-5.25a.75.75 0 000-1.39l-14-5.25a.75.75 0 00-.124-.02z" /></svg>);
const PdfIcon = () => (<svg xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>);
const AudioIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" /></svg>);
const WebsiteIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.953 11.953 0 0112 13.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0l-2.11 2.11m-2.11-2.11l2.11 2.11m0 0l-2.11 2.11m2.11-2.11l2.11 2.11M12 13.5a2.25 2.25 0 110-4.5 2.25 2.25 0 010 4.5z" /></svg>);
const YouTubeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /></svg>);
const CopiedTextIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 01-2.25 2.25h-1.5a2.25 2.25 0 01-2.25-2.25v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>);
const PlayIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>);
const PauseIcon = () => (<svg xmlns="http://www.w.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75zm9 0a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>);

// --- AUDIO HELPERS ---
function decode(base64: string) { const binaryString = atob(base64); const len = binaryString.length; const bytes = new Uint8Array(len); for (let i = 0; i < len; i++) { bytes[i] = binaryString.charCodeAt(i); } return bytes; }
async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> { const dataInt16 = new Int16Array(data.buffer); const frameCount = dataInt16.length / numChannels; const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate); for (let channel = 0; channel < numChannels; channel++) { const channelData = buffer.getChannelData(channel); for (let i = 0; i < frameCount; i++) { channelData[i] = dataInt16[i * numChannels + channel] / 32768.0; } } return buffer; }

interface ContentAnalyzerProps {
  nativeLanguage: Language;
  learningLanguage: Language;
}

const sourceButtons = [
  { id: 'pdf', name: 'PDF', icon: <PdfIcon /> },
  { id: 'audio', name: 'Audio', icon: <AudioIcon /> },
  { id: 'website', name: 'Website', icon: <WebsiteIcon /> },
  { id: 'youtube', name: 'YouTube', icon: <YouTubeIcon /> },
  { id: 'copied_text', name: 'Copied text', icon: <CopiedTextIcon /> },
];

const ContentAnalyzer: React.FC<ContentAnalyzerProps> = () => {
  const [view, setView] = useState<'idle' | 'loading' | 'result'>('idle');
  const [query, setQuery] = useState('');
  const [summary, setSummary] = useState('');
  const [audioData, setAudioData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    return () => {
      audioSourceRef.current?.stop();
      audioContextRef.current?.close();
    }
  }, []);

  const resetState = () => {
    setView('idle');
    setQuery('');
    setSummary('');
    setAudioData(null);
    setError(null);
    setIsPlaying(false);
    audioSourceRef.current?.stop();
    audioSourceRef.current = null;
    audioBufferRef.current = null;
  };

  const generateOverview = async (type: 'web' | 'text', content: string) => {
    setView('loading');
    setError(null);
    if (audioSourceRef.current) audioSourceRef.current.stop();

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      let summaryText = '';

      if (type === 'web') {
        const summaryResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Create a concise audio script summarizing the answer to the following query. The script should be easy to listen to. Query: "${content}"`,
          config: {
            tools: [{ googleSearch: {} }],
          },
        });
        summaryText = summaryResponse.text;
      } else {
        const summaryResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Summarize the following text into a concise audio script: "${content}"`,
        });
        summaryText = summaryResponse.text;
      }
      
      setSummary(summaryText);

      const ttsResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: summaryText }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        },
      });

      const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) throw new Error("No audio data received from the API.");
      
      setAudioData(base64Audio);
      
      // Pre-decode audio data
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
      const decodedBuffer = await decodeAudioData(decode(base64Audio), audioContextRef.current, 24000, 1);
      audioBufferRef.current = decodedBuffer;

      setView('result');

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setView('idle');
    }
  };

  const handleWebSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    generateOverview('web', query);
  };

  const handleButtonClick = (id: string) => {
    if (id === 'copied_text') {
      const text = window.prompt("Paste your text here to create an audio overview:");
      if (text && text.trim()) {
        setQuery(text); // Store original text for context if needed
        generateOverview('text', text);
      }
    } else {
      alert(`${id.replace('_', ' ')} source is not implemented in this demo.`);
    }
  };

  const togglePlayback = () => {
    if (!audioContextRef.current || !audioBufferRef.current) return;

    if (isPlaying) {
      audioSourceRef.current?.stop();
      setIsPlaying(false);
    } else {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBufferRef.current;
      source.connect(audioContextRef.current.destination);
      source.onended = () => {
        setIsPlaying(false);
      };
      source.start();
      audioSourceRef.current = source;
      setIsPlaying(true);
    }
  };


  if (view === 'loading') {
    return (
        <div className="p-4 sm:p-8 h-full flex flex-col items-center justify-center text-center">
            <Spinner/>
            <h2 className="text-2xl font-bold mt-4">Generating Audio Overview...</h2>
            <p className="text-text-secondary">This might take a moment.</p>
        </div>
    )
  }

  if (view === 'result') {
    return (
        <div className="p-4 sm:p-8 h-full flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full max-w-3xl bg-background-secondary/50 rounded-lg border border-background-tertiary/50 p-6 flex flex-col">
                    <h2 className="text-2xl font-bold font-heading mb-4 text-center">Your Audio Overview</h2>
                    <div className="flex-1 bg-background-tertiary p-4 rounded-md max-h-[40vh] overflow-y-auto prose prose-invert prose-sm max-w-none mb-6">
                        <ReactMarkdown>{summary}</ReactMarkdown>
                    </div>
                    <div className="flex items-center justify-center gap-4 bg-background-tertiary p-4 rounded-lg">
                        <button 
                            onClick={togglePlayback}
                            className="p-3 bg-accent-primary text-background-primary rounded-full hover:bg-accent-primary-dark transition-colors"
                            aria-label={isPlaying ? "Pause audio" : "Play audio"}
                        >
                            {isPlaying ? <PauseIcon /> : <PlayIcon />}
                        </button>
                    </div>
                </div>
                <button onClick={resetState} className="mt-8 bg-background-secondary text-text-primary font-semibold py-2 px-5 rounded-lg border border-background-tertiary hover:bg-background-tertiary/50 transition-colors duration-200">
                    Create Another Overview
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 h-full flex flex-col bg-background-primary text-text-primary">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
            Create audio overviews from{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-yellow-400">your notes</span>
          </h1>
          
          <form onSubmit={handleWebSearch} className="mt-8">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find sources from the web"
                className="w-full bg-background-secondary border-2 border-background-tertiary rounded-full py-4 pl-6 pr-16 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
              />
              <button
                type="submit"
                disabled={!query.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 bg-background-tertiary rounded-full flex items-center justify-center text-text-secondary hover:bg-accent-primary hover:text-background-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Find sources"
              >
                <SendIcon />
              </button>
            </div>
          </form>
          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
          
          <div className="my-8 text-text-secondary text-sm">Or upload your files</div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {sourceButtons.map(button => (
              <button
                key={button.id}
                onClick={() => handleButtonClick(button.id)}
                className="flex flex-col items-center justify-center gap-2 p-4 bg-background-secondary rounded-lg border border-background-tertiary hover:border-accent-primary hover:text-accent-primary transition-all group"
              >
                <div className="text-text-secondary group-hover:text-accent-primary transition-colors">{button.icon}</div>
                <span className="text-sm font-medium">{button.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentAnalyzer;
