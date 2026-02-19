import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calculator from './components/Calculator';
import Dashboard from './components/Dashboard';
import DecoyInterface from './components/DecoyInterface';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Calculator />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/shopping" element={<DecoyInterface />} />
      </Routes>
    </Router>
  );
}

export default App;
