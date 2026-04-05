"use client";

import { AnchorHTMLAttributes, MouseEvent } from 'react';
import { openDiscordAppFirst } from '@/lib/discord';

type DiscordLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export function DiscordLink({
  href,
  onClick,
  target = '_blank',
  rel = 'noopener noreferrer',
  children,
  ...props
}: DiscordLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    openDiscordAppFirst(href, target === '_self' ? '_self' : '_blank');
  };

  return (
    <a href={href} target={target} rel={rel} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
