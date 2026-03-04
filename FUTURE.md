# Future Features

Ideas and features that are on the radar but not yet scheduled into the roadmap. These are tracked here so they don't get lost — they'll be promoted to ROADMAP.md phases when the time comes.

---

## Gamification & Scoring

A point-based system that rewards engagement and activity. Users earn XP and unlock ranks/badges.

### Scoring Actions
| Action | Points | Notes |
|--------|--------|-------|
| Log a catch | 10 | Base points |
| Log a catch with photo | +5 | Bonus for photo evidence |
| Log a catch with location | +3 | Bonus for GPS data |
| Complete a trip | 15 | All catches logged |
| First catch of a species | 25 | "New Species" bonus |
| 5-star gear review | 5 | Detailed review with rating |
| Share a fly pattern | 10 | Community contribution |
| Write an article | 20 | Content creation |
| Help another angler (comment) | 2 | Community engagement |
| Daily login streak | 1-5 | Scales with streak length |
| Personal best (length/weight) | 50 | New PB for any species |

### Rank System
- Minnow (0-99 XP)
- Bluegill (100-499 XP)
- Bass (500-1499 XP)
- Trout (1500-3999 XP)
- Steelhead (4000-9999 XP)
- Muskie (10000+ XP)

### Badges / Achievements
- **Early Bird** — Log a catch before 6am
- **Night Owl** — Log a catch after 10pm
- **Explorer** — Fish at 10 different locations
- **Gear Head** — Own 20+ pieces of gear
- **Fly Tyer** — Create 5 custom fly patterns
- **Grand Slam** — Catch 3+ species in a single trip
- **Century Club** — Log 100 catches
- **Four Seasons** — Log catches in all 4 seasons
- **Conservation Hero** — Release 50 fish

### Implementation Notes
- XP stored on User model (totalXp field)
- Rank computed from XP, not stored separately
- Badge unlocks tracked in a UserBadge join table
- XP events logged in an XpEvent table for audit/display
- Leaderboard page showing top anglers by XP (monthly/all-time)
- Profile shows rank, badge count, and XP progress bar

---

## Gear Marketplace (Trade / Sell / Give Away)

A peer-to-peer marketplace for fishing gear within the community.

### Listing Types
- **For Sale** — Set a price, accept offers
- **Trade** — Looking to swap for something specific
- **Give Away** — Free to a good home (first-come or lottery)

### Core Features
- List gear for sale/trade/giveaway from existing inventory
- Set asking price, accept/decline offers
- In-app messaging between buyer and seller
- Listing status: ACTIVE / PENDING / SOLD / EXPIRED
- Gear condition rating (NEW / LIKE_NEW / GOOD / FAIR / POOR)
- Location-based proximity filtering
- Seller reputation score (based on completed transactions)

### Safety & Trust
- Transaction ratings after completion
- Report listing / block user
- No payment processing in-app (keep it simple — coordinate externally)
- Optional meetup location suggestions (public fishing spots)

### Implementation Notes
- GearListing model linked to GearItem
- Offer model for tracking buy/trade offers
- Message thread per listing interaction
- Gear status transitions: OWNED → LISTED → SOLD/TRADED/GIVEN
- Consider: escrow or payment integration later (Stripe Connect)

---

## Weather Integration

- Pull weather data for catch locations (OpenWeatherMap free tier)
- Auto-fill weather conditions when logging catches
- Weather forecasts for planned trip locations
- Historical weather correlation with catch success

## Tide & Moon Data

- Solunar tables for fishing activity predictions
- Tide charts for saltwater locations
- Moon phase tracking and correlation with catches

## Species Encyclopedia

- Database of common game fish species
- Identification guides with photos
- Season/location/method recommendations per species
- User contributions (regional tips, local names)

## Offline-First Catch Logging

- Queue catches locally when offline
- Sync when connection restored
- Cache recently viewed gear/patterns for offline access
- Background sync with conflict resolution

## Map Overlays

- Heatmap of catch density
- Public fishing access points
- Boat ramp locations
- Water body outlines (lakes, rivers, streams)
- Custom markers for personal spots (private)
