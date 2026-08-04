"use client"

import { useMemo, useState } from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import { getNumericCodes } from "i18n-iso-countries"
import worldAtlas from "world-atlas/countries-110m.json"
import type { CountryAnalyticsItem } from "@/api/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const numericCountryCodes = Object.entries(getNumericCodes()).reduce(
  (codes, [numeric, alpha2]) => {
    codes[alpha2.toUpperCase()] = numeric.padStart(3, "0")
    return codes
  },
  {} as Record<string, string>
)

export function ClickMap({ countries }: { countries: CountryAnalyticsItem[] }) {
  const [hovered, setHovered] = useState<CountryAnalyticsItem | null>(null)
  const clicksByMapId = useMemo(
    () =>
      countries.reduce<Record<string, CountryAnalyticsItem>>((clicks, country) => {
        const mapId = numericCountryCodes[country.country.toUpperCase()]
        if (mapId) clicks[mapId] = country
        return clicks
      }, {}),
    [countries]
  )
  const maxClicks = Math.max(...countries.map((country) => country.clicks), 1)

  return (
    <Card className="overflow-hidden border-emerald-500/30 bg-[#030806] text-emerald-100 shadow-[0_0_40px_rgba(16,185,129,0.08)]">
      <CardHeader className="border-b border-emerald-500/20 bg-emerald-500/[0.03]">
        <CardDescription className="font-mono text-[10px] tracking-[0.2em] text-emerald-400">
          GEOLOCATION // LIVE CLICK SIGNALS
        </CardDescription>
        <CardTitle className="font-mono text-xl text-emerald-100">
          Global traffic map
        </CardTitle>
      </CardHeader>
      <CardContent className="relative p-0">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(52,211,153,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.12)_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative p-4 sm:p-6">
          <ComposableMap projectionConfig={{ rotate: [-10, 0, 0], scale: 155 }}>
            <Geographies geography={worldAtlas}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const country = clicksByMapId[String(geo.id).padStart(3, "0")]
                  const intensity = country ? country.clicks / maxClicks : 0
                  const fill = country
                    ? `rgba(16, 185, 129, ${0.35 + intensity * 0.65})`
                    : "#0d1b15"

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setHovered(country ?? null)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        default: { fill, stroke: "#1d513c", strokeWidth: 0.45, outline: "none" },
                        hover: { fill: country ? "#5eead4" : "#1b3b2c", stroke: "#a7f3d0", strokeWidth: 0.7, outline: "none" },
                        pressed: { outline: "none" },
                      }}
                    />
                  )
                })
              }
            </Geographies>
          </ComposableMap>
          <div className="mt-2 flex items-center justify-between font-mono text-xs text-emerald-300">
            <span>{hovered ? `${hovered.country}: ${hovered.clicks} clicks` : "HOVER A LOCATION"}</span>
            <span>{countries.reduce((sum, country) => sum + country.clicks, 0)} SIGNALS</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
