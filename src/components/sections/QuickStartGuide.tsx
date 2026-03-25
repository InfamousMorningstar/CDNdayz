"use client";

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Download, Search, Play, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const steps = [
  {
    step: "01",
    title: "Get DayZ",
    description: "Purchase DayZ on Steam if you haven't already. Ensure you have the Livonia DLC for our Livonia servers.",
    icon: Download,
    action: { label: "Steam Store", url: "https://store.steampowered.com/app/221100/DayZ/" }
  },
  {
    step: "02",
    title: "Download Launcher",
    description: "We recommend using the DZSA Launcher for easy mod management and server discovery.",
    icon: Search,
    action: { label: "Get DZSA", url: "https://dayzsalauncher.com/#/home" }
  },
  {
    step: "03",
    title: "Join CDN",
    description: "Search for 'CDN' in the launcher filter to see our full list of modded PvE servers. Choose your map and join the action.",
    icon: Play,
    action: { label: "View Server List", url: "/servers", internal: true }
  }
];

export function QuickStartGuide() {
  return (
    <section className="py-20 bg-neutral-950 border-t border-white/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950 opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Start Your <span className="text-red-500">Journey</span></h2>
            <p className="text-neutral-400 text-lg max-w-2xl">
              From fresh spawn to veteran survivor in three simple steps. No complex whitelist application required.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full bg-neutral-900/40 border-neutral-800 hover:border-red-500/30 transition-all duration-300 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="text-8xl font-bold font-mono text-white tracking-tighter stroke-neutral-800">{item.step}</span>
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                    <item.icon size={28} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-neutral-400 mb-8 leading-relaxed flex-grow">
                    {item.description}
                  </p>
                  
                  {item.action.internal ? (
                     <Button variant="outline" className="w-full justify-between group/btn" asChild>
                        <Link href={item.action.url}>
                           {item.action.label} <ArrowRight size={16} className="text-red-500 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                     </Button>
                  ) : (
                     <Button variant="outline" className="w-full justify-between group/btn" onClick={() => window.open(item.action.url, '_blank')}>
                        {item.action.label} <ExternalLink size={16} className="text-neutral-500 group-hover/btn:text-white transition-colors" />
                     </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}