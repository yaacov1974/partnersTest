import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function AffiliateChatPage() {
  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      <Card className="w-80 border-white/10 bg-white/5 backdrop-blur flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h3 className="font-semibold text-white">Messages</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg p-3 hover:bg-white/5 cursor-pointer">
              <div className="h-10 w-10 rounded-full bg-zinc-800" />
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">SaaS Company {i}</span>
                  <span className="text-xs text-zinc-500">Yesterday</span>
                </div>
                <p className="truncate text-sm text-zinc-400">Your application has been approved!</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="flex-1 border-white/10 bg-white/5 backdrop-blur flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-zinc-800" />
          <div>
            <h3 className="font-semibold text-white">Acme SaaS</h3>
            <span className="text-xs text-zinc-500">Offline</span>
          </div>
        </div>
        
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <div className="flex justify-start">
            <div className="rounded-lg bg-zinc-800 px-4 py-2 text-white max-w-[80%]">
              Welcome to the program! Here are your assets.
            </div>
          </div>
          <div className="flex justify-end">
            <div className="rounded-lg bg-primary px-4 py-2 text-white max-w-[80%]">
              Thanks! I'll start promoting today.
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10">
          <form className="flex gap-2">
            <Input 
              placeholder="Type a message..." 
              className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500"
            />
            <Button size="icon" className="bg-primary hover:bg-primary/90">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
