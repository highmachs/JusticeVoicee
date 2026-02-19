import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Center {
    id: string;
    name: string;
    address: string;
    phone: string;
    distance_km: number;
}

/* ── SVG Icons ─────────────────────────────────── */

const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 inline mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const GeoDirectory = () => {
    const [centers, setCenters] = useState<Center[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const findNearest = async () => {
        setLoading(true);
        setSearched(true);
        try {
            // Mock params for hackathon demo
            const response = await fetch('http://localhost:8001/api/geo/nearest?lat=25.6&lng=85.1');
            const data = await response.json();
            setCenters(data.centers || []);
        } catch (error) {
            console.error("Error finding centers:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-lg border border-peach/30 overflow-hidden"
        >
            <div className="bg-gradient-to-r from-peach-light to-peach/40 p-4">
                <h2 className="text-gray-700 font-bold text-lg flex items-center">
                    <MapPinIcon /> One Stop Centres
                </h2>
            </div>

            <div className="p-6">
                {!searched ? (
                    <div className="text-center">
                        <p className="text-gray-500 mb-6 text-sm">Find the nearest safe haven ("One Stop Centre") quickly.</p>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={findNearest}
                            className="w-full bg-gradient-to-r from-peach to-peach-light text-gray-700 font-semibold py-3 px-6 rounded-xl shadow-sm transition-all hover:shadow-md flex items-center justify-center"
                        >
                            {loading ? 'Locating...' : 'Find Nearest Help'}
                        </motion.button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {centers.length > 0 ? (
                                centers.map((center, index) => (
                                    <motion.div
                                        key={center.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-peach-light/40 p-4 rounded-xl border border-peach/20 hover:shadow-md transition-shadow"
                                    >
                                        <h3 className="font-bold text-gray-700 text-lg">{center.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{center.address}</p>
                                        <div className="mt-3 flex justify-between items-center">
                                            <span className="bg-white text-peach-DEFAULT px-2 py-1 rounded text-xs font-bold border border-peach/20">
                                                {center.distance_km} km away
                                            </span>
                                            <a href={`tel:${center.phone}`} className="text-primary font-bold text-sm hover:underline inline-flex items-center">
                                                <PhoneIcon /> {center.phone}
                                            </a>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <p className="text-center text-gray-400 text-sm">No centers found nearby.</p>
                            )}
                        </AnimatePresence>
                        <button
                            onClick={() => setSearched(false)}
                            className="w-full mt-4 text-gray-400 text-sm hover:text-gray-600 transition-colors"
                        >
                            Clear Search
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default GeoDirectory;
