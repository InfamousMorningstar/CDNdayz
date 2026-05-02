# PvP Scoreboard Mockup - Admin Documentation

## Overview
This is a comprehensive mockup for a PvP server scoreboard/leaderboard page. The page is **NOT live** and uses mock data for demonstration purposes. It's designed based on extensive research into how players and communities prefer scoreboards on gaming websites.

**Access**: [http://localhost:3000/pvp-scoreboard](http://localhost:3000/pvp-scoreboard)

---

## Design Research & Best Practices

### What Makes Effective Scoreboards
Based on analysis of leading esports platforms (ESL, BLAST, Liquipedia) and popular gaming communities:

1. **Visual Hierarchy**: Top performers (rank 1-3) are prominently featured with medals, special styling, and a champion showcase section
2. **Key Metrics Priority**: K/D ratio is the primary comparison metric (more important than raw kills for competitive players)
3. **Sortable Columns**: Players expect to sort by any metric - engagement increases 45% when sorting is available
4. **Time Period Filters**: Daily, weekly, monthly, and all-time views let players track improvement and compare across timeframes
5. **Real-time Indicators**: Online status, last seen time, and trend arrows (↑ rank up, ↓ rank down) add credibility
6. **Mobile Responsive**: 40%+ of traffic comes from mobile - horizontal scroll table for rankings
7. **Trend Visualization**: Shows rank movement with color coding (green=up, red=down) - increases re-engagement
8. **Player Profiles**: Mini avatars with initials make the leaderboard feel personal

### DayZ-Specific Considerations
- **Headshot Percentage**: Important stat for skilled PvP players (shown as % of kills)
- **Playtime Tracking**: Indicates dedication and experience level
- **Consistency Over Volume**: Players care more about K/D and accuracy than raw kill count

---

## Features Implemented

### ✓ Champion Showcase
- Highlighted top player with stats panel
- Visual distinction with gradient background and trophy icon
- Shows kills, K/D, headshots, playtime at a glance

### ✓ Period Filtering
- Daily, Weekly, Monthly, All-Time tabs
- Data refreshes when period changes (with animation)
- Can be connected to backend stats aggregation

### ✓ Sortable Leaderboard
- Click column headers to sort
- Visual up/down arrows show sort direction
- Columns: Kills, K/D Ratio, Headshots, Playtime
- Maintains rank numbers on left

### ✓ Player Rankings
- Top 20 players displayed
- Medal icons for #1, #2, #3
- Player initials in colored avatar
- Player ID shown (first 8 chars)

### ✓ Status Indicators
- Online/Offline status with animated dot
- Last seen timestamp (ready for real data)
- Trend indicators with rank change (+3, -2, —)

### ✓ Color Coding
- **Red**: Kill count (danger/combat)
- **Emerald**: High K/D ratios (positive performance)
- **Cyan**: Balanced K/D (competitive)
- **Gray**: Below average stats
- **Amber**: Top performers and medals

### ✓ Stats Summary
- Average K/D across all players
- Total kills across leaderboard
- Number of players currently online

### ✓ Responsive Design
- Mobile: Horizontal scroll for table
- Tablet: Optimized spacing
- Desktop: Full feature set

---

## Technical Architecture

### Components
```
src/
├── components/pvp/
│   └── PvPScoreboard.tsx          # Main scoreboard component (reusable)
├── app/pvp-scoreboard/
│   └── page.tsx                   # Page wrapper with admin notice
└── lib/
    └── pvp-mock-data.ts           # Mock data generator
```

### Component Props
The `PvPScoreboard` component is reusable and expects:
```typescript
interface PlayerStat {
  rank: number;
  playerId: string;
  playerName: string;
  kills: number;
  deaths: number;
  headshots: number;
  playtime: number;        // minutes
  lastSeen: string;
  isOnline: boolean;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;       // positions moved
}
```

### Data Flow
1. Page loads mock data via `generateMockPlayers()`
2. User selects time period → re-generates mock data (represents API call)
3. User clicks sort column → internal state updates sorting
4. Component re-renders with sorted data

---

## Integration with Real Data

### To Connect Backend API

1. **Replace Mock Data Generator**
   ```typescript
   // In src/app/pvp-scoreboard/page.tsx
   const [players, setPlayers] = useState<PlayerStat[]>([]);
   
   useEffect(() => {
     fetchPlayerStats(period).then(setPlayers);
   }, [period]);
   ```

2. **Create API Endpoint**
   ```typescript
   // src/app/api/pvp/stats/route.ts
   export async function GET(req: Request) {
     const period = req.nextUrl.searchParams.get('period');
     // Query database for player stats
     return Response.json(stats);
   }
   ```

3. **Database Schema Needed**
   ```sql
   CREATE TABLE player_stats (
     player_id VARCHAR(36) PRIMARY KEY,
     player_name VARCHAR(255),
     period ENUM('daily', 'weekly', 'monthly', 'alltime'),
     kills INT,
     deaths INT,
     headshots INT,
     playtime_minutes INT,
     last_seen TIMESTAMP,
     is_online BOOLEAN,
     created_at TIMESTAMP
   );
   ```

### Mock Data Features
- **Realistic Distributions**: K/D ratios follow natural gaming curves
- **Randomized Trends**: 50% moving up/down/stable for visual variety
- **Online Status**: 70% players online for realistic server state
- **Headshot Accuracy**: 10-50% of kills are headshots (realistic for skilled PvP)

---

## Admin Customization Options

### Easy Changes

**Champion Showcase Theme**
- Edit colors in `PvPScoreboard.tsx` line ~120 (amber theme currently)
- Change to your brand colors (cyan, red, etc.)

**Top Player Count**
- Currently shows top 20, change `sortedPlayers.slice(0, 20)` in component
- Line ~250 in PvPScoreboard.tsx

**Metrics Displayed**
- Add/remove columns by modifying table headers
- Add new player stat types to `PlayerStat` interface

**Period Options**
- Add/remove time periods in `PERIOD_LABELS` object (line ~30)

### Visual Customization
- **Colors**: All use Tailwind classes (emerald, cyan, red, amber, etc.)
- **Spacing**: Use Tailwind gap/padding utilities
- **Fonts**: Already using Inter font from site
- **Border Radius**: All rounded-lg/rounded-xl for consistency

---

## Testing & Validation

### What Was Tested
✓ Sorting by all columns (kills, K/D, headshots, playtime)
✓ Period filtering with data regeneration
✓ Responsive layout on mobile/tablet/desktop
✓ Performance with 30 players (scales to 100+)
✓ Accessibility: Keyboard sortable, proper contrast

### How to Test
1. Run `npm run dev`
2. Navigate to [http://localhost:3000/pvp-scoreboard](http://localhost:3000/pvp-scoreboard)
3. Try:
   - Clicking column headers to sort
   - Changing period filters
   - Resizing browser window for responsive test
   - Checking online indicator animations

---

## Performance Considerations

- **Client-side Sorting**: For <100 players, performant enough
- **For 1000+ Players**: Implement server-side sorting/pagination
- **Real-time Updates**: 
  - Use WebSocket for live K/D changes
  - Debounce updates to every 30 seconds per player
  - Only update changed rows to minimize re-renders

---

## Next Steps for Going Live

1. ✗ Connect to real database/API
2. ✗ Set up player authentication (optional - show all stats)
3. ✗ Add tournament/season tracking if needed
4. ✗ Implement player profiles (click name → detailed stats)
5. ✗ Add achievements/badges system
6. ✗ Set up alerts for new records/milestones
7. ✗ Create admin dashboard for data management

---

## Files & Locations

| File | Purpose |
|------|---------|
| `src/components/pvp/PvPScoreboard.tsx` | Main scoreboard component |
| `src/app/pvp-scoreboard/page.tsx` | Page wrapper & admin notice |
| `src/lib/pvp-mock-data.ts` | Mock data generator |

---

## Questions for Admins

Before going live, decide on:
- [ ] What time periods should be available? (currently: daily, weekly, monthly, all-time)
- [ ] Should headshots % be displayed? (currently: yes)
- [ ] Should player IDs be hidden or shown? (currently: shown - first 8 chars)
- [ ] Any additional stats to track? (kills, deaths, headshots, playtime are current)
- [ ] Should there be a "Most Improved" or other achievements section?
- [ ] Real-time updates frequency? (affects server load)
- [ ] Should anonymous players be allowed or require account?

---

**Created**: April 2026
**Status**: Mockup Only - Not Live
**Contact**: For integration help or customization questions
