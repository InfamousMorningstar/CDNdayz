"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  Car,
  ExternalLink,
  Hammer,
  Package,
  Shield,
  Shirt,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  DISCORD_CUSTOM_BASES_CHANNEL_URL,
  DISCORD_DAYZ_CLOTHING_CHANNEL_URL,
  DISCORD_DAYZ_VEHICLES_CHANNEL_URL,
  DISCORD_ITEMS_CHANNEL_URL,
  DISCORD_SCIFI_BASE_ITEMS_CHANNEL_URL,
  DISCORD_SCIFI_GEAR_CHANNEL_URL,
  DISCORD_STORE_CHANNEL_URL,
} from '@/lib/links';
import { cn } from '@/lib/utils';

type StoreTab = {
  id: string;
  label: string;
  title: string;
  description: string;
  channelUrl: string;
  accent: string;
  icon: React.ReactNode;
  examples: string[];
};

const STORE_TABS: StoreTab[] = [
  {
    id: 'dayz-clothing',
    label: 'DayZ Clothing',
    title: 'DayZ Clothing',
    description: 'Premium survivor outfits and apparel bundles for standard DayZ loadouts.',
    channelUrl: DISCORD_DAYZ_CLOTHING_CHANNEL_URL,
    accent: 'text-emerald-300 border-emerald-500/20 bg-emerald-950/15',
    icon: <Shirt className="w-5 h-5 text-emerald-400" />,
    examples: ['Civilian outfits', 'Military apparel', 'Cold-weather kits', 'Roleplay-ready sets'],
  },
  {
    id: 'dayz-vehicles',
    label: 'DayZ Vehicles',
    title: 'DayZ Vehicles',
    description: 'Standard transport options for faster movement, convoy setups, and utility runs.',
    channelUrl: DISCORD_DAYZ_VEHICLES_CHANNEL_URL,
    accent: 'text-amber-300 border-amber-500/20 bg-amber-950/15',
    icon: <Car className="w-5 h-5 text-amber-400" />,
    examples: ['Utility vehicles', 'Convoy-ready rides', 'Supply run transport', 'Map traversal setups'],
  },
  {
    id: 'items',
    label: 'Items',
    title: 'Items',
    description: 'Core survival equipment and supply packages tailored to your playstyle.',
    channelUrl: DISCORD_ITEMS_CHANNEL_URL,
    accent: 'text-cyan-300 border-cyan-500/20 bg-cyan-950/15',
    icon: <Package className="w-5 h-5 text-cyan-400" />,
    examples: ['Medical supplies', 'Base essentials', 'Starter utility kits', 'General loot packages'],
  },
  {
    id: 'custom-bases',
    label: 'Custom Bases',
    title: 'Custom Bases',
    description: 'Purpose-built compounds and defended locations created around your server plans.',
    channelUrl: DISCORD_CUSTOM_BASES_CHANNEL_URL,
    accent: 'text-rose-300 border-rose-500/20 bg-rose-950/15',
    icon: <Hammer className="w-5 h-5 text-rose-400" />,
    examples: ['Starter compounds', 'Expanded safe zones', 'Team bases', 'Custom layout requests'],
  },
  {
    id: 'scifi-gear',
    label: 'Sci-Fi Gear',
    title: 'Sci-Fi Gear',
    description: 'Specialized futuristic gear sets for sci-fi themed servers and character builds.',
    channelUrl: DISCORD_SCIFI_GEAR_CHANNEL_URL,
    accent: 'text-violet-300 border-violet-500/20 bg-violet-950/15',
    icon: <Sparkles className="w-5 h-5 text-violet-400" />,
    examples: ['Sci-fi armor', 'Advanced weapon kits', 'Themed utility gear', 'Faction-style loadouts'],
  },
  {
    id: 'scifi-base-items',
    label: 'Sci-Fi Base Items',
    title: 'Sci-Fi Base Items',
    description: 'Futuristic structures, props, and specialty base pieces for themed builds.',
    channelUrl: DISCORD_SCIFI_BASE_ITEMS_CHANNEL_URL,
    accent: 'text-sky-300 border-sky-500/20 bg-sky-950/15',
    icon: <Shield className="w-5 h-5 text-sky-400" />,
    examples: ['Sci-fi base props', 'Defensive structures', 'Theme expansion pieces', 'Custom base item requests'],
  },
];

export function StoreCatalogTabs() {
  const [activeTab, setActiveTab] = useState<string>(STORE_TABS[0].id);
  const current = STORE_TABS.find((tab) => tab.id === activeTab) ?? STORE_TABS[0];

  return (
    <Card className="max-w-6xl mx-auto mb-10 sm:mb-16 p-4 sm:p-6 bg-neutral-900/50 border-neutral-800 backdrop-blur-md">
      <div className="flex flex-col gap-4 sm:gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-500">Store Catalog</p>
            <p className="mt-1 text-sm text-neutral-400">
              Browse categories, then open a ticket with exactly what you want.
            </p>
          </div>

          <Link href={current.channelUrl || DISCORD_STORE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="sm:min-w-[220px]">
            <Button size="default" className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white border-none">
              <span className="mr-2">Open Ticket</span>
              <ExternalLink size={16} />
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="flex min-w-max gap-2">
            {STORE_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                  activeTab === tab.id
                    ? 'border-amber-500/35 bg-amber-500/10 text-white'
                    : 'border-white/10 bg-black/25 text-neutral-400 hover:border-white/20 hover:text-white',
                )}
                aria-pressed={activeTab === tab.id}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-black/20 p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className={cn('inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm', current.accent)}>
                {current.icon}
                <span>{current.title}</span>
              </div>

              <p className="mt-4 text-base text-neutral-300 leading-relaxed">
                {current.description}
              </p>
            </div>

            <Link href={current.channelUrl || DISCORD_STORE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="lg:min-w-[220px]">
              <Button variant="outline" className="w-full">
                Request This Category
              </Button>
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {current.examples.map((example) => (
              <div key={example} className="rounded-xl border border-white/5 bg-neutral-950/40 px-4 py-3 text-sm text-neutral-300">
                {example}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}