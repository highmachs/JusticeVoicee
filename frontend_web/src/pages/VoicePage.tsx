import VoiceAssistant from '../components/VoiceAssistant';
import { motion } from 'framer-motion';

const VoicePage = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col items-center px-4 py-10"
    >
        <h1 className="text-3xl font-bold text-gray-700 mb-2">Voice Sakhi</h1>
        <p className="text-sm text-gray-400 mb-8">Speak with Sakhi — hands-free assistance</p>
        <div className="w-full max-w-lg">
            <VoiceAssistant />
        </div>
    </motion.div>
);

export default VoicePage;
