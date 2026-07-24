import "../../globals.css"
import { cn } from "@/lib/utils"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Uurl.uz",
}

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn()}>
      <body>{children}</body>
    </html>
  )
}
