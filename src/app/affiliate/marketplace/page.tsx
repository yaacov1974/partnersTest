import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

export default function AffiliateMarketplacePage() {
  const programs = [
    {
      name: "Acme SaaS",
      description: "All-in-one project management tool.",
      commission: "20% Recurring",
      cookie: "30 Days",
    },
    {
      name: "Globex CRM",
      description: "Customer relationship management for startups.",
      commission: "30% First Year",
      cookie: "60 Days",
    },
    {
      name: "Soylent AI",
      description: "AI-powered nutrition planning.",
      commission: "$50 CPA",
      cookie: "90 Days",
    },
    {
      name: "Umbrella Security",
      description: "Enterprise grade security platform.",
      commission: "15% Lifetime",
      cookie: "45 Days",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Find Programs</h2>
          <p className="text-zinc-400">Discover high-paying SaaS affiliate programs.</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search programs..."
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-500"
          />
        </div>
        <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => (
          <Card key={program.name} className="border-white/10 bg-white/5 backdrop-blur transition-all hover:bg-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-lg bg-zinc-800" />
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {program.commission}
                </span>
              </div>
              <CardTitle className="mt-4 text-white">{program.name}</CardTitle>
              <CardDescription>{program.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-zinc-400">
                Cookie Duration: <span className="text-white">{program.cookie}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-white text-black hover:bg-zinc-200">Apply Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
