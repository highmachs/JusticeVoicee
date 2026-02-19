import { useState, useRef, useEffect } from 'react';
import { Mic, Send, ShieldAlert, MapPin, FileText, Camera } from 'lucide-react';
import { chatWithSakhi, transcribeAudio, clearHistory, triageMessage, getTTS, uploadEvidence } from '../api';
import MapInterface from './MapInterface';
import FormWizard from './FormWizard';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { text: "Namaste. I am Sakhi. DISCLAIMER: I am an AI guide, not a lawyer. For emergencies, call 112.", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [severity, setSeverity] = useState('LOW'); // Triage State
  
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg = { text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // 1. Run Triage First
      const triage = await triageMessage(inputText);
      if (triage.severity === 'HIGH') {
        setSeverity('HIGH');
      }

      // 2. Initial Chat Response
      const data = await chatWithSakhi(inputText);
      const botMsg = { text: data.response, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);

      // 3. Auto-play TTS (Covering /voice/tts)
      try {
        const tts = await getTTS(data.response);
        const audio = new Audio(tts.audio_url);
        audio.play().catch(e => console.log("Audio play blocked by browser:", e));
      } catch (e) {
        console.error("TTS Error:", e);
      }

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { text: "I am having trouble connecting. Please try again.", sender: 'bot', isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const userMsg = { text: `[Uploading Evidence: ${file.name}...]`, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    
    try {
        await uploadEvidence(file);
        setMessages(prev => [...prev, { text: "Evidence secured in Vault.", sender: 'bot' }]);
    } catch (err) {
        setMessages(prev => [...prev, { text: "Failed to save evidence.", sender: 'bot', isError: true }]);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setIsLoading(true);
        try {
          const data = await transcribeAudio(blob);
          if (data.text) {
             const userMsg = { text: data.text, sender: 'user' };
             setMessages(prev => [...prev, userMsg]);
             const chatData = await chatWithSakhi(data.text);
             setMessages(prev => [...prev, { text: chatData.response, sender: 'bot' }]);
          }
        } catch (e) {
          console.error("Voice Error:", e);
        } finally {
          setIsLoading(false);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone Access Error:", err);
      alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handlePanic = async () => {
    if (window.confirm("Are you sure? This will delete all history and lock the app.")) {
       await clearHistory();
       window.location.href = "/"; 
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-gray-100">
      {/* Feature Overlays */}
      {showMap && <MapInterface onClose={() => setShowMap(false)} />}
      {showForm && <FormWizard onClose={() => setShowForm(false)} />}

      {/* Header */}
      <div className={`p-4 shadow-md flex justify-between items-center transition-colors ${severity === 'HIGH' ? 'bg-red-900 border-b border-red-500' : 'bg-slate-800'}`}>
        <div>
           <h1 className="text-xl font-bold text-justice-primary">JusticeVoice <span className="text-gray-400 text-sm">| Sakhi</span></h1>
           {severity === 'HIGH' && <span className="text-xs text-red-300 font-bold animate-pulse">CRISIS DETECTED - HELP IS NEAR</span>}
        </div>
        <button onClick={handlePanic} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center gap-2 text-sm font-bold">
          <ShieldAlert size={16} /> PANIC EXIT
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              msg.sender === 'user' 
                ? 'bg-justice-primary text-white rounded-br-none' 
                : 'bg-slate-700 text-gray-100 rounded-bl-none border border-slate-600'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
             <div className="bg-slate-700 p-3 rounded-2xl rounded-bl-none text-gray-400 animate-pulse">
               Sakhi is thinking...
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 bg-slate-800/50 flex gap-2 overflow-x-auto">
         <button onClick={() => setShowMap(true)} className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-lg text-sm whitespace-nowrap flex items-center gap-2 border border-slate-600">
            <MapPin size={14} className="text-justice-accent"/> Find Help
         </button>
         <button onClick={() => setShowForm(true)} className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-lg text-sm whitespace-nowrap flex items-center gap-2 border border-slate-600">
            <FileText size={14} className="text-justice-accent"/> File Report
         </button>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-800 border-t border-slate-700 flex items-center gap-2">
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*,audio/*" onChange={handleFileUpload} />
        <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-slate-700 hover:bg-slate-600 rounded-full text-white">
            <Camera size={24} />
        </button>

        <button 
          onMouseDown={startRecording} 
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          className={`p-3 rounded-full transition-colors ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-700 hover:bg-slate-600'}`}
        >
          <Mic size={24} className="text-white" />
        </button>
        
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type or hold mic to speak..."
          className="flex-1 bg-slate-700 text-white rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-justice-primary"
        />
        
        <button onClick={handleSendMessage} className="p-3 bg-justice-primary hover:bg-violet-700 rounded-full text-white">
          <Send size={24} />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
