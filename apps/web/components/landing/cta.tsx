import React from "react"

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-white py-[96px]">
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[450px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,_rgba(244,91,105,0.08)_0%,_transparent_70%)]" />

      <div className="mx-auto max-w-[1200px] px-[32px]">
        <div className="mx-auto max-w-[700px] text-center opacity-100 transition-all duration-700">
          <div className="mb-[28px] flex justify-center">
            <svg
              viewBox="0 0 220 130"
              fill="none"
              className="h-[130px] w-[220px] animate-bounce"
              style={{ animationDuration: "4s" }}
            >
              <g transform="translate(110,80) scale(0.8)">
                <ellipse
                  cx="0"
                  cy="60"
                  rx="22"
                  ry="6"
                  fill="rgba(0,0,0,0.07)"
                />
                <rect
                  x="-16"
                  y="14"
                  width="32"
                  height="46"
                  rx="14"
                  fill="#F45B69"
                />
                <circle cx="0" cy="0" r="24" fill="#FDDCB8" />
                <path
                  d="M-22,-10 Q-18,-30 0,-28 Q18,-30 22,-10"
                  fill="#4A3728"
                />
                <circle cx="-8" cy="-5" r="3.5" fill="#1A0800" />
                <circle cx="8" cy="-5" r="3.5" fill="#1A0800" />
                <circle cx="-6.5" cy="-6.5" r="1.3" fill="white" />
                <circle cx="9.5" cy="-6.5" r="1.3" fill="white" />
                <circle cx="-14" cy="3" r="6" fill="#FFB8C0" opacity="0.5" />
                <circle cx="14" cy="3" r="6" fill="#FFB8C0" opacity="0.5" />
                <path
                  d="M-7,7 Q0,14 7,7"
                  stroke="#4A2800"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M-16,20 Q-38,-4 -40,-18"
                  stroke="#FDDCB8"
                  strokeWidth="11"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M16,20 Q38,-4 40,-18"
                  stroke="#FDDCB8"
                  strokeWidth="11"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>

              <rect
                x="2"
                y="46"
                width="66"
                height="22"
                rx="11"
                fill="#FFE5E5"
              />
              <text
                x="35"
                y="60"
                textAnchor="middle"
                fontSize="8"
                fill="#F45B69"
                fontFamily="monospace"
                fontWeight="700"
              >
                uurl.uz/home
              </text>

              <rect
                x="142"
                y="28"
                width="66"
                height="22"
                rx="11"
                fill="#FFE5E5"
              />
              <text
                x="175"
                y="42"
                textAnchor="middle"
                fontSize="8"
                fill="#F45B69"
                fontFamily="monospace"
                fontWeight="700"
              >
                go.co/sale
              </text>

              <rect
                x="148"
                y="62"
                width="66"
                height="22"
                rx="11"
                fill="#FFE5E5"
              />
              <text
                x="181"
                y="76"
                textAnchor="middle"
                fontSize="8"
                fill="#F45B69"
                fontFamily="monospace"
                fontWeight="700"
              >
                uurl.uz/promo
              </text>

              <path
                d="M 12 16 L 14 22 L 20 24 L 14 26 L 12 32 L 10 26 L 4 24 L 10 22 Z"
                fill="#F45B69"
                opacity="0.8"
              />
              <path
                d="M 178 6 L 180 10 L 184 12 L 180 14 L 178 18 L 176 14 L 172 12 L 176 10 Z"
                fill="#FCD34D"
              />
              <path
                d="M 94 6 A 3 3 0 0 1 97 9 L 97 11 A 3 3 0 0 1 94 14 A 3 3 0 0 1 91 11 L 91 9 A 3 3 0 0 1 94 6 Z"
                stroke="#F45B69"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>

          <h2 className="mb-[16px] text-[clamp(32px,5vw,62px)] leading-[1.06] font-black tracking-[-2px] text-[#151515]">
            Ready to make your links{" "}
            <span className="bg-gradient-to-r from-[#F45B69] to-[#FF8A94] bg-clip-text text-transparent">
              smarter
            </span>
            ?
          </h2>

          <p className="mb-[36px] text-[18px] leading-[1.6] text-[#6B7280]">
            Join 12,000+ teams. Free forever. No card needed. Start in seconds.
          </p>

          <div className="mb-[20px] flex flex-wrap justify-center gap-[12px]">
            <button className="inline-flex items-center gap-2 rounded-[14px] bg-gradient-to-r from-[#F45B69] to-[#FF6B7A] px-[34px] py-[16px] text-[17px] font-extrabold tracking-[-0.3px] text-white shadow-[0_8px_32px_rgba(244,91,105,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_44px_rgba(244,91,105,0.48)] active:translate-y-0">
              Start creating links
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>

            <button className="rounded-[14px] border-[1.5px] border-[#E5E7EB] bg-transparent px-[28px] py-[16px] text-[16px] font-semibold text-[#151515] transition-all duration-200 hover:border-[#F45B69] hover:text-[#F45B69]">
              See all features
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-[13px] text-[#6B7280]">
            <span>✓ Free forever</span>
            <span>·</span>
            <span>✓ No credit card</span>
            <span>·</span>
            <span>✓ No limits</span>
          </div>
        </div>
      </div>
    </section>
  )
}
