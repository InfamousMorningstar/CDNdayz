"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Hammer, MessageSquare, AlertTriangle, BookOpen, Terminal, Construction, Users, Home, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DiscordLink } from '@/components/ui/DiscordLink';
import { cn } from '@/lib/utils';
import { DISCORD_SUPPORT_CHANNEL_URL } from '@/lib/links';

type Tab = 'general' | 'building';

const faqData = {
  gameplay: [
    {
      question: 'What type of server is this?',
      answer:
        `This is a PvE-focused server. That means survival, exploration, and cooperation come first. If you're here to ruin someone's day for fun... you're on the wrong server, mate.`,
    },
    {
      question: 'How do I join the server?',
      answer:
        `Find us through the DayZ launcher (or use our direct connect info). If you get stuck, that's what Discord is for-don't suffer in silence.`,
    },
    {
      question: 'Will there be events?',
      answer:
        `Yes. PvE events, challenges, and the occasional chaos-without turning the server into a warzone.`,
    },
    {
      question: 'Is base building allowed?',
      answer:
        `Of course. Build your empire. Just don't expect it to survive bad decisions.`,
    },
    {
      question: 'How do I dismantle / fold a BLR house kit?',
      answer:
        `Claim your house, make sure it's completely empty, and equip a hammer.
Stand outside facing the door, look at it, and you'll get the "Fold" option.

Note: If it's not working, something's off - either it's not claimed, not empty, or you're not at the door.`,
    },
    {
      question: 'Will my progress be wiped?',
      answer:
        `Wipes happen when necessary (updates, major changes, etc.). We don't do it for fun-but sometimes DayZ demands sacrifice.`,
    },
    {
      question: 'Can I suggest features or changes?',
      answer:
        `Absolutely. Good ideas get considered. Bad ideas... also get considered, briefly, before being ignored with respect.`,
    },
  ],
  rules: [
    {
      question: 'Is PvP allowed at all?',
      answer: `Nope.`,
    },
    {
      question: 'What happens if I break the rules?',
      answer:
        `Depends on how creative you got. Could be a warning, could be a ban. We're fair-but we're not here to babysit.`,
    },
    {
      question: 'Are there active admins?',
      answer:
        `Yes. We're around, watching, and occasionally fixing things before you even notice they broke.`,
    },
  ],
  technical: [
    {
      question: 'Do I need to install mods?',
      answer:
        `Yes. The launcher will automatically download everything you need. If it doesn't... well, technology has chosen violence that day-restart and try again.`,
    },
    {
      question: 'Who do I contact if something breaks?',
      answer:
        `Hit us up on Discord. If it's broken, we want to know. If it's really broken, we probably already know.`,
    },
    {
      question: 'Why am I getting kicked with "Server has a more recent version" or PBO errors?',
      answer:
        `That's DayZ politely telling you: "your mods are outdated, fix your life."

What's happening:
The server updated a mod (like Expansion), but your local version didn't. Even being slightly behind = instant kick.

How to fix it (properly, not guessing):
Step 1 - ALWAYS join through the DayZ Launcher
Not the in-game browser. The launcher actually syncs mods correctly.

Step 2 - Let the launcher update everything
Click the server
Hit Join
Click "Setup DLCs and Mods" if prompted
Wait. Don't rush it. Let it finish.

Step 3 - If you're still getting kicked (common with Expansion mods):
Go to the Mods tab
Find the problem mod (e.g. DayZ Expansion Bundle)
Unsubscribe -> Resubscribe
Let it fully reinstall

Step 4 - Restart the launcher + Steam
Yes, it matters. DayZ sometimes just refuses to cooperate until you do.

Step 5 - Last resort (but works):
Right-click DayZ in Steam -> Properties -> Installed Files -> Verify integrity
Relaunch and join again

Pro Tip:
If you see words like "PBO", "more recent version", or "data verification error" - it's almost always a mod mismatch, not your internet, not the server "being broken".

Still not working?
Then it's actually our problem. Open a ticket in Discord, and we'll take a look.`,
    },
  ],
} as const;

