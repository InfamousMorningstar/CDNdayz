import Link from 'next/link';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';

type WikiEntry = {
  name: string;
  icon: string;
  category: 'Infection / Disease' | 'Injury / Wound' | 'Treatment Buff' | 'Vaccine / Protection' | 'Mental / Survival';
  levelInfo: string;
  howToTreat: string;
  prevention: string;
};

const entries: WikiEntry[] = [
  {
    name: 'Flu / Cold / Pneumonia',
    icon: '/Images/terje-icons/influenza.png',
    category: 'Infection / Disease',
    levelInfo: 'Illness severity progresses in stages; antibiotic treatments are Level 1 to 3 depending on severity.',
    howToTreat:
      'Mild cold can clear with warmth/rest. For progressing flu/pneumonia, use antibiotics at the right level (examples: Tetracycline, Amibaktam, Ibuprofen/Nurofen support, Amoxiclav, Imipenem/Flemoclav for higher severity). Repeat doses as needed.',
    prevention: 'Stay warm and dry, avoid prolonged cold exposure. Use Vaxicam before high-risk runs.',
  },
  {
    name: 'Pain',
    icon: '/Images/terje-icons/pain.png',
    category: 'Infection / Disease',
    levelInfo: 'Pain has multiple intensity stages; painkiller treatments generally scale from Level 1 to 3.',
    howToTreat:
      'Use painkillers based on severity (examples: Codeine, Analgin, Nimesulide, Ketarol, Morphine class injectors). Pain fades over time but meds reduce it faster.',
    prevention: 'Reduce incoming trauma and treat wounds quickly before pain stacks.',
  },
  {
    name: 'Stomach Poison (Food Poisoning)',
    icon: '/Images/terje-icons/poisoning.png',
    category: 'Infection / Disease',
    levelInfo: 'Food poisoning worsens by stage; treatment items typically run from Level 1 to 3.',
    howToTreat:
      'Hydrate, then use antipoison meds by severity (Charcoal, Polysorb, Phthalazole, Mesalazine, Metoclopramid, Heptral, Stomaproxidal).',
    prevention: 'Avoid spoiled food, unsafe water, toxic liquids, and undercooked risky food.',
  },
  {
    name: 'Bruise (Hematoma)',
    icon: '/Images/terje-icons/hematoma.png',
    category: 'Injury / Wound',
    levelInfo: 'No fixed medicine level requirement; severity increases with accumulated bruises.',
    howToTreat:
      'Bruises can heal naturally. Speed recovery with ointments like Viprosal, Capsicum, or Finalgon.',
    prevention: 'Avoid blunt trauma and blocked-shot impacts to armor/helmet zones.',
  },
  {
    name: 'Zombie Virus',
    icon: '/Images/terje-icons/virusz.png',
    category: 'Infection / Disease',
    levelInfo: 'Long incubation followed by severe late stage; antidote treatment does not use a standard Level 1 to 3 scale.',
    howToTreat:
      'Use Zivirol (ampoule/injector) before late stage. Virus has a long incubation window, so treat early when exposed.',
    prevention: 'Mask + armor reduce risk. Avoid prolonged close zombie contact. Use Zerivax vaccine proactively.',
  },
  {
    name: 'Rabies',
    icon: '/Images/terje-icons/virus.png',
    category: 'Infection / Disease',
    levelInfo: 'Disease progresses through stages; rabies treatment options commonly span Level 2 to 3 (early intervention is critical).',
    howToTreat:
      'Treat as early as possible with rabies-specific meds (examples: Rabinoline, Rifampicin, Rabinucoline). Late stage becomes lethal quickly.',
    prevention: 'Avoid infected animal bites and vaccinate with Rabivax before high-risk hunts.',
  },
  {
    name: 'Contusion (Concussion)',
    icon: '/Images/terje-icons/brain.png',
    category: 'Injury / Wound',
    levelInfo: 'Concussion has increasing symptom severity; treatment items are not strictly tiered by Level 1 to 3 in all cases.',
    howToTreat:
      'Can fade over time, but treatment is faster with Noopept or Neirox (ampoule/injector).',
    prevention: 'Protect head, avoid blast shockwaves, and avoid repeated blunt hits.',
  },
  {
    name: 'Chemical Poisoning',
    icon: '/Images/terje-icons/biohazard.png',
    category: 'Infection / Disease',
    levelInfo: 'Chemical poisoning escalates by stage; anti-chemical treatment is usually available in Level 1 to 3 options.',
    howToTreat:
      'Leave contaminated area and treat fast with anti-chemical meds (Rombiopental, Neirocetal, AntiChem Injector).',
    prevention: 'Wear proper protection in toxic zones and do not overstay gas exposure.',
  },
  {
    name: 'Blood Poisoning (Sepsis)',
    icon: '/Images/terje-icons/blood2.png',
    category: 'Infection / Disease',
    levelInfo: 'Sepsis is severe and stage-based; treatment options are primarily high-tier antibiotic/antisepsis items (typically Level 3).',
    howToTreat:
      'Use strong antibiotic/sepsis treatments (Flemoclav, Imipenem, Amoxiclav injector, Topoisomerase injector). Treat quickly to stop health decline.',
    prevention: 'Keep hands/tools sterile and keep wounds disinfected/clean while healing.',
  },
  {
    name: 'Scratch (Light Bleed)',
    icon: '/Images/terje-icons/cut.png',
    category: 'Injury / Wound',
    levelInfo: 'Light bleed severity; no explicit medicine level gate, but response speed matters.',
    howToTreat:
      'Bandage immediately. Hemostatic-capable bandages are stronger than basic cloth.',
    prevention: 'Avoid close melee trades and keep a sterile dressing ready.',
  },
  {
    name: 'Deep Wound (Heavy Bleed)',
    icon: '/Images/terje-icons/cut3.png',
    category: 'Injury / Wound',
    levelInfo: 'High-severity bleed state; hemostasis support commonly uses Level 1 to 3 blood-control meds.',
    howToTreat:
      'Immediate hemostasis is priority, then continued care. Use blood-clot support meds (Vikasol, Erytromixelin) to reduce ongoing bleed rate.',
    prevention: 'Armor, discipline in close combat, and quick disengage when outnumbered.',
  },
  {
    name: 'Bullet Wound',
    icon: '/Images/terje-icons/bullet.png',
    category: 'Injury / Wound',
    levelInfo: 'Wound severity can escalate into deeper complications; surgical effectiveness depends on tool quality and treatment progression.',
    howToTreat:
      'Bandage first, then perform surgery to remove wound complications using surgical tools/kit (Surgical Tool variants, Surgical Kit, IFAK/AFAK).',
    prevention: 'Use maintained armor and avoid exposed peeks; plate condition matters.',
  },
  {
    name: 'Internal Organs Wound',
    icon: '/Images/terje-icons/organs.png',
    category: 'Injury / Wound',
    levelInfo: 'Critical wound state; usually treated through staged surgical recovery rather than simple Level 1 to 3 medicine only.',
    howToTreat:
      'Requires surgical treatment. Stabilize bleed, then use surgery-capable kits/tools; repeat if needed until complications clear.',
    prevention: 'Avoid severe penetrating hits; do not delay treatment after gunshot/stab incidents.',
  },
  {
    name: 'Bandaged Wound (Clean)',
    icon: '/Images/terje-icons/cut2.png',
    category: 'Injury / Wound',
    levelInfo: 'Stable wound-care state; can progress if hygiene drops.',
    howToTreat:
      'Maintain cleanliness and monitor. Re-disinfect and rebandage if contamination is suspected.',
    prevention: 'Always disinfect hands/tools before touching open wounds.',
  },
  {
    name: 'Bandaged Wound (Dirty)',
    icon: '/Images/terje-icons/cut2.png',
    category: 'Injury / Wound',
    levelInfo: 'Higher infection-risk wound-care state; treat quickly to prevent escalation to sepsis stages.',
    howToTreat:
      'Dirty dressings raise sepsis risk. Re-clean wound, disinfect, and replace with clean treatment materials.',
    prevention: 'Never reuse contaminated supplies without disinfection.',
  },
  {
    name: 'Sutured Wound (Clean)',
    icon: '/Images/terje-icons/cut2.png',
    category: 'Injury / Wound',
    levelInfo: 'Post-surgery controlled state; still requires hygiene maintenance to avoid negative progression.',
    howToTreat:
      'Keep disinfected and monitor while healing. Clean sutures are stable but still need upkeep.',
    prevention: 'Suture with sterile tools and keep follow-up care consistent.',
  },
  {
    name: 'Sutured Wound (Dirty)',
    icon: '/Images/terje-icons/cut2.png',
    category: 'Injury / Wound',
    levelInfo: 'Post-surgery high-risk infection state; can escalate into sepsis if ignored.',
    howToTreat:
      'Dirty sutures increase sepsis chance. Disinfect and re-treat immediately to prevent infection progression.',
    prevention: 'Do not perform surgery with dirty hands/instruments.',
  },
  {
    name: 'Disinfected Hands',
    icon: '/Images/terje-icons/desinfection.png',
    category: 'Treatment Buff',
    levelInfo: 'Preventive status effect; no severity stage, but critical for avoiding wound infection escalation.',
    howToTreat:
      'Use DisinfectantAlcohol or DisinfectantSpray before wound care and surgery.',
    prevention: 'Treat hand disinfection as mandatory every time you perform medical procedures.',
  },
  {
    name: 'Blood Regeneration',
    icon: '/Images/terje-icons/blood4.png',
    category: 'Treatment Buff',
    levelInfo: 'Blood regen medicines commonly come in Level 1 to 2 strength profiles depending on item.',
    howToTreat:
      'Boost blood recovery with Irovit, Magnesium Sulfate, Erythropoetin (ampoule/injector), or Erytromixelin.',
    prevention: 'Stop bleeding early so regen items are not wasted by active blood loss.',
  },
  {
    name: 'Fast Blood Clotting',
    icon: '/Images/terje-icons/blood3.png',
    category: 'Treatment Buff',
    levelInfo: 'Hemostasis support usually scales with medicine strength (commonly Level 1 to 3 by item type).',
    howToTreat:
      'Use hemostasis meds to slow blood loss (Vikasol, Erytromixelin) while stabilizing severe wounds.',
    prevention: 'Keep hemostatic meds preloaded in your quick-access slots.',
  },
  {
    name: 'Zombie Virus Vaccine',
    icon: '/Images/terje-icons/vaccine.png',
    category: 'Vaccine / Protection',
    levelInfo: 'Protection effect is duration-based, not a 1 to 3 severity medicine level.',
    howToTreat:
      'Use Zerivax before expected zombie-heavy operations to reduce infection risk.',
    prevention: 'Re-vaccinate as needed after duration expires.',
  },
  {
    name: 'Flu Vaccine',
    icon: '/Images/terje-icons/vaccine.png',
    category: 'Vaccine / Protection',
    levelInfo: 'Protection effect is duration-based, not a 1 to 3 severity medicine level.',
    howToTreat:
      'Use Vaxicam proactively in cold-weather missions.',
    prevention: 'Pair vaccine with warm clothing and shelter discipline.',
  },
  {
    name: 'Rabies Vaccine',
    icon: '/Images/terje-icons/vaccine.png',
    category: 'Vaccine / Protection',
    levelInfo: 'Protection effect is duration-based, not a 1 to 3 severity medicine level.',
    howToTreat:
      'Use Rabivax before wolf/predator routes.',
    prevention: 'Do not rely only on vaccine; avoid unnecessary animal bite risk.',
  },
  {
    name: 'Mental State',
    icon: '/Images/terje-icons/mental.png',
    category: 'Mental / Survival',
    levelInfo: 'Mental instability worsens by stage; antidepressant treatment options typically scale from Level 1 to 3.',
    howToTreat:
      'Stabilize with antidepressants (Adepress, Agteminol, Venlafaxine, Actaparoxetine, Amitriptyline, Amfitalicyne) depending on severity.',
    prevention: 'Limit exposure to psionic stressors and maintain stable combat tempo.',
  },
  {
    name: 'Sleeping State',
    icon: '/Images/terje-icons/dream.png',
    category: 'Mental / Survival',
    levelInfo: 'Sleep need escalates from warning to blackout risk; recovery items have effect strength but sleep itself is state-based.',
    howToTreat:
      'Sleep in safe warm zones (house, tent, near fire, sleeping bag). Energy drinks can temporarily push sleep recovery, but real rest is safer.',
    prevention: 'Manage fatigue before yellow/red sleep states trigger blackouts.',
  },
];

