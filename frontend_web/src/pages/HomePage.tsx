import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ── Inline SVG Icons ─────────────────────────────────── */

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const MicIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-14 0M12 19v2m0-2a7 7 0 007-7M12 19a7 7 0 01-7-7m7-8a3 3 0 00-3 3v4a3 3 0 006 0V7a3 3 0 00-3-3z" />
    </svg>
);

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const SparkleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

const SpeakerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6l-4 4H4v4h4l4 4V6z" />
    </svg>
);

const MapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const FEATURES = [
    {
        to: '/chat',
        icon: <ChatIcon />,
        title: 'Text Chat',
        desc: 'Chat with Sakhi AI for legal guidance in your preferred language.',
        color: 'from-primary/20 to-primary/5 border-primary/20 text-primary',
    },
    {
        to: '/voice',
        icon: <MicIcon />,
        title: 'Voice Sakhi',
        desc: 'Speak with Sakhi — hands-free, voice-first assistance.',
        color: 'from-mint/30 to-mint/10 border-mint/30 text-emerald-600',
    },
    {
        to: '/emergency',
        icon: <ShieldIcon />,
        title: 'Emergency Help',
        desc: 'Find safe havens nearby and trigger silent panic alerts.',
        color: 'from-rose-100 to-rose-50 border-rose-200 text-rose-500',
    },
];

const BADGES = [
    { icon: <LockIcon />, label: 'Privacy First' },
    { icon: <SparkleIcon />, label: 'AI Powered' },
    { icon: <SpeakerIcon />, label: 'Voice Enabled' },
    { icon: <MapIcon />, label: 'Geo-Aware' },
];

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

const HomePage = () => (
    <div className="flex-1 flex flex-col items-center px-4 py-14">

        {/* Hero */}
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-2xl"
        >
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-primary via-secondary to-peach bg-clip-text text-transparent">
                JusticeVoice
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
                Empowering women with{' '}
                <span className="font-semibold text-primary">AI Legal Guidance</span>{' '}
                and{' '}
                <span className="font-semibold text-secondary">Safe Space Access</span>.
            </p>

            {/* Badges */}
            <div className="mt-6 flex justify-center gap-2 flex-wrap">
                {BADGES.map(b => (
                    <span key={b.label} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-500 shadow-sm">
                        {b.icon} {b.label}
                    </span>
                ))}
            </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl"
        >
            {FEATURES.map(f => (
                <motion.div key={f.to} variants={item}>
                    <NavLink
                        to={f.to}
                        className={`block rounded-2xl border bg-gradient-to-br ${f.color} p-6 h-full transition-all duration-200 hover:shadow-md hover:-translate-y-1 group`}
                    >
                        <div className="mb-4 opacity-80 group-hover:opacity-100 transition-opacity">{f.icon}</div>
                        <h3 className="text-lg font-bold mb-1">{f.title}</h3>
                        <p className="text-sm opacity-70 leading-relaxed">{f.desc}</p>
                    </NavLink>
                </motion.div>
            ))}
        </motion.div>

        {/* Footer */}
        <p className="mt-16 text-xs text-gray-400">
            &copy; 2024 JusticeVoice &mdash; Built for Hackathon
        </p>
    </div>
);

export default HomePage;
