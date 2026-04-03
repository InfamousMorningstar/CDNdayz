import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Metadata } from 'next';
import Link from 'next/link';
import { Download, Search, Check, Play, HelpCircle } from 'lucide-react';
import { CinematicBackground } from '@/components/features/CinematicBackground';
import { LucideIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Join Guide | CDN - DayZ',
  description: 'Step-by-step instructions on how to join the CDN DayZ PvE servers.',
};

type JoinStep = {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: {
    label: string;
    url: string;
  };
};

const steps: JoinStep[] = [
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
  },
  {
    title: 'Click Play',
    description: 'Wait for mods to download and verify. The launcher handles everything.',
    icon: Play,
  },
];

export default function JoinPage() {
  return (
    <CinematicBackground backgroundImageSrc="/Images/3.jpg">
      <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center mb-10 sm:mb-16">
            <Badge variant="outline" className="mb-4 border-red-500/30 text-red-400 bg-red-900/10 backdrop-blur-sm px-4 py-1">
              Step-by-Step Guide
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-heading font-bold text-white mb-6">
              Join the <span className="text-red-500">Operation</span>
            </h1>
            <p className="text-neutral-400 text-base sm:text-lg max-w-2xl">
              Follow these steps to connect to the CDN network. Our servers use a curated modpack that is automatically downloaded.
            </p>
          </div>

          <h2 className="sr-only">Connection Steps</h2>

          <div className="space-y-8 sm:space-y-12 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-red-500 before:via-red-500/20 before:to-transparent">
            {steps.map((step, index) => (
              <div key={index} className="relative pl-12 md:pl-0 md:grid md:grid-cols-[200px_1fr] md:gap-8 items-start group">
                {/* Timeline dot */}
                <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-neutral-900 border-2 border-red-500/50 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(220,38,38,0.2)] md:relative md:left-auto md:top-auto md:w-16 md:h-16 md:mx-auto">
                  <span className="font-mono font-bold text-white md:text-xl">{index + 1}</span>
                </div>
                
                <Card className="p-5 sm:p-8 bg-neutral-900/40 border-neutral-800 hover:border-red-500/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <step.icon className="text-red-500 w-6 h-6" />
                      <h3 className="text-xl sm:text-2xl font-bold text-white">{step.title}</h3>
                    </div>
                    {step.action && (
                      <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                        <a href={step.action.url} target="_blank" rel="noopener noreferrer">
                          {step.action.label}
                        </a>
                      </Button>
                    )}
                  </div>
                  
                  <p className="text-neutral-400 leading-relaxed text-base sm:text-lg mb-4">
                    {step.description}
                  </p>
                </Card>
              </div>
            ))}
          </div>

          <div className="mt-14 sm:mt-20 pt-8 sm:pt-10 border-t border-white/5 flex flex-col items-center text-center">
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
    </CinematicBackground>
  );
}
