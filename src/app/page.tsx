import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { QuickInfo } from '@/components/sections/QuickInfo';
import { ServersList } from '@/components/sections/ServersList';
import { JoinCTA } from '@/components/sections/JoinCTA';
import { QuickStartGuide } from '@/components/sections/QuickStartGuide';

export default function Home() {
  return (
    <>
      <Hero />
      <QuickInfo />
      <ServersList />
      <QuickStartGuide />
      <Features />
      <JoinCTA />
    </>
  );
}
