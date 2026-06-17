import { Metadata } from 'next';
import { WikiExperience } from '@/components/wiki/WikiExperience';

export const metadata: Metadata = {
  title: "CDN Wiki | Terje Medicine & BoomLay's Things",
  description:
    "CDN field manuals for Hardcore Hashima: the Terje Medicine condition guide plus the BoomLay's Things furniture and crafting reference.",
};

export default function WikiPage() {
  return <WikiExperience />;
}
