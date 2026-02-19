import { useState } from 'react';
import PropTypes from 'prop-types';
import { FileText, Download, CheckCircle } from 'lucide-react';
import { generatePDVAPdf, createIncident } from '../api';

const FormWizard = ({ onClose }) => {
  const [formData, setFormData] = useState({
    victim_name: '',
    respondent_name: '',
    incident_details: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Generate PDF
      const blob = await generatePDVAPdf(formData);
      
      // 2. Save Incident to History (Covering /history/incidents/)
      await createIncident({
        description: formData.incident_details,
        incident_type: "PWDVA Report",
        location_lat: "23.3441", // Mock location for form
        location_long: "85.3096"
      });

      // 3. Download
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `DIR_${formData.victim_name}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
        <div className="fixed inset-0 bg-slate-900/95 z-50 flex flex-col items-center justify-center p-6 animate-in zoom-in">
            <CheckCircle size={64} className="text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Report Generated!</h2>
            <p className="text-gray-400 text-center mb-6">The PWDVA Form I has been downloaded to your device.</p>
            <button onClick={onClose} className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-full">Close</button>
        </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/95 z-50 flex flex-col p-4 animate-in slide-in-from-bottom">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="text-justice-accent" /> File Report
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">Close</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label className="block text-gray-400 text-sm mb-1">Your Name (Aggrieved Person)</label>
            <input 
                required
                type="text" 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-justice-primary outline-none"
                value={formData.victim_name}
                onChange={e => setFormData({...formData, victim_name: e.target.value})}
            />
        </div>

        <div>
            <label className="block text-gray-400 text-sm mb-1">Name of Abuser (Respondent)</label>
            <input 
                required
                type="text" 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-justice-primary outline-none"
                value={formData.respondent_name}
                onChange={e => setFormData({...formData, respondent_name: e.target.value})}
            />
        </div>

        <div>
            <label className="block text-gray-400 text-sm mb-1">Incident Details</label>
            <textarea 
                required
                rows={4}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-justice-primary outline-none"
                placeholder="Describe what happened..."
                value={formData.incident_details}
                onChange={e => setFormData({...formData, incident_details: e.target.value})}
            />
        </div>

        <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-justice-primary hover:bg-violet-700 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2"
        >
            {loading ? "Generating..." : <><Download size={20}/> Generate Official PDF</>}
        </button>
      </form>
    </div>
  );
};

export default FormWizard;

FormWizard.propTypes = {
  onClose: PropTypes.func.isRequired,
};
