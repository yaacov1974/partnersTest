import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SaaSSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Settings</h2>
        <p className="text-zinc-400">Manage your account and preferences.</p>
      </div>

      <Card className="border-white/10 bg-white/5 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white">Profile</CardTitle>
          <CardDescription>Update your company information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-white">Company Name</label>
            <Input className="bg-white/5 border-white/10 text-white" defaultValue="Acme Inc" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-white">Website</label>
            <Input className="bg-white/5 border-white/10 text-white" defaultValue="https://acme.inc" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-white">Description</label>
            <textarea 
              className="flex min-h-[80px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue="The best SaaS for..."
            />
          </div>
          <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
