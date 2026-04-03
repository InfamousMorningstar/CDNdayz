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
  }
];