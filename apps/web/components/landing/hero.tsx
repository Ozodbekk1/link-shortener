"use client"
import { LineShadowText } from "@/components/ui/line-shadow-text"
import { Highlighter } from "@/components/ui/highlighter"
import Image from "next/image"
import starImage from "../assets/gold-star.png"

const coral = "#F45B69"
const pinkBg = "#FFF5F5"
const pillBg = "rgba(244,91,105,0.08)"
const darkText = "#111827"

export default function Hero() {
  return (
    <>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        @keyframes pulse-dot {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.25);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease both;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed-1 {
          animation: float 4.5s ease-in-out 0.4s infinite;
        }
        .animate-float-delayed-2 {
          animation: float 5s ease-in-out 1s infinite;
        }
        .animate-float-delayed-3 {
          animation: float 5s ease-in-out 1.4s infinite;
        }
        .animate-float-slow-1 {
          animation: float-slow 5s ease-in-out 1s infinite;
        }
        .animate-float-slow-2 {
          animation: float-slow 5.5s ease-in-out 0.7s infinite;
        }
        .animate-float-slow-3 {
          animation: float-slow 4.5s ease-in-out 1.5s infinite;
        }
        .animate-float-slow-4 {
          animation: float-slow 6s ease-in-out 2s infinite;
        }
        .animate-pulse-dot {
          animation: pulse-dot 2s infinite;
        }
      `}</style>

      <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-white via-[#FFF8F8] to-[#FFF0F2] pt-[68px]">
        <div
          className="pointer-events-none absolute -top-[10%] -right-[5%] h-[700px] w-[700px] rounded-full opacity-60 blur-3xl"
          style={{
            background: `radial-gradient(circle, rgba(244,91,105,0.12) 0%, transparent 70%)`,
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-[10%] -left-[5%] h-[550px] w-[550px] rounded-full opacity-50 blur-3xl"
          style={{
            background: `radial-gradient(circle, rgba(244,91,105,0.08) 0%, transparent 70%)`,
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-2 lg:gap-8">
            <div className="animate-fade-in-up">
              <h1 className="mb-6 text-4xl leading-[1.05] font-black tracking-tight text-gray-900 sm:text-5xl lg:text-[68px]">
                Create smarter{" "}
                <LineShadowText className="text-[#F45B69]">
                  links
                </LineShadowText>
                .
                <br />
                Understand every{" "}
                <LineShadowText className="text-[#F45B69]">
                  click
                </LineShadowText>
                .
              </h1>

              <p className="mb-9 max-w-md text-base leading-relaxed text-gray-500 sm:text-lg">
                {" "}
                <Highlighter action="underline" color="#FF9800">
                  Free forever URL shortener
                </Highlighter>{" "}
                with advanced analytics,{" "}
                <Highlighter action="underline" color="#87CEFA">
                  custom sub domains
                </Highlighter>
                , QR codes, and powerful redirect rules.{" "}
                <Highlighter action="underline" color="#F45B69">
                  No limits. No subscriptions.
                </Highlighter>
              </p>

              <div className="mb-12 flex flex-wrap gap-3">
                <button
                  className="cursor-pointer rounded-xl px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-[#F45B69]/30 transition-all hover:opacity-95 active:scale-[0.98]"
                  style={{ backgroundColor: coral }}
                >
                  Create your first link →
                </button>
                <button className="cursor-pointer rounded-xl border border-gray-200/80 bg-white/80 px-6 py-3.5 text-base font-bold text-gray-800 backdrop-blur-sm transition-all hover:bg-white active:scale-[0.98]">
                  Explore features
                </button>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="flex -space-x-2">
                  {[
                    { bg: "#F59E0B", label: "J" },
                    { bg: "#10B981", label: "S" },
                    { bg: "#3B82F6", label: "A" },
                    { bg: "#8B5CF6", label: "M" },
                    { bg: "#EC4899", label: "R" },
                  ].map((user, i) => (
                    <div
                      key={i}
                      className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white shadow-xs"
                      style={{ backgroundColor: user.bg }}
                    >
                      {user.label}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="text-xs font-bold text-gray-900">
                    12,000+ teams trust Uurl
                  </div>
                  <div>Loved by marketers and devs</div>

                  <div className="flex flex-row items-center text-xs text-gray-400">
                    <Image src={starImage} alt="star" width={35} height={35} />{" "}
                    <Image src={starImage} alt="star" width={35} height={35} />{" "}
                    <Image src={starImage} alt="star" width={35} height={35} />{" "}
                    <Image src={starImage} alt="star" width={35} height={35} />{" "}
                    <Image
                      src={starImage}
                      alt="star"
                      width={35}
                      height={35}
                    />{" "}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <HeroIllo />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function HeroIllo() {
  const brd = "#E5E7EB"
  const gray = "#9CA3AF"
  const dark = "#111827"

  return (
    <svg
      viewBox="0 0 500 460"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full max-w-[520px] drop-shadow-sm"
    >
      <circle cx="250" cy="220" r="180" fill="#FFF0F2" opacity="0.8" />
      <circle cx="250" cy="220" r="135" fill="#FFE4E8" opacity="0.5" />

      <g className="animate-float-fast">
        <rect
          x="25"
          y="60"
          width="180"
          height="28"
          rx="14"
          fill="white"
          stroke={brd}
          strokeWidth="1.2"
        />
        <text
          x="115"
          y="77"
          textAnchor="middle"
          fontSize="8"
          fill={gray}
          fontFamily="monospace"
        >
          https://example.com/summer-sale-2024
        </text>
      </g>
      <text x="215" y="78" fontSize="14" fill={coral} fontWeight="800">
        →
      </text>
      <g className="animate-float-delayed-1">
        <rect x="232" y="60" width="120" height="28" rx="14" fill="#FFE4E8" />
        <text
          x="292"
          y="77"
          textAnchor="middle"
          fontSize="9"
          fill={coral}
          fontFamily="monospace"
          fontWeight="700"
        >
          uurl.uz/sale
        </text>
      </g>

      <g className="animate-float-delayed-2">
        <rect
          x="35"
          y="104"
          width="150"
          height="24"
          rx="12"
          fill="white"
          stroke={brd}
          strokeWidth="1"
        />
        <text
          x="110"
          y="119"
          textAnchor="middle"
          fontSize="7.5"
          fill="#D1D5DB"
          fontFamily="monospace"
        >
          https://store.brand.com/products
        </text>
      </g>
      <g className="animate-float-delayed-3">
        <rect
          x="195"
          y="104"
          width="100"
          height="24"
          rx="12"
          fill="#FFE4E8"
          opacity="0.8"
        />
        <text
          x="245"
          y="119"
          textAnchor="middle"
          fontSize="8"
          fill={coral}
          fontFamily="monospace"
          fontWeight="600"
        >
          uurl.uz/brand
        </text>
      </g>

      <Char x={250} y={210} />

      <g transform="translate(48,135)" className="animate-float-slow-1">
        <rect width="42" height="42" rx="10" fill="#FFE4E8" />
        <path
          d="M14 18 C14 14, 28 14, 28 18 C28 22, 14 22, 14 26 C14 30, 28 30, 28 26"
          stroke={coral}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      <g>
        <rect
          x="52"
          y="338"
          width="390"
          height="100"
          rx="14"
          fill="white"
          stroke={brd}
          strokeWidth="1.2"
        />
        <rect x="52" y="338" width="390" height="26" rx="14" fill="#F9FAFB" />
        <rect x="52" y="352" width="390" height="12" fill="#F9FAFB" />

        <circle cx="70" cy="351" r="4.5" fill="#FF5F57" />
        <circle cx="83" cy="351" r="4.5" fill="#FEBC2E" />
        <circle cx="96" cy="351" r="4.5" fill="#28C840" />

        <rect x="114" y="344" width="228" height="14" rx="7" fill="white" />
        <text
          x="228"
          y="354"
          textAnchor="middle"
          fontSize="7.5"
          fill={gray}
          fontFamily="monospace"
        >
          uurl.uz/summer
        </text>

        <text x="70" y="382" fontSize="8" fill={gray} fontFamily="monospace">
          Original: https://example.com/products/summer-sale-2024
        </text>
        <text
          x="70"
          y="396"
          fontSize="8.5"
          fill={coral}
          fontFamily="monospace"
          fontWeight="700"
        >
          Short: uurl.uz/summer
        </text>

        <rect x="70" y="406" width="76" height="18" rx="9" fill="#FFE4E8" />
        <text
          x="108"
          y="418"
          textAnchor="middle"
          fontSize="7.5"
          fill={coral}
          fontWeight="600"
        >
          10,482 clicks
        </text>

        <rect x="152" y="406" width="68" height="18" rx="9" fill="#FFE4E8" />
        <text
          x="186"
          y="418"
          textAnchor="middle"
          fontSize="7.5"
          fill={coral}
          fontWeight="600"
        >
          73 countries
        </text>

        <rect x="226" y="406" width="72" height="18" rx="9" fill="#FFE4E8" />
        <text
          x="262"
          y="418"
          textAnchor="middle"
          fontSize="7.5"
          fill={coral}
          fontWeight="600"
        >
          92% mobile
        </text>
      </g>
    </svg>
  )
}

function Char({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="52" rx="28" ry="6" fill="#F45B69" opacity="0.15" />

      <path
        d="M-18 20 C-18 10, 18 10, 18 20 L15 48 C15 50, -15 50, -15 48 Z"
        fill="#F45B69"
      />

      <path
        d="M-16 18 Q-28 28 -32 38"
        stroke="#FFE0BD"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />

      <path
        d="M16 18 Q28 26 38 18"
        stroke="#FFE0BD"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />

      <line
        x1="36"
        y1="20"
        x2="52"
        y2="-4"
        stroke="#A16207"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle
        cx="52"
        cy="-6"
        r="5"
        stroke="#F45B69"
        strokeWidth="2.5"
        fill="white"
      />

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
