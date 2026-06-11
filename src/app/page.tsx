import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { QuickInfo } from '@/components/sections/QuickInfo';
import { ServersList } from '@/components/sections/ServersList';
import { JoinCTA } from '@/components/sections/JoinCTA';
import { QuickStartGuide } from '@/components/sections/QuickStartGuide';
import { StatsBand } from '@/components/sections/StatsBand';
import { VelocityMarquee } from '@/components/motion/VelocityMarquee';

export default function Home() {
  return (
    <>
      <Hero />
      <VelocityMarquee text="Survive Together — Thrive Forever — CDN Network" />
      <QuickInfo />
      <StatsBand />
      <QuickStartGuide />
      <ServersList />
      <Features />
      <JoinCTA />
    </>
  );
}