export function RulesClient() {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [faqQuery, setFaqQuery] = useState('');

  const filterFaq = (items: readonly { question: string; answer: string }[]) => {
    const query = faqQuery.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) => {
      const text = `${item.question} ${item.answer}`.toLowerCase();
      return text.includes(query);
    });
  };

  const filteredGameplay = filterFaq(faqData.gameplay);
  const filteredRules = filterFaq(faqData.rules);
  const filteredTechnical = filterFaq(faqData.technical);
  const hasFaqResults = filteredGameplay.length > 0 || filteredRules.length > 0 || filteredTechnical.length > 0;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-3 mb-8 sm:mb-12">
        <button
          onClick={() => setActiveTab('general')}
          className={cn(
            "w-full sm:w-auto justify-center flex items-center gap-2 px-4 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold transition-all duration-300 border",
            activeTab === 'general'
              ? "bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]"
              : "bg-neutral-900/50 border-neutral-800 text-neutral-400 hover:border-red-500/50 hover:text-white"
          )}
        >
          <Shield className="w-5 h-5" />
          General & Discord
        </button>
        <button
          onClick={() => setActiveTab('building')}
          className={cn(
            "w-full sm:w-auto justify-center flex items-center gap-2 px-4 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold transition-all duration-300 border",
            activeTab === 'building'
              ? "bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]"
              : "bg-neutral-900/50 border-neutral-800 text-neutral-400 hover:border-red-500/50 hover:text-white"
          )}
        >
          <Hammer className="w-5 h-5" />
          Base Building
        </button>
      </div>

      <div className="min-h-[520px]">
        <AnimatePresence mode="wait">
          {activeTab === 'general' ? (
            <motion.div
              key="general"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <Card className="p-6 md:p-8 bg-red-950/25 border-red-500/40 shadow-[0_0_35px_rgba(220,38,38,0.18)]">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="text-red-400 w-6 h-6" />
                  <h2 className="text-2xl font-heading font-bold text-white">Hardcore Server Rules</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-red-500/25 bg-black/30 p-4">
                    <p className="text-sm text-white font-semibold mb-2">Donation Items/Gear Policy</p>
                    <p className="text-sm text-neutral-300">HC servers DO NOT allow Donation Items/Gear.</p>
                    <p className="text-xs text-neutral-500 mt-2">
                      Reason: Donation Items/Gear is OP and breaks hardcore gameplay balance.
                    </p>
                  </div>

                  <div className="rounded-lg border border-red-500/25 bg-black/30 p-4">
                    <p className="text-sm text-white font-semibold mb-2">Raiding Policy</p>
                    <p className="text-sm text-neutral-300">HC servers ALLOW raiding.</p>
                    <p className="text-xs text-neutral-500 mt-2">Players must record raids as proof.</p>
                  </div>

                  <div className="rounded-lg border border-red-500/25 bg-black/30 p-4 md:col-span-2">
                    <p className="text-sm text-white font-semibold mb-2">Territories</p>
                    <p className="text-sm text-neutral-300">Territories are PvP zones.</p>
                    <p className="text-xs text-neutral-500 mt-2">No PvE protection in these areas.</p>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
                {/* General Conduct */}
                <Card className="p-5 sm:p-8 bg-neutral-900/60 border-neutral-800">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                    <Users className="text-red-500 w-6 h-6" />
                    <h2 className="text-2xl font-heading font-bold text-white">Community Standards</h2>
                  </div>
                  <ul className="space-y-4 text-neutral-300 text-sm">
                    <li className="flex gap-3">
                      <span className="text-red-500">•</span>
                      <span>Above all, let{`'`}s keep our space friendly, respectful, and fun for everyone. We have mostly PVE servers, and being kind can go a long way.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-red-500">•</span>
                      <span>We{`'`}re here to build a community where everyone feels welcome. Please use the ticket system and forums to get help or share your thoughts.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-red-500">•</span>
                      <span>Do not DM the admins about game issues unless specifically given permission to do so for a specific case. Use the ticket system.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-red-500">•</span>
                      <span>Admins are here to keep things running smoothly, and the ticket system helps us help you.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-red-500">•</span>
                      <span>Keep nicknames relatively appropriate (no blank, offensive, sexually explicit, unreadable/untaggable Unicode)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-red-500">•</span>
                      <span>Keep profile pictures relatively appropriate (no offensive, graphic, sexually explicit)</span>
                    </li>
                     <li className="flex gap-3">
                      <span className="text-red-500">•</span>
                      <span>Always ask before sending direct messages to other members.</span>
                    </li>
                  </ul>
                </Card>

                {/* Ticket System */}
                <Card className="p-5 sm:p-8 bg-neutral-900/60 border-neutral-800">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                    <Terminal className="text-red-500 w-6 h-6" />
                    <h2 className="text-2xl font-heading font-bold text-white">Ticket System</h2>
                  </div>
                  <p className="text-neutral-400 mb-4 text-sm">Use when you want to chat with an Admin or if you have an in-game issue.</p>
                  <DiscordLink href={DISCORD_SUPPORT_CHANNEL_URL} className="inline-block mb-4">
                    <Button className="bg-[#5865F2] hover:bg-[#4752C4] text-white border-none">
                      <span className="mr-2">Open a Ticket</span>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </DiscordLink>
                  <div className="bg-black/40 p-4 rounded border border-white/5 mb-4 font-mono text-xs text-neutral-300">
                    <p className="text-neutral-500 mb-2 border-b border-white/5 pb-1 uppercase tracking-widest font-bold text-[10px]">Required Layout</p>
                    <p>Game: Server Name/Map</p>
                    <p>Issue: Description</p>
                    <p>Location on the map (if needed):</p>
                    <p>In-game name:</p>
                  </div>
                  <div className="space-y-3 text-sm text-neutral-400">
                     <p className="flex gap-2">
                       <span className="text-red-500 font-bold">⚠</span>
                       <span>Use the above layout; any other entry will be deleted until the ticket has this info.</span>
                     </p>
                     <p>
                       Admins do want to help you. Though writing &quot;heli went missing&quot; or &quot;drop/give Donation Items/Gear&quot; doesn{`'`}t help anyone.
                     </p>
                     <p className="italic text-neutral-500">
                       Politeness will also make things go smoother. Our admins are on throughout the day, but not all day, so please be patient when making a ticket.
                     </p>
                  </div>
                </Card>

                <Card className="p-5 sm:p-8 bg-neutral-900/60 border-neutral-800 md:col-span-2">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                    <AlertTriangle className="text-amber-400 w-6 h-6" />
                    <h2 className="text-2xl font-heading font-bold text-white">Important Notes</h2>
                  </div>
                  <ul className="space-y-4 text-sm text-neutral-300">
                    <li className="flex gap-3">
                      <span className="text-amber-400">•</span>
                      <span>Items, helis, and vehicles are not replaceable. Admins will not log in to fix or un-flip vehicles; use a vehicle recovery cone instead (available at trader).</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-amber-400">•</span>
                      <span>DayZ vehicles are unstable at the best of times. Be aware of what you are risking before something, or someone, goes sideways at 150 km/h.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-amber-400">•</span>
                      <span>Items lost during restarts are not replaced. All servers give timed warnings so you can get yourself safe before the restart hits.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-amber-400">•</span>
                      <span>Our admins are on throughout the day, but not all day, so please be patient when making a ticket.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-amber-400">•</span>
                      <span>Do not DM admins unless they tell you otherwise, and do not join admin voice chats to ask for something that should be handled in a ticket.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-amber-400">•</span>
                      <span>The ticket system is for us as much as it is for you. It helps us track bugs and issues, and skipping that process breaks that workflow. Tickets can be made in Discord in the open-a-ticket channel.</span>
                    </li>
                  </ul>
                </Card>

                {/* Chat Rules */}
                <Card className="p-5 sm:p-8 bg-neutral-900/60 border-neutral-800 md:col-span-2">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                    <MessageSquare className="text-red-500 w-6 h-6" />
                    <h2 className="text-2xl font-heading font-bold text-white">Communication Protocols</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    {/* Text Chat */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <Terminal size={16} /> Text Chat
                      </h3>
                      <ul className="space-y-2 text-neutral-300 text-sm">
                        <li className="flex gap-2"><span className="text-red-500">›</span> Respect everyone you interact with here.</li>
                        <li className="flex gap-2"><span className="text-red-500">›</span> No NSFW/NSFL content (Sexually explicit, gore).</li>
                        <li className="flex gap-2"><span className="text-red-500">›</span> Keep chat spam to a minimum so everyone can enjoy the conversation.</li>
                        <li className="flex gap-2"><span className="text-red-500">›</span> Do not publish personal information (including real names, addresses, emails, passwords, bank information, etc.)</li>
                        <li className="flex gap-2"><span className="text-red-500">›</span> Keep disagreements focused on the topic, not on each other.</li>
                        <li className="flex gap-2"><span className="text-red-500">›</span> No offensive content (racism, sexism, hate speech, etc.)</li>
                        <li className="flex gap-2"><span className="text-red-500">›</span> Do not advertise without permission.</li>
                        <li className="flex gap-2"><span className="text-red-500">›</span> Help us keep channels organized by chatting about the right topics in the right places.</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-8">
                      {/* Voice Chat */}
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                          <Users size={16} /> Voice Chat
                        </h3>
                        <ul className="space-y-2 text-neutral-300 text-sm">
                          <li className="flex gap-2"><span className="text-red-500">›</span> Please use the voice channels that best fit your conversation.</li>
                          <li className="flex gap-2"><span className="text-red-500">›</span> Avoid mic spam and keep your audio clear and pleasant for everyone.</li>
                        </ul>
                      </div>

                      {/* In-Game */}
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                          <Shield size={16} /> In-Game
                        </h3>
                        <ul className="space-y-2 text-neutral-300 text-sm">
                          <li className="flex gap-2">
                            <span className="text-red-500">›</span> 
                            <span>Please claim any AI missions or Drops you are about to take on. Claim radius - within shooting distance (500m is a good reference point).</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-red-500">›</span> 
                            <span>Reiterating: Respect everyone you interact with here. <strong className="text-white">Toxicity is not welcome on the CDN servers.</strong></span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Admin Rights */}
                  <div className="pt-6 border-t border-white/5">
                    <h3 className="text-lg font-bold text-red-500 mb-3 flex items-center gap-2">
                        <AlertTriangle size={16} /> Admin Rights
                    </h3>
                    <p className="text-neutral-400 text-sm mb-3 font-medium">Admins reserve the right to:</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-neutral-300">
                      <div className="bg-neutral-950/30 p-3 rounded border border-white/5">
                        <span className="text-red-500 font-bold mr-2">1.</span>
                        Remove messages they deem inappropriate.
                      </div>
                      <div className="bg-neutral-950/30 p-3 rounded border border-white/5">
                         <span className="text-red-500 font-bold mr-2">2.</span>
                         Remove users they deem disruptive to the CDN server.
                      </div>
                      <div className="bg-neutral-950/30 p-3 rounded border border-white/5">
                         <span className="text-red-500 font-bold mr-2">3.</span>
                         Ignore anyone arguing with them about their choices.
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="building"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Build Radius & Restrictions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
                <Card className="p-5 sm:p-8 bg-neutral-900/60 border-neutral-800 lg:col-span-2">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                    <Construction className="text-red-500 w-6 h-6" />
                    <h2 className="text-2xl font-heading font-bold text-white">Build Zones & Radius</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-red-950/10 border border-red-500/20 p-4 rounded">
                        <h3 className="font-bold text-red-400 mb-2">Military Areas</h3>
                        <ul className="text-sm text-neutral-300 space-y-2">
                          <li><strong className="text-white">1000m</strong> - Large Areas (2+ buildings/tents)</li>
                          <li><strong className="text-white">500m</strong> - Smaller Areas (2 or fewer tents)</li>
                        </ul>
                      </div>
                      <div className="bg-amber-950/10 border border-amber-500/20 p-4 rounded">
                        <h3 className="font-bold text-amber-400 mb-2">Traders & Missions</h3>
                        <ul className="text-sm text-neutral-300 space-y-2">
                          <li><strong className="text-white">1000m</strong> - All Traders (General)</li>
                          <li><strong className="text-white">500m</strong> - Namalsk Traders Only</li>
                          <li>
                            <strong className="text-white">500m</strong> - AI Missions
                            <span className="block text-[10px] text-neutral-500 font-normal mt-0.5 leading-tight">
                              (Strictly enforced to prevent mission blocking)
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-neutral-800/30 p-4 rounded border-l-2 border-red-500 space-y-2">
                      <p className="text-sm text-neutral-400">
                        <strong className="text-white">Note:</strong> Some maps can make this difficult, so if your territory is within 25-30 metres of the 1,000-metre boundary, you should be good. Do your best to stick to the 1000-metre radius, though.
                      </p>
                      <p className="text-sm text-neutral-400">
                        <strong className="text-white">Grace Period:</strong> Those who do not adhere to these rules may find their base deleted.
                        <br/>
                        <span className="text-neutral-500 text-xs mt-1 block">
                          – If you are online: Admins will try to talk to you in person first.
                          <br/>
                          – If you are offline: An admin will place a sign by your base. Please follow instructions on the sign.
                        </span>
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-5 sm:p-8 bg-neutral-900/60 border-neutral-800">
                   <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                    <Hammer className="text-red-500 w-6 h-6" />
                    <h2 className="text-2xl font-heading font-bold text-white">Systems</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Badge variant="outline" className="mb-2 text-red-400 border-red-500/30">Expansion Building</Badge>
                      <p className="text-xs text-neutral-500">DeerIsle, Bitterroot, Sakhal, Hardcore Hashima, Chernarus (Noob Friendly)</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2 text-amber-400 border-amber-500/30">Base Building Plus</Badge>
                      <p className="text-xs text-neutral-500">Hardcore Livonia</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2 text-emerald-400 border-emerald-500/30">No Mod</Badge>
                      <p className="text-xs text-neutral-500">Reg Livonia, Reg Chernarus, Banov, Scifi Banov, Namalsk</p>
                    </div>
                    <div className="pt-2">
                         <a href="/features" className="text-xs text-red-500 hover:text-red-400 underline decoration-red-500/30 underline-offset-4">
                            View Detailed System Features &rarr;
                         </a>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Bunkers & Specialty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
                <Card className="p-5 sm:p-8 bg-neutral-900/60 border-neutral-800">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                    <Shield className="text-red-500 w-6 h-6" />
                    <h2 className="text-2xl font-heading font-bold text-white">Bunkers</h2>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-red-400">Type 1: Purchasable</h3>
                      <ol className="list-decimal list-inside text-sm text-neutral-300 space-y-1 ml-2">
                        <li>Buy Kit & 2 Territory Flags from Building Trader.</li>
                        <li>Place Main Flag & create territory.</li>
                        <li>Place Bunker – <span className="text-red-400">Must be on solid ground or a ground floor.</span> If you try anything else, you risk falling under the structure or into rocks when exiting.</li>
                        <li>Open lid to attach CodeLock.</li>
                        <li>Enter & place 2nd Flag (Use similar name with a 1 or 2 added at the end).</li>
                      </ol>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-red-400">Type 2: Crafted</h3>
                      <div className="text-sm text-neutral-400 mb-2">
                        <strong className="text-white block mb-1">Equipment Needed:</strong>
                        <ul className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                           <li>• Bunker Shovel (Trader)</li>
                           <li>• Pickaxe (Digging)</li>
                           <li>• Hammer (Supports/Lights)</li>
                           <li>• Axe/Hatchet (Logs)</li>
                           <li>• Saw (Planks)</li>
                           <li>• Nails</li>
                           <li>• H7 Headlights/Cable Reels</li>
                           <li>• Logs (Supports/Planks)</li>
                           <li>• Stone (Floor/Roof/Walls)</li>
                           <li>• Territory Flag</li>
                        </ul>
                      </div>
                      <ol className="list-decimal list-inside text-sm text-neutral-300 space-y-1 ml-2">
                        <li>Find spot & dig entrance with Bunker Shovel.</li>
                        <li>Lock entrance.</li>
                        <li>Inside: Place Territory Flag (50m radius).</li>
                        <li>Use Tab Key to see resource requirements for walls/lights.</li>
                      </ol>
                    </div>
                  </div>
                </Card>

                <Card className="p-5 sm:p-8 bg-neutral-900/60 border-neutral-800">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                    <Home className="text-red-500 w-6 h-6" />
                    <h2 className="text-2xl font-heading font-bold text-white">Housing</h2>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Rag Cabins</h3>
                      <p className="text-sm text-neutral-400 mb-2">Available ONLY on <span className="text-white">Noob Chernarus</span>.</p>
                      <p className="text-sm text-neutral-300">
                        Purchasable at Building Trader. Place carefully as they do not break down well. Adhere to all build radii.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Portable Housing</h3>
                      <p className="text-sm text-neutral-300 mb-2">
                         9 options purchasable at Build Trader (Shacks to Mansions). Each includes a working fireplace/stove.
                      </p>
                      <ol className="list-decimal list-inside text-sm text-neutral-300 space-y-1 ml-2">
                        <li>Buy & Place in a valid location.</li>
                        <li>Look at door & select <strong className="text-white">"Claim House"</strong> from scroll options.</li>
                        <li>Use "Invite Members" from scroll options to give access.</li>
                      </ol>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">General Building</h3>
                      <ul className="text-sm text-neutral-300 space-y-3">
                        <li className="flex gap-2">
                          <span className="text-red-500">•</span>
                          <span><strong>Clutter:</strong> Only place items like tents, etc., that you are actively using. Keep hoarding of gear/weapons to a minimum to avoid server lag.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-red-500">•</span>
                          <span><strong>Obstruction:</strong> Do not block other survivors, bases, or public access points/monuments. Griefing is frowned upon.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-red-500">•</span>
                          <span><strong>Rendering:</strong> Please do not build within the rendering distance of another base.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-red-500">•</span>
                          <span><strong>Dono Bases:</strong> Do not move into unoccupied "premade" bases. These are donation-based. Open a ticket in #support if interested.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <section className="mt-14">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="text-red-500 w-6 h-6" />
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">
            <span className="text-red-500">FAQs</span>
          </h2>
        </div>

        <p className="text-neutral-400 mb-8 max-w-3xl">
          Quick answers for gameplay, rule enforcement, and common technical joining/mod issues.
        </p>
        <p className="text-neutral-500 text-sm mb-8 max-w-3xl">
          Note: Network default is PvE. Any Hardcore exceptions (territory PvP and raid policy) are explicitly listed in the Hardcore Server Rules section above.
        </p>

        <div className="mb-6">
          <input
            value={faqQuery}
            onChange={(event) => setFaqQuery(event.target.value)}
            placeholder="Search FAQ (joining, mods, rules, performance...)"
            className="w-full max-w-xl rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            aria-label="Search FAQ"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="p-6 bg-neutral-900/60 border-neutral-800">
            <div className="mb-4">
              <h3 className="text-white font-bold">Gameplay</h3>
            </div>
            <div className="space-y-3">
              {filteredGameplay.map((item) => (
                <details key={item.question} className="group rounded-lg border border-white/10 bg-black/20 p-4 open:border-red-500/30">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-white flex items-start justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/80 rounded">
                    <span>{item.question}</span>
                    <span className="text-red-400 text-xs group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="text-sm text-neutral-400 mt-3 leading-relaxed whitespace-pre-line">{item.answer}</p>
                </details>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-neutral-900/60 border-neutral-800">
            <div className="mb-4">
              <h3 className="text-white font-bold">Server Rules / Gameplay</h3>
            </div>
            <div className="space-y-3">
              {filteredRules.map((item) => (
                <details key={item.question} className="group rounded-lg border border-white/10 bg-black/20 p-4 open:border-amber-500/30">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-white flex items-start justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/80 rounded">
                    <span>{item.question}</span>
                    <span className="text-amber-400 text-xs group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="text-sm text-neutral-400 mt-3 leading-relaxed whitespace-pre-line">{item.answer}</p>
                </details>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-neutral-900/60 border-neutral-800">
            <div className="mb-4">
              <h3 className="text-white font-bold">Joining Issues / Mods / Performance</h3>
            </div>
            <div className="space-y-3">
              {filteredTechnical.map((item) => (
                <details key={item.question} className="group rounded-lg border border-white/10 bg-black/20 p-4 open:border-sky-500/30">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-white flex items-start justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/80 rounded">
                    <span>{item.question}</span>
                    <span className="text-sky-400 text-xs group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="text-sm text-neutral-400 mt-3 leading-relaxed whitespace-pre-line">{item.answer}</p>
                </details>
              ))}
            </div>
          </Card>
        </div>
        {!hasFaqResults && (
          <div className="mt-6 rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-sm text-neutral-400">
            No FAQ entries matched your search. Try broader keywords like &quot;mods&quot;, &quot;join&quot;, or &quot;wipe&quot;.
          </div>
        )}
      </section>
    </div>
  );
}