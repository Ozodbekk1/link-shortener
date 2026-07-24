import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Metadata } from "next"
// import {
//   SidebarProvider,
//   SidebarInset,
//   SidebarTrigger,
// } from "@/components/ui/sidebar"
// import { AppSidebar } from "@/components/app-sidebar"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Uurl.uz",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        {/* <ThemeProvider> */}
        {/* <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <SidebarTrigger className="mt-1 ml-1" />
              {children}
            </SidebarInset>
          </SidebarProvider> */}
        {children}
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}
