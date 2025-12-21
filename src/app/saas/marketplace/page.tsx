"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Loader2, Check, UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

interface Partner {
  id: string;
  full_name: string;
  promotion_platform: string;
  platform_url: string;
  audience_size: string;
  niche: string;
  avatar_url: string;
  country: string;
}

export default function SaaSMarketplacePage() {
  const { user, loading } = useAuth();
  const [availableAffiliates, setAvailableAffiliates] = useState<Partner[]>([]);
  const [myAffiliates, setMyAffiliates] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saasId, setSaasId] = useState<string | null>(null);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
        if (!user) return;
        
        try {
            // 1. Get current SaaS ID
            const { data: saasData, error: saasError } = await supabase
                .from('saas_companies')
                .select('id')
                .eq('owner_id', user.id)
                .single();
            
            if (saasError) throw saasError;
            if (!saasData) return;
            
            setSaasId(saasData.id);

            // 2. Get all partnerships for this SaaS
            const { data: partnershipsData, error: partnershipsError } = await supabase
                .from('partnerships')
                .select('partner_id, status')
                .eq('saas_id', saasData.id);

            if (partnershipsError) throw partnershipsError;
            
            const connectedPartnerIds = new Set(partnershipsData?.map(p => p.partner_id) || []);

            // 3. Get all Partners (Affiliates)
            const { data: partnersData, error: partnersError } = await supabase
                .from('partners')
                .select('*');

            if (partnersError) throw partnersError;

            const my_affiliates: Partner[] = [];
            const available_affiliates: Partner[] = [];

            partnersData?.forEach((partner) => {
                if (connectedPartnerIds.has(partner.id)) {
                    my_affiliates.push(partner);
                } else {
                    available_affiliates.push(partner);
                }
            });

            setMyAffiliates(my_affiliates);
            setAvailableAffiliates(available_affiliates);

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

  const handleConnect = async (partnerId: string) => {
    if (!saasId) return;
    setConnectingId(partnerId);
    try {
        const { error } = await supabase
            .from('partnerships')
            .insert({
                saas_id: saasId,
                partner_id: partnerId,
                status: 'pending' // Or 'active' if instant approval is desired, keeping pending for consistency
            });
        
        if (error) throw error;

        // Move from available to my affiliates
        const partner = availableAffiliates.find(p => p.id === partnerId);
        if (partner) {
            setAvailableAffiliates(prev => prev.filter(p => p.id !== partnerId));
            setMyAffiliates(prev => [...prev, partner]);
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
          <h2 className="text-3xl font-bold tracking-tight text-white">Affiliate Directory</h2>
          <p className="text-zinc-400">Find and recruit the perfect partners for your SaaS.</p>
        </div>
      </div>

      {/* SEARCH (Global) */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search affiliates..."
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-500"
          />
        </div>
        <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* SECTION 1: MY AFFILIATES */}
      {myAffiliates.length > 0 && (
          <div className="space-y-6">
              <h3 className="text-2xl font-bold text-indigo-400">My Affiliates</h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myAffiliates.map((partner) => (
                  <Card key={partner.id} className="border-indigo-500/20 bg-indigo-500/5 backdrop-blur overflow-hidden">
                    {/* Avatar Banner */}
                    <div className="h-40 w-full bg-zinc-900/50 flex items-center justify-center border-b border-indigo-500/10 relative group-hover:bg-zinc-900/70 transition-colors">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                       {partner.avatar_url ? (
                           <img src={partner.avatar_url} alt={partner.full_name} className="h-full w-full object-cover" /> 
                       ) : (
                           <span className="text-4xl font-bold text-zinc-700">{partner.full_name?.substring(0,2) || "??"}</span>
                       )}
                    </div>

                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <span className="rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-medium text-green-400 border border-green-500/20 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Partner
                        </span>
                      </div>
                      <CardTitle className="text-xl text-white">{partner.full_name}</CardTitle>
                      <CardDescription>{partner.promotion_platform} • {partner.country}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-zinc-400 flex flex-col gap-1">
                         <div>Audience: <span className="text-white font-medium">{partner.audience_size}</span></div>
                         <div>Niche: <span className="text-white font-medium">{partner.niche}</span></div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="secondary" className="w-full">Manage Partner</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
          </div>
      )}

      {/* SECTION 2: FIND AFFILIATES */}
      <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Find Affiliates</h3>
          
          {availableAffiliates.length === 0 ? (
              <div className="text-zinc-500 text-center py-10 bg-zinc-900/50 rounded-lg border border-zinc-800">
                  No new affiliates found matching your criteria.
              </div>
          ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {availableAffiliates.map((partner) => (
                  <Card key={partner.id} className="border-white/10 bg-white/5 backdrop-blur transition-all hover:bg-white/10 hover:border-indigo-500/50 overflow-hidden">
                    {/* Avatar Banner */}
                    <div className="h-40 w-full bg-zinc-900/50 flex items-center justify-center border-b border-white/5 relative group-hover:bg-zinc-900/70 transition-colors">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                       {partner.avatar_url ? (
                           <img src={partner.avatar_url} alt={partner.full_name} className="h-full w-full object-cover" /> 
                       ) : (
                           <span className="text-4xl font-bold text-zinc-700">{partner.full_name?.substring(0,2) || "??"}</span>
                       )}
                    </div>

                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        {partner.platform_url && (
                             <a href={partner.platform_url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline z-10">
                                View Channel
                             </a>
                        )}
                      </div>
                      <CardTitle className="text-xl text-white">{partner.full_name}</CardTitle>
                      <CardDescription>{partner.promotion_platform} • {partner.country}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-zinc-400 flex flex-col gap-1">
                         <div>Audience: <span className="text-white font-medium">{partner.audience_size}</span></div>
                         <div>Niche: <span className="text-white font-medium">{partner.niche}</span></div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => handleConnect(partner.id)}
                        disabled={connectingId === partner.id}
                        className="w-full bg-white text-black hover:bg-zinc-200 font-semibold"
                      >
                         {connectingId === partner.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><UserPlus className="w-4 h-4 mr-2"/> Recruit</>}
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
