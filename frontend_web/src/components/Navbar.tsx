import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ── Inline SVG Icons ─────────────────────────────────── */

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
    </svg>
);

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const MicIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-14 0M12 19v2m0-2a7 7 0 007-7M12 19a7 7 0 01-7-7m7-8a3 3 0 00-3 3v4a3 3 0 006 0V7a3 3 0 00-3-3z" />
    </svg>
);

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const NAV_ITEMS = [
    { to: '/', label: 'Home', icon: <HomeIcon /> },
    { to: '/chat', label: 'Text Chat', icon: <ChatIcon /> },
    { to: '/voice', label: 'Voice Sakhi', icon: <MicIcon /> },
    { to: '/emergency', label: 'Emergency', icon: <ShieldIcon /> },
];

const Navbar = () => (
    <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-lavender-200/60 shadow-sm"
    >
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3">
            {/* Brand */}
            <NavLink to="/" className="flex items-center gap-2 group">
                <span className="text-xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">
                    JusticeVoice
                </span>
            </NavLink>

            {/* Links */}
            <div className="flex items-center gap-1">
                {NAV_ITEMS.map(({ to, label, icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        className={({ isActive }) =>
                            `flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                ? 'bg-primary/10 text-primary shadow-sm'
                                : 'text-gray-500 hover:text-primary hover:bg-primary/5'
                            }`
                        }
                    >
                        {icon}
                        <span className="hidden sm:inline">{label}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    </motion.nav>
);

export default Navbar;
