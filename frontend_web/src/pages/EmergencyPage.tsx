import GeoDirectory from '../components/GeoDirectory';
import { motion } from 'framer-motion';

/* ── SVG Icons ─────────────────────────────────── */

const BellAlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

const EmergencyPage = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col items-center px-4 py-10"
    >
        <h1 className="text-3xl font-bold text-gray-700 mb-2">Emergency Help</h1>
        <p className="text-sm text-gray-400 mb-8">Find safe havens and alert your emergency contacts</p>

        <div className="w-full max-w-lg space-y-8">
            {/* Geo Directory */}
            <GeoDirectory />

            {/* Panic Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full rounded-2xl p-6 text-white shadow-lg cursor-pointer border border-rose-200 relative overflow-hidden group bg-gradient-to-r from-rose-400 to-rose-300 transition-all duration-200 hover:shadow-xl"
            >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-center gap-3 relative z-10 mb-2">
                    <BellAlertIcon />
                    <h3 className="text-xl font-bold">Panic Mode</h3>
                </div>
                <p className="opacity-90 text-sm mb-4 relative z-10 text-left">Tap here to alert emergency contacts immediately.</p>
                <div className="flex justify-between items-center relative z-10">
                    <span className="text-xs font-mono bg-white/20 px-3 py-1 rounded-full">Silent Alert</span>
                    <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                        <BellAlertIcon />
                    </motion.span>
                </div>
            </motion.button>
        </div>
    </motion.div>
);

export default EmergencyPage;
