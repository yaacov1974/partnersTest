import Link from "next/link";

export function SimpleHeader() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
      <div className="container mx-auto flex h-16 items-center justify-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-white">P</span>
          </span>
          <span className="text-xl font-bold tracking-tight text-white">Partnerz.ai</span>
        </Link>
      </div>
    </nav>
  );
}
