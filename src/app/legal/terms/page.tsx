import { CinematicBackground } from '@/components/features/CinematicBackground';
import { Card } from '@/components/ui/Card';
import { Shield, Info } from 'lucide-react';
import { DISCORD_INVITE_URL } from '@/lib/links';
import { DiscordLink } from '@/components/ui/DiscordLink';

export const metadata = {
  title: 'Terms of Service | CDN DayZ',
  description: 'Terms of service and legal information for the CDN DayZ community website.',
};

export default function TermsPage() {
  return (
    <CinematicBackground>
      <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 sm:mb-8">Terms of Service</h1>
          
          <Card className="p-5 sm:p-8 md:p-12 bg-neutral-900/60 border-neutral-800 backdrop-blur-md">
            <div className="prose prose-invert max-w-none space-y-8">
              
              <section>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Info className="text-red-500" />
                  1. Project Nature & Ownership
                </h2>
                <p className="text-neutral-300 leading-relaxed">
                  The <strong>CDN DayZ Portal</strong> is an independent, community-driven project designed and maintained for the CDN DayZ community.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-400 mt-4">
                  <li>
                    <strong>Design & Code:</strong> The underlying code, design architecture, and frontend implementation are maintained for CDN DayZ operations and community use.
                  </li>
                  <li>
                    <strong>Server Content:</strong> All game-related data, server rules, lore, and community guidelines are provided and owned by the <strong>CDN DayZ Administration</strong>.
                  </li>
                  <li>
                    <strong>Authorization:</strong> This project has been authorized by the CDN DayZ server owner for public use by the community.
                  </li>
                </ul>
              </section>

              <div className="h-px bg-white/5 my-8" />

              <section>
                <h2 className="text-2xl font-bold text-white">2. Liability Disclaimer</h2>
                <p className="text-neutral-300 leading-relaxed mt-4">
                  This website is provided "as is" without any warranties. The CDN web team is not responsible for:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-400 mt-4">
                  <li>Temporary downtimes or interruptions in server status reporting.</li>
                  <li>Any inaccuracies in the data fetched from third-party APIs (Steam, Discord, Gamedig).</li>
                  <li>In-game issues, bans, or disputes, which should be directed to the CDN DayZ moderation team via Discord.</li>
                </ul>
              </section>

              <div className="h-px bg-white/5 my-8" />

              <section>
                <h2 className="text-2xl font-bold text-white">3. Third-Party Services</h2>
                <p className="text-neutral-300 leading-relaxed mt-4">
                  This website integrates with external services to provide functionality:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-400 mt-4">
                  <li><strong>Steam API:</strong> Used to fetch official game news and updates.</li>
                  <li><strong>Gamedig:</strong> Used to query live server status and player counts.</li>
                  <li><strong>Discord:</strong> Used for community communication and support tickets.</li>
                </ul>
                <p className="text-neutral-400 mt-4">
                  Usage of these services is subject to their respective Terms of Service.
                </p>
              </section>

              <div className="h-px bg-white/5 my-8" />

              <section>
                <h2 className="text-2xl font-bold text-white">4. Contact</h2>
                <div className="bg-neutral-950/50 p-6 rounded-lg border border-neutral-800 mt-4">
                  <p className="text-neutral-300 mb-4">
                    <strong>For Website Issues:</strong> If you encounter bugs or technical errors on this site, please contact <a href="https://portfolio.ahmxd.net" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 underline">Morningstar.0</a>.
                  </p>
                  <p className="text-neutral-300">
                    <strong>For Server Issues:</strong> If you have issues with in-game griefing, bans, or donations, please open a ticket in the official <DiscordLink href={DISCORD_INVITE_URL} className="text-red-400 hover:text-red-300 underline">CDN Discord</DiscordLink>.
                  </p>
                </div>
              </section>

            </div>
          </Card>
        </div>
      </div>
    </CinematicBackground>
  );
}
