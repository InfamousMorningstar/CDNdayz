const DISCORD_HOSTS = [
  'discord.gg',
  'www.discord.gg',
  'discord.com',
  'www.discord.com',
  'canary.discord.com',
  'ptb.discord.com',
];

function getDiscordUrl(url: string): URL | null {
  try {
    const parsed = new URL(url);
    if (!DISCORD_HOSTS.includes(parsed.hostname.toLowerCase())) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function getDiscordDeepLink(url: string): string | null {
  const parsed = getDiscordUrl(url);
  if (!parsed) {
    return null;
  }

  const host = parsed.hostname.toLowerCase();

  if (host === 'discord.gg' || host === 'www.discord.gg') {
    const inviteCode = parsed.pathname.replace(/^\/+/, '');
    return inviteCode ? `discord://invite/${inviteCode}` : null;
  }

  const channelMatch = parsed.pathname.match(/^\/channels\/([^/]+)\/([^/]+)/);
  if (channelMatch) {
    const [, guildId, channelId] = channelMatch;
    return `discord://-/channels/${guildId}/${channelId}`;
  }

  const inviteMatch = parsed.pathname.match(/^\/invite\/([^/]+)/);
  if (inviteMatch) {
    return `discord://invite/${inviteMatch[1]}`;
  }

  return null;
}

export function openDiscordAppFirst(url: string, fallbackTarget: '_blank' | '_self' = '_blank'): void {
  if (typeof window === 'undefined') {
    return;
  }

  const deepLink = getDiscordDeepLink(url);
  if (!deepLink) {
    window.open(url, fallbackTarget, 'noopener,noreferrer');
    return;
  }

  let fallbackHandled = false;
  let fallbackTimer = 0;
  let iframe: HTMLIFrameElement | null = null;

  const cleanup = () => {
    if (fallbackTimer) {
      window.clearTimeout(fallbackTimer);
      fallbackTimer = 0;
    }

    window.removeEventListener('blur', onExitPage);
    document.removeEventListener('visibilitychange', onVisibilityChange);

    if (iframe && iframe.parentNode) {
      iframe.parentNode.removeChild(iframe);
      iframe = null;
    }
  };

  const openFallback = () => {
    if (fallbackHandled) {
      return;
    }

    fallbackHandled = true;
    cleanup();
    window.open(url, fallbackTarget, 'noopener,noreferrer');
  };

  const onExitPage = () => {
    fallbackHandled = true;
    cleanup();
  };

  const onVisibilityChange = () => {
    if (document.hidden) {
      onExitPage();
    }
  };

  window.addEventListener('blur', onExitPage, { once: true });
  document.addEventListener('visibilitychange', onVisibilityChange, { once: true });

  iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = deepLink;
  document.body.appendChild(iframe);

  fallbackTimer = window.setTimeout(() => {
    openFallback();
  }, 900);
}
