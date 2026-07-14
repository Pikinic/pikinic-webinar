"use client";

import { useEffect, useRef, useState } from "react";

interface Milestone {
  time: string;
  title: string;
  trackADetail: string;
  trackBDetail: string;
}

const milestones: Milestone[] = [
  {
    time: "00:00",
    title: "Registration & Profile Creation",
    trackADetail: "Input your career history and target courses. We instantly map your profile to partner fast-track routes.",
    trackBDetail: "Enter your child's academic grades (WAEC/NECO/Degree) and select preferred UK study locations.",
  },
  {
    time: "04:00",
    title: "Direct Document Portal Submission",
    trackADetail: "Upload your CV and employment letters. We use these to bypass generic IELTS and exam requirements.",
    trackBDetail: "Upload transcripts, WAEC certificates, and sponsor details for rapid credibility review.",
  },
  {
    time: "18:00",
    title: "Partner Admissions Fast-Track Review",
    trackADetail: "Admissions teams at partner universities prioritize your application using direct internal channels.",
    trackBDetail: "University representatives verify credentials and check sponsor viability for financial clearance.",
  },
  {
    time: "24:00",
    title: "Official Offer Letter Issued",
    trackADetail: "Your official conditional/unconditional offer is issued, bypasses weeks of regular public queue waiting.",
    trackBDetail: "Receive the official offer letter along with clear, step-by-step tuition payment and CAS details.",
  },
];

export default function TimelineRail() {
  const [activeTrack, setActiveTrack] = useState<"A" | "B">("A");
  const [activeStep, setActiveStep] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Intersection Observer to trigger sequenced animations when section is visible
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          // Sequence the steps
          let step = 0;
          const animate = () => {
            setActiveStep(step);
            if (step < milestones.length - 1) {
              step++;
              setTimeout(animate, 500); // 500ms delay between nodes
            }
          };
          // Start sequence after a brief initial delay
          setTimeout(animate, 200);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [hasAnimated]);

  // Handle reset to allow user to toggle and re-animate or just view
  const accentColorClass = activeTrack === "A" ? "bg-red-500 text-white" : "bg-orange-500 text-white";
  const accentBorderColorClass = activeTrack === "A" ? "border-red-500" : "border-orange-500";
  const accentTextColorClass = activeTrack === "A" ? "text-red-500" : "text-orange-500";
  const activeDotClass = activeTrack === "A" ? "bg-red-500 shadow-[0_0_15px_rgba(237,50,55,0.7)]" : "bg-orange-500 shadow-[0_0_15px_rgba(245,134,52,0.7)]";

  return (
    <div
      ref={containerRef}
      className="w-full max-w-6xl mx-auto px-4 md:px-8 py-8"
    >
      {/* Track Switcher */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex p-1 bg-ink-900/60 rounded-full border border-teal-900/30 backdrop-blur-sm">
          <button
            onClick={() => setActiveTrack("A")}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTrack === "A"
                ? "bg-red-500 text-white shadow-lg"
                : "text-cream-50/70 hover:text-cream-50"
            }`}
          >
            Track A: Professionals
          </button>
          <button
            onClick={() => setActiveTrack("B")}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTrack === "B"
                ? "bg-orange-500 text-white shadow-lg"
                : "text-cream-50/70 hover:text-cream-50"
            }`}
          >
            Track B: Parents
          </button>
        </div>
      </div>

      {/* Desktop Horizontal Rail */}
      <div className="hidden md:block relative mb-16 mt-8">
        {/* The Connection Rail */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-teal-900/20 transform -translate-y-1/2 z-0" />
        
        {/* The Active/Filled Progress Rail */}
        <div
          className="absolute top-1/2 left-0 h-1 transform -translate-y-1/2 z-0 transition-all duration-1000 ease-out"
          style={{
            width: `${Math.max(0, (activeStep / (milestones.length - 1)) * 100)}%`,
            backgroundColor: activeTrack === "A" ? "#ED3237" : "#F58634",
          }}
        />

        {/* Milestone Nodes */}
        <div className="relative flex justify-between z-10">
          {milestones.map((milestone, idx) => {
            const isCompleted = activeStep >= idx;
            return (
              <div
                key={idx}
                className="flex flex-col items-center w-1/4 text-center px-4"
              >
                {/* Time Indicator */}
                <div
                  className={`font-mono text-sm tracking-wider mb-4 transition-all duration-500 ${
                    isCompleted ? "text-yellow-400 font-bold" : "text-cream-50/40"
                  }`}
                >
                  {milestone.time}
                </div>

                {/* Node Circle */}
                <div
                  className={`w-8 h-8 rounded-full border-4 border-teal-900 flex items-center justify-center transition-all duration-500 transform ${
                    isCompleted
                      ? `${activeDotClass} scale-110`
                      : "bg-teal-900/80 border-teal-900/40 scale-100"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${isCompleted ? "bg-white" : "bg-cream-50/20"}`} />
                </div>

                {/* Milestone Title */}
                <h4
                  className={`mt-4 font-semibold text-lg leading-tight transition-all duration-500 ${
                    isCompleted ? "text-cream-50" : "text-cream-50/50"
                  }`}
                >
                  {milestone.title}
                </h4>

                {/* Milestone Details */}
                <p
                  className={`mt-2 text-sm leading-relaxed transition-all duration-700 delay-150 ${
                    isCompleted ? "text-cream-50/80" : "text-cream-50/0 pointer-events-none"
                  }`}
                >
                  {activeTrack === "A" ? milestone.trackADetail : milestone.trackBDetail}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical Rail */}
      <div className="md:hidden relative border-l-2 border-teal-900/20 pl-8 ml-4 space-y-12 py-4">
        {/* Animated active vertical line */}
        <div
          className="absolute left-0 top-0 w-0.5 transition-all duration-1000 ease-out"
          style={{
            height: `${Math.max(0, ((activeStep + 1) / milestones.length) * 100)}%`,
            backgroundColor: activeTrack === "A" ? "#ED3237" : "#F58634",
            transform: "translateX(-1px)",
          }}
        />

        {milestones.map((milestone, idx) => {
          const isCompleted = activeStep >= idx;
          return (
            <div
              key={idx}
              className={`relative transition-all duration-500 transform ${
                isCompleted ? "translate-x-0 opacity-100" : "translate-x-4 opacity-30"
              }`}
            >
              {/* Node Indicator Dot */}
              <div
                className={`absolute -left-12 top-0.5 w-8 h-8 rounded-full border-4 border-teal-900 flex items-center justify-center transition-all duration-500 transform ${
                  isCompleted ? `${activeDotClass} scale-110` : "bg-teal-900/80 border-teal-900/40 scale-100"
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${isCompleted ? "bg-white" : "bg-cream-50/20"}`} />
              </div>

              {/* Time Indicator */}
              <div className={`font-mono text-xs tracking-wider mb-1 ${isCompleted ? "text-yellow-400 font-bold" : "text-cream-50/40"}`}>
                {milestone.time}
              </div>

              {/* Milestone Title */}
              <h4 className="font-semibold text-lg text-cream-50">
                {milestone.title}
              </h4>

              {/* Milestone Details */}
              <p className="mt-2 text-sm text-cream-50/80 leading-relaxed">
                {activeTrack === "A" ? milestone.trackADetail : milestone.trackBDetail}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
