import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Metadata } from 'next';
import Link from 'next/link';
import { Download, Search, Check, Play, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Join Guide | CDN - DayZ',
  description: 'Step-by-step instructions on how to join the CDN DayZ PvE servers.',
};

const steps = [
  {
    title: 'Install DayZ',
    description: 'Ensure you have DayZ installed via Steam.',
    icon: Download,
    action: { label: 'Get on Steam', url: 'https://store.steampowered.com/app/221100/DayZ/' },
  },
  {
    title: 'Download Launcher',
    description: 'We recommend using DZSA Launcher for easy mod management.',
    icon: Search,
    action: { label: 'Download DZSA', url: 'https://dayzsalauncher.com/' },
  },
  {
    title: 'Search for "CDN"',
    description: 'Open the launcher and type "CDN" in the filter bar.',
    icon: Search,
    image: '/launcher-guide.jpg', // Placeholder
  },
  {
    title: 'Click Play',
    description: 'Wait for mods to download and verify. The launcher handles everything.',
    icon: Play,
  },
];

export default function JoinPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 container mx-auto px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-center">Join the <span className="text-red-500">Operation</span></h1>
        <p className="text-neutral-400 text-center text-lg mb-16 max-w-2xl mx-auto">
          Follow these steps to connect to the CDN network. Our servers use a curated modpack that is automatically downloaded.
        </p>

        <div className="space-y-12 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-red-500 before:via-red-500/20 before:to-transparent">
          {steps.map((step, index) => (
            <div key={index} className="relative pl-12 md:pl-0 md:grid md:grid-cols-[200px_1fr] md:gap-8 items-start group">
              {/* Timeline dot */}
              <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-neutral-900 border-2 border-red-500/50 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(220,38,38,0.2)] md:relative md:left-auto md:top-auto md:w-16 md:h-16 md:mx-auto">
                <span className="font-mono font-bold text-white md:text-xl">{index + 1}</span>
              </div>
              
              <Card className="p-8 bg-neutral-900/40 border-neutral-800 hover:border-red-500/30 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <step.icon className="text-red-500 w-6 h-6" />
                    <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                  </div>
                  {step.action && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={step.action.url} target="_blank" rel="noopener noreferrer">
                        {step.action.label}
                      </a>
                    </Button>
                  )}
                </div>
                
                <p className="text-neutral-400 leading-relaxed text-lg mb-4">
                  {step.description}
                </p>

                {step.image && (
                  <div className="w-full h-48 bg-black/50 rounded-lg border border-white/5 flex items-center justify-center text-neutral-600">
                     <span className="text-sm">Screenshots/Images go here</span>
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col items-center text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Already in?</h3>
            <p className="text-neutral-400 mb-8 max-w-lg">
              Check out our New Player Guide to learn the basics of survival, trading, and base building on CDN.
            </p>
            <Button size="lg" className="px-10" asChild>
               <Link href="/new-player">View Survival Guide</Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
