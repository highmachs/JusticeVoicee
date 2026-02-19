import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MapPin, Phone, Navigation } from 'lucide-react';
import { getNearybyHelp } from '../api';

const MapInterface = ({ onClose }) => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Default to Ranchi for demo if geolocation fails/denied
    const fetchHelp = async (lat, lng) => {
      try {
        const data = await getNearybyHelp(lat, lng);
        setCenters(data);
      } catch (err) {
        setError("Failed to load help centers.");
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchHelp(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Fallback to Ranchi Capital coordinates
          fetchHelp(23.3441, 85.3096); 
        }
      );
    } else {
        fetchHelp(23.3441, 85.3096);
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-900/95 z-50 flex flex-col p-4 animate-in slide-in-from-bottom">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <MapPin className="text-justice-accent" /> Nearby Help
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">Close</button>
      </div>

      {loading && <div className="text-white text-center mt-10">Locating safe spaces...</div>}
      {error && <div className="text-red-400 text-center mt-10">{error}</div>}

      <div className="grid gap-4 overflow-y-auto pb-20">
        {centers.map((center, idx) => (
          <div key={idx} className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-white">{center.name}</h3>
                    <p className="text-justice-primary text-sm font-semibold">{center.type}</p>
                    <p className="text-gray-400 text-sm mt-1">{center.address}</p>
                </div>
                <div className="text-right">
                    <span className="bg-slate-700 text-xs px-2 py-1 rounded text-white">{center.distance_km} km</span>
                </div>
            </div>
            
            <div className="mt-4 flex gap-3">
                <a href={`tel:${center.phone}`} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex justify-center items-center gap-2">
                    <Phone size={18} /> Call
                </a>
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`} target="_blank" rel="noreferrer" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex justify-center items-center gap-2">
                    <Navigation size={18} /> Navigate
                </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapInterface;

MapInterface.propTypes = {
  onClose: PropTypes.func.isRequired,
};
