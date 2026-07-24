import React from "react"

export default function FeaturesSection() {
  return (
    <section id="features" className="relative bg-gray-50 py-24">
      <div
        className="absolute top-0 right-0 left-0 h-[1px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgb(255, 204, 204), transparent)",
        }}
      />

      <div className="mx-auto max-w-[1200px] px-8">
        <div className="mb-15 text-center opacity-100 transition-opacity duration-700">
          <h2 className="mb-3.5 text-[clamp(28px,4vw,48px)] leading-tight font-black tracking-tight text-[#151515]">
            Not just a simple link shortener
          </h2>
          <p className="mx-auto max-w-[500px] text-[17px] leading-relaxed text-gray-500">
            Everything you need to manage, analyze, and grow your links.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="opacity-100 transition-all duration-700">
            <div className="group flex cursor-default flex-col gap-4.5 rounded-[20px] border-[1.5px] border-gray-200 bg-white p-6.5 shadow-sm transition-all duration-300 hover:border-[#F45B69] hover:shadow-md hover:shadow-[#F45B69]/5">
              <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-[14px] bg-gray-50 transition-colors duration-300 group-hover:bg-[#FFE5E5]/30">
                <svg
                  viewBox="0 0 140 110"
                  fill="none"
                  className="h-[110px] w-[140px]"
                >
                  <circle
                    cx="70"
                    cy="55"
                    r="40"
                    fill="#FFE5E5"
                    stroke="#F45B69"
                    strokeWidth="1.5"
                  />
                  <ellipse
                    cx="70"
                    cy="55"
                    rx="15"
                    ry="40"
                    stroke="#F45B69"
                    strokeWidth="1.2"
                    fill="none"
                  />
                  <line
                    x1="30"
                    y1="55"
                    x2="110"
                    y2="55"
                    stroke="#F45B69"
                    strokeWidth="1.2"
                  />
                  <line
                    x1="32"
                    y1="40"
                    x2="108"
                    y2="40"
                    stroke="#F45B69"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                  <line
                    x1="32"
                    y1="70"
                    x2="108"
                    y2="70"
                    stroke="#F45B69"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                  <g>
                    <circle
                      cx="50"
                      cy="42"
                      r="7"
                      fill="#F45B69"
                      opacity="0.1"
                    />
                    <circle
                      cx="50"
                      cy="42"
                      r="4"
                      fill="#F45B69"
                      opacity="0.25"
                    />
                    <circle
                      cx="50"
                      cy="42"
                      r="2"
                      fill="#F45B69"
                      opacity="0.9"
                    />
                    <circle cx="50" cy="42" r="1" fill="white" />
                  </g>
                  <g>
                    <circle
                      cx="74"
                      cy="36"
                      r="7"
                      fill="#F45B69"
                      opacity="0.1"
                    />
                    <circle
                      cx="74"
                      cy="36"
                      r="4"
                      fill="#F45B69"
                      opacity="0.25"
                    />
                    <circle
                      cx="74"
                      cy="36"
                      r="2"
                      fill="#F45B69"
                      opacity="0.9"
                    />
                    <circle cx="74" cy="36" r="1" fill="white" />
                  </g>
                  <g>
                    <circle
                      cx="90"
                      cy="58"
                      r="7"
                      fill="#F45B69"
                      opacity="0.1"
                    />
                    <circle
                      cx="90"
                      cy="58"
                      r="4"
                      fill="#F45B69"
                      opacity="0.25"
                    />
                    <circle
                      cx="90"
                      cy="58"
                      r="2"
                      fill="#F45B69"
                      opacity="0.9"
                    />
                    <circle cx="90" cy="58" r="1" fill="white" />
                  </g>
                  <g>
                    <circle
                      cx="58"
                      cy="68"
                      r="7"
                      fill="#F45B69"
                      opacity="0.1"
                    />
                    <circle
                      cx="58"
                      cy="68"
                      r="4"
                      fill="#F45B69"
                      opacity="0.25"
                    />
                    <circle
                      cx="58"
                      cy="68"
                      r="2"
                      fill="#F45B69"
                      opacity="0.9"
                    />
                    <circle cx="58" cy="68" r="1" fill="white" />
                  </g>
                  <g>
                    <circle
                      cx="40"
                      cy="52"
                      r="7"
                      fill="#F45B69"
                      opacity="0.1"
                    />
                    <circle
                      cx="40"
                      cy="52"
                      r="4"
                      fill="#F45B69"
                      opacity="0.25"
                    />
                    <circle
                      cx="40"
                      cy="52"
                      r="2"
                      fill="#F45B69"
                      opacity="0.9"
                    />
                    <circle cx="40" cy="52" r="1" fill="white" />
                  </g>
                  <g>
                    <circle
                      cx="95"
                      cy="44"
                      r="7"
                      fill="#F45B69"
                      opacity="0.1"
                    />
                    <circle
                      cx="95"
                      cy="44"
                      r="4"
                      fill="#F45B69"
                      opacity="0.25"
                    />
                    <circle
                      cx="95"
                      cy="44"
                      r="2"
                      fill="#F45B69"
                      opacity="0.9"
                    />
                    <circle cx="95" cy="44" r="1" fill="white" />
                  </g>
                </svg>
              </div>
              <div>
                <h3 className="mb-[7px] text-[16px] font-extrabold tracking-tight text-[#151515]">
                  Global Analytics
                </h3>
                <p className="m-0 text-[13.5px] leading-relaxed text-gray-500">
                  Track every click with pinpoint detail. Countries, cities,
                  devices, browsers, OS — all in real-time.
                </p>
              </div>
              <div className="flex flex-wrap gap-[5px]">
                {[
                  "Countries",
                  "Cities",
                  "Devices",
                  "Browsers",
                  "Real-time",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-50 px-2.5 py-0.75 text-[11.5px] font-semibold text-gray-500 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="opacity-100 transition-all delay-[70ms] duration-700">
            <div className="group flex cursor-default flex-col gap-4.5 rounded-[20px] border-[1.5px] border-gray-200 bg-white p-6.5 shadow-sm transition-all duration-300 hover:border-[#F45B69] hover:shadow-md hover:shadow-[#F45B69]/5">
              <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-[14px] bg-gray-50 transition-colors duration-300 group-hover:bg-[#FFE5E5]/30">
                <svg
                  viewBox="0 0 140 110"
                  fill="none"
                  className="h-[110px] w-[140px]"
                >
                  <g transform="translate(70,72) scale(0.55)">
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
                      fill="#6366F1"
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
                    <circle
                      cx="-14"
                      cy="3"
                      r="6"
                      fill="#FFB8C0"
                      opacity="0.5"
                    />
                    <circle cx="14" cy="3" r="6" fill="#FFB8C0" opacity="0.5" />
                    <path
                      d="M-7,7 Q0,14 7,7"
                      stroke="#4A2800"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path
                      d="M-16,30 Q-40,36 -42,48"
                      stroke="#FDDCB8"
                      strokeWidth="11"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d="M16,30 Q40,36 42,48"
                      stroke="#FDDCB8"
                      strokeWidth="11"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </g>
                  <circle cx="30" cy="50" r="14" fill="#EF4444" />
                  <text
                    x="30"
                    y="53.5"
                    textAnchor="middle"
                    fontSize="7"
                    fill="white"
                    fontWeight="700"
                    fontFamily="sans-serif"
                  >
                    STOP
                  </text>
                  <circle cx="110" cy="50" r="14" fill="#10B981" />
                  <text
                    x="110"
                    y="53.5"
                    textAnchor="middle"
                    fontSize="7.5"
                    fill="white"
                    fontWeight="700"
                    fontFamily="sans-serif"
                  >
                    GO
                  </text>
                  <path
                    d="M44,50 Q57,42 65,45"
                    stroke="#6366F1"
                    strokeWidth="2"
                    strokeDasharray="3,2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M75,45 Q83,42 96,50"
                    stroke="#6366F1"
                    strokeWidth="2"
                    strokeDasharray="3,2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <g transform="translate(14,86)">
                    <rect width="34" height="16" rx="8" fill="#EEF2FF" />
                    <text
                      x="17"
                      y="11"
                      textAnchor="middle"
                      fontSize="6.5"
                      fill="#6366F1"
                      fontWeight="600"
                      fontFamily="sans-serif"
                    >
                      🌍 Country
                    </text>
                  </g>
                  <g transform="translate(50,86)">
                    <rect width="34" height="16" rx="8" fill="#EEF2FF" />
                    <text
                      x="17"
                      y="11"
                      textAnchor="middle"
                      fontSize="6.5"
                      fill="#6366F1"
                      fontWeight="600"
                      fontFamily="sans-serif"
                    >
                      📱 Device
                    </text>
                  </g>
                  <g transform="translate(86,86)">
                    <rect width="34" height="16" rx="8" fill="#EEF2FF" />
                    <text
                      x="17"
                      y="11"
                      textAnchor="middle"
                      fontSize="6.5"
                      fill="#6366F1"
                      fontWeight="600"
                      fontFamily="sans-serif"
                    >
                      🕐 Time
                    </text>
                  </g>
                </svg>
              </div>
              <div>
                <h3 className="mb-[7px] text-[16px] font-extrabold tracking-tight text-[#151515]">
                  Smart Redirect Rules
                </h3>
                <p className="m-0 text-[13.5px] leading-relaxed text-gray-500">
                  Route visitors based on country, device, browser, language, or
                  time. Personalize every click.
                </p>
              </div>
              <div className="flex flex-wrap gap-[5px]">
                {["Country", "Device", "Browser", "Language", "Time-based"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-50 px-2.5 py-0.75 text-[11.5px] font-semibold text-gray-500 transition-colors"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Card 3: Beautiful QR Codes */}
          <div className="opacity-100 transition-all delay-[140ms] duration-700">
            <div className="group flex cursor-default flex-col gap-4.5 rounded-[20px] border-[1.5px] border-gray-200 bg-white p-6.5 shadow-sm transition-all duration-300 hover:border-[#F45B69] hover:shadow-md hover:shadow-[#F45B69]/5">
              <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-[14px] bg-gray-50 transition-colors duration-300 group-hover:bg-[#FFE5E5]/30">
                <svg
                  viewBox="0 0 140 110"
                  fill="none"
                  className="h-[110px] w-[140px]"
                >
                  <rect
                    x="30"
                    y="8"
                    width="80"
                    height="80"
                    rx="12"
                    fill="white"
                    stroke="#059669"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="38"
                    y="16"
                    width="26"
                    height="26"
                    rx="5"
                    stroke="#059669"
                    strokeWidth="2"
                    fill="none"
                  />
                  <rect
                    x="43"
                    y="21"
                    width="16"
                    height="16"
                    rx="2"
                    fill="#059669"
                    opacity="0.7"
                  />
                  <rect
                    x="76"
                    y="16"
                    width="26"
                    height="26"
                    rx="5"
                    stroke="#059669"
                    strokeWidth="2"
                    fill="none"
                  />
                  <rect
                    x="81"
                    y="21"
                    width="16"
                    height="16"
                    rx="2"
                    fill="#059669"
                    opacity="0.7"
                  />
                  <rect
                    x="38"
                    y="58"
                    width="26"
                    height="26"
                    rx="5"
                    stroke="#059669"
                    strokeWidth="2"
                    fill="none"
                  />
                  <rect
                    x="43"
                    y="63"
                    width="16"
                    height="16"
                    rx="2"
                    fill="#059669"
                    opacity="0.7"
                  />
                  <rect
                    x="68"
                    y="58"
                    width="6"
                    height="6"
                    rx="1"
                    fill="#059669"
                    opacity="0.4"
                  />
                  <rect
                    x="76"
                    y="58"
                    width="6"
                    height="6"
                    rx="1"
                    fill="#059669"
                    opacity="0.48"
                  />
                  <rect
                    x="84"
                    y="58"
                    width="6"
                    height="6"
                    rx="1"
                    fill="#059669"
                    opacity="0.56"
                  />
                  <rect
                    x="68"
                    y="66"
                    width="6"
                    height="6"
                    rx="1"
                    fill="#059669"
                    opacity="0.64"
                  />
                  <rect
                    x="84"
                    y="66"
                    width="6"
                    height="6"
                    rx="1"
                    fill="#059669"
                    opacity="0.72"
                  />
                  <rect
                    x="68"
                    y="74"
                    width="6"
                    height="6"
                    rx="1"
                    fill="#059669"
                    opacity="0.8"
                  />
                  <rect
                    x="76"
                    y="74"
                    width="6"
                    height="6"
                    rx="1"
                    fill="#059669"
                    opacity="0.88"
                  />
                  <rect
                    x="84"
                    y="74"
                    width="6"
                    height="6"
                    rx="1"
                    fill="#059669"
                    opacity="0.96"
                  />
                  <rect
                    x="57"
                    y="42"
                    width="26"
                    height="26"
                    rx="7"
                    fill="#F45B69"
                  />
                  <text
                    x="70"
                    y="58"
                    textAnchor="middle"
                    fontSize="12"
                    fill="white"
                    fontWeight="800"
                    fontFamily="sans-serif"
                  >
                    L
                  </text>
                </svg>
              </div>
              <div>
                <h3 className="mb-[7px] text-[16px] font-extrabold tracking-tight text-[#151515]">
                  Beautiful QR Codes
                </h3>
                <p className="m-0 text-[13.5px] leading-relaxed text-gray-500">
                  Branded QR codes with custom colors and your logo inside.
                  Download as PNG or SVG.
                </p>
              </div>
              <div className="flex flex-wrap gap-[5px]">
                {["Custom colors", "Logo inside", "PNG / SVG"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-50 px-2.5 py-0.75 text-[11.5px] font-semibold text-gray-500 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="opacity-100 transition-all delay-[210ms] duration-700">
            <div className="group flex cursor-default flex-col gap-4.5 rounded-[20px] border-[1.5px] border-gray-200 bg-white p-6.5 shadow-sm transition-all duration-300 hover:border-[#F45B69] hover:shadow-md hover:shadow-[#F45B69]/5">
              <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-[14px] bg-gray-50 transition-colors duration-300 group-hover:bg-[#FFE5E5]/30">
                <svg
                  viewBox="0 0 140 110"
                  fill="none"
                  className="h-[110px] w-[140px]"
                >
                  <g transform="translate(65,82) scale(0.6)">
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
                      fill="#D97706"
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
                    <circle
                      cx="-14"
                      cy="3"
                      r="6"
                      fill="#FFB8C0"
                      opacity="0.5"
                    />
                    <circle cx="14" cy="3" r="6" fill="#FFB8C0" opacity="0.5" />
                    <path
                      d="M-7,7 Q0,14 7,7"
                      stroke="#4A2800"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path
                      d="M-16,30 Q-40,36 -42,48"
                      stroke="#FDDCB8"
                      strokeWidth="11"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d="M16,30 Q40,36 42,48"
                      stroke="#FDDCB8"
                      strokeWidth="11"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <g>
                      <line
                        x1="40"
                        y1="36"
                        x2="40"
                        y2="-20"
                        stroke="#8B6914"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <rect
                        x="40"
                        y="-20"
                        width="42"
                        height="24"
                        rx="5"
                        fill="#F45B69"
                      />
                      <text
                        x="61"
                        y="-4"
                        textAnchor="middle"
                        fontSize="10"
                        fill="white"
                        fontWeight="800"
                        fontFamily="monospace"
                      >
                        go.co
                      </text>
                    </g>
                  </g>
                  <rect
                    x="82"
                    y="22"
                    width="50"
                    height="22"
                    rx="6"
                    fill="#D97706"
                  />
                  <text
                    x="107"
                    y="37"
                    textAnchor="middle"
                    fontSize="9"
                    fill="white"
                    fontWeight="800"
                    fontFamily="monospace"
                  >
                    go.brand.com
                  </text>
                </svg>
              </div>
              <div>
                <h3 className="mb-[7px] text-[16px] font-extrabold tracking-tight text-[#151515]">
                  Custom Domains
                </h3>
                <p className="m-0 text-[13.5px] leading-relaxed text-gray-500">
                  Use your own brand domain. go.yourcompany.com instead of
                  uurl.uz — for every link.
                </p>
              </div>
              <div className="flex flex-wrap gap-[5px]">
                {["Brand domain", "Auto SSL", "Zero config"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-50 px-2.5 py-0.75 text-[11.5px] font-semibold text-gray-500 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="opacity-100 transition-all delay-[280ms] duration-700">
            <div className="group flex cursor-default flex-col gap-4.5 rounded-[20px] border-[1.5px] border-gray-200 bg-white p-6.5 shadow-sm transition-all duration-300 hover:border-[#F45B69] hover:shadow-md hover:shadow-[#F45B69]/5">
              <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-[14px] bg-gray-50 transition-colors duration-300 group-hover:bg-[#FFE5E5]/30">
                <svg
                  viewBox="0 0 140 110"
                  fill="none"
                  className="h-[110px] w-[140px]"
                >
                  <rect
                    x="46"
                    y="32"
                    width="48"
                    height="54"
                    rx="6"
                    fill="#F5F3FF"
                    stroke="#7C3AED"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="55"
                    y="72"
                    width="12"
                    height="14"
                    rx="2"
                    fill="#7C3AED"
                    opacity="0.4"
                  />
                  <rect
                    x="69"
                    y="72"
                    width="12"
                    height="14"
                    rx="2"
                    fill="#7C3AED"
                    opacity="0.4"
                  />
                  <rect
                    x="53"
                    y="40"
                    width="12"
                    height="11"
                    rx="2"
                    fill="#7C3AED"
                    opacity="0.6"
                  />
                  <rect
                    x="69"
                    y="40"
                    width="12"
                    height="11"
                    rx="2"
                    fill="#7C3AED"
                    opacity="0.6"
                  />
                  <rect
                    x="53"
                    y="55"
                    width="12"
                    height="11"
                    rx="2"
                    fill="#7C3AED"
                    opacity="0.4"
                  />
                  <rect
                    x="69"
                    y="55"
                    width="12"
                    height="11"
                    rx="2"
                    fill="#7C3AED"
                    opacity="0.4"
                  />
                  <rect
                    x="50"
                    y="22"
                    width="40"
                    height="14"
                    rx="5"
                    fill="#7C3AED"
                  />
                  <text
                    x="70"
                    y="32"
                    textAnchor="middle"
                    fontSize="7.5"
                    fill="white"
                    fontWeight="700"
                    fontFamily="sans-serif"
                  >
                    Acme Inc
                  </text>
                  <g>
                    <circle
                      cx="16"
                      cy="74"
                      r="13"
                      fill="#7C3AED"
                      opacity="0.15"
                    />
                    <circle
                      cx="16"
                      cy="74"
                      r="9"
                      fill="#7C3AED"
                      opacity="0.7"
                    />
                    <text
                      x="16"
                      y="77.5"
                      textAnchor="middle"
                      fontSize="8"
                      fill="white"
                      fontWeight="700"
                      fontFamily="sans-serif"
                    >
                      J
                    </text>
                  </g>
                  <g>
                    <circle
                      cx="124"
                      cy="74"
                      r="13"
                      fill="#7C3AED"
                      opacity="0.15"
                    />
                    <circle
                      cx="124"
                      cy="74"
                      r="9"
                      fill="#7C3AED"
                      opacity="0.7"
                    />
                    <text
                      x="124"
                      y="77.5"
                      textAnchor="middle"
                      fontSize="8"
                      fill="white"
                      fontWeight="700"
                      fontFamily="sans-serif"
                    >
                      S
                    </text>
                  </g>
                  <g>
                    <circle
                      cx="70"
                      cy="10"
                      r="13"
                      fill="#7C3AED"
                      opacity="0.15"
                    />
                    <circle
                      cx="70"
                      cy="10"
                      r="9"
                      fill="#7C3AED"
                      opacity="0.7"
                    />
                    <text
                      x="70"
                      y="13.5"
                      textAnchor="middle"
                      fontSize="8"
                      fill="white"
                      fontWeight="700"
                      fontFamily="sans-serif"
                    >
                      A
                    </text>
                  </g>
                  <line
                    x1="25"
                    y1="74"
                    x2="46"
                    y2="74"
                    stroke="#7C3AED"
                    strokeWidth="1.5"
                    strokeDasharray="3,2"
                  />
                  <line
                    x1="94"
                    y1="74"
                    x2="115"
                    y2="74"
                    stroke="#7C3AED"
                    strokeWidth="1.5"
                    strokeDasharray="3,2"
                  />
                  <line
                    x1="70"
                    y1="19"
                    x2="70"
                    y2="32"
                    stroke="#7C3AED"
                    strokeWidth="1.5"
                    strokeDasharray="3,2"
                  />
                </svg>
              </div>
              <div>
                <h3 className="mb-[7px] text-[16px] font-extrabold tracking-tight text-[#151515]">
                  Organizations
                </h3>
                <p className="m-0 text-[13.5px] leading-relaxed text-gray-500">
                  Create company workspaces, invite teammates, and manage
                  permissions across every department.
                </p>
              </div>
              <div className="flex flex-wrap gap-[5px]">
                {["Workspace", "Members", "Roles"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-50 px-2.5 py-0.75 text-[11.5px] font-semibold text-gray-500 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="opacity-100 transition-all delay-[350ms] duration-700">
            <div className="group flex cursor-default flex-col gap-4.5 rounded-[20px] border-[1.5px] border-gray-200 bg-white p-6.5 shadow-sm transition-all duration-300 hover:border-[#F45B69] hover:shadow-md hover:shadow-[#F45B69]/5">
              <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-[14px] bg-gray-50 transition-colors duration-300 group-hover:bg-[#FFE5E5]/30">
                <svg
                  viewBox="0 0 140 110"
                  fill="none"
                  className="h-[110px] w-[140px]"
                >
                  <g>
                    <rect
                      x="6"
                      y="10"
                      width="58"
                      height="42"
                      rx="8"
                      fill="white"
                      stroke="#E5E7EB"
                      strokeWidth="1"
                    />
                    <rect
                      x="12"
                      y="18"
                      width="22"
                      height="4"
                      rx="2"
                      fill="#F45B69"
                      opacity="0.7"
                    />
                    <rect
                      x="12"
                      y="26"
                      width="46"
                      height="3"
                      rx="1.5"
                      fill="#E5E7EB"
                    />
                    <rect
                      x="12"
                      y="32"
                      width="32"
                      height="3"
                      rx="1.5"
                      fill="#E5E7EB"
                    />
                    <text
                      x="35"
                      y="48"
                      textAnchor="middle"
                      fontSize="7.5"
                      fill="#6B7280"
                      fontWeight="500"
                      fontFamily="sans-serif"
                    >
                      6 links
                    </text>
                  </g>
                  <g>
                    <rect
                      x="74"
                      y="10"
                      width="58"
                      height="42"
                      rx="8"
                      fill="white"
                      stroke="#E5E7EB"
                      strokeWidth="1"
                    />
                    <rect
                      x="80"
                      y="18"
                      width="22"
                      height="4"
                      rx="2"
                      fill="#6366F1"
                      opacity="0.7"
                    />
                    <rect
                      x="80"
                      y="26"
                      width="46"
                      height="3"
                      rx="1.5"
                      fill="#E5E7EB"
                    />
                    <rect
                      x="80"
                      y="32"
                      width="32"
                      height="3"
                      rx="1.5"
                      fill="#E5E7EB"
                    />
                    <text
                      x="103"
                      y="48"
                      textAnchor="middle"
                      fontSize="7.5"
                      fill="#6B7280"
                      fontWeight="500"
                      fontFamily="sans-serif"
                    >
                      11 links
                    </text>
                  </g>
                  <g>
                    <rect
                      x="6"
                      y="60"
                      width="58"
                      height="42"
                      rx="8"
                      fill="#FFE5E5"
                      stroke="#FFCCCC"
                      strokeWidth="1"
                    />
                    <rect
                      x="12"
                      y="68"
                      width="22"
                      height="4"
                      rx="2"
                      fill="#F45B69"
                      opacity="0.7"
                    />
                    <rect
                      x="12"
                      y="76"
                      width="46"
                      height="3"
                      rx="1.5"
                      fill="#E5E7EB"
                    />
                    <rect
                      x="12"
                      y="82"
                      width="32"
                      height="3"
                      rx="1.5"
                      fill="#E5E7EB"
                    />
                    <text
                      x="35"
                      y="98"
                      textAnchor="middle"
                      fontSize="7.5"
                      fill="#F45B69"
                      fontWeight="500"
                      fontFamily="sans-serif"
                    >
                      3 links
                    </text>
                  </g>
                  <g>
                    <rect
                      x="74"
                      y="60"
                      width="58"
                      height="42"
                      rx="8"
                      fill="#F9FAFB"
                      stroke="#E5E7EB"
                      strokeWidth="1"
                      strokeDasharray="3,3"
                    />
                    <rect
                      x="80"
                      y="68"
                      width="22"
                      height="4"
                      rx="2"
                      fill="#6B7280"
                      opacity="0.7"
                    />
                    <text
                      x="103"
                      y="98"
                      textAnchor="middle"
                      fontSize="7.5"
                      fill="#6B7280"
                      fontWeight="500"
                      fontFamily="sans-serif"
                    >
                      + New
                    </text>
                  </g>
                </svg>
              </div>
              <div>
                <h3 className="mb-[7px] text-[16px] font-extrabold tracking-tight text-[#151515]">
                  Workspaces &amp; Teams
                </h3>
                <p className="m-0 text-[13.5px] leading-relaxed text-gray-500">
                  Organize links into projects. Assign roles, collaborate in
                  real-time, and keep everyone aligned.
                </p>
              </div>
              <div className="flex flex-wrap gap-[5px]">
                {["Projects", "Permissions", "Collaboration", "Sharing"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-50 px-2.5 py-0.75 text-[11.5px] font-semibold text-gray-500 transition-colors"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
