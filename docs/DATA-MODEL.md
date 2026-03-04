# Data Model

## Current Models (Phase 0-2)

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

Relations: `accounts`, `sessions`, `preferences`, `gear`, `catches`, `trips`, `tripMembers`

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
Relations: `catches` (via CatchGear)

### Catch
A logged fish catch.

| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | |
| userId | String | FK → User |
| tripId | String? | FK → Trip (optional) |
| species | String | Required |
| length | Decimal? | In user's preferred units |
| weight | Decimal? | In user's preferred units |
| method | FishingMethod? | How it was caught |
| locationName | String? | Human-readable location |
| latitude | Decimal? | GPS coordinate |
| longitude | Decimal? | GPS coordinate |
| waterTemp | Decimal? | Water temperature |
| weather | String? | Weather conditions |
| notes | String? | |
| released | Boolean | Default true |
| visibility | Visibility | Default PRIVATE |
| caughtAt | DateTime | When the fish was caught |
| createdAt | DateTime | |
| updatedAt | DateTime | |

Indexes: `[userId]`, `[userId, species]`, `[userId, caughtAt]`, `[tripId]`
Relations: `photos`, `gear` (via CatchGear), `trip`

### CatchPhoto
Photos attached to a catch.

| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | |
| catchId | String | FK → Catch |
| url | String | Upload URL |
| caption | String? | |
| isPrimary | Boolean | Default false |

### CatchGear
Many-to-many linking catches to gear used.

| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | |
| catchId | String | FK → Catch |
| gearId | String | FK → GearItem |

Unique constraint: `[catchId, gearId]`

### Trip
A fishing trip (may span multiple days).

| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | |
| userId | String | FK → User (owner) |
| title | String | Required |
| description | String? | |
| locationName | String? | |
| latitude | Decimal? | |
| longitude | Decimal? | |
| waterBody | String? | e.g. "Madison River" |
| startDate | DateTime | Required |
| endDate | DateTime? | |
| weather | String? | |
| waterConditions | String? | |
| notes | String? | |
| visibility | Visibility | Default PRIVATE |
| createdAt | DateTime | |
| updatedAt | DateTime | |

Indexes: `[userId]`, `[userId, startDate]`
Relations: `catches`, `members`, `photos`

### TripMember
Links users to trips they're part of (companions).

| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | |
| tripId | String | FK → Trip |
| userId | String | FK → User |

Unique constraint: `[tripId, userId]`

### TripPhoto
Photos attached to a trip.

| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | |
| tripId | String | FK → Trip |
| url | String | Upload URL |
| caption | String? | |
| isPrimary | Boolean | Default false |

## Enums

- **GearCategory**: ROD, REEL, LINE, LURE, FLY, TACKLE, CLOTHING, ELECTRONICS, ACCESSORY, OTHER
- **GearStatus**: OWNED, WISHLIST, RETIRED, LOST
- **FishingMethod**: FLY, SPIN, BAIT, TROLLING, ICE, SURF, OTHER
- **UnitSystem**: IMPERIAL, METRIC
- **Visibility**: PUBLIC, PRIVATE, FOLLOWERS_ONLY

## Planned Models (Future Phases)

See `ROADMAP.md` and the plan file for details on:
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
