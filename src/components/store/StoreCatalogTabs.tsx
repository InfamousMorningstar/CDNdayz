"use client";

import { useState } from 'react';
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
import { DiscordLink } from '@/components/ui/DiscordLink';
import {
  DISCORD_CUSTOM_BASES_CHANNEL_URL,
  DISCORD_DAYZ_CLOTHING_CHANNEL_URL,
  DISCORD_DAYZ_VEHICLES_CHANNEL_URL,
  DISCORD_ITEMS_CHANNEL_URL,
  DISCORD_SCIFI_BASE_ITEMS_CHANNEL_URL,
  DISCORD_SCIFI_GEAR_CHANNEL_URL,
} from '@/lib/links';
import { cn } from '@/lib/utils';

type StoreTab = {
  id: string;
  label: string;
  title: string;
  description: string;
  channelUrl: string;
  ref: string;
  icon: React.ReactNode;
};

const STORE_TABS: StoreTab[] = [
  {
    id: 'dayz-clothing',
    label: 'DayZ Clothing',
    title: 'DayZ Clothing',
    description: 'Premium survivor outfits and apparel bundles for standard DayZ loadouts.',
    channelUrl: DISCORD_DAYZ_CLOTHING_CHANNEL_URL,
    ref: 'REF. 01',
    icon: <Shirt className="w-5 h-5 text-[#d4b06a]" />,
  },
  {
    id: 'dayz-vehicles',
    label: 'DayZ Vehicles',
    title: 'DayZ Vehicles',
    description: 'Standard transport options for faster movement, convoy setups, and utility runs.',
    channelUrl: DISCORD_DAYZ_VEHICLES_CHANNEL_URL,
    ref: 'REF. 02',
    icon: <Car className="w-5 h-5 text-[#d4b06a]" />,
  },
  {
    id: 'items',
    label: 'Items',
    title: 'Items',
    description: 'Core survival equipment and supply packages tailored to your playstyle.',
    channelUrl: DISCORD_ITEMS_CHANNEL_URL,
    ref: 'REF. 03',
    icon: <Package className="w-5 h-5 text-[#d4b06a]" />,
  },
  {
    id: 'custom-bases',
    label: 'Custom Bases',
    title: 'Custom Bases',
    description: 'Purpose-built compounds and defended locations created around your server plans.',
    channelUrl: DISCORD_CUSTOM_BASES_CHANNEL_URL,
    ref: 'REF. 04',
    icon: <Hammer className="w-5 h-5 text-[#d4b06a]" />,
  },
  {
    id: 'scifi-gear',
    label: 'Sci-Fi Gear',
    title: 'Sci-Fi Gear',
    description: 'Specialized futuristic gear sets for sci-fi themed servers and character builds.',
    channelUrl: DISCORD_SCIFI_GEAR_CHANNEL_URL,
    ref: 'REF. 05',
    icon: <Sparkles className="w-5 h-5 text-[#d4b06a]" />,
  },
  {
    id: 'scifi-base-items',
    label: 'Sci-Fi Base Items',
    title: 'Sci-Fi Base Items',
    description: 'Futuristic structures, props, and specialty base pieces for themed builds.',
    channelUrl: DISCORD_SCIFI_BASE_ITEMS_CHANNEL_URL,
    ref: 'REF. 06',
    icon: <Shield className="w-5 h-5 text-[#d4b06a]" />,
  },
];

export function StoreCatalogTabs() {
  const [activeTab, setActiveTab] = useState<string>(STORE_TABS[0].id);
  const current = STORE_TABS.find((tab) => tab.id === activeTab) ?? STORE_TABS[0];

  return (
    <Card className="max-w-6xl mx-auto mb-10 sm:mb-16 p-4 sm:p-6 bg-gradient-to-b from-white to-gray-50 dark:from-[#161616] dark:to-[#0f0f0f] border-gray-200 dark:border-[#2a2a2a] backdrop-blur-md overflow-hidden relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4b06a]/60 to-transparent" />
      <div className="relative z-10 flex flex-col gap-5 sm:gap-6">
        <div className="space-y-1.5">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-gray-400 dark:text-[#8d8d8d]">Maison CDN</p>
          <p className="text-lg sm:text-xl font-serif text-gray-900 dark:text-[#f4f1ea] tracking-wide">
            Store Catalog
          </p>
          <p className="text-sm text-gray-500 dark:text-neutral-400">
            Choose a category, then open a ticket from the main store button above.
          </p>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="flex min-w-max gap-2">
            {STORE_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'rounded-md border px-4 py-2 text-xs uppercase tracking-[0.14em] font-medium transition-colors',
                  activeTab === tab.id
                    ? 'border-[#d4b06a]/65 bg-[#d4b06a]/10 text-gray-900 dark:text-[#f4f1ea]'
                    : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/25 text-gray-400 dark:text-neutral-500 hover:border-gray-400 dark:hover:border-white/20 hover:text-gray-700 dark:hover:text-neutral-200',
                )}
                aria-pressed={activeTab === tab.id}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-[#2c2c2c] bg-gradient-to-br from-gray-50 to-white dark:bg-[linear-gradient(160deg,#141414_0%,#0b0b0b_100%)] p-5 sm:p-7 shadow-[inset_0_1px_0_rgba(212,176,106,0.15)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-md border border-[#d4b06a]/35 bg-[#d4b06a]/10 px-3 py-1.5 text-sm text-[#ecd8ae]">
              {current.icon}
              <span>{current.title}</span>
            </div>

            <p className="text-[11px] uppercase tracking-[0.2em] text-amber-700 dark:text-[#8f7a4d]">{current.ref}</p>

            <p className="text-base text-gray-600 dark:text-neutral-300 leading-relaxed max-w-xl">
              {current.description}
            </p>
            </div>

            <DiscordLink href={current.channelUrl} className="lg:min-w-[220px]">
              <Button variant="outline" className="w-full !rounded-md border-[#d4b06a]/45 text-[#e8d5ad] hover:bg-[#d4b06a]/10 hover:border-[#d4b06a]/70">
                <span className="mr-2">Request This Category</span>
                <ExternalLink size={16} />
              </Button>
            </DiscordLink>
          </div>
        </div>
      </div>
    </Card>
  );
}