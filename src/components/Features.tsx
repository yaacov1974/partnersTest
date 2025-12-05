import { CreditCard, BarChart3, Users } from "lucide-react";

const features = [
  {
    title: "Automated Payouts",
    description: "Global payments handling with built-in tax compliance and automated invoicing.",
    icon: CreditCard,
  },
  {
    title: "Real-time Tracking",
    description: "Monitor clicks, conversions, and revenue in real-time with precision analytics.",
    icon: BarChart3,
  },
  {
    title: "Partner Management",
    description: "A complete CRM for your partnerships. Onboard, manage, and scale your network.",
    icon: Users,
  },
];

export function Features() {
  return (
    <section id="features" className="container mx-auto px-4 py-24">
      <div className="grid gap-8 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 transition-colors hover:bg-zinc-900"
          >
            <div className="mb-4 inline-block rounded-lg bg-zinc-800 p-3 text-white group-hover:bg-white group-hover:text-black transition-colors">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">{feature.title}</h3>
            <p className="text-zinc-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
