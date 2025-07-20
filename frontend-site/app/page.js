import Layout from '@/components/layout/Layout'
import Hero from '@/components/sections/Hero'
import Stats from '@/components/sections/Stats'
import Features from '@/components/sections/Features'
import Testimonials from '@/components/sections/Testimonials'
import CTA from '@/components/sections/CTA'

export default function HomePage() {
  return (
    <Layout>
      <div className="min-h-screen">
        <Hero />
        <Stats />
        <Features />
        <Testimonials />
        <CTA />
      </div>
    </Layout>
  )
}