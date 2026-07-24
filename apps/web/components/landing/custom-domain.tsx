import React from "react"

export default function CustomDomainSection() {
  return (
    <section
      id="domains"
      className="bg-[linear-gradient(155deg,rgb(255,249,249)_0%,rgb(255,255,255)_50%,rgb(255,249,249)_100%)] py-[96px]"
    >
      <div className="mx-auto max-w-[1200px] px-[32px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div className="opacity-100 transition-all duration-800">
            <h2 className="mb-[18px] text-[clamp(28px,4vw,48px)] leading-[1.1] font-black tracking-[-1.5px] text-[#151515]">
              Your brand.
              <br />
              <span className="text-[#F45B69]">Your links.</span>
            </h2>

            <p className="mb-[36px] text-[17px] leading-[1.65] text-[#6B7280]">
              Stop sending people to uurl.uz. Connect your own domain and every
              link reinforces your brand identity.
            </p>

            <div className="mb-[36px] flex flex-col gap-[10px]">
              <div className="flex items-center gap-[12px]">
                <span className="w-[48px] shrink-0 text-[13px] font-bold text-[#6B7280]">
                  Before
                </span>
                <code className="flex-1 rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] px-[14px] py-[10px] text-[13px] text-[#6B7280] line-through">
                  uurl.uz/company-sale
                </code>
              </div>

              <div className="pl-[60px]">
                <div className="ml-[8px] h-[18px] w-[1px] bg-[#FFCCCC]" />
              </div>

              <div className="flex items-center gap-[12px]">
                <span className="w-[48px] shrink-0 text-[13px] font-bold text-[#F45B69]">
                  After
                </span>
                <code className="flex-1 rounded-[10px] border border-[#FFCCCC] bg-[#FFE5E5] px-[14px] py-[10px] text-[13px] font-bold text-[#151515]">
                  go.company.com/sale
                </code>
              </div>
            </div>

            <div className="flex flex-wrap gap-[8px]">
              {[
                "Auto SSL",
                "Zero config",
                "Instant setup",
                "Multiple domains",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#FFE5E5] px-[12px] py-[5px] text-[12px] font-semibold text-[#F45B69]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-center opacity-100 transition-opacity duration-700">
            <svg
              viewBox="0 0 300 300"
              fill="none"
              className="h-[300px] w-[300px]"
            >
              <circle cx="150" cy="150" r="130" fill="#FFE5E5" opacity="0.4" />
              <ellipse
                cx="150"
                cy="258"
                rx="90"
                ry="11"
                fill="rgba(0,0,0,0.06)"
              />

              <rect
                x="138"
                y="100"
                width="8"
                height="162"
                rx="4"
                fill="#8B6914"
              />

              <rect
                x="74"
                y="108"
                width="152"
                height="38"
                rx="8"
                fill="#F45B69"
                style={{
                  filter: "drop-shadow(rgba(244, 91, 105, 0.3) 0px 4px 14px)",
                }}
              />
              <text
                x="150"
                y="131"
                textAnchor="middle"
                fontSize="14.5"
                fill="white"
                fontWeight="800"
                fontFamily="monospace"
              >
                go.company.com
              </text>

              <rect
                x="90"
                y="154"
                width="122"
                height="30"
                rx="8"
                fill="white"
                stroke="#E5E7EB"
                strokeWidth="1.5"
              />
              <text
                x="151"
                y="173"
                textAnchor="middle"
                fontSize="10"
                fill="#6B7280"
                fontFamily="monospace"
              >
                uurl.uz/sale ↗
              </text>

              <g transform="translate(150,234) scale(0.8)">
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
                  d="M-16,24 Q-40,10 -42,-4"
                  stroke="#FDDCB8"
                  strokeWidth="11"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M16,24 Q40,10 42,-4"
                  stroke="#FDDCB8"
                  strokeWidth="11"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>

              <text x="50" y="118" fontSize="22" fontFamily="sans-serif">
                ⭐
              </text>
              <text x="238" y="92" fontSize="18" fontFamily="sans-serif">
                ✨
              </text>
              <text x="240" y="156" fontSize="16" fontFamily="sans-serif">
                🏷️
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
