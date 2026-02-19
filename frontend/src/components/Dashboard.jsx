import { useEffect } from 'react';
import ChatInterface from './ChatInterface';
import { syncOfflineData } from '../api';

const Dashboard = () => {
  useEffect(() => {
    // Sync data in background for offline use (Covering /services/sync/offline-data)
    syncOfflineData().catch(console.error);
  }, []);

  return (
    <ChatInterface />
  );
};

export default Dashboard;
