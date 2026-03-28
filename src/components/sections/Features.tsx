"use client";

import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { Shield, Zap, Users, Code, Globe, Headphones } from 'lucide-react';

const features = [
  {
    title: 'Zero Toxicity',
    description: 'Strictly monitored PvE environment where griefing and harassment are not tolerated.',
    icon: Shield,
    color: 'text-red-400',
  },
  {
    title: 'Custom Economy',
    description: 'Balanced trader system with dynamic pricing and rare loot opportunities.',
    icon: Zap,
    color: 'text-amber-400',
  },
  {
    title: 'Thriving Community',
    description: 'Join thousands of survivors in our Discord. Friendly, helpful, and active.',
    icon: Users,
    color: 'text-sky-400',
  },
  {
    title: 'Premium Mods',
    description: 'Only the best, most stable mods. Custom developed features unique to CDN.',
    icon: Code,
    color: 'text-purple-400',
  },
  {
    title: 'Diverse Playstyles',
    description: 'Experience everything from Hardcore survival and Sci-Fi adventures to Noob-friendly servers.',
    icon: Globe,
    color: 'text-rose-400',
  },
  {
    title: 'Active Support',
    description: 'Dedicated staff and helpful community members ready to assist you in-game and on Discord 24/7.',
    icon: Headphones,
    color: 'text-indigo-400',
  },
];

export function Features() {
  return (
    <section aria-labelledby="why-choose-cdn-heading" className="py-24 bg-neutral-950 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
      
      <div className="container px-6 mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-red-500 font-mono text-sm tracking-widest uppercase mb-4">Why Choose CDN</span>
          <h2 id="why-choose-cdn-heading" className="text-3xl md:text-5xl font-bold text-white mb-6">Designed for the <span className="text-neutral-500">Dedicated</span></h2>
          <p className="text-neutral-400 max-w-2xl text-lg">
            We don't just host servers; we craft experiences. Every mod, every rule, and every event is designed to enhance your survival journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              variant="outline"
              className="p-8 group relative overflow-hidden border-neutral-800/50 hover:border-red-500/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className={`p-3 rounded-lg bg-white/5 w-fit mb-6 ${feature.color}`}>
                <feature.icon size={24} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">{feature.title}</h3>
              <p className="text-neutral-400 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
