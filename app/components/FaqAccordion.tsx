"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    question: "Is this webinar really free?",
    answer: "Yes. There is no cost to attend and no obligation to apply for anything afterward.",
  },
  {
    question: "Do I need any documents ready to join?",
    answer: "No. This session is designed to tell you exactly what you will need, so you can prepare properly afterward.",
  },
  {
    question: "What if I can't attend live?",
    answer: "Register anyway. You will receive access to the replay so you do not miss the information.",
  },
  {
    question: "Is this only for professionals, or can parents attend too?",
    answer: "Both. The session covers the process for professionals applying for themselves and parents applying on behalf of their child.",
  },
  {
    question: "Will there be time for questions?",
    answer: "Yes. Part of the session is set aside specifically so you can ask about your own situation directly.",
  },
  {
    question: "What happens after the webinar if I want to move forward?",
    answer: "You will be shown exactly how the 24-hour offer process and the £3,000 deposit works, so you can decide for yourself with no pressure to commit on the spot.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {faqItems.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`border-b border-teal-900/10 pb-4 transition-all duration-300`}
          >
            <button
              onClick={() => toggleItem(idx)}
              className="w-full flex justify-between items-center text-left py-4 focus:outline-none group"
              aria-expanded={isOpen}
            >
              <span
                className={`text-lg md:text-xl font-medium transition-all duration-300 ${
                  isOpen ? "text-teal-900" : "text-ink-900/80 group-hover:text-teal-900"
                }`}
              >
                {item.question}
              </span>
              <span
                className={`ml-4 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isOpen ? "bg-yellow-400 text-ink-900" : "bg-teal-900/5 text-teal-900 group-hover:bg-teal-900/10"
                }`}
              >
                <svg
                  className={`w-4 h-4 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-60 opacity-100 mt-2" : "max-h-0 opacity-0 pointer-events-none"
              }`}
            >
              <p className="text-base text-ink-900/70 leading-relaxed pl-1 border-l-2 border-yellow-400">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
