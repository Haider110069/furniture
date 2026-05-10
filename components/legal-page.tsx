import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import type { ReactNode } from "react"

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="pt-28 pb-12 px-6 bg-muted/40 border-b border-border">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{title}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        </div>
      </section>
      <article className="max-w-3xl mx-auto px-6 py-12 space-y-6 text-sm text-muted-foreground leading-relaxed [&_h2]:text-foreground [&_h2]:font-semibold [&_h2]:text-lg [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-primary">
        {children}
      </article>
      <Footer />
    </main>
  )
}
