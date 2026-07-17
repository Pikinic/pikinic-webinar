"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Countdown from "../../components/Countdown";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "../../schemas/register";
import { track } from "@vercel/analytics";
import { sendGAEvent } from "@next/third-parties/google";

// Fallback skeleton for Suspense boundary while loading search params
function RegisterFormFallback() {
  return (
    <div className="w-full animate-pulse bg-white border border-teal-900/10 rounded-2xl p-8 shadow-sm h-[400px]" />
  );
}



function RegisterPageContent() {
  const searchParams = useSearchParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedData, setSubmittedData] = useState<RegisterInput | null>(null);
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  // Combined Vercel + Google Analytics event tracking helper
  const trackEvent = (eventName: string, params: Record<string, any>) => {
    // Vercel Analytics
    track(eventName, params);
    // Google Analytics
    sendGAEvent({ event: eventName, ...params });
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      track: "professional",
      countryCode: "+234"
    }
  });

  useEffect(() => {
    // Pre-fill track selection based on query parameter
    const trackParam = searchParams.get("track");
    if (trackParam === "parent" || trackParam === "professional") {
      setValue("track", trackParam);
    }
    
    // Track registration form page view with query params
    trackEvent("Registration Form Viewed", { track: trackParam || "default" });
  }, [searchParams, setValue]);

  const handleFormFocus = () => {
    if (!hasTrackedStart) {
      const trackParam = searchParams.get("track") || "default";
      trackEvent("Registration Started", { track: trackParam });
      setHasTrackedStart(true);
    }
  };

  const onSubmit = async (data: RegisterInput) => {
    trackEvent("Registration Submission Attempt", { track: data.track });
    
    // Combine countryCode and whatsapp if it doesn't already start with '+'
    const cleanNumber = data.whatsapp.trim();
    const isFullInternational = cleanNumber.startsWith("+");
    const combinedWhatsapp = isFullInternational 
      ? cleanNumber 
      : `${data.countryCode || "+234"}${cleanNumber.replace(/^0/, "")}`;

    const payload = {
      ...data,
      whatsapp: combinedWhatsapp
    };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        trackEvent("Registration Successful", { track: data.track });
        setSubmittedData(data);
        setShowSuccessModal(true);
        reset(); // Clear form inputs
      } else {
        const errorData = await response.json();
        const errMessage = errorData.error || "Form submission failed. Please try again.";
        trackEvent("Registration Failed", { track: data.track, error: errMessage });
        setErrorMessage(errMessage);
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Submission network error:", error);
      trackEvent("Registration Failed", { track: data.track, error: "Network Error" });
      setErrorMessage("Network error. Please check your internet connection and try again.");
      setShowErrorModal(true);
    }
  };

  // Google Calendar URL generation
  const gcalUrl = "https://www.google.com/calendar/render?action=TEMPLATE" + 
    "&text=" + encodeURIComponent("PiKiNiC UK University Admissions Webinar") +
    "&dates=20260721T190000Z/20260721T210000Z" +
    "&details=" + encodeURIComponent("Join link and webinar access instructions will be sent via email.\n\nLearn the 24-hour admissions system Nigerian professionals and parents are using to secure UK university offers before the September intake closes.") +
    "&location=" + encodeURIComponent("Online (Join link to be emailed)") +
    "&sf=true&output=xml";

  return (
    <div className="w-full max-w-xl mx-auto relative">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-2xl z-20 transition-all duration-300">
          <div className="w-12 h-12 rounded-full border-4 border-teal-900/10 border-t-teal-900 animate-spin" />
          <p className="mt-4 text-sm font-semibold text-teal-900 font-mono tracking-wide animate-pulse">
            Securing your seat on the rail...
          </p>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-teal-900/10 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-6 transform scale-100 transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-teal-900/5 border border-teal-900/10 flex items-center justify-center text-teal-900 mx-auto">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-teal-900">Registration Successful</h3>
              <p className="text-sm text-ink-900/70 leading-relaxed">
                We have reserved your seat for the live session.
              </p>
            </div>

            <div className="bg-teal-900/5 rounded-xl p-4 text-left border border-teal-900/10 space-y-2">
              <p className="text-xs text-ink-900/70"><span className="font-semibold text-teal-900">Name:</span> {submittedData?.name}</p>
              <p className="text-xs text-ink-900/70"><span className="font-semibold text-teal-900">Email:</span> {submittedData?.email}</p>
            </div>

            <div className="space-y-3">
              <a
                href={gcalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("Add to Calendar Clicked", { track: submittedData?.track || "unknown", modal: "true" })}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-white bg-teal-900 hover:bg-teal-900/90 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm-5-5H7v-2h7v2z" />
                </svg>
                Add to Google Calendar
              </a>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setIsSubmitted(true); // Switch to inline success state for page persistence
                }}
                className="w-full py-2.5 px-4 rounded-full text-sm font-medium text-ink-900 hover:bg-teal-900/5 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-teal-900/10 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-red-500/5 border border-red-500/10 flex items-center justify-center text-red-500 mx-auto">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-teal-900">Registration Failed</h3>
              <p className="text-sm text-ink-900/70 leading-relaxed">
                {errorMessage || "We encountered an issue securing your seat. Please check your details and try again."}
              </p>
            </div>

            <div>
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full py-3.5 px-6 rounded-full text-sm font-semibold text-white bg-red-500 hover:bg-red-500/90 transition-colors shadow-md"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {!isSubmitted ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white border border-teal-900/10 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
        >
          {/* Form Field: Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-teal-900 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              onFocus={handleFormFocus}
              placeholder="e.g. Babajide Olusola"
              className="w-full px-4 py-3 rounded-lg border border-teal-900/10 text-ink-900 placeholder-ink-900/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1.5 font-mono">{errors.name.message}</p>
            )}
          </div>

          {/* Form Field: Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-teal-900 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              onFocus={handleFormFocus}
              placeholder="e.g. name@example.com"
              className="w-full px-4 py-3 rounded-lg border border-teal-900/10 text-ink-900 placeholder-ink-900/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5 font-mono">{errors.email.message}</p>
            )}
          </div>

          {/* Form Field: WhatsApp */}
          <div>
            <label htmlFor="whatsapp" className="block text-sm font-semibold text-teal-900 mb-1.5">
              WhatsApp Number
            </label>
            <div className="relative flex rounded-lg border border-teal-900/10 focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-transparent transition-all">
              <select
                id="countryCode"
                {...register("countryCode")}
                className="inline-flex items-center px-3 rounded-l-lg border-r border-teal-900/10 bg-teal-900/5 text-ink-900/60 font-mono text-sm focus:outline-none cursor-pointer outline-none select-none max-w-[100px]"
              >
                <option value="+234">NG (+234)</option>
                <option value="+44">UK (+44)</option>
                <option value="+1">US/CA (+1)</option>
                <option value="+233">GH (+233)</option>
                <option value="+254">KE (+254)</option>
                <option value="+27">ZA (+27)</option>
                <option value="+353">IE (+353)</option>
                <option value="+61">AU (+61)</option>
              </select>
              <input
                type="tel"
                id="whatsapp"
                {...register("whatsapp")}
                onFocus={handleFormFocus}
                placeholder="8031234567"
                className="w-full px-4 py-3 rounded-r-lg text-ink-900 placeholder-ink-900/30 focus:outline-none"
              />
            </div>
            {errors.whatsapp && (
              <p className="text-red-500 text-xs mt-1.5 font-mono">{errors.whatsapp.message}</p>
            )}
            <p className="text-[10px] text-ink-900/40 mt-1.5">
              We send the direct join link and reminders here so you don&apos;t miss the session.
            </p>
          </div>

          {/* Form Field: Track selector */}
          <div>
            <label htmlFor="track" className="block text-sm font-semibold text-teal-900 mb-1.5">
              I am registering as:
            </label>
            <select
              id="track"
              {...register("track")}
              onFocus={handleFormFocus}
              className="w-full px-4 py-3 rounded-lg border border-teal-900/10 bg-white text-ink-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            >
              <option value="professional">Myself (working professional)</option>
              <option value="parent">My child (parent/sponsor)</option>
              <option value="other">Other (Individual applicant / relocation)</option>
            </select>
            {errors.track && (
              <p className="text-red-500 text-xs mt-1.5 font-mono">{errors.track.message}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-full text-base font-bold text-ink-900 bg-yellow-400 hover:bg-yellow-400/90 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all flex items-center justify-center`}
          >
            Confirm My Free Seat
          </button>
        </form>
      ) : (
        <div className="bg-white border border-teal-900/10 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-teal-900/5 border border-teal-900/10 flex items-center justify-center text-teal-900 mx-auto">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-teal-900">Seat Confirmed</h3>
            <p className="text-ink-900/80 leading-relaxed max-w-sm mx-auto">
              Check your email for your join link and a reminder before we go live.
            </p>
          </div>

          <div className="pt-4 border-t border-teal-900/5 space-y-4">
            <p className="text-xs text-ink-900/50">
              Don&apos;t forget to add this event to your calendar so you don&apos;t miss it:
            </p>
            <a
              href={gcalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("Add to Calendar Clicked", { track: submittedData?.track || "unknown", modal: "false" })}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-teal-900 hover:bg-teal-900/90 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm-5-5H7v-2h7v2z" />
              </svg>
              Add to Google Calendar
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const miniFaqs = [
    {
      q: "Is this webinar really free?",
      a: "Yes, completely free. There are no hidden fees, no application deposits, and zero obligation to hire our team afterward."
    },
    {
      q: "Do I need to have all my documents ready before attending?",
      a: "No. The webinar is designed to show you what you need to prepare so that you can utilize the 24-hour admissions system effectively."
    },
    {
      q: "What if I cannot attend the live session?",
      a: "If you register, we will send you a recording of the webinar. However, only live attendees will have access to the open Q&A."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-cream-50">
      {/* Minimal Header: Logo Only */}
      <header className="py-6 border-b border-teal-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center sm:justify-start">
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <img
              src="/images/logo.svg"
              alt="PiKiNiC"
              className="h-10 w-auto"
            />
          </Link>
        </div>
      </header>

      {/* Main Form container */}
      <main className="flex-grow flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto w-full text-center space-y-6 mb-8">
          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl font-bold text-teal-900 tracking-tight leading-tight">
            Get Your UK University Offer in 24 to 48 Hours
          </h2>
          
          {/* Subhead */}
          <p className="text-base sm:text-lg text-ink-900/80 font-medium max-w-lg mx-auto leading-relaxed">
            Skip months of waiting. Learn the direct admissions system certified counselors are using to secure UK offers before September intake closes.
          </p>

          {/* Live Session Info Badge */}
          <p className="text-xs font-mono text-red-500 font-bold uppercase tracking-wider">
            21 July, 8pm WAT — Free · Live · Online
          </p>

          {/* Text Countdown */}
          <div className="inline-block px-4 py-2.5 bg-teal-900/5 rounded-xl border border-teal-900/10">
            <Countdown variant="compact" />
          </div>
        </div>

        {/* The Form Card inside Suspense */}
        <Suspense fallback={<RegisterFormFallback />}>
          <RegisterPageContent />
        </Suspense>

        {/* Trust Strip */}
        <div className="max-w-xl mx-auto w-full mt-12 py-6 border-t border-b border-teal-900/10">
          <ul className="space-y-3 text-center text-xs md:text-sm text-ink-900/60 font-medium">
            <li>• No cost to attend, no obligation to apply</li>
            <li>• Replay available if you can&apos;t make it live</li>
            <li>• For professionals applying for themselves and parents applying for their child</li>
          </ul>
        </div>

        {/* Mini FAQ */}
        <div className="max-w-lg mx-auto w-full mt-12 space-y-4">
          <h4 className="text-center font-bold text-teal-900 text-lg mb-6">
            Quick Questions
          </h4>
          
          {miniFaqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="border-b border-teal-900/10 pb-3">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center text-left py-2 focus:outline-none"
                >
                  <span className="text-sm font-semibold text-teal-900">{faq.q}</span>
                  <span className="text-teal-900/50 text-xs">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <p className="text-xs text-ink-900/70 mt-1.5 leading-relaxed pl-2 border-l border-yellow-400">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <footer className="py-8 border-t border-teal-900/5 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex justify-center">
            <img
              src="/images/logo.svg"
              alt="PiKiNiC"
              className="h-7 w-auto"
            />
          </div>
          <p className="text-[10px] text-ink-900/40 leading-relaxed font-mono">
            &copy; 2026 PiKiNiC. All rights reserved.<br />
            Alausa Shoppping Mall, Office 131, Ikeja, Lagos
          </p>
        </div>
      </footer>
    </div>
  );
}
