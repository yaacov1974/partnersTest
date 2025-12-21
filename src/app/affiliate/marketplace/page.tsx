"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Loader2, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

interface SaasCompany {
  id: string;
  name: string;
  short_description: string;
  commission_rate: number;
  commission_model: string;
  cookie_duration: number;
  logo_url: string;
  category: string;
}

interface Partnership {
  id: string;
  saas_id: string;
  status: string;
}

export default function AffiliateMarketplacePage() {
  const { user, loading } = useAuth();
  const [availablePrograms, setAvailablePrograms] = useState<SaasCompany[]>([]);
  const [myPrograms, setMyPrograms] = useState<SaasCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
        if (!user) return;
        
        try {
            // 1. Get current partner ID
            const { data: partnerData, error: partnerError } = await supabase
                .from('partners')
                .select('id')
                .eq('profile_id', user.id)
                .single();
            
            if (partnerError) throw partnerError;
            if (!partnerData) return;
            
            setPartnerId(partnerData.id);

            // 2. Get all partnerships for this partner
            const { data: partnershipsData, error: partnershipsError } = await supabase
                .from('partnerships')
                .select('saas_id, status')
                .eq('partner_id', partnerData.id);

            if (partnershipsError) throw partnershipsError;
            
            const connectedSaasIds = new Set(partnershipsData?.map(p => p.saas_id) || []);
            const connectedMap = new Map();
            partnershipsData?.forEach(p => connectedMap.set(p.saas_id, p.status));

            // 3. Get all SaaS companies
            const { data: saasData, error: saasError } = await supabase
                .from('saas_companies')
                .select('*');

            if (saasError) throw saasError;

            const my_programs: SaasCompany[] = [];
            const available_programs: SaasCompany[] = [];

            saasData?.forEach((company) => {
                if (connectedSaasIds.has(company.id)) {
                    my_programs.push({
                        ...company,
                        // potentially append status here if needed in UI
                    });
                } else {
                    available_programs.push(company);
                }
            });

            setMyPrograms(my_programs);
            setAvailablePrograms(available_programs);

        } catch (error) {
            console.error("Error fetching marketplace data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    if (!loading && user) {
        fetchData();
    }
  }, [user, loading]);

  const handleConnect = async (saasId: string) => {
    if (!partnerId) return;
    setConnectingId(saasId);
    try {
        const { error } = await supabase
            .from('partnerships')
            .insert({
                saas_id: saasId,
                partner_id: partnerId,
                status: 'pending'
            });
        
        if (error) throw error;

        // Move from available to my programs
        const company = availablePrograms.find(c => c.id === saasId);
        if (company) {
            setAvailablePrograms(prev => prev.filter(c => c.id !== saasId));
            setMyPrograms(prev => [...prev, company]);
        }

    } catch (error) {
        console.error("Error connecting:", error);
        alert("Failed to connect. Please try again.");
    } finally {
        setConnectingId(null);
    }
  };

  if (loading || isLoading) {
      return (
          <div className="flex h-[50vh] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      );
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Find Programs</h2>
          <p className="text-zinc-400">Discover and partner with high-paying SaaS companies.</p>
        </div>
      </div>

      {/* SEARCH (Global) */}
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

      {/* SECTION 1: MY PARTNER PROGRAMS */}
      {myPrograms.length > 0 && (
          <div className="space-y-6">
              <h3 className="text-2xl font-bold text-indigo-400">My Partner Programs</h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myPrograms.map((program) => (
                  <Card key={program.id} className="border-indigo-500/20 bg-indigo-500/5 backdrop-blur">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="h-12 w-12 rounded-lg bg-zinc-800 overflow-hidden">
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           {program.logo_url && <img src={program.logo_url} alt={program.name} className="h-full w-full object-cover" />}
                        </div>
                        <span className="rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-medium text-green-400 border border-green-500/20 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Connected
                        </span>
                      </div>
                      <CardTitle className="mt-4 text-white">{program.name}</CardTitle>
                      <CardDescription className="line-clamp-2 min-h-[40px]">{program.short_description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-zinc-400 flex flex-col gap-1">
                        <div>Commission: <span className="text-white font-medium">{program.commission_rate}% {program.commission_model}</span></div>
                        <div>Cookie: <span className="text-white font-medium">{program.cookie_duration} Days</span></div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="secondary" className="w-full">View Dashboard</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
          </div>
      )}

      {/* SECTION 2: EXPLORE PROGRAMS */}
      <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Explore Programs</h3>
          
          {availablePrograms.length === 0 ? (
              <div className="text-zinc-500 text-center py-10 bg-zinc-900/50 rounded-lg border border-zinc-800">
                  No new programs available at the moment.
              </div>
          ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {availablePrograms.map((program) => (
                  <Card key={program.id} className="border-white/10 bg-white/5 backdrop-blur transition-all hover:bg-white/10 hover:border-indigo-500/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                         <div className="h-12 w-12 rounded-lg bg-zinc-800 overflow-hidden flex items-center justify-center">
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           {program.logo_url ? (
                               <img src={program.logo_url} alt={program.name} className="h-full w-full object-cover" /> 
                           ) : (
                               <span className="text-xs text-zinc-500">{program.name.substring(0,2)}</span>
                           )}
                        </div>
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary border border-primary/20">
                          {program.commission_rate}% {program.commission_model}
                        </span>
                      </div>
                      <CardTitle className="mt-4 text-white">{program.name}</CardTitle>
                      <CardDescription className="line-clamp-2 min-h-[40px]">{program.short_description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-zinc-400 flex flex-col gap-1">
                        <div>Category: <span className="text-white">{program.category}</span></div>
                        <div>Cookie: <span className="text-white">{program.cookie_duration} Days</span></div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => handleConnect(program.id)}
                        disabled={connectingId === program.id}
                        className="w-full bg-white text-black hover:bg-zinc-200 font-semibold"
                      >
                         {connectingId === program.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply Now"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
          )}
      </div>
    </div>
  );
}
