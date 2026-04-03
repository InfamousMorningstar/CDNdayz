export type DayzErrorReference = {
  id: string;
  title: string;
  url: string;
  type: 'official' | 'official_forum' | 'support' | 'community';
  note: string;
  evidenceQuotes: string[];
};

export const dayzErrorReferences: DayzErrorReference[] = [
  {
    id: 'R1',
    title: 'Bohemia Community Wiki - DayZ Error Codes',
    url: 'https://community.bistudio.com/wiki/DayZ:Error_Codes',
    type: 'official',
    note: 'Official DayZ error code index page referenced by Bohemia community resources and search indexes.',
    evidenceQuotes: [
      '"With Game Update 1.12, DayZ introduced new error codes when it comes to the server connection process."',
      '"This page is dedicated to error codes that will appear in the server browser upon attempt of connection, or disconnect from a server."'
    ]
  },
  {
    id: 'R2',
    title: 'BattlEye FAQ',
    url: 'https://www.battleye.com/support/faq/',
    type: 'support',
    note: 'Authoritative troubleshooting for BattlEye service, client not responding, query timeout, and blocked service cases.',
    evidenceQuotes: [
      '"I am getting kicked for the following violation(s). ... Client not responding ... Query Timeout"',
      '"Please ensure that any security software ... does not block the BE Service ... You might have to add it to your security software\'s exception list."'
    ]
  },
  {
    id: 'R3',
    title: 'Steam Support - Verify Integrity of Game Files',
    url: 'https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB',
    type: 'support',
    note: 'Official Steam repair step used for client corruption and missing file checks.',
    evidenceQuotes: [
      '"If you are missing textures or other content in game or experiencing crashing ... have Steam verify that the game\'s files are installed correctly."',
      '"Select the Installed Files tab and click the Verify integrity of game files button."'
    ]
  },
  {
    id: 'R4',
    title: 'DayZ Forums - 0x00040004 Error Thread',
    url: 'https://forums.dayz.com/topic/258920-0x00040004-error/',
    type: 'official_forum',
    note: 'Community troubleshooting examples for timeout-related connection failures.',
    evidenceQuotes: [
      '"Same on both official and community."',
      '"did you tryed to clean the Windows DNS cache ... ipconfig /flushdns"'
    ]
  },
  {
    id: 'R5',
    title: 'DayZ Forums - Warning 0x000400F0 (Client not responding)',
    url: 'https://forums.dayz.com/topic/255088-warning-0x000400f0-client-not-responding/',
    type: 'official_forum',
    note: 'Community symptom patterns around BattlEye client response failures.',
    evidenceQuotes: [
      '"Warning 0x000400F0 (Client not responding)."',
      '"I\'ve tried official and modded servers but I still can\'t connect."'
    ]
  },
  {
    id: 'R6',
    title: 'Bohemia Feedback Tracker - T159696',
    url: 'https://feedback.bistudio.com/T159696',
    type: 'official',
    note: 'Indexed quote links 0x00040004 to timeout and 0x000400F0 to BattlEye/admin kick contexts.',
    evidenceQuotes: [
      '"0x00040004 refers to your connection timing out."',
      '"0x000400F0 is either a kick from battleye or from the server admin (the latter applies only to community servers)."'
    ]
  },
  {
    id: 'R7',
    title: 'Bohemia Feedback Tracker - T158246',
    url: 'https://feedback.bistudio.com/T158246',
    type: 'official',
    note: 'Indexed quote states 0x00040004 indicates network timeout and advises packet-loss/network checks.',
    evidenceQuotes: [
      '"The 0x00040004 error specifies that there has been a network timeout between your client and the server."',
      '"We suggest that you check your network for any issues/packet loss."'
    ]
  },
  {
    id: 'R8',
    title: 'Bohemia Feedback Tracker - T171043',
    url: 'https://feedback.bistudio.com/T171043',
    type: 'official',
    note: 'Indexed ticket includes a 0x000400F0 BattlEye Bad Service Version case.',
    evidenceQuotes: [
      '"Unable to connect to any server due to Warning (0x000400F0) ... BattlEye (Bad Service Version)."'
    ]
  },
  {
    id: 'R9',
    title: 'Bohemia Feedback Tracker - T181823',
    url: 'https://feedback.bistudio.com/T181823',
    type: 'official',
    note: 'Indexed ticket includes 0x000400F0 BattlEye Query Timeout case.',
    evidenceQuotes: [
      '"Kick every 15 minutes with error 0x000400F0 (BattlEye Query timeout)."'
    ]
  },
  {
    id: 'R10',
    title: 'Bohemia Feedback Tracker - T183960',
    url: 'https://feedback.bistudio.com/T183960',
    type: 'official',
    note: 'Indexed ticket includes 0x00040031 WaitAuthPlayerLoginState login timeout context.',
    evidenceQuotes: [
      '"Warning (0x00040031) ... Login error: Login time out. (WaitAuthPlayerLoginState)."'
    ]
  },
  {
    id: 'R11',
    title: 'Steam Community - 0x000400F0 Client Not Responding Thread',
    url: 'https://steamcommunity.com/app/221100/discussions/0/600787351824961837/',
    type: 'community',
    note: 'Community-reported workaround patterns, including launcher-vs-in-game join behavior and resource saturation symptoms.',
    evidenceQuotes: [
      '"BattlEye is not the problem, it is just the mechanism for delivering the Error message that your Game Client is not responding."',
      '"Instead of direct joining ... joined through the in-game menu ... and that fixed it."'
    ]
  }
];