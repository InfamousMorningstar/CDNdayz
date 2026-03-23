import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { ServersList } from '@/components/sections/ServersList';
import { JoinCTA } from '@/components/sections/JoinCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <ServersList />
      <JoinCTA />
    </>
  );
}
