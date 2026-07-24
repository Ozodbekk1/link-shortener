"use client"
import React, { useState, useEffect, useRef } from "react"
import scissor from "../assets/scissors.png"
import shareLink from "../assets/share.png"

import Image from "next/image"
import { CoolMode } from "@/components/ui/cool-mode"
import BlurText from "@/components/BlurText"

const coral = "#F45B69"
const coralDark = "#E04856"
const pinkLight = "#FFF0F2"
const pinkMedium = "#FFE4E8"

export default function Demo() {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const slugs = [
    "my-product",
    "summer-sale",
    "promo-now",
    "get-started",
    "big-launch",
    "special-offer",
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  function shorten() {
    if (!url.trim()) return
    setLoading(true)
    setResult("")
    setTimeout(() => {
      setResult(`uurl.uz/${slugs[Math.floor(Math.random() * slugs.length)]}`)
      setLoading(false)
    }, 900)
  }

  function copy() {
    navigator.clipboard.writeText(result).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <style jsx global>{`
        @keyframes bounce-dots {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .animate-bounce-dot-0 {
          animation: bounce-dots 1s ease-in-out 0s infinite;
        }
        .animate-bounce-dot-1 {
          animation: bounce-dots 1s ease-in-out 0.2s infinite;
        }
        .animate-bounce-dot-2 {
          animation: bounce-dots 1s ease-in-out 0.4s infinite;
        }
      `}</style>

      <section
        id="shortener"
        className="relative overflow-hidden bg-white py-24"
      >
        <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-[#FFE4E8] to-transparent" />
        <div className="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-[#FFE4E8] to-transparent" />

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            ref={sectionRef}
            className={`mb-13 text-center transition-all duration-700 ease-out ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-7 opacity-0"
            }`}
          >
            {/* <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[#F45B69]/15 bg-[#FFF0F2] px-3.5 py-1">
              <span className="text-xs font-semibold text-[#F45B69]">
                ⚡ Instant magic
              </span>
            </div> */}

            <div className="mb-3 flex flex-wrap items-center justify-center gap-2 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              <BlurText
                text="Shorten a link in "
                delay={200}
                animateBy="words"
                direction="top"
                animationFrom={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                animationTo={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                onAnimationComplete={() => {}}
                className="mb-3 flex justify-center text-3xl leading-tight font-black tracking-tight text-gray-900 sm:text-4xl lg:text-5xl"
              />
              <BlurText
                text="seconds"
                delay={200}
                animateBy="words"
                direction="top"
                animationFrom={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                animationTo={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                onAnimationComplete={() => {}}
                className="mb-3 flex justify-center text-3xl leading-tight font-black tracking-tight text-[#F45B69] sm:text-4xl lg:text-5xl"
              />
            </div>

            <p className="mx-auto max-w-md text-base leading-relaxed text-gray-500 sm:text-lg">
              Paste your long URL and get a clean, trackable short link
              instantly.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl shadow-black/5 sm:p-8">
              <div className="mb-2.5 text-[11.5px] font-bold tracking-wider text-gray-500 uppercase">
                Your long URL
              </div>

              <div className="mb-3.5 flex flex-col gap-2.5 sm:flex-row">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value)
                    setResult("")
                  }}
                  onKeyDown={(e) => e.key === "Enter" && shorten()}
                  placeholder="Paste your long URL here..."
                  className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 font-mono text-sm text-gray-900 transition-colors outline-none focus:border-[#F45B69]"
                />
                <CoolMode>
                  <button
                    onClick={shorten}
                    disabled={!url.trim() || loading}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold whitespace-nowrap transition-all ${
                      url.trim() && !loading
                        ? "bg-[#F45B69] text-white shadow-md shadow-[#F45B69]/20 hover:bg-[#E04856] active:scale-[0.98]"
                        : "cursor-not-allowed bg-gray-200 text-gray-400"
                    }`}
                  >
                    <Image
                      src={scissor}
                      alt="Scissors"
                      width={20}
                      height={20}
                    />
                    {loading ? "Cutting..." : "Shorten"}
                  </button>
                </CoolMode>
              </div>

              <div className="text-xs text-gray-400">
                Try: https://example.com/products/summer-sale-2024?ref=email
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5 py-2 lg:flex-col lg:py-0">
              <svg viewBox="0 0 110 140" width="88" height="112" fill="none">
                <CharScissors x={55} y={80} scale={0.8} />
              </svg>

              <div className="flex gap-1.5">
                <div className="animate-bounce-dot-0 h-1.75 w-1.75 rounded-full bg-[#F45B69] opacity-40" />
                <div className="animate-bounce-dot-1 h-1.75 w-1.75 rounded-full bg-[#F45B69] opacity-70" />
                <div className="animate-bounce-dot-2 h-1.75 w-1.75 rounded-full bg-[#F45B69] opacity-100" />
              </div>
            </div>

            <div
              className={`flex min-h-[146px] flex-col justify-center rounded-3xl border p-6 transition-all duration-400 sm:p-8 ${
                result
                  ? "border-[#FFE4E8] bg-gradient-to-br from-[#FFF0F2] via-white to-white shadow-xl shadow-[#F45B69]/10"
                  : "border-gray-200 bg-gray-50 shadow-xs"
              }`}
            >
              {result ? (
                <>
                  <div className="mb-2.5 text-[11.5px] font-bold tracking-wider text-[#F45B69] uppercase">
                    Your short link
                  </div>

                  <div className="mb-3.5 flex flex-col gap-2.5 sm:flex-row">
                    <code className="flex flex-1 items-center rounded-xl border border-[#FFE4E8] bg-white px-3.5 py-2.5 text-base font-extrabold tracking-tight text-gray-900">
                      {result}
                    </code>
                    <CoolMode>
                      <button
                        onClick={copy}
                        className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold whitespace-nowrap text-white transition-all ${
                          copied
                            ? "bg-emerald-500 hover:bg-emerald-600"
                            : "bg-[#F45B69] hover:bg-[#E04856]"
                        }`}
                      >
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </CoolMode>
                  </div>

                  <div className="flex gap-2">
                    {[
                      { v: "0", l: "Clicks" },
                      { v: "0", l: "Countries" },
                      { v: "100%", l: "Uptime" },
                    ].map(({ v, l }) => (
                      <div
                        key={l}
                        className="flex-1 rounded-xl border border-[#FFE4E8]/60 bg-white p-2 text-center"
                      >
                        <div className="text-base font-extrabold text-[#F45B69]">
                          {v}
                        </div>
                        <div className="text-[11px] text-gray-400">{l}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center py-2 text-center text-gray-400">
                  <div className="mb-2 text-4xl">
                    <Image src={shareLink} alt="link" width={50} height={50} />
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Your short link will appear here
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    Paste a URL and click Shorten
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function CharScissors({
  x,
  y,
  scale = 1,
}: {
  x: number
  y: number
  scale?: number
}) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="52" rx="26" ry="5" fill="#F45B69" opacity="0.15" />

      <path
        d="M-18 20 C-18 10, 18 10, 18 20 L15 48 C15 50, -15 50, -15 48 Z"
        fill="#F45B69"
      />

      <path
        d="M-16 18 Q-26 26 -30 36"
        stroke="#FFE0BD"
        strokeWidth="5.5"
        strokeLinecap="round"
        fill="none"
      />

      <path
        d="M16 18 Q26 24 34 16"
        stroke="#FFE0BD"
        strokeWidth="5.5"
        strokeLinecap="round"
        fill="none"
      />

      <g transform="translate(34, 10) rotate(-15)">
        <path
          d="M0 0 L18 -12"
          stroke="#9CA3AF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M0 -6 L18 6"
          stroke="#9CA3AF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="6" cy="-3" r="1.5" fill="#4B5563" />
        <circle
          cx="-4"
          cy="2"
          r="4"
          stroke="#F45B69"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="-4"
          cy="-8"
          r="4"
          stroke="#F45B69"
          strokeWidth="2"
          fill="none"
        />
      </g>

      <circle cx="0" cy="-6" r="22" fill="#FFE0BD" />

      <path
        d="M-22 -6 C-22 -22, 22 -22, 22 -6 C14 -12, -14 -12, -22 -6 Z"
        fill="#3D2314"
      />

      <circle cx="-7" cy="-2" r="2" fill="#111827" />
      <circle cx="7" cy="-2" r="2" fill="#111827" />

      <circle cx="-12" cy="3" r="3" fill="#F45B69" opacity="0.25" />
      <circle cx="12" cy="3" r="3" fill="#F45B69" opacity="0.25" />

      <path
        d="M-4 5 Q0 9 4 5"
        stroke="#111827"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  )
}
