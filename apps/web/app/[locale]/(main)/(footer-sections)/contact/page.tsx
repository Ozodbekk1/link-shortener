"use client"

import React, { useState } from "react"
import { useLocale } from "@/hooks/use-locale"
import Link from "next/link"
import {
  ArrowLeft,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
} from "lucide-react"

const contactMethods = [
  {
    icon: <Mail className="h-5 w-5" />,
    title: "Email Us",
    content: "hello@uurl.uz",
    description: "We typically respond within 24 hours",
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    title: "Location",
    content: "Tashkent, Uzbekistan",
    description: "Remote-first team, global presence",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Response Time",
    content: "Mon–Fri, 9AM–6PM GMT+5",
    description: "We aim to reply within 48 hours",
  },
]

export default function ContactPage() {
  const locale = useLocale()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // send data from api to admin dashboard messages
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1200px] px-[32px] pt-[120px]">
        <Link
          href={`/${locale}`}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#6B7280] transition-colors hover:text-[#F45B69]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="mx-auto max-w-[1200px] px-[32px] pb-[80px]">
        <div className="mb-12">
          <div className="mb-4 inline-block rounded-full bg-[#F45B69]/10 px-4 py-1.5 text-xs font-bold tracking-wider text-[#F45B69] uppercase">
            Get in Touch
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl">
            We&rsquo;d love to hear{" "}
            <span className="text-[#F45B69]">from you</span>
          </h1>
          <p className="max-w-[500px] text-lg leading-relaxed text-[#6B7280]">
            Have a question, feedback, or just want to say hi? Drop us a message
            and we&rsquo;ll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F45B69]/10">
                  <CheckCircle2 className="h-8 w-8 text-[#F45B69]" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#111827]">
                  Message Sent!
                </h3>
                <p className="mb-6 max-w-[400px] text-[#6B7280]">
                  Thank you for reaching out. We&rsquo;ll review your message
                  and get back to you within 48 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="rounded-xl bg-[#F45B69] px-6 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1.5 block text-sm font-semibold text-[#111827]"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#111827] transition-colors placeholder:text-[#9CA3AF] focus:border-[#F45B69] focus:ring-2 focus:ring-[#F45B69]/20 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-semibold text-[#111827]"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      placeholder="john@example.com"
                      className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#111827] transition-colors placeholder:text-[#9CA3AF] focus:border-[#F45B69] focus:ring-2 focus:ring-[#F45B69]/20 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-1.5 block text-sm font-semibold text-[#111827]"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    placeholder="How can we help?"
                    className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#111827] transition-colors placeholder:text-[#9CA3AF] focus:border-[#F45B69] focus:ring-2 focus:ring-[#F45B69]/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-sm font-semibold text-[#111827]"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full resize-none rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#111827] transition-colors placeholder:text-[#9CA3AF] focus:border-[#F45B69] focus:ring-2 focus:ring-[#F45B69]/20 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#F45B69] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#F45B69]/30 transition-all hover:opacity-90 active:scale-[0.98]"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            {contactMethods.map((method) => (
              <div
                key={method.title}
                className="group rounded-2xl border border-[#E5E7EB] bg-white p-6 transition-all duration-300 hover:border-[#F45B69]/30 hover:shadow-lg"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#F45B69]/10 text-[#F45B69]">
                  {method.icon}
                </div>
                <h3 className="mb-1 text-base font-bold text-[#111827]">
                  {method.title}
                </h3>
                <p className="mb-1 text-sm text-[#111827]">{method.content}</p>
                <p className="text-xs text-[#6B7280]">{method.description}</p>
              </div>
            ))}

            <div className="rounded-2xl border border-[#E5E7EB] bg-[#FFF8F8] p-6">
              <h3 className="mb-3 text-base font-bold text-[#111827]">
                Follow Us
              </h3>
              <p className="mb-4 text-sm text-[#6B7280]">
                Stay up to date with the latest features and updates.
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#6B7280] transition-colors hover:bg-[#F45B69] hover:text-white"
                  aria-label="GitHub"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#6B7280] transition-colors hover:bg-[#F45B69] hover:text-white"
                  aria-label="LinkedIn"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="currentColor"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#6B7280] transition-colors hover:bg-[#F45B69] hover:text-white"
                  aria-label="YouTube"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="currentColor"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
