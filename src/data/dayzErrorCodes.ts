export type DayzErrorCode = {
  code: string;
  title: string;
  category: string;
  description: string;
  commonCauses: string[];
  recommendedFixes: string[];
  status: "documented" | "partially_documented" | "inferred";
  sourceIds: string[];
};

export const dayzErrorCodes: DayzErrorCode[] = [
  {
    code: "0xC0000409",
    title: "PROCESS_CORRUPTION_FAST_FAIL",
    category: "Client Crash / Runtime",
    description: "Windows raised a non-continuable fast-fail exception (0xC0000409), indicating the process was considered corrupted and terminated immediately.",
    commonCauses: [
      "Critical runtime corruption detected by Windows fail-fast handling",
      "Injected/blocked third-party files or security tooling conflicts in the game process path",
      "Corrupted game/runtime files that destabilize startup or in-session execution",
      "Corrupted or outdated mods causing client instability during load or gameplay"
    ],
    recommendedFixes: [
      "Verify DayZ files in Steam (Installed Files -> Verify integrity of game files)",
      "Repair BattlEye path and ensure BEService/launcher executables are not blocked by antivirus or firewall",
      "Update all required server mods and repair/re-download corrupted Workshop mod content before reconnecting",
      "Check for unexpected injected DLLs in the game directory (for example d3d9.dll, dxgi.dll, dsound.dll) and remove non-required hooks/overlays",
      "Reboot and retest with minimal background software to isolate third-party conflicts"
    ],
    status: "documented",
    sourceIds: ["R12", "R13", "R2", "R3"]
  },
  {
    code: "0x00040004",
    title: "NETWORK_TIMEOUT",
    category: "Network / Connection",
    description: "Client timed out while communicating with the server.",
    commonCauses: [
      "Slow storage such as HDD or external USB drive",
      "Network instability or packet loss",
      "Large mod packs loading too slowly"
    ],
    recommendedFixes: [
      "Use a stable wired connection and reduce packet loss/jitter",
      "Restart router/modem and renew local network stack",
      "Verify game files through Steam"
    ],
    status: "documented",
    sourceIds: ["R1", "R3", "R4", "R6", "R7"]
  },
  {
    code: "0x0004000A",
    title: "UNSTABLE_NETWORK",
    category: "Network / Connection",
    description: "Connection to the server is inconsistent or fluctuating.",
    commonCauses: [
      "Unstable Wi-Fi or congested local network",
      "High latency and packet loss between client and server",
      "Transient ISP or route instability"
    ],
    recommendedFixes: [
      "Use Ethernet instead of Wi-Fi where possible",
      "Restart network equipment and retry on a cleaner route",
      "Test another server/region to isolate route-specific instability"
    ],
    status: "partially_documented",
    sourceIds: ["R1", "R4", "R6", "R7"]
  },
  {
    code: "0x0004000B",
    title: "SERVER_SHUTDOWN",
    category: "Network / Connection",
    description: "The server is shutting down or restarting.",
    commonCauses: [
      "Scheduled restart",
      "Server crash",
      "Maintenance"
    ],
    recommendedFixes: [
      "Wait for the server to come back online",
      "Reconnect after restart"
    ],
    status: "partially_documented",
    sourceIds: ["R1"]
  },
  {
    code: "0x00040010",
    title: "ADMIN_KICK",
    category: "Admin / Server Action",
    description: "Player was removed by a server administrator or admin system (and can occasionally appear during scripted pre-restart kick routines).",
    commonCauses: [
      "Manual admin kick",
      "Rule enforcement",
      "Automated moderation",
      "Automated pre-restart player kick routine on some community servers"
    ],
    recommendedFixes: [
      "If a restart was announced, wait and reconnect after the server is back up",
      "Contact the server admin if needed",
      "Review server rules"
    ],
    status: "partially_documented",
    sourceIds: ["R1"]
  },
  {
    code: "0x00040011",
    title: "INVALID_ID",
    category: "Admin / Server Action",
    description: "Invalid or missing player/session ID.",
    commonCauses: [
      "Session desync",
      "Corrupted local data"
    ],
    recommendedFixes: [
      "Restart the game",
      "Verify game files"
    ],
    status: "partially_documented",
    sourceIds: ["R1", "R3"]
  },
  {
    code: "0x00040030",
    title: "LOGIN_MACHINE_ERROR",
    category: "Login / Player State",
    description: "An error occurred during the login process.",
    commonCauses: [
      "Server-side session initialization issue",
      "Temporary backend failure"
    ],
    recommendedFixes: [
      "Reconnect",
      "Try another server"
    ],
    status: "partially_documented",
    sourceIds: ["R1", "R10"]
  },
  {
    code: "0x00040031",
    title: "PLAYER_STATE_TIMEOUT",
    category: "Login / Player State",
    description: "Player data failed to load in time.",
    commonCauses: [
      "Authentication/login state timed out on server handshake",
      "Backend/server load during player auth",
      "Client sync delay during login state transition"
    ],
    recommendedFixes: [
      "Retry after server restart or lower-load period",
      "Verify files and relaunch before reconnect",
      "Try another server to isolate whether the issue is server-specific"
    ],
    status: "documented",
    sourceIds: ["R1", "R3", "R10"]
  },
  {
    code: "0x00040050",
    title: "INIT_RESPAWN_IDENTITY",
    category: "Respawn / Identity",
    description: "Issue initializing player identity during respawn.",
    commonCauses: [
      "Server-side respawn state issue",
      "Character identity initialization failure"
    ],
    recommendedFixes: [
      "Reconnect",
      "Retry after server restart"
    ],
    status: "partially_documented",
    sourceIds: ["R1"]
  },
  {
    code: "0x00040051",
    title: "RESPAWN_IDENTITY_ERROR",
    category: "Respawn / Identity",
    description: "Respawn identity process failed.",
    commonCauses: [
      "Identity state corruption",
      "Server-side respawn issue"
    ],
    recommendedFixes: [
      "Reconnect",
      "Try again after restart"
    ],
    status: "partially_documented",
    sourceIds: ["R1"]
  },
  {
    code: "0x000400F0",
    title: "CLIENT_NOT_RESPONDING",
    category: "BattlEye / Client Response",
    description: "Client failed to respond to BattlEye or related checks.",
    commonCauses: [
      "BattlEye service/client path is blocked or not responding",
      "Service version mismatch or query timeout variants",
      "System/resource stalls that prevent timely BattlEye response"
    ],
    recommendedFixes: [
      "Verify game files and reinstall/repair BattlEye service",
      "Allow BattlEye executables in antivirus/firewall and remove blockers",
      "Relaunch and join via in-game browser if launcher direct-join fails"
    ],
    status: "documented",
    sourceIds: ["R1", "R2", "R3", "R5", "R6", "R8", "R9", "R11"]
  },
  {
    code: "0x00040093",
    title: "VE_DATA",
    category: "Mods / Verification",
    description: "Client was kicked because a mod's local version is older than the version installed on the server. DayZ verifies PBO file versions on join and rejects clients whose mod files do not match the server's current build.",
    commonCauses: [
      "Steam Workshop failed to auto-update the mod before you launched (common with large mod packs or slow connections)",
      "The server updated the mod (e.g. Dabs Framework) after you last launched the game without restarting Steam",
      "Steam download cache is stale or corrupted, preventing the mod from updating",
      "Multiple DayZ launchers (DayZ SA Launcher, DayZ Launcher, vanilla launcher) can each maintain their own mod state — one may have an outdated copy",
      "The mod was updated by the author and the server admin applied it immediately, leaving a short window where clients are behind"
    ],
    recommendedFixes: [
      "Fully close DayZ and Steam, then reopen Steam and wait for Workshop updates to complete before relaunching",
      "In Steam, go to Library → DayZ → Workshop → find the outdated mod (e.g. Dabs Framework) and manually check for updates or click Subscribe again to force a re-download",
      "Clear the Steam download cache: Steam menu → Settings → Downloads → Clear Download Cache, then relaunch Steam",
      "Unsubscribe from the mod in the Steam Workshop page, let Steam fully remove it, then resubscribe and re-download a clean copy",
      "Verify DayZ game file integrity via Steam (Library → DayZ → Properties → Installed Files → Verify integrity of game files) — this can also refresh Workshop mod metadata",
      "Recommended quickest fix: open DayZ SA Launcher (DZSA), go to the Mods tab, and use Verify on all installed mods — DZSA will detect and re-download any outdated or mismatched files, after which the game will load correctly",
      "If using DayZ SA Launcher or a third-party launcher, use its built-in 'Update Mods' or 'Check for Updates' function before joining the server"
    ],
    status: "documented",
    sourceIds: ["R1", "R3", "USER_REPORT"]
  },
  {
    code: "0x00040074",
    title: "VE_EXTRA_MOD",
    category: "Mods / Verification",
    description: "Client has a mod installed that is not present on the server, or mods failed to load/validate in time before server verification.",
    commonCauses: [
      "Client has extra mods the server doesn't run",
      "Mod was recently removed from server but client still has it",
      "Client launched wrong mod set for this server",
      "Mod manager activated mods not in server's active list",
      "Mods stored on slow storage (external HDD ~80-120 MB/s) and didn't load/validate in time during login",
      "Mod verification timeout due to system resource constraints or storage I/O bottleneck"
    ],
    recommendedFixes: [
      "Disable extra mods on your client that aren't on the server",
      "Verify server's active mod list before joining",
      "Use mod manager to synchronize your mods with server requirements",
      "Create a separate profile for this server with matching mods only",
      "Move game and mods to internal SSD (at minimum) or Thunderbolt SSD for consistent fast loading (90-98% success rate if HDD was the bottleneck)",
      "Avoid external HDDs (USB suffers from high latency and poor seek time with thousands of small mod files)",
      "Close background applications to free up system resources during mod loading"
    ],
    status: "documented",
    sourceIds: ["BOHEMIA_WIKI", "USER_REPORT", "PERF_TEST"]
  }
];