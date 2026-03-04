# Data Model

## Current Models (Phase 0-1)

### User (Auth.js managed)
Core user record created by Auth.js on first login.

| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | Primary key |
| name | String? | Display name |
| email | String? | Unique |
| emailVerified | DateTime? | Auth.js managed |
| image | String? | Avatar URL |
| bio | String? | Profile bio |
| location | String? | City/region |
| isPublic | Boolean | Default false |
| createdAt | DateTime | |
| updatedAt | DateTime | |

Relations: `accounts`, `sessions`, `preferences`, `gear`

### UserPreferences
One-to-one with User. Stores fishing-specific settings.

| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | |
| userId | String | Unique FK → User |
| preferredSpecies | String[] | Free-text species names |
| preferredMethods | FishingMethod[] | Enum array |
| unitSystem | UnitSystem | IMPERIAL / METRIC |
| defaultVisibility | Visibility | PUBLIC / PRIVATE / FOLLOWERS_ONLY |

### GearItem
User's fishing gear inventory.

| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | |
| userId | String | FK → User, indexed |
| name | String | Required |
| category | GearCategory | ROD/REEL/LINE/LURE/FLY/TACKLE/CLOTHING/ELECTRONICS/ACCESSORY/OTHER |
| brand | String? | |
| model | String? | |
| description | String? | |
| imageUrl | String? | |
| status | GearStatus | OWNED/WISHLIST/RETIRED/LOST |
| rating | Int? | 1-5 |
| notes | String? | |
| purchaseDate | DateTime? | |
| purchasePrice | Decimal? | |
| createdAt | DateTime | |
| updatedAt | DateTime | |

Indexes: `[userId, category]`, `[userId, status]`

## Enums

- **GearCategory**: ROD, REEL, LINE, LURE, FLY, TACKLE, CLOTHING, ELECTRONICS, ACCESSORY, OTHER
- **GearStatus**: OWNED, WISHLIST, RETIRED, LOST
- **FishingMethod**: FLY, SPIN, BAIT, TROLLING, ICE, SURF, OTHER
- **UnitSystem**: IMPERIAL, METRIC
- **Visibility**: PUBLIC, PRIVATE, FOLLOWERS_ONLY

## Planned Models (Future Phases)

See `ROADMAP.md` and the plan file for details on:
- **Catch** + CatchPhoto + CatchGear (Phase 2)
- **Trip** + TripMember + TripPhoto (Phase 2)
- **FlyPattern** + FlyMaterial + FlyTyingStep (Phase 3)
- **MaterialInventory** + BaitType (Phase 3)
- **Article** (Phase 4)
- **Follow**, **Like**, **Comment** (Phase 4)

## Adding a New Model

1. Create `.prisma` file in `packages/db/prisma/schema/`
2. Add reverse relation to parent model (usually `user.prisma`)
3. Run `pnpm db:generate`
4. Create matching Zod schemas in `packages/validators/src/`
5. Export from `packages/validators/src/index.ts`
