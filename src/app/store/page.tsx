import { CinematicBackground } from '@/components/features/CinematicBackground';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Shield, Crown, Package, Zap, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Store | CDN',
  description: 'Support the server and get exclusive perks. All donations go directly to server upkeep and development.',
};

const DISCORD_LINK = "https://discord.gg/2Wf3N6r9kR"; // Using the Discord link from footer/context

export default function StorePage() {
  const categories = [
    {
      title: "Priority Queue",
      icon: <Zap className="w-8 h-8 text-amber-500" />,
      description: "Skip the line and get into the action instantly. Essential for peak hours.",
      price: "From $10/mo",
      features: [
        "Instant server access",
        "Reserved slot",
        "Discord Role",
        "Supporter Chat Access"
      ],
      classes: {
        border: "hover:border-amber-500/30",
        gradient: "from-amber-500/5",
        iconBox: "bg-amber-900/20 border-amber-500/20",
        price: "text-amber-400",
        bullet: "bg-amber-500",
        button: "bg-amber-600 hover:bg-amber-500 hover:shadow-amber-500/20"
      }
    },
    {
      title: "Custom Bases",
      icon: <Shield className="w-8 h-8 text-red-500" />,
      description: "Secure your legacy with a professionally built custom base or compound.",
      price: "From $25",
      features: [
        "NPC Guard option",
        "Custom Layout",
        "Map Marker",
        "Safe Zone Radius"
      ],
      classes: {
        border: "hover:border-red-500/30",
        gradient: "from-red-500/5",
        iconBox: "bg-red-900/20 border-red-500/20",
        price: "text-red-400",
        bullet: "bg-red-500",
        button: "bg-red-600 hover:bg-red-500 hover:shadow-red-500/20"
      }
    },
    {
      title: "Loadout Kits",
      icon: <Package className="w-8 h-8 text-emerald-500" />,
      description: "Start your wipe with the gear you need to survive and thrive.",
      price: "From $5",
      features: [
        "Weapons Cases",
        "Building Supplies",
        "Medical Crates",
        "Vehicle Spawns"
      ],
      classes: {
        border: "hover:border-emerald-500/30",
        gradient: "from-emerald-500/5",
        iconBox: "bg-emerald-900/20 border-emerald-500/20",
        price: "text-emerald-400",
        bullet: "bg-emerald-500",
        button: "bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-500/20"
      }
    }
  ];

  return (
    <CinematicBackground>
      <div className="min-h-screen pt-32 pb-20 container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <Badge variant="outline" className="mb-4 border-amber-500/30 text-amber-400 bg-amber-900/10 backdrop-blur-sm px-4 py-1">
            Server Support
          </Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
            Donation <span className="text-amber-500">Store</span>
          </h1>
          <p className="text-neutral-400 max-w-2xl text-lg font-sans">
            Support the CDN community and receive exclusive in-game rewards. 
            All transactions are handled securely through our Discord ticket system to ensure you get exactly what you want.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {categories.map((item, index) => (
            <Card key={index} className={`p-8 bg-neutral-900/40 border-neutral-800 transition-all group relative overflow-hidden flex flex-col ${item.classes.border}`}>
              {/* Hover Effect Background */}
              <div className={`absolute inset-0 bg-gradient-to-b to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${item.classes.gradient}`} />
              
              <div className="relative z-10 flex-1 flex flex-col">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border ${item.classes.iconBox}`}>
                  {item.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                <div className={`text-xl font-mono mb-4 ${item.classes.price}`}>{item.price}</div>
                <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
                  {item.description}
                </p>

                <ul className="space-y-3 mb-8 flex-1">
                  {item.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-neutral-300 text-sm">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.classes.bullet}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href={DISCORD_LINK} target="_blank" className="w-full">
                  <Button className={`w-full text-white border-0 transition-all shadow-lg ${item.classes.button}`}>
                    <span className="mr-2">Get on Discord</span>
                    <ExternalLink size={16} />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ / Discord Redirect Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 md:p-12 bg-neutral-900/60 border-neutral-800 relative overflow-hidden text-center">
            <div className="relative z-10">
              <h2 className="text-3xl font-heading font-bold text-white mb-4">How to Purchase</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left my-8">
                <div className="relative pl-6 border-l border-neutral-800">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-neutral-700" />
                  <h4 className="text-white font-bold mb-2">1. Join Discord</h4>
                  <p className="text-sm text-neutral-400">Join our community Discord server where all support tickets are handled.</p>
                </div>
                <div className="relative pl-6 border-l border-neutral-800">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-neutral-700" />
                  <h4 className="text-white font-bold mb-2">2. Open Ticket</h4>
                  <p className="text-sm text-neutral-400">Navigate to the #donation-support channel and click "Create Ticket".</p>
                </div>
                <div className="relative pl-6 border-l border-neutral-800">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-neutral-700" />
                  <h4 className="text-white font-bold mb-2">3. Receive Item</h4>
                  <p className="text-sm text-neutral-400">Admins will process your request and grant your in-game items instantly.</p>
                </div>
              </div>

              <Link href={DISCORD_LINK} target="_blank">
                <Button size="lg" className="bg-[#5865F2] hover:bg-[#4752C4] text-white border-none px-8 py-6 text-lg">
                  <span className="mr-2">Open Discord Store</span>
                  <ExternalLink size={20} />
                </Button>
              </Link>
              <p className="mt-4 text-xs text-neutral-500">
                You will be redirected to the official CDN Discord server.
              </p>
            </div>
          </Card>
        </div>

      </div>
    </CinematicBackground>
  );
}