const medicineKeywords = [
  'Tetracycline',
  'Amibaktam',
  'Ibuprofen',
  'Nurofen',
  'Amoxiclav',
  'Imipenem',
  'Flemoclav',
  'Codeine',
  'Analgin',
  'Nimesulide',
  'Ketarol',
  'Morphine',
  'Charcoal',
  'Polysorb',
  'Phthalazole',
  'Mesalazine',
  'Metoclopramid',
  'Heptral',
  'Stomaproxidal',
  'Viprosal',
  'Capsicum',
  'Finalgon',
  'Zivirol',
  'Zerivax',
  'Rabinoline',
  'Rifampicin',
  'Rabinucoline',
  'Noopept',
  'Neirox',
  'Rombiopental',
  'Neirocetal',
  'AntiChem Injector',
  'Topoisomerase injector',
  'Surgical Tool',
  'Surgical Kit',
  'IFAK',
  'AFAK',
  'DisinfectantAlcohol',
  'DisinfectantSpray',
  'Irovit',
  'Magnesium Sulfate',
  'Erythropoetin',
  'Erytromixelin',
  'Vikasol',
  'Vaxicam',
  'Rabivax',
  'Adepress',
  'Agteminol',
  'Venlafaxine',
  'Actaparoxetine',
  'Amitriptyline',
  'Amfitalicyne',
];

