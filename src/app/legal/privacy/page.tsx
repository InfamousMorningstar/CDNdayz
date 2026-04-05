import { CinematicBackground } from '@/components/features/CinematicBackground';
import { Card } from '@/components/ui/Card';
import { DISCORD_INVITE_URL } from '@/lib/links';
import { DiscordLink } from '@/components/ui/DiscordLink';

export const metadata = {
  title: 'Privacy Policy | CDN DayZ',
  description: 'Privacy policy for the CDN DayZ community website.',
};

export default function PrivacyPage() {
  return (
    <CinematicBackground>
      <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 sm:mb-8">Privacy Policy</h1>
          
          <Card className="p-5 sm:p-8 md:p-12 bg-neutral-900/60 border-neutral-800 backdrop-blur-md">
            <div className="prose prose-invert max-w-none space-y-8">
              
              <section>
                <h2 className="text-2xl font-bold text-white">1. Data Collection</h2>
                <p className="text-neutral-300 leading-relaxed mt-4">
                  This website ("CDN DayZ Portal") prioritizes user privacy.
                  <strong className="text-white block mt-2">
                    We collect minimal to no personally identifiable information (PII).
                  </strong>
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-400 mt-4">
                  <li>
                    <strong>Server Queries:</strong> We use public APIs (like Gamedig) to fetch server status (player count, uptime). This does not log or track individual player IPs or session data.
                  </li>
                  <li>
                    <strong>Steam Updates:</strong> We fetch public news/updates from Steam's API. No Steam login or account linking is required to view this content.
                  </li>
                  <li>
                    <strong>Discord Integration:</strong> Links to Discord redirect you to their platform. We do not store or access your Discord account data.
                  </li>
                </ul>
              </section>

              <div className="h-px bg-white/5 my-8" />

              <section>
                <h2 className="text-2xl font-bold text-white">2. Cookies & Local Storage</h2>
                <p className="text-neutral-300 leading-relaxed mt-4">
                  This website uses minimal browser storage for essential functionality:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-400 mt-4">
                  <li>
                    <strong>Functionality:</strong> Storing UI preferences (like dark mode, if applicable) or minimizing repeated network requests.
                  </li>
                  <li>
                    <strong>Analytics:</strong> Currently, this site does not use invasive tracking pixels or advertising cookies.
                  </li>
                </ul>
              </section>

              <div className="h-px bg-white/5 my-8" />

              <section>
                <h2 className="text-2xl font-bold text-white">3. Third-Party Links</h2>
                <p className="text-neutral-300 leading-relaxed mt-4">
                  This site contains links to other websites (Discord, Steam, Bohemia Interactive). Please note that we are not responsible for the privacy practices of these external sites.
                </p>
                <p className="text-neutral-300 leading-relaxed mt-2">
                  We encourage users to be aware when they leave our site and to read the privacy statements of any other site that collects personally identifiable information.
                </p>
              </section>

              <div className="h-px bg-white/5 my-8" />

              <section>
                <h2 className="text-2xl font-bold text-white">4. Children's Privacy</h2>
                <p className="text-neutral-300 leading-relaxed mt-4">
                  This service is not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately for removal.
                </p>
              </section>

              <div className="h-px bg-white/5 my-8" />

              <section>
                <h2 className="text-2xl font-bold text-white">5. Updates & Contact</h2>
                <p className="text-neutral-300 leading-relaxed mt-4">
                  This policy is effective as of 2026 and may be updated periodically. Your continued use of the website constitutes acceptance of any changes.
                </p>
                <p className="text-neutral-300 leading-relaxed mt-4">
                  For questions regarding this policy or the website&apos;s data practices, please contact <a href="https://portfolio.ahmxd.net" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 underline">Morningstar.0</a> or the CDN Administration on <DiscordLink href={DISCORD_INVITE_URL} className="text-red-400 hover:text-red-300 underline">Discord</DiscordLink>.
                </p>
              </section>

            </div>
          </Card>
        </div>
      </div>
    </CinematicBackground>
  );
}
