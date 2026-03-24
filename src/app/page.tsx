import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { QuickInfo } from '@/components/sections/QuickInfo';
import { ServersList } from '@/components/sections/ServersList';
import { JoinCTA } from '@/components/sections/JoinCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <QuickInfo />
      <Features />
      <ServersList />
      <JoinCTA />
    </>
  );
}