const medicineKeywordSet = new Set(medicineKeywords.map((item) => item.toLowerCase()));

function escapeRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightMedicines(text: string) {
  const keywordPattern = medicineKeywords.map(escapeRegex).join('|');
  const regex = new RegExp(`(${keywordPattern})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (medicineKeywordSet.has(part.toLowerCase())) {
      return (
        <span key={`med-${part}-${index}`} className="font-semibold text-cyan-700 dark:text-cyan-300">
          {part}
        </span>
      );
    }

    return part;
  });
}

function categoryTheme(category: WikiEntry['category']) {
  if (category === 'Infection / Disease') {
    return {
      badge: 'border-red-500/35 bg-red-500/12 text-red-700 dark:text-red-300',
      stripe: 'bg-gradient-to-r from-red-500 to-rose-400',
      iconWrap: 'bg-red-950/80 dark:bg-red-500/20 border-red-500/35',
      iconGlow: 'bg-red-500/30',
      sectionTone: 'text-red-700 dark:text-red-300',
      motif: 'bg-[radial-gradient(circle_at_14%_20%,rgba(239,68,68,0.2),transparent_30%)]',
      frame: 'after:absolute after:inset-0 after:pointer-events-none after:border after:border-red-500/15 after:rounded-2xl',
      tag: 'BIOHAZARD',
    };
  }

  if (category === 'Injury / Wound') {
    return {
      badge: 'border-amber-500/35 bg-amber-500/12 text-amber-700 dark:text-amber-300',
      stripe: 'bg-gradient-to-r from-amber-500 to-orange-400',
      iconWrap: 'bg-amber-950/80 dark:bg-amber-500/20 border-amber-500/35',
      iconGlow: 'bg-amber-500/30',
      sectionTone: 'text-amber-700 dark:text-amber-300',
      motif: 'bg-[linear-gradient(125deg,rgba(245,158,11,0.15)_0%,transparent_30%)]',
      frame: 'after:absolute after:inset-0 after:pointer-events-none after:border after:border-amber-500/15 after:rounded-2xl',
      tag: 'TRAUMA',
    };
  }

  if (category === 'Treatment Buff') {
    return {
      badge: 'border-emerald-500/35 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300',
      stripe: 'bg-gradient-to-r from-emerald-500 to-teal-400',
      iconWrap: 'bg-emerald-950/80 dark:bg-emerald-500/20 border-emerald-500/35',
      iconGlow: 'bg-emerald-500/30',
      sectionTone: 'text-emerald-700 dark:text-emerald-300',
      motif: 'bg-[linear-gradient(145deg,rgba(16,185,129,0.14)_0%,transparent_36%)]',
      frame: 'after:absolute after:inset-0 after:pointer-events-none after:border after:border-emerald-500/15 after:rounded-2xl',
      tag: 'SUPPORT',
    };
  }

  if (category === 'Vaccine / Protection') {
    return {
      badge: 'border-sky-500/35 bg-sky-500/12 text-sky-700 dark:text-sky-300',
      stripe: 'bg-gradient-to-r from-sky-500 to-cyan-400',
      iconWrap: 'bg-sky-950/80 dark:bg-sky-500/20 border-sky-500/35',
      iconGlow: 'bg-sky-500/30',
      sectionTone: 'text-sky-700 dark:text-sky-300',
      motif: 'bg-[radial-gradient(circle_at_84%_15%,rgba(14,165,233,0.2),transparent_32%)]',
      frame: 'after:absolute after:inset-0 after:pointer-events-none after:border after:border-sky-500/15 after:rounded-2xl',
      tag: 'IMMUNITY',
    };
  }

  return {
    badge: 'border-violet-500/35 bg-violet-500/12 text-violet-700 dark:text-violet-300',
    stripe: 'bg-gradient-to-r from-violet-500 to-fuchsia-400',
    iconWrap: 'bg-violet-950/80 dark:bg-violet-500/20 border-violet-500/35',
    iconGlow: 'bg-violet-500/30',
    sectionTone: 'text-violet-700 dark:text-violet-300',
    motif: 'bg-[linear-gradient(135deg,rgba(139,92,246,0.16)_0%,transparent_34%)]',
    frame: 'after:absolute after:inset-0 after:pointer-events-none after:border after:border-violet-500/15 after:rounded-2xl',
    tag: 'PSYCHE',
  };
}

export function TerjeWiki() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-3.5">
        {entries.map((entry, index) => {
          const theme = categoryTheme(entry.category);

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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={entry.icon} alt={entry.name} width={22} height={22} className="object-contain" />
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
                    <p className={`text-[10px] uppercase tracking-[0.16em] mb-0.5 font-semibold ${theme.sectionTone}`}>Levels</p>
                    <p className="text-[13px] text-gray-600 dark:text-neutral-300 leading-snug">{entry.levelInfo}</p>
                  </div>

                  <div className="rounded-2xl border border-gray-200/50 dark:border-white/[0.06] bg-gray-50/60 dark:bg-white/[0.02] p-2.5">
                    <p className={`text-[10px] uppercase tracking-[0.16em] mb-0.5 font-semibold ${theme.sectionTone}`}>How to cure</p>
                    <p className="text-[13px] text-gray-600 dark:text-neutral-300 leading-snug">{highlightMedicines(entry.howToTreat)}</p>
                  </div>

                  <div className="rounded-2xl border border-gray-200/50 dark:border-white/[0.06] bg-gray-50/60 dark:bg-white/[0.02] p-2.5">
                    <p className={`text-[10px] uppercase tracking-[0.16em] mb-0.5 font-semibold ${theme.sectionTone}`}>Prevention</p>
                    <p className="text-[13px] text-gray-600 dark:text-neutral-300 leading-snug">{entry.prevention}</p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-5 p-4 sm:p-5 rounded-3xl bg-emerald-500/[0.07] border-emerald-500/20 backdrop-blur-2xl shadow-[0_8px_30px_-12px_rgba(16,185,129,0.25)]">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
          <div className="text-sm text-gray-600 dark:text-neutral-300 leading-relaxed">
            <span className="font-semibold text-gray-900 dark:text-white">Quick triage:</span> stop bleed first, disinfect, stabilize blood loss, then treat disease layer. If there is a wound icon plus disease icon, treat both.
          </div>
        </div>
      </Card>

      <Card className="mt-4 p-3.5 sm:p-4 rounded-3xl bg-white/60 dark:bg-neutral-900/50 border-gray-200/60 dark:border-white/[0.07] backdrop-blur-2xl">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-xs text-gray-500 dark:text-neutral-400 leading-relaxed">
            Community-made reference only. <span className="font-semibold text-gray-700 dark:text-neutral-300">Terje Medicine</span> is created by its
            original developer(s){' '}
            <Link
              className="text-red-600 dark:text-red-400 hover:underline"
              href="https://steamcommunity.com/sharedfiles/filedetails/?id=3649957536"
              target="_blank"
              rel="noopener noreferrer"
            >
              (Steam Workshop)
            </Link>
            . CDN is not affiliated with the Terje Medicine developers, Bohemia Interactive, or DayZ; all trademarks and
            assets belong to their respective owners. Rights holders can contact the CDN admin team for changes or
            removal.
          </p>
        </div>
      </Card>
    </>
  );
}
