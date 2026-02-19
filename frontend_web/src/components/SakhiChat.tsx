import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'sakhi';
}

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'mr', label: 'मराठी' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
];

// Curated suggestions for women's safety & legal queries
const SUGGESTED_QUERIES = [
    "What are my rights if my husband beats me?",
    "How to file a domestic violence complaint?",
    "Where is the nearest One Stop Centre?",
    "Can I get a protection order from court?",
    "What is the dowry prohibition law?",
    "How to file an FIR against harassment?",
    "What legal help is available for free?",
    "My in-laws are demanding dowry. What can I do?",
    "How to get maintenance after separation?",
    "What is Section 498A IPC?",
    "Can I stay in my marital home after filing a case?",
    "How does the Protection of Women from Domestic Violence Act help?",
    "What documents do I need to file a complaint?",
    "Can I get custody of my children?",
    "What is sexual harassment at workplace law?",
    "How to report cyber harassment or stalking?",
    "What are my rights during divorce?",
    "Is verbal abuse considered domestic violence?",
    "What is the Women Helpline number?",
    "How to reach a women's shelter near me?",
];

const SakhiChat = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Namaste! I am Sakhi, your AI legal guide. I'm here to help you understand your rights and find safety. You can ask me anything — I'm listening. 🙏", sender: 'sakhi' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [language, setLanguage] = useState('en');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    // Filter suggestions based on input
    useEffect(() => {
        if (input.trim().length >= 2) {
            const filtered = SUGGESTED_QUERIES.filter(q =>
                q.toLowerCase().includes(input.toLowerCase())
            ).slice(0, 5);
            setFilteredSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else if (input.trim().length === 0) {
            // Show top 5 suggestions when input is empty but focused
            setFilteredSuggestions(SUGGESTED_QUERIES.slice(0, 5));
        } else {
            setShowSuggestions(false);
        }
    }, [input]);

    const selectSuggestion = (suggestion: string) => {
        setInput(suggestion);
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const sendMessage = async (messageText?: string) => {
        const text = messageText || input;
        if (!text.trim()) return;

        const userMsg: Message = { id: Date.now(), text, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setShowSuggestions(false);
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8001/api/v1/chat/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: text, language }),
            });

            const data = await response.json();
            const sakhiMsg: Message = { id: Date.now() + 1, text: data.response, sender: 'sakhi' };
            setMessages(prev => [...prev, sakhiMsg]);
        } catch (error) {
            console.error("Error connecting to Sakhi:", error);
            const errorMsg: Message = { id: Date.now() + 1, text: "I'm having trouble connecting. Please check if the backend is running on port 8001.", sender: 'sakhi' };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col h-[560px] w-full max-w-md mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-primary-light"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center shadow-md relative overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary font-bold text-xl mr-3 shadow-sm border-2 border-accent z-10"
                >
                    S
                </motion.div>
                <div className="z-10 flex-1">
                    <h2 className="text-white font-bold text-lg">Sakhi AI</h2>
                    <p className="text-white/80 text-xs">Women's Legal Guide • RAG + NLP</p>
                </div>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="z-10 bg-white/20 text-white text-xs rounded-lg px-2 py-1 border border-white/30 backdrop-blur-sm focus:outline-none cursor-pointer"
                >
                    {LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code} className="text-gray-800">
                            {lang.label}
                        </option>
                    ))}
                </select>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
            </div>

            {/* Quick Action Chips (shown when no messages are loading) */}
            {messages.length <= 1 && !isLoading && (
                <div className="px-3 pt-3 pb-1 bg-gradient-to-b from-purple-50 to-transparent">
                    <p className="text-xs text-purple-500 mb-2 font-medium">💡 Common questions:</p>
                    <div className="flex flex-wrap gap-1.5">
                        {SUGGESTED_QUERIES.slice(0, 4).map((q, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => sendMessage(q)}
                                className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-200 transition-colors border border-purple-200"
                            >
                                {q.length > 35 ? q.slice(0, 35) + '...' : q}
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-50 to-pink-50">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, x: msg.sender === 'user' ? 20 : -20 }}
                            animate={{ opacity: 1, y: 0, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${msg.sender === 'user'
                                ? 'bg-primary text-white rounded-tr-none'
                                : 'bg-white text-gray-800 border border-purple-100 rounded-tl-none'
                                }`}>
                                {msg.text}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-purple-100 shadow-sm flex space-x-2">
                            <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-primary rounded-full" />
                            <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-secondary rounded-full" />
                            <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-accent rounded-full" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input + Autocomplete */}
            <div className="p-4 bg-white border-t border-purple-100 relative">
                {/* Autocomplete dropdown */}
                <AnimatePresence>
                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-full left-4 right-4 mb-1 bg-white rounded-xl shadow-xl border border-purple-200 overflow-hidden z-20 max-h-48 overflow-y-auto"
                        >
                            {filteredSuggestions.map((suggestion, i) => (
                                <button
                                    key={i}
                                    onClick={() => selectSuggestion(suggestion)}
                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors border-b border-purple-50 last:border-0 flex items-center gap-2"
                                >
                                    <span className="text-purple-400 text-xs">🔍</span>
                                    {suggestion}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex space-x-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onFocus={() => {
                            if (input.trim().length >= 2 && filteredSuggestions.length > 0) {
                                setShowSuggestions(true);
                            }
                        }}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !isLoading) sendMessage();
                            if (e.key === 'Escape') setShowSuggestions(false);
                        }}
                        placeholder="Ask about your rights, laws, safety..."
                        className="flex-1 p-3 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-50"
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => sendMessage()}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-primary to-secondary text-white p-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        Send
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default SakhiChat;
