import Link from "next/link"
import {
  BookOpen,
  Code2,
  Bookmark,
  Rss,
  ChevronRight,
  ArrowLeft,
} from "lucide-react"
import Image from "next/image"

const links = [
  {
    title: "Documentation",
    description: "Learn how to integrate our tools with your app.",
    href: "/docs",
    icon: BookOpen,
  },
  {
    title: "API Reference",
    description: "A complete API reference for our libraries.",
    href: "/api-docs",
    icon: Code2,
  },
  {
    title: "Guides",
    description: "Installation guides that cover popular setups.",
    href: "/guides",
    icon: Bookmark,
  },
  {
    title: "Blog",
    description: "Read our latest news and articles.",
    href: "/blog",
    icon: Rss,
  },
]

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-background px-4 py-12 text-foreground selection:bg-primary/10 md:py-16">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center">
        <div className="mb-12">
          <Image
            src={"/icons/favicon.svg"}
            alt="404-image"
            width={100}
            height={200}
          />
        </div>

        <div className="mb-10 text-center">
          <p className="mb-3 text-3xl font-semibold tracking-wide text-primary">
            404
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            This page does not exist
          </h1>
          <p className="text-base font-normal text-muted-foreground">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
        </div>

        <div className="mb-10 w-full divide-y divide-border border-t border-b border-border">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.title}
                href={link.href}
                className="group -mx-2 flex items-center justify-between rounded-lg px-2 py-4 transition-colors hover:bg-accent/50 sm:py-5"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-border bg-card text-primary shadow-sm transition-colors group-hover:border-primary/30">
                    <Icon className="h-5 w-5 stroke-[1.75]" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                      {link.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                      {link.description}
                    </p>
                  </div>
                </div>

                <ChevronRight className="ml-4 h-4 w-4 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
              </Link>
            )
          })}
        </div>

        <Link
          href="/"
          className="group inline-flex items-center text-sm font-semibold text-primary transition-colors hover:text-primary/80"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to home
        </Link>
      </div>
    </div>
  )
}
