import { CinematicBackground } from '@/components/features/CinematicBackground';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Shield, Crown, Package, Zap, ExternalLink, Shirt, Car, Hammer } from 'lucide-react';
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
      title: "Equipment & Supplies",
      icon: <Shirt className="w-8 h-8 text-emerald-500" />,
      description: "Gear up for survival with premium clothing and essential items.",
      price: "From $5 USD",
      features: [
        "DayZ Clothing",
        "DayZ Items",
        "Sci-Fi Gear",
        "Sci-Fi Items"
      ],
      classes: {
        border: "hover:border-emerald-500/30",
        gradient: "from-emerald-500/5",
        iconBox: "bg-emerald-900/20 border-emerald-500/20",
        price: "text-emerald-400",
        bullet: "bg-emerald-500",
        button: "bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-500/20"
      }
    },
    {
      title: "Transport",
      icon: <Car className="w-8 h-8 text-amber-500" />,
      description: "Traverse the map in style with our selection of vehicles.",
      price: "From $15 USD",
      features: [
        "Sci-Fi Vehicles",
        "Helicopters",
        "Vehicle Insurance"
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
      title: "Territories",
      icon: <Hammer className="w-8 h-8 text-red-500" />,
      description: "Establish your dominance with custom bases and secure compounds.",
      price: "From $50 USD",
      features: [
        "Custom Bases",
        "Sci-Fi Bases"
      ],
      classes: {
        border: "hover:border-red-500/30",
        gradient: "from-red-500/5",
        iconBox: "bg-red-900/20 border-red-500/20",
        price: "text-red-400",
        bullet: "bg-red-500",
        button: "bg-red-600 hover:bg-red-500 hover:shadow-red-500/20"
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

        {/* Donation Info & Payment Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* Info Card */}
            <Card className="p-8 bg-neutral-900/60 border-neutral-800 flex flex-col backdrop-blur-md">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Shield className="text-red-500 w-6 h-6" />
                    Important Information
                </h3>
                
                <div className="space-y-8 text-neutral-300">
                    <div className="bg-neutral-950/50 border border-neutral-800/50 p-5 rounded-xl">
                        <strong className="text-emerald-400 block mb-2 text-lg">Server Configuration</strong>
                        <p className="text-neutral-300 leading-relaxed">
                            <span className="text-white font-semibold">Player vs Environment (PvE) Only.</span> Player-to-player damage is globally disabled across all our servers. Equipment and vehicles purchased here are intended for use against environmental threats and AI challenges.
                        </p>
                    </div>

                    <div className="bg-red-900/20 border border-red-500/20 p-5 rounded-xl">
                        <strong className="text-red-400 block mb-2 text-lg">Wipe Rollover Policy</strong>
                        <p className="text-neutral-300 leading-relaxed">
                            Donation items last a full wipe. If you donate for something in the <span className="text-white font-semibold">last month before a wipe</span>, 
                            it will roll over to the new wipe automatically.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <strong className="text-white block text-lg">Flexible Support</strong>
                        <p className="text-neutral-400 leading-relaxed">
                            If you can't make a large donation, any small donation is appreciated! We can still offer you something, 
                            so just make a ticket in #support with what you want. Items can be claimed across all servers.
                        </p>
                    </div>
                    
                    <div className="space-y-2">
                        <strong className="text-white block text-lg">Server Maintenance</strong>
                        <p className="text-neutral-400 leading-relaxed">
                            We want everyone to have fun and enjoy the server! All donations go directly back into 
                            keeping the server running, maintained, and funding new mods.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Payment & Steps Card */}
            <Card className="p-8 bg-neutral-900/60 border-neutral-800 flex flex-col backdrop-blur-md">
                 <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Crown className="text-amber-500 w-6 h-6" />
                    Payment Methods
                </h3>

                <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <Zap size={48} />
                    </div>
                    <h4 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                        <span className="animate-pulse w-2 h-2 rounded-full bg-amber-500"></span>
                        Proof of Purchase
                    </h4>
                    <p className="text-neutral-300 text-sm leading-relaxed mb-3">
                        <strong className="text-white">Always open a ticket when you purchase.</strong>
                        <br />
                        No matter which payment method you use, opening a ticket helps admins verify your transaction immediately.
                    </p>
                    <div className="flex items-start gap-2 text-xs text-neutral-400 bg-black/20 p-2 rounded">
                        <span className="text-amber-500 mt-0.5">ℹ</span>
                        <span>A screenshot of the transaction is highly encouraged to make the process smoother.</span>
                    </div>
                </div>

                <div className="space-y-6 mb-8">
                     <div className="p-5 bg-neutral-800/50 rounded-xl border border-neutral-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-bl-lg">Preferred</div>
                        <div className="text-xs uppercase tracking-widest text-neutral-500 mb-2">PayPal (Friends & Family)</div>
                        <div className="font-mono text-amber-400 text-lg md:text-xl select-all break-all cursor-pointer hover:text-amber-300 transition-colors">
                            Joelmarq1559@icloud.com
                        </div>
                     </div>

                     <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/30">
                        <div className="font-bold text-white mb-1">Other Options</div>
                        <p className="text-neutral-400 text-sm">
                            Cash App, Zelle, Venmo, etc. available upon request. Please open a ticket in #support.
                        </p>
                     </div>
                </div>

                <div className="mt-auto pt-6 border-t border-neutral-800">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        How to Donate
                    </h4>
                     <ol className="space-y-3 text-neutral-400 text-sm mb-6 pl-2">
                        <li className="flex gap-3">
                            <span className="font-mono text-neutral-600 font-bold">01</span>
                            <span>Join our Discord server</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-mono text-neutral-600 font-bold">02</span>
                            <span>Open a ticket in <span className="text-amber-500">#support</span></span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-mono text-neutral-600 font-bold">03</span>
                            <span>Mention your desired items and payment method</span>
                        </li>
                    </ol>

                    <Link href={DISCORD_LINK} target="_blank" className="block">
                        <Button size="lg" className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white border-none py-6 text-lg font-bold shadow-xl shadow-indigo-500/10">
                        <span className="mr-2">Open Ticket on Discord</span>
                        <ExternalLink size={20} />
                        </Button>
                    </Link>
                    <p className="text-center mt-3 text-xs text-neutral-600">
                        Secure transaction handling via Discord support tickets
                    </p>
                </div>
            </Card>
        </div>

      </div>
    </CinematicBackground>
  );
}
