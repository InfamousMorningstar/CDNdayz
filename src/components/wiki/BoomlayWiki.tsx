import Link from 'next/link';
import {
  AlertTriangle,
  Archive,
  Bed,
  Box,
  Coffee,
  CloudRain,
  Flame,
  Hammer,
  Lamp,
  LampDesk,
  Layers,
  Lightbulb,
  Package,
  Refrigerator,
  Sofa,
  Sprout,
  Sun,
  Table,
  Trash2,
  Wrench,
  Youtube,
  ExternalLink,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

type BoomCategory =
  | 'Base Kit'
  | 'Furniture'
  | 'Storage'
  | 'Utility / Mechanics'
  | 'Lighting'
  | 'Power';

type BoomEntry = {
  name: string;
  icon: typeof Hammer;
  category: BoomCategory;
  recipe: string;
  tool?: string;
  notes: string;
};

// All crafting data below is sourced from BoomLay's own pinned "Crafting" guide and the
// mod's Steam Workshop description. See the Sources & Citations section at the bottom.
const entries: BoomEntry[] = [
  {
    name: 'Wooden Pallet',
    icon: Layers,
    category: 'Base Kit',
    recipe: 'Planks + Nails',
    notes:
      'The core building block of the whole mod. Pallets can be found in the world or crafted, and can be broken back down into Planks and Nails. Almost every Kit is built around pallets.',
  },
  {
    name: 'Furniture Kit (Base)',
    icon: Hammer,
    category: 'Base Kit',
    recipe: '1 Wooden Pallet + 5 Planks',
    notes:
      'Crafts the basic Kits: Table Kit, Cabinet Kit, Bed Kit, Sofa Kit, Box Kit and Special Kit. Each Kit has "pallet slots" — the number of pallets you load decides which Thing you can place.',
  },
  {
    name: 'Table Kit',
    icon: Table,
    category: 'Furniture',
    recipe: '1 Pallet = Small table · 2 Pallets = Medium table · 3 Pallets = Large table',
    notes: 'Add pallets to the Kit to scale the table size you can place.',
  },
  {
    name: 'Bed Kit',
    icon: Bed,
    category: 'Furniture',
    recipe: '3 Pallets = Small bed · 4 Pallets = Large bed',
    notes: 'A simple sleeping/decor furniture piece.',
  },
  {
    name: 'Sofa Kit',
    icon: Sofa,
    category: 'Furniture',
    recipe: '2 Pallets = Small sofa · 3 Pallets = Medium sofa · 4 Pallets = Large sofa',
    notes:
      'BoomLay flagged the original Sofa Kit as bugged in the crafting guide. A community fix mod and a separate sofas mod have since been shared in the comments — check with your server owner before relying on it.',
  },
  {
    name: 'Cabinet Kit',
    icon: Archive,
    category: 'Storage',
    recipe:
      '1 Pallet = Pallet Shelf (holds up to 3 wooden crates) · 2 Pallets = Gun Cabinet · 3 Pallets = Medium Cabinet · 4 Pallets = Large Cabinet',
    notes:
      'The Medium Cabinet needs an Old Wooden Crate, crafted from 10 Planks + 16 Nails. Great for organized storage.',
  },
  {
    name: 'Box Kit',
    icon: Box,
    category: 'Storage',
    recipe: 'Insert Pallet Frames (max 4) — each Frame = 4 Planks + 24 Nails',
    notes:
      'Instead of pallet slots, the Box Kit uses pallet frames. The more frames you add, the bigger the storage box you can place.',
  },
  {
    name: 'Special Kit',
    icon: Wrench,
    category: 'Utility / Mechanics',
    recipe:
      '2 Pallets = Trashcan · 3 Pallets = Workbench · 5 Pallets = Greenhouse · 4 Fabric = Log Storage Place',
    notes:
      'The Workbench unlocks advanced crafting (fridge, lamps, repair bench, etc.). "Fabric" is the beige Tarp item, per the mod author and community.',
  },
  {
    name: 'Stove Kit',
    icon: Flame,
    category: 'Utility / Mechanics',
    recipe: 'Empty Barrel + Hacksaw, then fill the material slot with 10 Metal Sheets',
    notes:
      'Places an indoor stove. Note: other mods that override metal-plate/sheet slots (e.g. BBP, Cabin) can break this recipe.',
  },
  {
    name: 'Rain Collector Kit',
    icon: CloudRain,
    category: 'Utility / Mechanics',
    recipe: 'Wooden Pallet + 4 Metal Sheets, then fill the material slot with 4 Fabric',
    notes: 'A working rain collector for gathering water at your base.',
  },
  {
    name: 'Old Fridge',
    icon: Refrigerator,
    category: 'Utility / Mechanics',
    recipe: '10 Metal Plates + 1 Metal Wire + 1 Electronic Repair Kit',
    tool: 'Screwdriver — crafted on the Workbench',
    notes:
      'A working fridge that increases food hold time (3x longer by default, configurable). Does not currently need power.',
  },
  {
    name: 'Repair Bench',
    icon: Wrench,
    category: 'Utility / Mechanics',
    recipe: '10 Metal Plates + 10 Wooden Planks + 30 Nails',
    tool: 'Screwdriver — crafted on the Workbench',
    notes:
      'A repair booster. Add repair kits to the bench and hold the damaged item to repair faster, repair to pristine, and make attached repair kits last longer.',
  },
  {
    name: 'Coffee Machine',
    icon: Coffee,
    category: 'Utility / Mechanics',
    recipe: '10 Metal Plates + 1 Metal Wire + 1 Electronic Repair Kit',
    tool: 'Blowtorch — crafted on the Workbench',
    notes:
      'A retro coffee machine. Add a bag of coffee beans and fill with water. Does not need to be powered.',
  },
  {
    name: 'Firewood Storage Place',
    icon: Package,
    category: 'Storage',
    recipe: '4 Metal Plates',
    tool: 'Blowtorch — crafted on the Workbench',
    notes: 'A small storage spot for firewood, wooden sticks and bits to keep a cozy fire going.',
  },
  {
    name: 'Greenhouse',
    icon: Sprout,
    category: 'Utility / Mechanics',
    recipe: 'Special Kit loaded with 5 Pallets',
    notes:
      'To dismantle the greenhouse you must stand inside it and aim at the middle with a tool in hand.',
  },
  {
    name: 'Trashcan',
    icon: Trash2,
    category: 'Utility / Mechanics',
    recipe: 'Special Kit loaded with 2 Pallets',
    notes: 'A simple trashcan for clearing unwanted items.',
  },
  {
    name: 'Small Spotlight',
    icon: Lightbulb,
    category: 'Lighting',
    recipe: '1 Metal Plate + 1 Metal Wire + 25% of an Electronic Repair Kit',
    tool: 'Screwdriver — crafted on the Workbench',
    notes:
      'Powered by a 9V Battery and placed on the ground. Works in artificial darkness areas like bunkers.',
  },
  {
    name: 'Desk Lamp',
    icon: LampDesk,
    category: 'Lighting',
    recipe: '1 Metal Plate + 3 Wooden Planks + 25% of an Electronic Repair Kit',
    tool: 'Screwdriver — crafted on the Workbench',
    notes: 'The lamp head position can be changed. Also works in artificial darkness.',
  },
  {
    name: 'Floor Lamp',
    icon: Lamp,
    category: 'Lighting',
    recipe: '1 Metal Pipe + 1 Metal Wire + 2 Wooden Planks + 25% of an Electronic Repair Kit',
    tool: 'Screwdriver — crafted on the Workbench',
    notes:
      'An all-around light that must be powered externally (generator or truck battery + wire). Disabled in artificial darkness for performance.',
  },
  {
    name: 'Solar Panel',
    icon: Sun,
    category: 'Power',
    recipe: '10 Metal Plates + 1 Metal Wire + 1 Electronic Repair Kit',
    tool: 'Blowtorch — crafted on the Workbench',
    notes: 'Requires a truck battery to work. Turn it on to charge the battery during daytime.',
  },
];

function boomTheme(category: BoomCategory) {
  switch (category) {
    case 'Base Kit':
      return {
        badge: 'border-amber-500/35 bg-amber-500/12 text-amber-700 dark:text-amber-300',
        stripe: 'bg-gradient-to-r from-amber-500 to-orange-400',
        iconWrap: 'bg-amber-950/80 dark:bg-amber-500/20 border-amber-500/35 text-amber-600 dark:text-amber-300',
        iconGlow: 'bg-amber-500/30',
        sectionTone: 'text-amber-700 dark:text-amber-300',
        motif: 'bg-[linear-gradient(125deg,rgba(245,158,11,0.15)_0%,transparent_30%)]',
        frame: 'after:absolute after:inset-0 after:pointer-events-none after:border after:border-amber-500/15 after:rounded-2xl',
        tag: 'CORE',
      };
    case 'Furniture':
      return {
        badge: 'border-orange-500/35 bg-orange-500/12 text-orange-700 dark:text-orange-300',
        stripe: 'bg-gradient-to-r from-orange-500 to-amber-400',
        iconWrap: 'bg-orange-950/80 dark:bg-orange-500/20 border-orange-500/35 text-orange-600 dark:text-orange-300',
        iconGlow: 'bg-orange-500/30',
        sectionTone: 'text-orange-700 dark:text-orange-300',
        motif: 'bg-[radial-gradient(circle_at_14%_20%,rgba(249,115,22,0.18),transparent_30%)]',
        frame: 'after:absolute after:inset-0 after:pointer-events-none after:border after:border-orange-500/15 after:rounded-2xl',
        tag: 'FURNITURE',
      };
    case 'Storage':
      return {
        badge: 'border-emerald-500/35 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300',
        stripe: 'bg-gradient-to-r from-emerald-500 to-teal-400',
        iconWrap: 'bg-emerald-950/80 dark:bg-emerald-500/20 border-emerald-500/35 text-emerald-600 dark:text-emerald-300',
        iconGlow: 'bg-emerald-500/30',
        sectionTone: 'text-emerald-700 dark:text-emerald-300',
        motif: 'bg-[linear-gradient(145deg,rgba(16,185,129,0.14)_0%,transparent_36%)]',
        frame: 'after:absolute after:inset-0 after:pointer-events-none after:border after:border-emerald-500/15 after:rounded-2xl',
        tag: 'STORAGE',
      };
    case 'Lighting':
      return {
        badge: 'border-yellow-500/35 bg-yellow-500/12 text-yellow-700 dark:text-yellow-300',
        stripe: 'bg-gradient-to-r from-yellow-400 to-amber-300',
        iconWrap: 'bg-yellow-950/80 dark:bg-yellow-500/20 border-yellow-500/35 text-yellow-600 dark:text-yellow-300',
        iconGlow: 'bg-yellow-400/30',
        sectionTone: 'text-yellow-700 dark:text-yellow-300',
        motif: 'bg-[radial-gradient(circle_at_84%_15%,rgba(234,179,8,0.18),transparent_32%)]',
        frame: 'after:absolute after:inset-0 after:pointer-events-none after:border after:border-yellow-500/15 after:rounded-2xl',
        tag: 'LIGHTING',
      };
    case 'Power':
      return {
        badge: 'border-sky-500/35 bg-sky-500/12 text-sky-700 dark:text-sky-300',
        stripe: 'bg-gradient-to-r from-sky-500 to-cyan-400',
        iconWrap: 'bg-sky-950/80 dark:bg-sky-500/20 border-sky-500/35 text-sky-600 dark:text-sky-300',
        iconGlow: 'bg-sky-500/30',
        sectionTone: 'text-sky-700 dark:text-sky-300',
        motif: 'bg-[radial-gradient(circle_at_84%_15%,rgba(14,165,233,0.2),transparent_32%)]',
        frame: 'after:absolute after:inset-0 after:pointer-events-none after:border after:border-sky-500/15 after:rounded-2xl',
        tag: 'POWER',
      };
    default:
      return {
        badge: 'border-violet-500/35 bg-violet-500/12 text-violet-700 dark:text-violet-300',
        stripe: 'bg-gradient-to-r from-violet-500 to-fuchsia-400',
        iconWrap: 'bg-violet-950/80 dark:bg-violet-500/20 border-violet-500/35 text-violet-600 dark:text-violet-300',
        iconGlow: 'bg-violet-500/30',
        sectionTone: 'text-violet-700 dark:text-violet-300',
        motif: 'bg-[linear-gradient(135deg,rgba(139,92,246,0.16)_0%,transparent_34%)]',
        frame: 'after:absolute after:inset-0 after:pointer-events-none after:border after:border-violet-500/15 after:rounded-2xl',
        tag: 'UTILITY',
      };
  }
}

export function BoomlayWiki() {
  return (
    <>
      <Card className="mb-5 p-4 sm:p-5 rounded-3xl bg-white/60 dark:bg-neutral-900/50 border-gray-200/60 dark:border-white/[0.07] backdrop-blur-2xl">
        <p className="text-sm text-gray-600 dark:text-neutral-300 leading-relaxed">
          <span className="font-semibold text-amber-600 dark:text-amber-300">BoomLay&apos;s Things</span> adds
          craftable furniture, storage and working utility objects (fridge, rain collector, repair bench, lamps,
          solar panel and more), almost all built around a simple <span className="font-semibold text-gray-900 dark:text-white">Wooden Pallet</span>.
          Crafting can be enabled or disabled by your server owner, so some recipes below may not be active on every
          server.
        </p>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-3.5">
        {entries.map((entry, index) => {
          const theme = boomTheme(entry.category);
          const Icon = entry.icon;

          return (
            <Card
              key={entry.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.035, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative overflow-hidden rounded-3xl border-gray-200/60 dark:border-white/[0.07] bg-white/70 dark:bg-neutral-900/50 backdrop-blur-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06),0_16px_40px_-16px_rgba(0,0,0,0.18)] transition-shadow duration-300 ${theme.motif}`}
            >
              <div className={`absolute inset-x-0 top-0 h-0.5 ${theme.stripe}`} />
              <div className={`absolute -right-12 -top-12 h-28 w-28 rounded-full blur-3xl opacity-25 ${theme.iconGlow}`} />

              <div className="p-3.5">
                <div className="flex items-start gap-2.5 mb-2.5">
                  <div className={`relative w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 ${theme.iconWrap}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-[15px] font-semibold tracking-tight text-gray-900 dark:text-white leading-tight">{entry.name}</h2>
                      <span className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-bold tracking-[0.18em] ${theme.badge}`}>
                        {theme.tag}
                      </span>
                    </div>
                    <span className={`mt-1.5 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${theme.badge}`}>
                      {entry.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="rounded-2xl border border-gray-200/50 dark:border-white/[0.06] bg-gray-50/60 dark:bg-white/[0.02] p-2.5">
                    <p className={`text-[10px] uppercase tracking-[0.16em] mb-0.5 font-semibold ${theme.sectionTone}`}>Recipe</p>
                    <p className="text-[13px] text-gray-600 dark:text-neutral-300 leading-snug">{entry.recipe}</p>
                  </div>

                  {entry.tool ? (
                    <div className="rounded-2xl border border-gray-200/50 dark:border-white/[0.06] bg-gray-50/60 dark:bg-white/[0.02] p-2.5">
                      <p className={`text-[10px] uppercase tracking-[0.16em] mb-0.5 font-semibold ${theme.sectionTone}`}>Tool</p>
                      <p className="text-[13px] text-gray-600 dark:text-neutral-300 leading-snug">{entry.tool}</p>
                    </div>
                  ) : null}

                  <div className="rounded-2xl border border-gray-200/50 dark:border-white/[0.06] bg-gray-50/60 dark:bg-white/[0.02] p-2.5">
                    <p className={`text-[10px] uppercase tracking-[0.16em] mb-0.5 font-semibold ${theme.sectionTone}`}>Notes</p>
                    <p className="text-[13px] text-gray-600 dark:text-neutral-300 leading-snug">{entry.notes}</p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Dismantling + non-craftable info */}
      <Card className="mt-5 p-4 sm:p-5 rounded-3xl bg-amber-500/[0.07] border-amber-500/20 backdrop-blur-2xl shadow-[0_8px_30px_-12px_rgba(245,158,11,0.25)]">
        <div className="flex items-start gap-3">
          <Hammer className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
          <div className="space-y-2 text-sm text-gray-600 dark:text-neutral-300">
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Dismantling &amp; non-craftable items</h2>
            <p>
              <span className="font-semibold">Pallets</span> dismantle with a Hatchet, Wood Axe, Firefighter Axe,
              Crowbar or Pickaxe — default yield is 6 Planks and 20 Nails.
            </p>
            <p>
              <span className="font-semibold">Furniture</span> dismantles with a Screwdriver or Pliers by default
              (server owners can change the allowed tools). If crafting is enabled you always get the Kit back; whether
              materials return depends on server settings.
            </p>
            <p>
              <span className="font-semibold">Not craftable:</span> indoor plants, paintings and carpets are decorative
              items only.
            </p>
          </div>
        </div>
      </Card>

      {/* Sources & Citations */}
      <Card className="mt-4 p-4 sm:p-5 rounded-3xl bg-white/60 dark:bg-neutral-900/50 border-gray-200/60 dark:border-white/[0.07] backdrop-blur-2xl">
        <div className="flex items-start gap-3">
          <ExternalLink className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
          <div className="space-y-3 text-sm text-gray-600 dark:text-neutral-300 w-full">
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Sources &amp; citations</h2>
            <p>All crafting recipes and item details above are taken directly from the mod author&apos;s own pages:</p>
            <ul className="space-y-2 list-none">
              <li className="flex items-start gap-2">
                <ExternalLink className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
                <span>
                  BoomLay — <span className="font-semibold">&ldquo;BoomLay&apos;s Things&rdquo;</span> Steam Workshop page (mod description, dismantling &amp; non-craftable items):{' '}
                  <Link
                    className="text-amber-600 dark:text-amber-400 hover:underline break-all"
                    href="https://steamcommunity.com/sharedfiles/filedetails/?id=2860643107"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    steamcommunity.com/sharedfiles/filedetails/?id=2860643107
                  </Link>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ExternalLink className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
                <span>
                  BoomLay — pinned <span className="font-semibold">&ldquo;Crafting&rdquo;</span> guide (full recipe list):{' '}
                  <Link
                    className="text-amber-600 dark:text-amber-400 hover:underline break-all"
                    href="https://steamcommunity.com/workshop/filedetails/discussion/2860643107/6682809959401948513/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    steamcommunity.com/workshop/filedetails/discussion/2860643107/6682809959401948513/
                  </Link>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ExternalLink className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
                <span>
                  BoomLay — <span className="font-semibold">Config Guide</span> for server owners:{' '}
                  <Link
                    className="text-amber-600 dark:text-amber-400 hover:underline break-all"
                    href="https://steamcommunity.com/workshop/filedetails/discussion/2860643107/3735205021140241792/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    steamcommunity.com/workshop/filedetails/discussion/2860643107/3735205021140241792/
                  </Link>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Youtube className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                <span>
                  Community video walkthroughs of the mod can be found by searching{' '}
                  <Link
                    className="text-amber-600 dark:text-amber-400 hover:underline break-all"
                    href="https://www.youtube.com/results?search_query=BoomLay%27s+Things+DayZ"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    &ldquo;BoomLay&apos;s Things DayZ&rdquo; on YouTube
                  </Link>
                  . Those videos belong to their respective creators.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Legal disclaimer */}
      <Card className="mt-4 p-3.5 sm:p-4 rounded-3xl bg-white/60 dark:bg-neutral-900/50 border-gray-200/60 dark:border-white/[0.07] backdrop-blur-2xl">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-gray-500 dark:text-neutral-400 leading-relaxed">
            Community-made reference only. <span className="font-semibold text-gray-700 dark:text-neutral-300">BoomLay&apos;s Things</span> is created by{' '}
            <span className="font-semibold text-gray-700 dark:text-neutral-300">BoomLay</span> and licensed under{' '}
            <Link
              className="text-amber-600 dark:text-amber-400 hover:underline"
              href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC BY-NC-SA 4.0
            </Link>
            . CDN is not affiliated with BoomLay, Bohemia Interactive, or DayZ; all trademarks and assets belong to their
            respective owners. Rights holders can contact the CDN admin team for changes or removal.
          </p>
        </div>
      </Card>
    </>
  );
}
