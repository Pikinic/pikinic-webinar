"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "../schemas/register";
import { track } from "@vercel/analytics";
import { sendGAEvent } from "@next/third-parties/google";

interface RegisterFormProps {
  defaultTrack?: "professional" | "parent" | "other";
  className?: string;
}

export default function RegisterForm({ defaultTrack, className = "" }: RegisterFormProps) {
  const searchParams = useSearchParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedData, setSubmittedData] = useState<RegisterInput | null>(null);
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  // Combined Vercel + Google Analytics event tracking helper
  const trackEvent = (eventName: string, params: Record<string, any>) => {
    try {
      track(eventName, params);
      sendGAEvent({ event: eventName, ...params });
    } catch (err) {
      console.warn("Analytics tracking error:", err);
    }
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
      track: defaultTrack || "professional",
      countryCode: "+234"
    }
  });

  useEffect(() => {
    // Pre-fill track selection based on query parameter
    if (searchParams) {
      const trackParam = searchParams.get("track");
      if (trackParam === "parent" || trackParam === "professional" || trackParam === "other") {
        setValue("track", trackParam as any);
      }
    }
  }, [searchParams, setValue]);

  const handleFormFocus = () => {
    if (!hasTrackedStart) {
      const trackParam = searchParams?.get("track") || defaultTrack || "default";
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
    "&details=" + encodeURIComponent("Join link and webinar access instructions will be sent via email.\n\nLearn the 24-48 hour admissions system Nigerian professionals and parents are using to secure UK university offers before the September intake closes.") +
    "&location=" + encodeURIComponent("Online (Join link to be emailed)") +
    "&sf=true&output=xml";

  return (
    <div className={`w-full max-w-xl mx-auto relative ${className}`}>
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-3xl z-20 transition-all duration-300">
          <div className="w-12 h-12 rounded-full border-4 border-teal-900/10 border-t-teal-900 animate-spin" />
          <p className="mt-4 text-sm font-semibold text-teal-900 font-mono tracking-wide animate-pulse">
            Securing your seat...
          </p>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-teal-900/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-6 transform scale-100 transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-teal-900/5 border border-teal-900/10 flex items-center justify-center text-teal-900 mx-auto">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-teal-900">Registration Successful</h3>
              <p className="text-sm text-ink-900/70 leading-relaxed">
                We have reserved your seat for the live session on July 21st at 8:00 PM WAT.
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
                  setIsSubmitted(true);
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
          <div className="bg-white border border-teal-900/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-6">
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
          className="bg-white border border-teal-900/10 rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg space-y-6"
        >
          <div className="text-center pb-2 border-b border-teal-900/5">
            <h3 className="text-xl sm:text-2xl font-bold text-teal-900">
              Register For The Free Live Webinar
            </h3>
            <p className="text-xs sm:text-sm text-ink-900/60 mt-1">
              July 21st · 8:00 PM WAT · Online Access
            </p>
          </div>

          {/* Form Field: Name */}
          <div>
            <label htmlFor="form-name" className="block text-sm font-semibold text-teal-900 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              id="form-name"
              {...register("name")}
              onFocus={handleFormFocus}
              placeholder="e.g. Babajide Olusola"
              className="w-full px-4 py-3.5 rounded-xl border border-teal-900/10 text-ink-900 placeholder-ink-900/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1.5 font-mono">{errors.name.message}</p>
            )}
          </div>

          {/* Form Field: Email */}
          <div>
            <label htmlFor="form-email" className="block text-sm font-semibold text-teal-900 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              id="form-email"
              {...register("email")}
              onFocus={handleFormFocus}
              placeholder="e.g. name@example.com"
              className="w-full px-4 py-3.5 rounded-xl border border-teal-900/10 text-ink-900 placeholder-ink-900/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5 font-mono">{errors.email.message}</p>
            )}
          </div>

          {/* Form Field: WhatsApp */}
          <div>
            <label htmlFor="form-whatsapp" className="block text-sm font-semibold text-teal-900 mb-1.5">
              WhatsApp Phone Number
            </label>
            <div className="relative flex rounded-xl border border-teal-900/10 focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-transparent transition-all">
              <select
                id="form-countryCode"
                {...register("countryCode")}
                className="inline-flex items-center px-3 rounded-l-xl border-r border-teal-900/10 bg-teal-900/5 text-ink-900/70 font-mono text-sm focus:outline-none cursor-pointer outline-none select-none max-w-[110px]"
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
                id="form-whatsapp"
                {...register("whatsapp")}
                onFocus={handleFormFocus}
                placeholder="8031234567"
                className="w-full px-4 py-3.5 rounded-r-xl text-ink-900 placeholder-ink-900/30 focus:outline-none"
              />
            </div>
            {errors.whatsapp && (
              <p className="text-red-500 text-xs mt-1.5 font-mono">{errors.whatsapp.message}</p>
            )}
            <p className="text-[10px] text-ink-900/50 mt-1.5">
              We send the direct join link and reminders here so you don&apos;t miss the session.
            </p>
          </div>

          {/* Form Field: Track selector */}
          <div>
            <label htmlFor="form-track" className="block text-sm font-semibold text-teal-900 mb-1.5">
              I am registering as:
            </label>
            <select
              id="form-track"
              {...register("track")}
              onFocus={handleFormFocus}
              className="w-full px-4 py-3.5 rounded-xl border border-teal-900/10 bg-white text-ink-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all cursor-pointer"
            >
              <option value="professional">Myself (working professional)</option>
              <option value="parent">My child (parent/sponsor)</option>
              <option value="other">Other (individual applicant)</option>
            </select>
            {errors.track && (
              <p className="text-red-500 text-xs mt-1.5 font-mono">{errors.track.message}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-full text-base font-bold text-ink-900 bg-yellow-400 hover:bg-yellow-400/90 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            Register Now →
          </button>
        </form>
      ) : (
        <div className="bg-white border border-teal-900/10 rounded-3xl p-8 sm:p-10 shadow-lg space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-teal-900/5 border border-teal-900/10 flex items-center justify-center text-teal-900 mx-auto">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-teal-900">Seat Confirmed!</h3>
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
