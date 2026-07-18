import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollProgress from "./components/ScrollProgress";
import Header from "./components/Header";
import Countdown from "./components/Countdown";
import TimelineRail from "./components/TimelineRail";
import FaqAccordion from "./components/FaqAccordion";
import Reveal from "./components/Reveal";
import RegisterForm from "./components/RegisterForm";

export default function Homepage() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow">
        
        {/* Hero Section */}
        <section id="hero" className="bg-cream-50 pt-12 pb-16 md:py-24 border-b border-teal-900/5 relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-900/[0.02] rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/[0.02] rounded-full blur-3xl pointer-events-none -ml-32 -mb-32" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
              {/* Left Column - Copy */}
              <div className="lg:col-span-7 flex flex-col items-start space-y-8">
                
                {/* Eyebrow */}
                <Reveal delay={100} duration={500}>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider text-teal-900 bg-teal-900/5 border border-teal-900/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Live webinar with Adeniyi Akitoye (MD, PiKiNiC)
                  </span>
                </Reveal>
 
                {/* Headline */}
                <Reveal delay={200} duration={600}>
                  <h1 className="text-4xl md:text-5xl lg:text-[52px] font-bold text-teal-900 tracking-tight leading-[1.05] font-sans">
                    The <span className="text-red-500 relative inline-block">24-48 Hour System<span className="absolute bottom-1 left-0 w-full h-[6px] bg-yellow-400 -z-10" /></span> Nigerian Applicants Use To Get UK University Offers — Before The September Intake Closes
                  </h1>
                </Reveal>
 
                {/* Subhead */}
                <Reveal delay={300} duration={600}>
                  <p className="text-lg md:text-xl text-ink-900/80 leading-relaxed max-w-2xl">
                    A UK university offer usually takes months of back-and-forth. Through our direct admissions partnerships, it can take a day. This free live session shows you exactly how — no cost, no obligation.
                  </p>
                </Reveal>
 
                {/* Countdown Timer */}
                <Reveal delay={400} duration={600}>
                  <Countdown variant="cards" />
                </Reveal>
 
                {/* Action Buttons */}
                <Reveal delay={500} duration={600}>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
                    <a
                      href="#register-section"
                      className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-bold text-white bg-red-500 hover:bg-red-500/95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_20px_rgba(237,50,55,0.2)] text-center group"
                    >
                      Register Now
                      <span className="ml-2 transform group-hover:translate-x-0.5 transition-transform">→</span>
                    </a>
                  </div>
                </Reveal>
              </div>
 
              {/* Right Column - Premium Generated Image with quiet border */}
              <div className="lg:col-span-5 relative w-full aspect-square md:max-w-md lg:max-w-none mx-auto">
                <Reveal delay={300} duration={800} className="w-full h-full relative">
                  <div className="absolute inset-0 border border-teal-900/10 rounded-2xl overflow-hidden shadow-2xl bg-white transform hover:scale-[1.01] hover:rotate-1 transition-all duration-500">
                    <Image
                      src="/images/hero_professional.jpg"
                      alt="Nigerian family consulting with a student advisor"
                      fill
                      sizes="(max-w-720px) 100vw, 500px"
                      priority
                      className="object-cover"
                    />
                  </div>
                  {/* Absolute overlay tag */}
                  <div className="absolute -bottom-4 -left-4 bg-yellow-400 text-ink-900 font-mono text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg border border-teal-900/10">
                    Live July 21 · 8pm WAT
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* Registration Section (Directly Under Hero) */}
        <section id="register-section" className="bg-cream-50 py-12 md:py-16 border-b border-teal-900/5 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Reveal delay={100}>
              <Suspense fallback={<div className="w-full max-w-xl mx-auto h-[480px] bg-white rounded-3xl animate-pulse shadow-sm" />}>
                <RegisterForm />
              </Suspense>
            </Reveal>
          </div>
        </section>
 
        {/* Trust Bar Section (Visa Completion Numbers) */}
        <section className="bg-cream-50 py-12 border-b border-teal-900/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 divide-y-0 lg:divide-x divide-teal-900/10 text-center lg:text-left py-4">
              {/* Stat 1 */}
              <div className="flex flex-col items-center lg:items-start lg:pl-4 lg:pr-8 py-2">
                <span className="font-mono text-3xl md:text-4xl font-bold text-teal-900">
                  482
                </span>
                <span className="text-xs text-ink-900/70 mt-1.5 uppercase tracking-wider font-semibold">
                  Students Enrolled
                </span>
              </div>
              {/* Stat 2 */}
              <div className="flex flex-col items-center lg:items-start lg:px-8 py-2">
                <span className="font-mono text-3xl md:text-4xl font-bold text-teal-900">
                  98%
                </span>
                <span className="text-xs text-ink-900/70 mt-1.5 uppercase tracking-wider font-semibold">
                  Visa Success Rate
                </span>
              </div>
              {/* Stat 3 */}
              <div className="flex flex-col items-center lg:items-start lg:px-8 py-2">
                <span className="font-mono text-3xl md:text-4xl font-bold text-teal-900">
                  27
                </span>
                <span className="text-xs text-ink-900/70 mt-1.5 uppercase tracking-wider font-semibold">
                  University Partnerships
                </span>
              </div>
              {/* Stat 4 */}
              <div className="flex flex-col items-center lg:items-start lg:pl-8 py-2">
                <span className="font-mono text-3xl md:text-4xl font-bold text-teal-900">
                  12
                </span>
                <span className="text-xs text-ink-900/70 mt-1.5 uppercase tracking-wider font-semibold">
                  Certified Counselors
                </span>
              </div>
            </div>
          </div>
        </section>
 
        {/* Why We're Hosting This For Free Section */}
        <section id="why-free" className="bg-cream-50 py-24 md:py-32 border-b border-teal-900/5 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-400/[0.03] rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-white border border-teal-900/10 rounded-3xl p-8 sm:p-12 md:p-14 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                
                {/* Left Column - Heading */}
                <div className="lg:col-span-5 flex flex-col items-start lg:border-r border-teal-900/10 lg:pr-10">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-teal-900 bg-teal-900/5 border border-teal-900/10">
                    Transparency & Value
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-teal-900 mt-4 tracking-tight leading-tight">
                    Why we&apos;re hosting this for free:
                  </h2>
                </div>
                
                {/* Right Column - Paragraphs */}
                <div className="lg:col-span-7 space-y-6 text-ink-900/85 text-base sm:text-lg leading-relaxed">
                  <p>
                    UK universities need qualified international applicants every single intake, because international tuition funds a real part of their budget.
                  </p>
                  <p className="font-semibold text-teal-900">
                    Which means the door is already open, most people just do not know how to walk through it correctly.
                  </p>
                  <p>
                    We built direct relationships with admissions teams so applicants would not have to go through the slow public queue everyone else is stuck in.
                  </p>
                  <p>
                    This webinar exists because explaining that system properly, once, to a room full of people, is a far better use of an hour than answering the same five questions one DM at a time.
                  </p>
                  <p className="p-6 bg-cream-50 border border-teal-900/10 rounded-2xl text-teal-900 font-medium leading-relaxed">
                    You are not being pitched something hidden behind a paywall. You are getting the same information we would give a paying client, for free, because the information itself is not the business. Helping you actually secure your offer is.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </section>
 
       
 
        {/* What You'll Learn Section (Editorial Split with Campus Image) */}
        <section className="bg-cream-50 py-24 md:py-32 border-b border-teal-900/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
              
              {/* Left Column: Heading and Takeaways */}
              <div className="lg:col-span-7 space-y-12">
                <div className="flex flex-col items-start">
                  <span className="text-xs font-mono tracking-widest text-teal-900/60 uppercase">
                    Curriculum
                  </span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-teal-900 mt-2 tracking-tight">
                    What You&apos;ll Walk Away With
                  </h2>
                  <p className="text-ink-900/75 mt-4 text-base leading-relaxed">
                    We don&apos;t hold general motivational seminars. This session outlines actionable strategies to resolve the most common delays in the UK admissions funnel.
                  </p>
                </div>
 
                <div className="space-y-8">
                  {/* Takeaway 1 */}
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-6 h-6 mt-1 flex items-center justify-center text-teal-900 text-sm font-bold select-none">
                      —
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-teal-900">Real Requirements</h4>
                      <p className="text-ink-900/70 mt-1.5 leading-relaxed">
                        What UK universities actually look for, stripping away the noise of agent checklists. We explain which requirements are strictly necessary and which can be waived.
                      </p>
                    </div>
                  </div>
 
                  {/* Takeaway 2 */}
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-6 h-6 mt-1 flex items-center justify-center text-teal-900 text-sm font-bold select-none">
                      —
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-teal-900">The 24-48 Hour Process</h4>
                      <p className="text-ink-900/70 mt-1.5 leading-relaxed">
                        How our direct admissions route works, and how to prepare your documents to qualify for 24-48 hour turnaround. Get a copy of the exact document checklists used by top partners.
                      </p>
                    </div>
                  </div>
 
                  {/* Takeaway 3 */}
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-6 h-6 mt-1 flex items-center justify-center text-teal-900 text-sm font-bold select-none">
                      —
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-teal-900">Funding & Proof of Funds</h4>
                      <p className="text-ink-900/70 mt-1.5 leading-relaxed">
                        The actual proof-of-funds rules, and how to navigate financial requirements without locking up all your capital. Learn legitimate strategies to demonstrate viability securely.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
 
              {/* Right Column: Tall Campus Portrait Image with offset frame */}
              <div className="lg:col-span-5 w-full aspect-[4/5] relative">
                <div className="absolute inset-0 border border-teal-900/10 rounded-3xl overflow-hidden shadow-2xl bg-white">
                  <Image
                    src="/images/uk_campus.jpg"
                    alt="Student walking on a UK university campus"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Floating badge */}
                <div className="absolute top-4 right-4 bg-teal-900 text-white font-mono text-[9px] font-bold px-3 py-1.5 rounded-full shadow-md uppercase tracking-wider">
                  Partnership Network
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Host Credibility Section */}
        <section className="bg-cream-50 py-24 md:py-32 border-b border-teal-900/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="max-w-3xl mx-auto text-center mb-20">
              <span className="text-xs font-mono tracking-widest text-teal-900/60 uppercase">
                Speaker & Advisory
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-teal-900 mt-2 tracking-tight">
                Meet Your Webinar Host
              </h2>
              <p className="text-ink-900/75 mt-3 text-base md:text-lg">
                Learn directly from the specialist who coordinates admissions directly with UK university representatives.
              </p>
            </div>

            {/* Profile split */}
            <div className="flex justify-center max-w-3xl mx-auto">
              
              {/* Speaker 1 */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 w-full">
                <div className="relative group flex-shrink-0">
                  {/* Premium offset background border */}
                  <div className="absolute inset-0 bg-teal-900/5 rounded-3xl translate-x-2 translate-y-2 transition-transform group-hover:translate-x-3 group-hover:translate-y-3 duration-300" />
                  <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 flex-shrink-0 rounded-3xl overflow-hidden border-2 border-teal-900/10 bg-white shadow-md transition-transform duration-300 group-hover:scale-[1.01]">
                    <Image
                      src="/images/MD-Akitoye1.JPEG"
                      alt="Mr. Adeniyi Akitoye Portrait"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
                <div className="text-center md:text-left flex-grow mt-4 md:mt-2">
                  <h4 className="text-2xl font-bold text-teal-900 tracking-tight">Mr Adeniyi Akitoye</h4>
                  <p className="text-xs font-mono text-red-500 font-bold uppercase tracking-wider mt-1">Managing Director, PiKiNiC</p>
                  <p className="text-base text-ink-900/75 mt-4 leading-relaxed">
                    A British Council Certified Counselor, NAFSA Certified Counselor, and ICEF Certified Education Counselor, Adeniyi brings extensive expertise in international student travel and global relocation. His background in corporate banking gives him a unique understanding of complex financial requirements like proof of funds, enabling him to build PiKiNiC&apos;s direct partner network to bypass standard bottlenecks.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>
 
        {/* Testimonials Section (Second Dark Panel) */}
        <section className="bg-gradient-to-br from-teal-900 to-ink-900 text-cream-50 py-24 md:py-32 relative">
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-teal-950/10 rounded-full blur-3xl pointer-events-none -ml-48" />
 
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            {/* Header */}
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-xs font-mono tracking-widest text-yellow-400 uppercase">
                Success Stories
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-2 tracking-tight">
                What Nigerian Applicants Say
              </h2>
            </div>
 
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Quote 1 */}
              <div className="p-8 bg-teal-900/10 rounded-2xl border border-white/5 flex flex-col justify-between h-full relative group hover:border-white/10 transition-all">
                {/* Quote icon decoration */}
                <span className="text-6xl text-teal-900/20 font-serif absolute top-4 right-6 select-none pointer-events-none">&ldquo;</span>
                
                <p className="text-cream-50/80 leading-relaxed italic text-base relative z-10 pt-4">
                  &ldquo;I was skeptical about the 24 to 48-hour offer, but after submitting my docs through PiKiNiC, I had my offer from a top UK university in exactly 18 hours. Saved me months of stress.&rdquo;
                </p>
                <div className="mt-8 pt-4 border-t border-teal-900/20 flex items-center justify-between z-10">
                  <div>
                    <h5 className="font-bold text-white text-sm">Tunde O.</h5>
                    <p className="text-[10px] font-mono text-red-500 mt-0.5">Software Engineer (Lagos)</p>
                  </div>
                  <span className="text-[10px] font-mono bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full font-bold">
                    18h Offer
                  </span>
                </div>
              </div>
 
              {/* Quote 2 */}
              <div className="p-8 bg-teal-900/10 rounded-2xl border border-white/5 flex flex-col justify-between h-full relative group hover:border-white/10 transition-all">
                <span className="text-6xl text-teal-900/20 font-serif absolute top-4 right-6 select-none pointer-events-none">&ldquo;</span>
                
                <p className="text-cream-50/80 leading-relaxed italic text-base relative z-10 pt-4">
                  &ldquo;As a parent, my biggest worry was trust. Mr. Akitoye and his team guided us through every fee and document. My daughter got her offer within a day, and the visa support was seamless.&rdquo;
                </p>
                <div className="mt-8 pt-4 border-t border-teal-900/20 flex items-center justify-between z-10">
                  <div>
                    <h5 className="font-bold text-white text-sm">Mrs. Funmi A.</h5>
                    <p className="text-[10px] font-mono text-orange-500 mt-0.5">Parent (Ibadan)</p>
                  </div>
                  <span className="text-[10px] font-mono bg-orange-500/10 text-orange-500 border border-orange-500/20 px-2 py-0.5 rounded-full font-bold">
                    Sponsor Route
                  </span>
                </div>
              </div>
 
              {/* Quote 3 */}
              <div className="p-8 bg-teal-900/10 rounded-2xl border border-white/5 flex flex-col justify-between h-full relative group hover:border-white/10 transition-all">
                <span className="text-6xl text-teal-900/20 font-serif absolute top-4 right-6 select-none pointer-events-none">&ldquo;</span>
                
                <p className="text-cream-50/80 leading-relaxed italic text-base relative z-10 pt-4">
                  &ldquo;The work-experience waiver guidance was exactly what I needed. I didn&apos;t have to write IELTS, and the admissions process was incredibly fast. Highly recommended.&rdquo;
                </p>
                <div className="mt-8 pt-4 border-t border-teal-900/20 flex items-center justify-between z-10">
                  <div>
                    <h5 className="font-bold text-white text-sm">Chidi N.</h5>
                    <p className="text-[10px] font-mono text-red-500 mt-0.5">Finance Manager (Port Harcourt)</p>
                  </div>
                  <span className="text-[10px] font-mono bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full font-bold">
                    Waiver Applied
                  </span>
                </div>
              </div>
 
            </div>
 
            {/* Guarantee Statement */}
            <div className="mt-16 text-center border-t border-teal-900/20 pt-8">
              <p className="text-sm font-mono tracking-wider text-yellow-400 uppercase font-semibold">
                Guarantee: Nothing to lose, no payment, no obligation.
              </p>
            </div>
 
          </div>
        </section>
 
        {/* FAQ Section */}
        <section id="faq" className="bg-cream-50 py-24 md:py-32 border-b border-teal-900/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-xs font-mono tracking-widest text-teal-900/60 uppercase">
                Answering Your Queries
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-teal-900 mt-2 tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>
 
            {/* Accordion list */}
            <Reveal delay={100}>
              <FaqAccordion />
            </Reveal>
          </div>
        </section>
 
        {/* Final CTA Section (Third Dark Panel) */}
        <section className="bg-gradient-to-br from-teal-900 via-teal-950 to-ink-900 text-cream-50 py-24 md:py-32 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,202,6,0.02),transparent)] pointer-events-none" />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center space-y-8 relative z-10">
            {/* Header */}
            <div className="max-w-4xl mx-auto text-center flex flex-col items-center space-y-8">
              <span className="text-xs font-mono tracking-widest text-yellow-400 uppercase font-semibold">
                Intake Closing Soon
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2 tracking-tight text-white leading-tight">
                September Intake Closes July 31st
              </h2>
              <p className="text-cream-50/70 mt-4 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                Secure your seat today. Learn how to bypass the standard public wait lines and secure your UK offer in 24 to 48 hours. No cost, no obligation.
              </p>
            </div>
 
            {/* Small Numeric Countdown */}
            <div className="p-5 bg-ink-900/50 border border-teal-900/20 rounded-2xl inline-block shadow-lg">
              <Countdown variant="compact" accentColorClass="text-yellow-400" />
            </div>
 
            {/* CTA Button */}
            <a
              href="#register-section"
              className="inline-flex items-center justify-center px-10 py-5 rounded-full text-base font-bold text-ink-900 bg-yellow-400 hover:bg-yellow-400/90 active:scale-[0.98] transition-all duration-200 shadow-md shadow-yellow-400/5"
            >
              Register Now →
            </a>
          </div>
        </section>
 
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-teal-900/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
            <img
              src="/images/logo.svg"
              alt="PiKiNiC"
              className="h-8 w-auto"
            />
            <span className="text-xs text-ink-900/50 font-mono sm:mt-1.5">
              | Direct Admissions Network
            </span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-xs text-ink-900/60">
              &copy; 2026 PiKiNiC. All rights reserved.
            </p>
            <p className="text-[10px] text-ink-900/40 mt-1 font-mono">
              Alausa Shoppping Mall, Office 131, Ikeja, Lagos
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}