import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Answer {
    label: string;
    value: string;
}

interface Question {
    id: string;
    question: string;
    icon: string;
    answers: Answer[];
}

const QUESTIONS: Question[] = [
    {
        id: 'living',
        question: 'Are you currently living with the person who is hurting you?',
        icon: '🏠',
        answers: [
            { label: 'Yes, I live with them', value: 'living_with' },
            { label: 'No, I live separately', value: 'living_apart' },
            { label: 'I left recently', value: 'recently_left' },
        ],
    },
    {
        id: 'children',
        question: 'Do you have children?',
        icon: '👶',
        answers: [
            { label: 'Yes', value: 'has_children' },
            { label: 'No', value: 'no_children' },
        ],
    },
    {
        id: 'violence_type',
        question: 'What kind of harm are you facing?',
        icon: '⚠️',
        answers: [
            { label: 'Physical (hitting, slapping)', value: 'physical' },
            { label: 'Verbal (insults, threats)', value: 'verbal' },
            { label: 'Dowry demands', value: 'dowry' },
            { label: 'Financial (not given money)', value: 'financial' },
            { label: 'Sexual', value: 'sexual' },
        ],
    },
    {
        id: 'reported',
        question: 'Have you reported this to anyone before?',
        icon: '📝',
        answers: [
            { label: 'Yes, to the police', value: 'reported_police' },
            { label: 'Yes, to family', value: 'reported_family' },
            { label: 'No, this is the first time', value: 'not_reported' },
        ],
    },
];

// Safety plan items based on real guidelines from National Commission for Women
interface PlanItem {
    action: string;
    detail: string;
    priority: 'high' | 'medium' | 'low';
}

function generatePlan(answers: Record<string, string>): PlanItem[] {
    const plan: PlanItem[] = [];

    // Always add emergency numbers
    plan.push({
        action: 'Save emergency numbers',
        detail: 'Women Helpline: 181, Police: 112, Domestic Abuse: 1091. Save them under a code name like "Doctor" or "Aunty" in your phone.',
        priority: 'high',
    });

    if (answers.living === 'living_with') {
        plan.push({
            action: 'Prepare a safety bag',
            detail: 'Keep a bag packed with your ID (Aadhaar, marriage certificate), some cash, medicines, and one change of clothes. Hide it at a trusted neighbor\'s house or where it\'s easy to grab.',
            priority: 'high',
        });
        plan.push({
            action: 'Identify a safe exit',
            detail: 'Know which door or window you can use to leave quickly. Practice the route so you can do it even in the dark.',
            priority: 'high',
        });
        plan.push({
            action: 'Tell a trusted person',
            detail: 'Confide in one neighbor, friend, or relative who lives nearby. Agree on a code word or signal that means "come help me" or "call the police."',
            priority: 'high',
        });
    }

    if (answers.living === 'recently_left') {
        plan.push({
            action: 'Apply for a Protection Order',
            detail: 'Visit the nearest Magistrate court or contact a Protection Officer through the Women Helpline (181). A Protection Order legally prevents the abuser from contacting or coming near you.',
            priority: 'high',
        });
    }

    if (answers.children === 'has_children') {
        plan.push({
            action: 'Know your custody rights',
            detail: 'Under Indian law, mothers generally get custody of children below 5 years. Older children\'s preference is also considered. You can apply for custody through the family court.',
            priority: 'medium',
        });
        plan.push({
            action: 'Keep children\'s documents safe',
            detail: 'Make copies of children\'s birth certificates, school records, and vaccination cards. Store them separately from originals.',
            priority: 'medium',
        });
    }

    if (answers.violence_type === 'physical' || answers.violence_type === 'sexual') {
        plan.push({
            action: 'Document injuries',
            detail: 'If safe, take photos of injuries with dates. Visit a government hospital and get a medical report (MLC - Medico Legal Case). These are free and serve as legal evidence.',
            priority: 'high',
        });
    }

    if (answers.violence_type === 'dowry') {
        plan.push({
            action: 'File under Dowry Prohibition Act',
            detail: 'Dowry demands are a crime under the Dowry Prohibition Act 1961 and IPC Section 498A. You can file a complaint at any police station. Keep records of messages, gifts given, and witnesses.',
            priority: 'high',
        });
    }

    if (answers.violence_type === 'financial') {
        plan.push({
            action: 'Claim maintenance',
            detail: 'Under PWDVA Section 20 and CrPC Section 125, you have the right to monthly maintenance from your husband even without divorce. Contact a lawyer at the One Stop Centre (call 181).',
            priority: 'medium',
        });
    }

    if (answers.reported === 'not_reported') {
        plan.push({
            action: 'Visit a One Stop Centre',
            detail: 'One Stop Centres provide free medical help, legal aid, counseling, and temporary shelter all in one place. Call 181 to find the nearest one. You do not need to file a police complaint first.',
            priority: 'medium',
        });
    }

    plan.push({
        action: 'Know your legal rights',
        detail: 'Under PWDVA 2005, you have the right to: live in your shared home (Section 17), get a protection order (Section 18), receive maintenance (Section 20), and get custody of children (Section 21).',
        priority: 'medium',
    });

    return plan;
}

