"use client";

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Shield, Zap, Users, Code, Globe, Headphones } from 'lucide-react';
import { Reveal3D } from '@/components/motion/Reveal3D';
import { TiltCard } from '@/components/motion/TiltCard';
import { TextReveal } from '@/components/motion/TextReveal';
import { ParallaxLayer } from '@/components/motion/ParallaxLayer';

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
    <section aria-labelledby="why-choose-cdn-heading" className="py-12 sm:py-16 bg-stone-50 dark:bg-neutral-950 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />

      {/* Parallax ambience drifting behind the grid */}
      <ParallaxLayer speed={-90} className="absolute -top-32 left-1/2 -translate-x-1/2 w-[60rem] h-[60rem] pointer-events-none">
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.07),transparent_60%)]" />
      </ParallaxLayer>

      <div className="container px-4 sm:px-6 mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-10">
          <Reveal3D from="up" tilt={10} duration={0.6}>
            <div className="flex flex-col items-center gap-2 mb-4">
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-red-500/80">05 // Doctrine</span>
              <Badge variant="outline" className="border-red-500/35 text-red-700 dark:text-red-400 bg-red-500/12 dark:bg-red-900/10 backdrop-blur-sm px-4 py-1">
                Why Choose CDN
              </Badge>
            </div>
          </Reveal3D>
          <h2 id="why-choose-cdn-heading" className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-5">
            <TextReveal>
              Designed for the <span className="text-gray-400 dark:text-neutral-500">Dedicated</span>
            </TextReveal>
          </h2>
          <Reveal3D from="up" delay={0.2} duration={0.6}>
            <p className="text-gray-600 dark:text-neutral-400 max-w-2xl text-base sm:text-lg">
              We dont just host servers; we craft experiences. Every mod, every rule, and every event is designed to enhance your survival journey.
            </p>
          </Reveal3D>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Reveal3D
              key={feature.title}
              from={index % 3 === 0 ? 'left' : index % 3 === 2 ? 'right' : 'up'}
              delay={(index % 3) * 0.1}
              className="h-full"
            >
              <TiltCard intensity={8}>
                <Card
                  variant="outline"
                  className="p-5 sm:p-8 group relative overflow-hidden border-gray-200 dark:border-neutral-800/50 hover:border-red-500/20 transition-all duration-300 h-full hud-corners"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div style={{ transform: 'translateZ(22px)' }}>
                    <div className={`p-3 rounded-lg bg-gray-200/70 dark:bg-white/5 w-fit mb-6 ${feature.color}`}>
                      <feature.icon size={24} />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </TiltCard>
            </Reveal3D>
          ))}
        </div>
      </div>
    </section>
  );
}
