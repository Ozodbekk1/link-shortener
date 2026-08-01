"use client"

import React from "react"

interface FullscreenLoaderProps {
  message?: string
}

/**
 * Premium fullscreen loading screen shown while authentication state
 * is being resolved (fetching /users/me). Prevents any page content
 * from rendering until auth is determined.
 */
export function FullscreenLoader({
  message = "Loading your workspace...",
}: FullscreenLoaderProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-white via-[#FFF8F8] to-[#FFF0F2]">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(244,91,105,0.18) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -right-[10%] -bottom-[20%] h-[500px] w-[500px] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(244,91,105,0.14) 0%, transparent 70%)",
        }}
      />

      {/* Logo + Spinner */}
      <div className="relative flex flex-col items-center gap-8">
        {/* Pulsing ring */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-2xl bg-[#F45B69]/20" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F45B69] to-[#e04b59] shadow-lg shadow-[#F45B69]/30">
            <svg
              viewBox="0 0 24 24"
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
        </div>

        {/* Brand name */}
        <div className="text-2xl font-black tracking-tight text-gray-900">
          UURL
        </div>

        {/* Animated dots loader */}
        <div className="flex items-center gap-1.5">
          <div
            className="h-2 w-2 rounded-full bg-[#F45B69] opacity-80"
            style={{
              animation: "pulse-dot 1.4s ease-in-out infinite",
              animationDelay: "0s",
            }}
          />
          <div
            className="h-2 w-2 rounded-full bg-[#F45B69] opacity-80"
            style={{
              animation: "pulse-dot 1.4s ease-in-out infinite",
              animationDelay: "0.2s",
            }}
          />
          <div
            className="h-2 w-2 rounded-full bg-[#F45B69] opacity-80"
            style={{
              animation: "pulse-dot 1.4s ease-in-out infinite",
              animationDelay: "0.4s",
            }}
          />
        </div>

        {/* Message */}
        <p className="text-sm font-medium text-gray-400">{message}</p>
      </div>

      {/* Keyframe animation */}
      <style jsx>{`
        @keyframes pulse-dot {
          0%,
          80%,
          100% {
            transform: scale(0.6);
            opacity: 0.4;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
