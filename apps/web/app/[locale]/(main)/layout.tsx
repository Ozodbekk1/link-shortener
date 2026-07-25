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
  return <>{children}</>
}
