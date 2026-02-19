import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface StealthCalculatorProps {
    onReveal: () => void;
}

const StealthCalculator = ({ onReveal }: StealthCalculatorProps) => {
    const [display, setDisplay] = useState('0');
    const [prevValue, setPrevValue] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);

    // Secret code: type "112" to reveal real app
    useEffect(() => {
        if (display === '112') {
            const timer = setTimeout(() => onReveal(), 400);
            return () => clearTimeout(timer);
        }
    }, [display, onReveal]);

    const inputNumber = (num: string) => {
        if (waitingForOperand) {
            setDisplay(num);
            setWaitingForOperand(false);
        } else {
            setDisplay(display === '0' ? num : display + num);
        }
    };

    const inputDecimal = () => {
        if (!display.includes('.')) {
            setDisplay(display + '.');
        }
    };

    const clearAll = () => {
        setDisplay('0');
        setPrevValue(null);
        setOperator(null);
        setWaitingForOperand(false);
    };

    const inputOperator = (op: string) => {
        const current = parseFloat(display);
        if (prevValue !== null && operator && !waitingForOperand) {
            const result = calculate(prevValue, current, operator);
            setDisplay(String(result));
            setPrevValue(result);
        } else {
            setPrevValue(current);
        }
        setOperator(op);
        setWaitingForOperand(true);
    };

    const calculate = (a: number, b: number, op: string): number => {
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '×': return a * b;
            case '÷': return b !== 0 ? a / b : 0;
            default: return b;
        }
    };

    const handleEquals = () => {
        const current = parseFloat(display);
        if (prevValue !== null && operator) {
            const result = calculate(prevValue, current, operator);
            setDisplay(String(parseFloat(result.toFixed(8))));
            setPrevValue(null);
            setOperator(null);
            setWaitingForOperand(true);
        }
    };

    const buttons = [
        ['C', '±', '%', '÷'],
        ['7', '8', '9', '×'],
        ['4', '5', '6', '-'],
        ['1', '2', '3', '+'],
        ['0', '.', '='],
    ];

    const handleButton = (btn: string) => {
        switch (btn) {
            case 'C': clearAll(); break;
            case '±': setDisplay(String(-parseFloat(display))); break;
            case '%': setDisplay(String(parseFloat(display) / 100)); break;
            case '÷': case '×': case '-': case '+': inputOperator(btn); break;
            case '=': handleEquals(); break;
            case '.': inputDecimal(); break;
            default: inputNumber(btn); break;
        }
    };

    const isOperator = (btn: string) => ['÷', '×', '-', '+'].includes(btn);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-xs bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Display */}
                <div className="bg-gray-900 p-6 pt-12">
                    <div className="text-right text-white text-5xl font-light tracking-tight overflow-hidden">
                        {display.length > 9 ? parseFloat(display).toExponential(3) : display}
                    </div>
                </div>

                {/* Buttons */}
                <div className="p-3 bg-gray-800 space-y-2">
                    {buttons.map((row, rowIdx) => (
                        <div key={rowIdx} className="flex gap-2">
                            {row.map(btn => {
                                const isZero = btn === '0';
                                const isOp = isOperator(btn);
                                const isEquals = btn === '=';
                                const isTopRow = rowIdx === 0 && !isOp;

                                return (
                                    <motion.button
                                        key={btn}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleButton(btn)}
                                        className={`
                      ${isZero ? 'flex-[2]' : 'flex-1'} 
                      aspect-square rounded-full text-2xl font-medium
                      flex items-center justify-center
                      transition-colors active:brightness-75
                      ${isOp || isEquals ? 'bg-orange-500 text-white' : ''}
                      ${isTopRow ? 'bg-gray-400 text-gray-900' : ''}
                      ${!isOp && !isEquals && !isTopRow ? 'bg-gray-700 text-white' : ''}
                      ${isZero ? 'aspect-auto py-4' : ''}
                    `}
                                    >
                                        {btn}
                                    </motion.button>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Subtle hint (barely visible) */}
                <div className="bg-gray-800 pb-4 px-4">
                    <p className="text-gray-700 text-[9px] text-center select-none">
                        dial emergency
                    </p>
                </div>
            </div>
        </div>
    );
};

// SOS Overlay Component
const SOSOverlay = ({ onClose }: { onClose: () => void }) => {
    const [locationStatus, setLocationStatus] = useState('Getting location...');
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    setLocationStatus('📍 Location captured');
                },
                () => setLocationStatus('📍 Location unavailable')
            );
        }
    }, []);

    const emergencyNumbers = [
        { name: 'Women Helpline', number: '181', icon: '👩' },
        { name: 'Police', number: '112', icon: '🚔' },
        { name: 'Domestic Abuse', number: '1091', icon: '🆘' },
        { name: 'NCW Helpline', number: '7827-170-170', icon: '📞' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-red-900/95 backdrop-blur-md flex flex-col items-center justify-center p-6"
        >
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="max-w-sm w-full space-y-6"
            >
                <div className="text-center">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="text-6xl mb-4"
                    >
                        🚨
                    </motion.div>
                    <h2 className="text-3xl font-bold text-white mb-2">Emergency SOS</h2>
                    <p className="text-red-200 text-sm">{locationStatus}</p>
                    {coords && (
                        <p className="text-red-300 text-xs mt-1 font-mono">
                            {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                        </p>
                    )}
                </div>

                {/* Emergency Call Buttons */}
                <div className="space-y-3">
                    {emergencyNumbers.map((item) => (
                        <motion.a
                            key={item.number}
                            href={`tel:${item.number}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/25 transition-colors"
                        >
                            <span className="text-3xl mr-4">{item.icon}</span>
                            <div className="flex-1">
                                <p className="text-white font-bold">{item.name}</p>
                                <p className="text-red-200 text-sm">{item.number}</p>
                            </div>
                            <span className="text-2xl">📞</span>
                        </motion.a>
                    ))}
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="w-full py-3 text-red-300 text-sm hover:text-white transition-colors"
                >
                    ✕ Close (Press Escape)
                </button>
            </motion.div>
        </motion.div>
    );
};

export { StealthCalculator, SOSOverlay };
export default StealthCalculator;
