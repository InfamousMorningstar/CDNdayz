import { rulesData } from '@/data/mock';
import { Card } from '@/components/ui/Card';
import { Metadata } from 'next';
import { Shield, Book, Hammer, Skull, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Network Rules | CDN',
  description: 'Community guidelines and server rules for the CDN DayZ PvE Network.',
};

const iconMap: Record<string, any> = {
  'General Conduct': Shield,
  'PvE Rules': Book,
  'Base Building': Hammer,
  'PvP Rules': Skull,
};

export default function RulesPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 container mx-auto px-6">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Network <span className="text-red-500">Protocol</span></h1>
        <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
          Strict adherence to these guidelines ensures a premium experience for all survivors. Violations may result in immediate suspension.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rulesData.map((section, index) => {
          const Icon = iconMap[section.title] || Shield;
          
          return (
            <Card key={section.title} className="flex flex-col p-8 h-full bg-neutral-900/40 border-neutral-800">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/5">
                <div className="p-3 rounded-lg bg-red-500/10 text-red-500">
                  <Icon size={24} />
                </div>
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">{section.title}</h2>
              </div>
              
              <ul className="space-y-4 mb-6 flex-1">
                {section.rules.map((rule, rIndex) => (
                  <li key={rIndex} className="flex gap-3 text-neutral-300 group">
                    <span className="text-red-500/50 font-mono text-sm mt-1 select-none group-hover:text-red-500 transition-colors">
                      {String(rIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="leading-relaxed text-sm group-hover:text-neutral-100 transition-colors">
                      {rule}
                    </span>
                  </li>
                ))}
              </ul>

              {section.title === 'Base Building' && (
                <div className="pt-4 border-t border-white/5 mt-auto">
                    <Button variant="outline" className="w-full justify-between group" asChild>
                       <Link href="/rules/building">
                         Detailed Guidelines 
                         <ChevronRight className="w-4 h-4 text-red-500 group-hover:translate-x-1 transition-transform" />
                       </Link>
                    </Button>
                </div>
              )}
            </Card>
          );
        })}
      
        {/* Support Section */}
        <Card className="p-8 md:col-span-2 lg:col-span-3 border-red-500/20 bg-red-950/5 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
               <div className="p-4 rounded-full bg-red-500/10 text-red-400">
                 <Shield size={32} />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-white mb-1">Need Clarification?</h3>
                 <p className="text-neutral-400 text-sm">Create a ticket in our Discord if you are unsure about a specific rule.</p>
               </div>
            </div>
            <Badge variant="outline" className="text-red-400 border-red-500/30 px-4 py-2 hover:bg-red-500/10 cursor-pointer">
              Open Support Ticket
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}
