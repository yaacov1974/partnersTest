import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-black to-black" />
      
      <div className="animate-fade-in-up space-y-8 text-center">
        <div className="mx-auto w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
          <span className="text-sm font-medium text-primary-foreground">
            ✨ The Future of SaaS Partnerships
          </span>
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-7xl font-heading">
          Start for Free, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Pay as You Sell
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-zinc-400 sm:text-xl">
          The next-gen affiliate network built exclusively for SaaS. Automated recurring 
          commissions, seamless Stripe integration, and AI-powered insights.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/saas/signup">
            <Button size="lg" className="h-12 min-w-[180px] bg-primary text-white hover:bg-primary/90 text-base">
              For SaaS Brands
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/affiliate/signup">
            <Button size="lg" variant="outline" className="h-12 min-w-[180px] border-white/10 bg-transparent text-white hover:bg-white/5 text-base">
              For Affiliates
            </Button>
          </Link>
        </div>

        <div className="pt-12 space-y-4">
          <p className="text-xs font-medium tracking-widest text-zinc-500 uppercase">Powering Next-Gen SaaS Companies</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0">
            {["Acme.inc", "Globex", "Soylent", "Umbrella"].map((brand) => (
              <div key={brand} className="flex items-center gap-2 text-lg font-semibold text-white">
                <div className="h-6 w-6 rounded bg-zinc-700" />
                {brand}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
