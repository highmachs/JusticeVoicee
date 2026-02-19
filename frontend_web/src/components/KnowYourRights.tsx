import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// All facts are from REAL Indian law — PWDVA 2005, IPC 498A, DV Act, etc.
const RIGHTS_CARDS = [
    {
        title: "You Can Stay In Your Home",
        law: "PWDVA 2005, Section 17",
        fact: "Under the Protection of Women from Domestic Violence Act, you have the legal right to live in your shared household. Your husband or in-laws cannot throw you out. Even if the house is not in your name, you have the right to reside there.",
        icon: "🏠",
        color: "from-purple-100 to-purple-50",
        border: "border-purple-200",
    },
    {
        title: "Verbal Abuse IS Domestic Violence",
        law: "PWDVA 2005, Section 3",
        fact: "Domestic violence is not just physical. The law covers verbal abuse, emotional abuse, threats, insults, ridicule, and humiliation. If someone is calling you names, threatening you, or controlling your movements — that is domestic violence under Indian law.",
        icon: "🗣️",
        color: "from-pink-100 to-pink-50",
        border: "border-pink-200",
    },
    {
        title: "Free Legal Aid Is Your Right",
        law: "Legal Services Authorities Act, 1987",
        fact: "Every woman in India has the right to free legal aid regardless of income. You can visit your District Legal Services Authority or call 181 to connect with a free lawyer. One Stop Centres also provide free legal help.",
        icon: "⚖️",
        color: "from-blue-100 to-blue-50",
        border: "border-blue-200",
    },
    {
        title: "You Can Get a Protection Order",
        law: "PWDVA 2005, Section 18",
        fact: "A Magistrate can issue a Protection Order that stops your abuser from contacting you, entering your home, or coming near your workplace. You can apply through a Protection Officer or a lawyer. This order is legally enforceable.",
        icon: "🛡️",
        color: "from-green-100 to-green-50",
        border: "border-green-200",
    },
    {
        title: "Dowry Demand Is a Crime",
        law: "Dowry Prohibition Act, 1961 & IPC 498A",
        fact: "Demanding dowry before, during, or after marriage is a criminal offence punishable with up to 5 years in prison. If your in-laws are demanding money, gold, or gifts — you can file a complaint at any police station.",
        icon: "💰",
        color: "from-amber-100 to-amber-50",
        border: "border-amber-200",
    },
    {
        title: "Police Must Register Your FIR",
        law: "CrPC Section 154",
        fact: "The police cannot refuse to register your FIR. If they do, you can write to the Superintendent of Police or approach the Magistrate directly. For domestic violence, women police stations are available in most districts.",
        icon: "📋",
        color: "from-rose-100 to-rose-50",
        border: "border-rose-200",
    },
    {
        title: "You Can Get Monthly Maintenance",
        law: "PWDVA 2005, Section 20 & CrPC 125",
        fact: "If you are separated from your husband, you have the legal right to maintenance (monthly money) for yourself and your children. The court decides the amount based on your husband's income. You do not need a divorce to claim this.",
        icon: "💵",
        color: "from-teal-100 to-teal-50",
        border: "border-teal-200",
    },
    {
        title: "Workplace Harassment Is Punishable",
        law: "POSH Act, 2013",
        fact: "The Prevention of Sexual Harassment at Workplace Act covers all workplaces including offices, factories, farms, and even domestic work. Every employer with 10+ employees must have an Internal Complaints Committee. You can file a written complaint.",
        icon: "🏢",
        color: "from-indigo-100 to-indigo-50",
        border: "border-indigo-200",
    },
];

const KnowYourRights = () => {
    const [currentCard, setCurrentCard] = useState(0);
    const [direction, setDirection] = useState(0);

    const goNext = () => {
        if (currentCard < RIGHTS_CARDS.length - 1) {
            setDirection(1);
            setCurrentCard(prev => prev + 1);
        }
    };

    const goPrev = () => {
        if (currentCard > 0) {
            setDirection(-1);
            setCurrentCard(prev => prev - 1);
        }
    };

    const card = RIGHTS_CARDS[currentCard];

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Card */}
            <div className="relative overflow-hidden" style={{ minHeight: '320px' }}>
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentCard}
                        custom={direction}
                        initial={{ x: direction > 0 ? 200 : -200, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: direction > 0 ? -200 : 200, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 border ${card.border} shadow-sm`}
                    >
                        <div className="text-center mb-4">
                            <span className="text-4xl">{card.icon}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 text-center mb-2">{card.title}</h3>
                        <div className="bg-white/60 rounded-lg px-3 py-1.5 mb-4 inline-block w-full text-center">
                            <span className="text-xs font-medium text-purple-700">{card.law}</span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{card.fact}</p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-4 px-2">
                <button
                    onClick={goPrev}
                    disabled={currentCard === 0}
                    className="w-10 h-10 rounded-full bg-white border border-purple-200 flex items-center justify-center text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-purple-50 transition-colors shadow-sm"
                >
                    ←
                </button>
                <div className="flex gap-1.5">
                    {RIGHTS_CARDS.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => { setDirection(i > currentCard ? 1 : -1); setCurrentCard(i); }}
                            className={`w-2 h-2 rounded-full transition-all ${i === currentCard ? 'bg-purple-500 w-6' : 'bg-purple-200'
                                }`}
                        />
                    ))}
                </div>
                <button
                    onClick={goNext}
                    disabled={currentCard === RIGHTS_CARDS.length - 1}
                    className="w-10 h-10 rounded-full bg-white border border-purple-200 flex items-center justify-center text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-purple-50 transition-colors shadow-sm"
                >
                    →
                </button>
            </div>

            <p className="text-center text-xs text-purple-400 mt-2">
                {currentCard + 1} of {RIGHTS_CARDS.length} rights
            </p>
        </div>
    );
};

export default KnowYourRights;
