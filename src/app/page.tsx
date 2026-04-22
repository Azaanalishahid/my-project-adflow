import Link from 'next/link'
import { ArrowRight, ShieldCheck, Zap, BarChart3, ChevronRight, Sparkles, Globe, Rocket } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative flex min-h-[95vh] w-full flex-col items-center justify-center overflow-hidden px-6 py-20 text-center lg:py-32">
        <div className="container relative z-10 flex flex-col items-center">
          <div className="animate-fade-in mb-8 inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface-1)] px-5 py-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--primary)] shadow-2xl">
            <span className="flex h-2 w-2 animate-pulse rounded-full bg-[var(--primary)] shadow-[0_0_10px_var(--primary)]" />
            Empowering the Next Gen of Digital Advertising
          </div>
          
          <h1 className="animate-fade-in mb-8 max-w-5xl text-6xl font-extrabold leading-[1] tracking-tight text-white md:text-[7rem]" style={{ animationDelay: '0.1s' }}>
            Scale Your <span className="gradient-text">Impact</span> <br /> 
            With <span className="italic font-light">AdFlow Pro.</span>
          </h1>
          
          <p className="animate-fade-in mx-auto mb-12 max-w-2xl text-lg font-medium leading-relaxed text-[#94a3b8] md:text-xl" style={{ animationDelay: '0.2s' }}>
            The premier marketplace for elite sponsored content. Streamline your ad workflow with AI-assisted moderation, secure transactions, and global reach.
          </p>

          <div className="animate-fade-in flex flex-col items-center justify-center gap-6 sm:flex-row" style={{ animationDelay: '0.3s' }}>
            <Link href="/ads" className="btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', textDecoration: 'none' }}>
              Browse Marketplace
              <ArrowRight size={22} />
            </Link>
            
            <Link href="/login" className="btn-secondary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', textDecoration: 'none' }}>
              Launch Your Campaign
            </Link>
          </div>

          {/* Stats */}
          <div className="animate-fade-in mt-32 grid w-full max-w-5xl grid-cols-2 gap-12 md:grid-cols-4" style={{ animationDelay: '0.4s' }}>
            {[
              { label: 'Verified Ads', val: '15K+' },
              { label: 'Top Publishers', val: '3.2K' },
              { label: 'Global Reach', val: '180+' },
              { label: 'Avg. ROI', val: '4.8x' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-4xl font-extrabold text-white mb-1">{stat.val}</div>
                <div className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-[var(--primary)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-32 relative z-10">
        <div className="mb-24 text-center">
          <h2 className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-[var(--primary)] mb-4">Core Ecosystem</h2>
          <h3 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl">Built for Performance.</h3>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="premium-card group">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface-2)] text-[var(--primary)] border border-[var(--border)] shadow-lg transition-transform group-hover:scale-110">
              <ShieldCheck size={32} />
            </div>
            <h4 className="mb-4 text-2xl font-bold text-white">Trust-First Verification</h4>
            <p className="text-[#64748b] leading-relaxed">
              Every listing undergoes rigorous multi-tier verification. We ensure authenticity, quality, and compliance so you can invest with absolute confidence.
            </p>
          </div>
          
          <div className="premium-card group">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface-2)] text-[var(--secondary)] border border-[var(--border)] shadow-lg transition-transform group-hover:scale-110">
              <Zap size={32} />
            </div>
            <h4 className="mb-4 text-2xl font-bold text-white">Lightning Deployment</h4>
            <p className="text-[#64748b] leading-relaxed">
              Eliminate the friction of traditional ad buying. Our automated workflow takes your campaign from approval to live status in record time.
            </p>
          </div>
          
          <div className="premium-card group">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface-2)] text-[var(--accent)] border border-[var(--border)] shadow-lg transition-transform group-hover:scale-110">
              <BarChart3 size={32} />
            </div>
            <h4 className="mb-4 text-2xl font-bold text-white">Actionable Intel</h4>
            <p className="text-[#64748b] leading-relaxed">
              Gain deep visibility into your campaign performance with real-time analytics and transparent reporting metrics.
            </p>
          </div>

          <div className="premium-card md:col-span-3 flex flex-col md:flex-row items-center gap-12 p-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 mb-6 text-[var(--primary)] font-bold text-sm">
                <Rocket size={18} />
                <span>SCALABILITY READY</span>
              </div>
              <h4 className="mb-6 text-4xl font-extrabold text-white">Global Reach, Local Impact.</h4>
              <p className="text-[#94a3b8] text-lg mb-10 leading-relaxed max-w-2xl">
                Whether you're a boutique brand or a global enterprise, AdFlow Pro provides the infrastructure to scale your message across borders while maintaining local relevance.
              </p>
              <Link href="/ads" className="inline-flex items-center gap-3 font-bold text-[var(--primary)] hover:gap-5 transition-all text-lg">
                Explore Premium Packages <ArrowRight size={20} />
              </Link>
            </div>
            <div className="relative h-64 w-full md:w-96 rounded-3xl overflow-hidden border border-[var(--border)] bg-[var(--surface-2)] group">
               <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] opacity-10" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <Globe size={120} className="text-[var(--primary)] opacity-20 animate-spin-slow" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-32 relative z-10">
        <div className="premium-card overflow-hidden relative p-16 text-center">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent" />
           <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-8">Ready to start your flow?</h3>
           <p className="text-[#94a3b8] text-xl mb-12 max-w-2xl mx-auto">
             Join thousands of successful advertisers and publishers on the world's most advanced ad marketplace.
           </p>
           <div className="flex flex-col sm:flex-row gap-6 justify-center">
             <Link href="/login?signup=true" className="btn-primary" style={{ padding: '1rem 3rem' }}>
               Create Free Account
             </Link>
             <Link href="/ads" className="btn-secondary" style={{ padding: '1rem 3rem' }}>
               View Live Ads
             </Link>
           </div>
        </div>
      </section>
    </div>
  )
}
