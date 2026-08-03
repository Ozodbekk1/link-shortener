"use client"

import React from "react"

interface FullscreenLoaderProps {
  message?: string
}

export function FullscreenLoader({
  message = "Loading your workspace...",
}: FullscreenLoaderProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-white via-[#FFF8F8] to-[#FFF0F2]">
      <div
        className="pointer-events-none absolute -top-[20%] -left-[10%] h-[500px] w-[500px] animate-pulse rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(244,91,105,0.2) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -right-[10%] -bottom-[20%] h-[500px] w-[500px] animate-pulse rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(244,91,105,0.16) 0%, transparent 70%)",
          animationDelay: "1s",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white/80 p-4 shadow-xl ring-1 shadow-[#F45B69]/10 ring-[#F45B69]/15 backdrop-blur-md">
          <div
            className="absolute inset-0 animate-ping rounded-3xl bg-[#F45B69]/10"
            style={{ animationDuration: "2.5s" }}
          />

          <svg
            className="h-12 w-12 text-[#F45B69]"
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M19 14H15A9 9 0 0 0 15 32H19"
              className="origin-center"
              style={{
                animation: "link-pull-left 2s ease-in-out infinite",
              }}
            />
            <path
              d="M29 14H33A9 9 0 0 1 33 32H29"
              className="origin-center"
              style={{
                animation: "link-pull-right 2s ease-in-out infinite",
              }}
            />
            <line
              x1="18"
              y1="23"
              x2="30"
              y2="23"
              style={{
                animation: "link-[#F45B69]-connect 2s ease-in-out infinite",
              }}
            />
          </svg>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl font-black tracking-tight text-gray-900">
            uurl<span className="text-[#F45B69]">.uz</span>
          </span>
          <p className="text-xs font-semibold tracking-wider text-[#F45B69]/80 uppercase">
            Link Shortener
          </p>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <div
            className="h-2 w-2 rounded-full bg-[#F45B69]"
            style={{
              animation: "wave-dot 1.2s ease-in-out infinite",
              animationDelay: "0s",
            }}
          />
          <div
            className="h-2 w-2 rounded-full bg-[#F45B69]"
            style={{
              animation: "wave-dot 1.2s ease-in-out infinite",
              animationDelay: "0.2s",
            }}
          />
          <div
            className="h-2 w-2 rounded-full bg-[#F45B69]"
            style={{
              animation: "wave-dot 1.2s ease-in-out infinite",
              animationDelay: "0.4s",
            }}
          />
        </div>

        <p className="text-sm font-medium text-gray-500">{message}</p>
      </div>

      <style jsx>{`
        @keyframes link-pull-left {
          0%,
          100% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(3px);
          }
        }
        @keyframes link-pull-right {
          0%,
          100% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(-3px);
          }
        }
        @keyframes link-connect {
          0%,
          100% {
            stroke-dasharray: 12;
            stroke-dashoffset: 0;
            opacity: 1;
          }
          50% {
            stroke-dasharray: 12;
            stroke-dashoffset: 6;
            opacity: 0.4;
          }
        }
        @keyframes wave-dot {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-5px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
