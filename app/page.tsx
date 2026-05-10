import { Suspense } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Products } from "@/components/products"
import { WhyChooseUs } from "@/components/why-choose-us"
import { InteriorSection } from "@/components/interior-section"
import { ProductCards } from "@/components/product-cards"
import { Footer } from "@/components/footer"

function HomeBlock({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[120px]">{children}</div>
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Suspense fallback={<HomeBlock />}>
        <Products />
      </Suspense>
      <WhyChooseUs />
      <InteriorSection />
      <Suspense fallback={<HomeBlock />}>
        <ProductCards />
      </Suspense>
      <Footer />
    </main>
  )
}
