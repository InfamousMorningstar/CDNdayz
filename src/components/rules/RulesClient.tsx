"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Hammer, MessageSquare, AlertTriangle, BookOpen, Terminal, Construction, Users } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

type Tab = 'general' | 'building';

export function RulesClient() {
  const [activeTab, setActiveTab] = useState<Tab>('general');

  return (
    <div className="max-w-6xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <button
          onClick={() => setActiveTab('general')}
          className={cn(
            "flex items-center gap-2 px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 border",
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
            "flex items-center gap-2 px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 border",
            activeTab === 'building'
              ? "bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]"
              : "bg-neutral-900/50 border-neutral-800 text-neutral-400 hover:border-red-500/50 hover:text-white"
          )}
        >
          <Hammer className="w-5 h-5" />
          Base Building
        </button>
      </div>

      <div className="min-h-[600px]">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* General Conduct */}
                <Card className="p-8 bg-neutral-900/60 border-neutral-800">
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
                <Card className="p-8 bg-neutral-900/60 border-neutral-800">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                    <Terminal className="text-red-500 w-6 h-6" />
                    <h2 className="text-2xl font-heading font-bold text-white">Ticket System</h2>
                  </div>
                  <p className="text-neutral-400 mb-4 text-sm">Use when you want to chat with an Admin or if you have an in-game issue.</p>
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
                       Admins do want to help you. Though writing &quot;heli went missing&quot; or &quot;drop/give dono gear&quot; doesn{`'`}t help anyone.
                     </p>
                     <p className="italic text-neutral-500">
                       Politeness will also make things go smoother. Our admins are on throughout the day, but not all day, so please be patient when making a ticket.
                     </p>
                  </div>
                </Card>

                {/* Chat Rules */}
                <Card className="p-8 bg-neutral-900/60 border-neutral-800 md:col-span-2">
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="p-8 bg-neutral-900/60 border-neutral-800 lg:col-span-2">
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

                <Card className="p-8 bg-neutral-900/60 border-neutral-800">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-8 bg-neutral-900/60 border-neutral-800">
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

                <Card className="p-8 bg-neutral-900/60 border-neutral-800">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                    <AlertTriangle className="text-red-500 w-6 h-6" />
                    <h2 className="text-2xl font-heading font-bold text-white">Special Rules</h2>
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
    </div>
  );
}