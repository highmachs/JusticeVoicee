import { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import SakhiChat from './components/SakhiChat';
import GeoDirectory from './components/GeoDirectory';
import VoiceAssistant from './components/VoiceAssistant';
import KnowYourRights from './components/KnowYourRights';
import SafetyPlan from './components/SafetyPlan';
import { StealthCalculator, SOSOverlay } from './components/StealthMode';
import { motion, AnimatePresence } from 'framer-motion';

// Page wrapper with animation
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex-1 flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// --- PAGE COMPONENTS ---

const ChatPage = () => (
  <div className="flex-1 flex flex-col items-center px-4 py-6">
    <div className="text-center mb-6">
      <h1 className="text-3xl font-bold text-purple-800 mb-1">💬 Ask Sakhi</h1>
      <p className="text-purple-400 text-sm">Your safe space to ask legal questions</p>
    </div>
    <SakhiChat />
  </div>
);

const VoicePage = () => (
  <div className="flex-1 flex flex-col items-center px-4 py-6">
    <div className="text-center mb-6">
      <h1 className="text-3xl font-bold text-purple-800 mb-1">🎙️ Voice Sakhi</h1>
      <p className="text-purple-400 text-sm">Speak freely, Sakhi is listening</p>
    </div>
    <VoiceAssistant />
  </div>
);

const HelpPage = () => (
  <div className="flex-1 flex flex-col items-center px-4 py-6">
    <div className="text-center mb-6">
      <h1 className="text-3xl font-bold text-purple-800 mb-1">📍 Find Help Near You</h1>
      <p className="text-purple-400 text-sm">Locate One Stop Centres and shelters</p>
    </div>
    <GeoDirectory />

    {/* Helpline Quick Contacts */}
    <div className="mt-8 w-full max-w-md space-y-3">
      <h3 className="text-lg font-semibold text-purple-700 text-center mb-3">📞 Helpline Numbers</h3>
      {[
        { name: 'Women Helpline', number: '181', color: 'bg-pink-50 border-pink-200', icon: '👩' },
        { name: 'Police Emergency', number: '112', color: 'bg-purple-50 border-purple-200', icon: '🚔' },
        { name: 'Domestic Abuse', number: '1091', color: 'bg-rose-50 border-rose-200', icon: '🆘' },
        { name: 'NCW WhatsApp', number: '7827-170-170', color: 'bg-amber-50 border-amber-200', icon: '📱' },
      ].map((item) => (
        <a
          key={item.number}
          href={`tel:${item.number}`}
          className={`flex items-center p-4 rounded-2xl border ${item.color} hover:shadow-md transition-all`}
        >
          <span className="text-2xl mr-3">{item.icon}</span>
          <div className="flex-1">
            <p className="font-semibold text-gray-800">{item.name}</p>
            <p className="text-sm text-gray-500">{item.number}</p>
          </div>
          <span className="text-xl">→</span>
        </a>
      ))}
    </div>
  </div>
);

const SOSPage = ({ onTriggerSOS }: { onTriggerSOS: () => void }) => (
  <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-red-700 mb-1">🚨 Emergency</h1>
      <p className="text-red-400 text-sm">Immediate help when you need it most</p>
    </div>

    {/* Big SOS Button */}
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      onClick={onTriggerSOS}
      className="w-48 h-48 rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-2xl flex flex-col items-center justify-center mb-8 border-4 border-red-300"
    >
      <motion.span
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-5xl mb-2"
      >
        🚨
      </motion.span>
      <span className="text-2xl font-bold">SOS</span>
      <span className="text-xs opacity-80">Tap for help</span>
    </motion.button>

    {/* Info Cards */}
    <div className="w-full max-w-sm space-y-4">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
        <h3 className="font-bold text-red-800 mb-2">What happens when you tap SOS?</h3>
        <ul className="text-sm text-red-600 space-y-1">
          <li>📍 Your location is captured</li>
          <li>📞 Emergency numbers appear for one-tap calling</li>
          <li>🔕 Everything is silent — no sound alerts</li>
        </ul>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <h3 className="font-bold text-amber-800 mb-2">⌨️ Keyboard Shortcut</h3>
        <p className="text-sm text-amber-600">
          Press <kbd className="bg-amber-200 px-1.5 py-0.5 rounded text-amber-800 font-mono text-xs">Ctrl+Shift+S</kbd> from anywhere to trigger SOS
        </p>
      </div>
    </div>
  </div>
);

const RightsPage = () => (
  <div className="flex-1 flex flex-col items-center px-4 py-6">
    <div className="text-center mb-6">
      <h1 className="text-3xl font-bold text-purple-800 mb-1">📜 Know Your Rights</h1>
      <p className="text-purple-400 text-sm">Real laws that protect you</p>
    </div>
    <KnowYourRights />
  </div>
);

const PlanPage = () => (
  <div className="flex-1 flex flex-col items-center px-4 py-6">
    <div className="text-center mb-6">
      <h1 className="text-3xl font-bold text-purple-800 mb-1">🛡️ Safety Plan</h1>
      <p className="text-purple-400 text-sm">A personalized plan based on your situation</p>
    </div>
    <SafetyPlan />
  </div>
);

// --- NAVBAR ---
const navItems = [
  { path: '/', label: 'Chat', icon: '💬' },
  { path: '/voice', label: 'Voice', icon: '🎙️' },
  { path: '/rights', label: 'Rights', icon: '📜' },
  { path: '/plan', label: 'Plan', icon: '🛡️' },
  { path: '/help', label: 'Help', icon: '📍' },
  { path: '/sos', label: 'SOS', icon: '🚨' },
];

const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-xl border-t border-purple-100 shadow-lg">
    <div className="max-w-lg mx-auto flex">
      {navItems.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-3 text-xs font-medium transition-all duration-200 ${isActive
              ? item.path === '/sos'
                ? 'text-red-600 scale-110'
                : 'text-purple-700 scale-110'
              : 'text-gray-400 hover:text-purple-400'
            }`
          }
        >
          <span className="text-xl mb-0.5">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  </nav>
);

// --- MAIN APP ---
function AppContent() {
  const [showSOS, setShowSOS] = useState(false);
  const location = useLocation();

  // SOS keyboard shortcut: Ctrl + Shift + S
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
      e.preventDefault();
      setShowSOS(true);
    }
    if (e.key === 'Escape' && showSOS) {
      setShowSOS(false);
    }
  }, [showSOS]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen flex flex-col pb-20 relative">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-200/40 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-10 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-40 left-1/4 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-float" />
      </div>

      {/* Top Bar */}
      <header className="sticky top-0 z-20 bg-white/60 backdrop-blur-xl border-b border-purple-100/50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
              JusticeVoice
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => (window as any).__enterStealth?.()}
              className="text-xs bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full border border-purple-200 hover:bg-purple-100 transition-colors"
              title="Hide app as calculator"
            >
              🔒 Stealth
            </button>
          </div>
        </div>
      </header>

      {/* SOS Overlay */}
      <AnimatePresence>
        {showSOS && <SOSOverlay onClose={() => setShowSOS(false)} />}
      </AnimatePresence>

      {/* Page Content */}
      <PageTransition>
        <Routes location={location}>
          <Route path="/" element={<ChatPage />} />
          <Route path="/voice" element={<VoicePage />} />
          <Route path="/rights" element={<RightsPage />} />
          <Route path="/plan" element={<PlanPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/sos" element={<SOSPage onTriggerSOS={() => setShowSOS(true)} />} />
        </Routes>
      </PageTransition>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

function App() {
  const [isStealthMode, setIsStealthMode] = useState(true);

  // Expose stealth trigger globally so the inner component can use it
  useEffect(() => {
    (window as any).__enterStealth = () => setIsStealthMode(true);
  }, []);

  if (isStealthMode) {
    return <StealthCalculator onReveal={() => setIsStealthMode(false)} />;
  }

  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;
