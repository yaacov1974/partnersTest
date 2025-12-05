import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

export default function SaaSMarketplacePage() {
  const partners = [
    {
      name: "TechReviewer Pro",
      category: "Content Creator",
      audience: "50k+ Subscribers",
      match: "98% Match",
    },
    {
      name: "SaaS Weekly",
      category: "Newsletter",
      audience: "25k+ Readers",
      match: "95% Match",
    },
    {
      name: "DevTools Daily",
      category: "Blog",
      audience: "100k+ Monthly Views",
      match: "92% Match",
    },
    {
      name: "Cloud Influencer",
      category: "Social Media",
      audience: "10k+ Followers",
      match: "88% Match",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Partner Marketplace</h2>
          <p className="text-zinc-400">Find the perfect partners for your SaaS.</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search partners..."
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-500"
          />
        </div>
        <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {partners.map((partner) => (
          <Card key={partner.name} className="border-white/10 bg-white/5 backdrop-blur transition-all hover:bg-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-lg bg-zinc-800" />
                <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500">
                  {partner.match}
                </span>
              </div>
              <CardTitle className="mt-4 text-white">{partner.name}</CardTitle>
              <CardDescription>{partner.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-zinc-400">
                Audience: <span className="text-white">{partner.audience}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary hover:bg-primary/90">Connect</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