const SafetyPlan = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showPlan, setShowPlan] = useState(false);

    const handleAnswer = (questionId: string, value: string) => {
        const newAnswers = { ...answers, [questionId]: value };
        setAnswers(newAnswers);

        if (currentQuestion < QUESTIONS.length - 1) {
            setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
        } else {
            setTimeout(() => setShowPlan(true), 300);
        }
    };

    const restart = () => {
        setCurrentQuestion(0);
        setAnswers({});
        setShowPlan(false);
    };

    if (showPlan) {
        const plan = generatePlan(answers);
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-md mx-auto"
            >
                <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4">
                        <h3 className="text-xl font-bold text-purple-800 text-center">Your Personal Safety Plan</h3>
                        <p className="text-purple-500 text-xs text-center mt-1">Based on your situation — keep this safe</p>
                    </div>
                    <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                        {plan.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`p-3 rounded-xl border ${item.priority === 'high'
                                        ? 'bg-red-50 border-red-200'
                                        : item.priority === 'medium'
                                            ? 'bg-amber-50 border-amber-200'
                                            : 'bg-green-50 border-green-200'
                                    }`}
                            >
                                <div className="flex items-start gap-2">
                                    <span className="text-sm mt-0.5">
                                        {item.priority === 'high' ? '🔴' : item.priority === 'medium' ? '🟡' : '🟢'}
                                    </span>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">{item.action}</p>
                                        <p className="text-gray-600 text-xs mt-1 leading-relaxed">{item.detail}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-purple-100">
                        <button
                            onClick={restart}
                            className="w-full py-2.5 text-sm text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
                        >
                            ↻ Start Over
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    const q = QUESTIONS[currentQuestion];

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Progress */}
            <div className="flex gap-1.5 mb-6">
                {QUESTIONS.map((_, i) => (
                    <div
                        key={i}
                        className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${i <= currentQuestion ? 'bg-purple-500' : 'bg-purple-100'
                            }`}
                    />
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-2xl border border-purple-100 p-6 shadow-sm"
                >
                    <div className="text-center mb-6">
                        <span className="text-4xl">{q.icon}</span>
                        <h3 className="text-lg font-semibold text-gray-800 mt-3">{q.question}</h3>
                        <p className="text-purple-400 text-xs mt-1">Question {currentQuestion + 1} of {QUESTIONS.length}</p>
                    </div>

                    <div className="space-y-2.5">
                        {q.answers.map((answer) => (
                            <motion.button
                                key={answer.value}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleAnswer(q.id, answer.value)}
                                className={`w-full text-left p-3.5 rounded-xl border transition-all text-sm ${answers[q.id] === answer.value
                                        ? 'bg-purple-100 border-purple-300 text-purple-800'
                                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-purple-50 hover:border-purple-200'
                                    }`}
                            >
                                {answer.label}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default SafetyPlan;
