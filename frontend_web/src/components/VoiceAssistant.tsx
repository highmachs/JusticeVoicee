import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Web Speech API types
interface SpeechRecognitionEvent {
    results: { [index: number]: { [index: number]: { transcript: string } } };
}

/* ── Inline SVG Icons ─────────────────────────────────── */

const MicIconLarge = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-14 0M12 19v2m0-2a7 7 0 007-7M12 19a7 7 0 01-7-7m7-8a3 3 0 00-3 3v4a3 3 0 006 0V7a3 3 0 00-3-3z" />
    </svg>
);

const StopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
    </svg>
);

const LoaderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

const SpeakerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6l-4 4H4v4h4l4 4V6z" />
    </svg>
);

const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const MicSmall = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-14 0M12 19v2m0-2a7 7 0 007-7M12 19a7 7 0 01-7-7m7-8a3 3 0 00-3 3v4a3 3 0 006 0V7a3 3 0 00-3-3z" />
    </svg>
);

const VoiceAssistant = () => {
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState('');
    const [language, setLanguage] = useState('en');
    const recognitionRef = useRef<any>(null);

    const LANGUAGES = [
        { code: 'en', label: 'English', speechCode: 'en-IN' },
        { code: 'hi', label: 'हिंदी', speechCode: 'hi-IN' },
        { code: 'ta', label: 'தமிழ்', speechCode: 'ta-IN' },
        { code: 'te', label: 'తెలుగు', speechCode: 'te-IN' },
        { code: 'bn', label: 'বাংলা', speechCode: 'bn-IN' },
        { code: 'mr', label: 'मराठी', speechCode: 'mr-IN' },
        { code: 'kn', label: 'ಕನ್ನಡ', speechCode: 'kn-IN' },
        { code: 'gu', label: 'ગુજરાતી', speechCode: 'gu-IN' },
        { code: 'pa', label: 'ਪੰਜਾਬੀ', speechCode: 'pa-IN' },
    ];

    const startListening = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setResponse('Speech Recognition is not supported in this browser. Please use Chrome.');
            return;
        }

        const recognition = new SpeechRecognition();
        const selectedLang = LANGUAGES.find(l => l.code === language);
        recognition.lang = selectedLang?.speechCode || 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const text = event.results[0][0].transcript;
            setTranscript(text);
            setIsListening(false);
            sendToSakhi(text);
        };

        recognition.onerror = () => {
            setIsListening(false);
            setResponse('Could not hear you. Please try again.');
        };

        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
        recognition.start();
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    const sendToSakhi = async (text: string) => {
        setIsProcessing(true);
        setResponse('');
        try {
            const res = await fetch('http://localhost:8001/api/v1/chat/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: text, language }),
            });
            const data = await res.json();
            const aiResponse = data.response;
            setResponse(aiResponse);
            speakResponse(aiResponse);
        } catch {
            setResponse('Could not connect to Sakhi. Is the backend running?');
        } finally {
            setIsProcessing(false);
        }
    };

    const speakResponse = (text: string) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const selectedLang = LANGUAGES.find(l => l.code === language);
        utterance.lang = selectedLang?.speechCode || 'en-IN';
        utterance.rate = 0.9;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    const stopSpeaking = () => {
        window.speechSynthesis?.cancel();
        setIsSpeaking(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-mint/40"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-mint to-mint-light p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MicSmall />
                    <div>
                        <h2 className="font-bold text-gray-700 text-lg">Voice Sakhi</h2>
                        <p className="text-gray-500 text-xs">Speak, I'm listening</p>
                    </div>
                </div>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-white/60 text-gray-600 text-xs rounded-lg px-2 py-1 border border-white/80 focus:outline-none cursor-pointer shadow-sm"
                >
                    {LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code} className="text-gray-800">{lang.label}</option>
                    ))}
                </select>
            </div>

            {/* Main Area */}
            <div className="p-8 flex flex-col items-center space-y-5 min-h-[300px] bg-gradient-to-b from-mint-light/30 to-white">

                {/* Mic Button */}
                <motion.button
                    onClick={isListening ? stopListening : startListening}
                    disabled={isProcessing}
                    whileTap={{ scale: 0.9 }}
                    className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all text-white ${isListening
                        ? 'bg-rose-300 animate-pulse ring-4 ring-rose-200'
                        : isProcessing
                            ? 'bg-gray-300 cursor-wait text-gray-500'
                            : 'bg-gradient-to-br from-mint-dark to-mint hover:from-mint hover:to-mint-light hover:shadow-xl'
                        }`}
                >
                    {isListening ? <StopIcon /> : isProcessing ? <LoaderIcon /> : <MicIconLarge />}
                </motion.button>

                <p className="text-sm text-gray-500">
                    {isListening ? (
                        <><span className="inline-block w-2 h-2 rounded-full bg-rose-400 mr-1.5 animate-pulse" />Listening... Speak now</>
                    ) : isProcessing ? (
                        'Thinking...'
                    ) : (
                        'Tap the mic to ask Sakhi'
                    )}
                </p>

                {/* Transcript */}
                <AnimatePresence>
                    {transcript && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full bg-lavender-50 rounded-xl p-3 border border-lavender-200/30"
                        >
                            <p className="text-xs text-gray-400 mb-1">You said:</p>
                            <p className="text-sm text-gray-700">{transcript}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Response */}
                <AnimatePresence>
                    {response && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full bg-mint-light/40 rounded-xl p-3 border border-mint/30"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-xs text-gray-500">Sakhi says:</p>
                                {isSpeaking && (
                                    <button onClick={stopSpeaking} className="text-xs bg-rose-100 text-rose-500 px-2 py-0.5 rounded-full hover:bg-rose-200 transition-colors">
                                        Stop
                                    </button>
                                )}
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">{response}</p>
                            {!isSpeaking && response && (
                                <button
                                    onClick={() => speakResponse(response)}
                                    className="mt-2 text-xs bg-mint/30 text-gray-600 px-3 py-1 rounded-full hover:bg-mint/50 transition-colors inline-flex items-center"
                                >
                                    <SpeakerIcon /> Listen again
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default VoiceAssistant;
