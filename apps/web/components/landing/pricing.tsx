import React from "react"

export default function Pricing() {
  const perks = [
    {
      label: "Unlimited links",
      sub: "Create as many as you need",
      icon: (
        <svg
          className="h-[38px] w-[38px] text-[#F45B69]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      ),
    },
    {
      label: "Unlimited clicks",
      sub: "No traffic caps, ever",
      icon: (
        <svg
          className="h-[38px] w-[38px] text-[#F45B69]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      label: "Unlimited QR codes",
      sub: "Generate without restriction",
      icon: (
        <svg
          className="h-[38px] w-[38px] text-[#F45B69]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
          />
        </svg>
      ),
    },
    {
      label: "Unlimited analytics",
      sub: "Full data, no paywalls",
      icon: (
        <svg
          className="h-[38px] w-[38px] text-[#F45B69]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
    {
      label: "Unlimited teams",
      sub: "Invite everyone you want",
      icon: (
        <svg
          className="h-[38px] w-[38px] text-[#F45B69]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      label: "Unlimited workspaces",
      sub: "Organize freely",
      icon: (
        <svg
          className="h-[38px] w-[38px] text-[#F45B69]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H7m6 4v6m-4-6v6"
          />
        </svg>
      ),
    },
  ]

  const confettiColors = [
    "#F45B69",
    "#FFE5E5",
    "#FFCCCC",
    "#FCD34D",
    "#86EFAC",
    "#93C5FD",
    "#C4B5FD",
  ]

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-white py-[96px]"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-[9px] w-[9px] animate-pulse rounded-full opacity-25"
            style={{
              left: `${5 + i * 5.5}%`,
              top: `${Math.abs(Math.sin(i * 1.3) * 60 + 20)}%`,
              backgroundColor: confettiColors[i % 7],
              animationDuration: `${3 + (i % 4)}s`,
              animationDelay: `${i * 0.28}s`,
            }}
          />
        ))}
      </div>

      <div className="mx-auto max-w-[1200px] px-[32px]">
        <div className="mb-[60px] text-center">
          <div className="mb-[16px] inline-flex items-center justify-center text-[#F45B69]">
            <svg
              className="h-[56px] w-[56px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m11-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>

          <h2 className="mb-[16px] text-[clamp(28px,4vw,54px)] leading-[1.05] font-black tracking-[-2px] text-[#151515]">
            Everything is free.
            <br />
            <span className="text-[#F45B69]">Forever.</span>
          </h2>

          <p className="mx-auto max-w-[480px] text-[17px] leading-[1.6] text-[#6B7280]">
            No credit card. No trial. No limits. No &ldquo;unlimited*&rdquo;
            fine print.
            <br />
            Just the full product, always free.
          </p>
        </div>

        <div className="mx-auto mb-[48px] grid max-w-[900px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {perks.map(({ icon, label, sub }) => (
            <div
              key={label}
              className="group flex flex-col items-center justify-center rounded-[20px] border border-[#E5E7EB] bg-[#F9FAFB] p-[24px_26px] text-center transition-all duration-200 hover:-translate-y-1 hover:border-[#FFCCCC] hover:bg-[#FFE5E5] hover:shadow-[0_12px_36px_rgba(244,91,105,0.12)]"
            >
              <div className="mb-[12px] flex h-[48px] w-[48px] items-center justify-center transition-transform duration-200 group-hover:scale-110">
                {icon}
              </div>
              <div className="mb-[4px] text-[15.5px] font-extrabold tracking-[-0.2px] text-[#151515]">
                ∞ {label}
              </div>
              <div className="text-[13px] text-[#6B7280]">{sub}</div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="rounded-[14px] bg-gradient-to-r from-[#F45B69] to-[#FF6B7A] px-[34px] py-[16px] text-[17px] font-extrabold tracking-[-0.3px] text-white shadow-[0_8px_32px_rgba(244,91,105,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_44px_rgba(244,91,105,0.45)] active:translate-y-0">
            Get started free — no card needed
          </button>
        </div>
      </div>
    </section>
  )
}
