import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const navigate = useNavigate();
  const SECRET_CODE = '1122+'; 
  const DECOY_CODE = '0000+';

  const handlePress = (val) => {
    setDisplay((prev) => {
      const newVal = prev === '0' ? val : prev + val;
      
      // Check for secret code sequence
      if (newVal.endsWith(SECRET_CODE)) {
        navigate('/dashboard'); // Unlock App
        return '0';
      }
      // Check for decoy code sequence
      if (newVal.endsWith(DECOY_CODE)) {
        navigate('/shopping'); // Open Decoy App
        return '0';
      }
      return newVal;
    });
  };

  const calculate = () => {
    try {
      // eslint-disable-next-line no-eval
      setDisplay(String(eval(display)));
    } catch (e) {
      setDisplay('Error');
    }
  };

  const clear = () => setDisplay('0');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-80 bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        {/* Display */}
        <div className="h-24 bg-gray-900 flex items-end justify-end p-4 text-4xl font-mono text-white">
          {display}
        </div>
        
        {/* Keypad */}
        <div className="grid grid-cols-4 gap-1 bg-gray-700 p-1">
          {['C', '(', ')', '/'].map((btn) => (
            <button key={btn} onClick={btn === 'C' ? clear : () => handlePress(btn)} 
              className="p-4 bg-gray-600 hover:bg-gray-500 text-cyan-400 font-bold text-xl rounded">
              {btn}
            </button>
          ))}
          {[7, 8, 9, '*'].map((btn) => (
            <button key={btn} onClick={() => handlePress(String(btn))}
              className={`p-4 ${typeof btn === 'number' ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-600 text-cyan-400'} font-bold text-xl rounded`}>
              {btn}
            </button>
          ))}
          {[4, 5, 6, '-'].map((btn) => (
            <button key={btn} onClick={() => handlePress(String(btn))}
              className={`p-4 ${typeof btn === 'number' ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-600 text-cyan-400'} font-bold text-xl rounded`}>
              {btn}
            </button>
          ))}
          {[1, 2, 3, '+'].map((btn) => (
            <button key={btn} onClick={() => handlePress(String(btn))}
              className={`p-4 ${typeof btn === 'number' ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-600 text-cyan-400'} font-bold text-xl rounded`}>
              {btn}
            </button>
          ))}
          <button onClick={() => handlePress('0')} className="col-span-2 p-4 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xl rounded">0</button>
          <button onClick={() => handlePress('.')} className="p-4 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xl rounded">.</button>
          <button onClick={calculate} className="p-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xl rounded">=</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
