import FinalCTA from "@/components/landing/cta"
import CustomDomainSection from "@/components/landing/custom-domain"
import Demo from "@/components/landing/demo"
import FeaturesSection from "@/components/landing/features"
import Footer from "@/components/landing/footer"
import Hero from "@/components/landing/hero"
import LandingNavbar from "@/components/landing/navbar"
import Pricing from "@/components/landing/pricing"

export default function Page() {
  return (
    <div>
      <LandingNavbar />
      <Hero />
      <Demo />
      <FeaturesSection />
      <CustomDomainSection />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  )
}
