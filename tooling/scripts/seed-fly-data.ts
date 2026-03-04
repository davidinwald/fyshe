/**
 * seed-fly-data.ts
 *
 * Populates the fyshe database with 60+ well-known fly patterns (with materials)
 * and 20+ bait types. Designed to be idempotent: truncates target tables first,
 * then creates all records fresh.
 *
 * Usage:
 *   pnpm --filter @fyshe/db db:seed-flies
 *   # or directly:
 *   tsx tooling/scripts/seed-fly-data.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Type aliases pulled from the Prisma enums for readability
// ---------------------------------------------------------------------------
type FlyCategory =
  | "DRY_FLY"
  | "NYMPH"
  | "STREAMER"
  | "WET_FLY"
  | "EMERGER"
  | "TERRESTRIAL"
  | "MIDGE"
  | "SALMON_FLY"
  | "BASS_BUG"
  | "SALTWATER";

type FlyType = "ATTRACTOR" | "IMITATOR" | "SEARCHING";
type FlyDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
type Season = "SPRING" | "SUMMER" | "FALL" | "WINTER";
type WaterType = "RIVER" | "STREAM" | "LAKE" | "POND" | "RESERVOIR" | "SALTWATER" | "BRACKISH";
type BaitCategory = "LIVE_BAIT" | "CUT_BAIT" | "ARTIFICIAL_BAIT" | "DOUGH_BAIT" | "PREPARED_BAIT";

interface MaterialInput {
  part: string;
  material: string;
  color?: string;
}

interface FlyPatternInput {
  name: string;
  category: FlyCategory;
  type: FlyType;
  description: string;
  difficulty: FlyDifficulty;
  seasons: Season[];
  waterTypes: WaterType[];
  targetSpecies: string[];
  regions: string[];
  hookSize: string;
  hookType: string;
  materials: MaterialInput[];
}

interface BaitTypeInput {
  name: string;
  description: string;
  category: BaitCategory;
  isLive: boolean;
  seasons: Season[];
  waterTypes: WaterType[];
  targetSpecies: string[];
  regions: string[];
  tips: string;
}

// ---------------------------------------------------------------------------
// Fly Pattern Data
// ---------------------------------------------------------------------------

const flyPatterns: FlyPatternInput[] = [
  // ===================== DRY FLIES (15) =====================
  {
    name: "Adams",
    category: "DRY_FLY",
    type: "SEARCHING",
    description:
      "The quintessential all-purpose dry fly. Its mixed grizzly and brown hackle suggests a wide variety of mayflies, making it one of the most versatile patterns in fly fishing.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM", "LAKE"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Brook Trout", "Cutthroat Trout"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest", "Midwest"],
    hookSize: "12-18",
    hookType: "Standard dry fly hook",
    materials: [
      { part: "Tail", material: "Grizzly and Brown Hackle Fibers", color: "Mixed" },
      { part: "Body", material: "Dubbed Muskrat Fur", color: "Gray" },
      { part: "Wing", material: "Grizzly Hackle Tips", color: "Grizzly" },
      { part: "Hackle", material: "Brown and Grizzly Rooster Hackle", color: "Mixed" },
      { part: "Thread", material: "8/0 Uni-Thread", color: "Gray" },
    ],
  },
  {
    name: "Elk Hair Caddis",
    category: "DRY_FLY",
    type: "IMITATOR",
    description:
      "Al Troth's legendary caddisfly imitation. The buoyant elk hair wing and palmered hackle make it float high even in rough water, perfectly imitating adult caddis.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Brook Trout", "Cutthroat Trout"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest", "Midwest"],
    hookSize: "12-18",
    hookType: "Standard dry fly hook",
    materials: [
      { part: "Body", material: "Dubbed Hare's Ear Fur", color: "Tan" },
      { part: "Rib", material: "Fine Gold Wire" },
      { part: "Hackle", material: "Brown Rooster Hackle", color: "Brown" },
      { part: "Wing", material: "Elk Hair", color: "Natural Tan" },
      { part: "Thread", material: "8/0 Uni-Thread", color: "Tan" },
    ],
  },
  {
    name: "Royal Wulff",
    category: "DRY_FLY",
    type: "ATTRACTOR",
    description:
      "Lee Wulff's iconic attractor pattern with a peacock herl body divided by a red floss band. Its white calf hair wings provide superb visibility in any water condition.",
    difficulty: "ADVANCED",
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Brook Trout"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest"],
    hookSize: "10-16",
    hookType: "Standard dry fly hook",
    materials: [
      { part: "Tail", material: "Moose Body Hair", color: "Dark Brown" },
      { part: "Body", material: "Peacock Herl with Red Floss Band", color: "Green/Red" },
      { part: "Wing", material: "White Calf Body Hair", color: "White" },
      { part: "Hackle", material: "Brown Rooster Hackle", color: "Brown" },
      { part: "Thread", material: "8/0 Uni-Thread", color: "Black" },
    ],
  },
  {
    name: "Blue Wing Olive",
    category: "DRY_FLY",
    type: "IMITATOR",
    description:
      "A precise imitation of Baetis mayflies that hatch prolifically on overcast days and during fall and spring. One of the most important patterns for technical trout fishing.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING", "FALL", "WINTER"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Cutthroat Trout"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest", "Midwest"],
    hookSize: "16-22",
    hookType: "Standard dry fly hook",
    materials: [
      { part: "Tail", material: "Dun Hackle Fibers", color: "Medium Dun" },
      { part: "Body", material: "Olive Dubbing", color: "Olive" },
      { part: "Wing", material: "Dun Hen Hackle Tips", color: "Medium Dun" },
      { part: "Hackle", material: "Dun Rooster Hackle", color: "Medium Dun" },
      { part: "Thread", material: "8/0 Uni-Thread", color: "Olive" },
    ],
  },
  {
    name: "Pale Morning Dun",
    category: "DRY_FLY",
    type: "IMITATOR",
    description:
      "Imitates the Ephemerella mayfly, one of the most important hatches of summer across the West. Trout become highly selective during PMD hatches, making an accurate imitation essential.",
    difficulty: "INTERMEDIATE",
    seasons: ["SUMMER"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Cutthroat Trout"],
    regions: ["Rocky Mountain", "Pacific Northwest"],
    hookSize: "14-18",
    hookType: "Standard dry fly hook",
    materials: [
      { part: "Tail", material: "Light Dun Hackle Fibers", color: "Light Dun" },
      { part: "Body", material: "Pale Yellow Dubbing", color: "Pale Yellow" },
      { part: "Wing", material: "Light Dun Hen Hackle Tips", color: "Light Dun" },
      { part: "Hackle", material: "Light Dun Rooster Hackle", color: "Light Dun" },
      { part: "Thread", material: "8/0 Uni-Thread", color: "Pale Yellow" },
    ],
  },
  {
    name: "Stimulator",
    category: "DRY_FLY",
    type: "ATTRACTOR",
    description:
      "Randall Kaufmann's versatile attractor that can imitate stoneflies, caddis, or grasshoppers depending on size and color. Excellent as a dry-dropper indicator fly.",
    difficulty: "ADVANCED",
    seasons: ["SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Cutthroat Trout", "Golden Trout"],
    regions: ["Rocky Mountain", "Pacific Northwest"],
    hookSize: "6-14",
    hookType: "2XL dry fly hook",
    materials: [
      { part: "Tail", material: "Elk Hair", color: "Natural" },
      { part: "Abdomen", material: "Dubbed Goat or Angora", color: "Orange" },
      { part: "Abdomen Hackle", material: "Grizzly Rooster Hackle", color: "Grizzly" },
      { part: "Wing", material: "Elk Hair", color: "Natural" },
      { part: "Thorax", material: "Dubbed Angora Goat", color: "Amber" },
      { part: "Thorax Hackle", material: "Grizzly Rooster Hackle", color: "Grizzly" },
    ],
  },
  {
    name: "Humpy",
    category: "DRY_FLY",
    type: "ATTRACTOR",
    description:
      "A buoyant, highly visible attractor pattern originating from the Rocky Mountain West. The deer hair shellback and split tail make it virtually unsinkable in fast pocket water.",
    difficulty: "ADVANCED",
    seasons: ["SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Rainbow Trout", "Cutthroat Trout", "Brook Trout"],
    regions: ["Rocky Mountain"],
    hookSize: "10-16",
    hookType: "Standard dry fly hook",
    materials: [
      { part: "Tail", material: "Moose Body Hair", color: "Natural" },
      { part: "Body/Shellback", material: "Deer Hair", color: "Natural" },
      { part: "Underbody", material: "Tying Thread", color: "Yellow" },
      { part: "Wing", material: "White Calf Tail", color: "White" },
      { part: "Hackle", material: "Brown and Grizzly Rooster Hackle", color: "Mixed" },
    ],
  },
  {
    name: "Griffith's Gnat",
    category: "DRY_FLY",
    type: "IMITATOR",
    description:
      "George Griffith's tiny masterpiece that imitates midge clusters on the surface. An essential pattern for winter and early spring fishing when midges are the only game in town.",
    difficulty: "BEGINNER",
    seasons: ["WINTER", "SPRING", "FALL"],
    waterTypes: ["RIVER", "STREAM", "LAKE"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Brook Trout"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest", "Midwest"],
    hookSize: "18-24",
    hookType: "Standard dry fly hook",
    materials: [
      { part: "Body", material: "Peacock Herl", color: "Natural Iridescent" },
      { part: "Hackle", material: "Grizzly Rooster Hackle (palmered)", color: "Grizzly" },
      { part: "Thread", material: "8/0 Uni-Thread", color: "Black" },
    ],
  },
  {
    name: "Parachute Adams",
    category: "DRY_FLY",
    type: "SEARCHING",
    description:
      "A parachute variation of the Adams that sits lower in the film for a more realistic silhouette. The white post makes it easy to track on the water, a favorite of guides everywhere.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM", "LAKE"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Brook Trout", "Cutthroat Trout"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest", "Midwest"],
    hookSize: "12-20",
    hookType: "Standard dry fly hook",
    materials: [
      { part: "Tail", material: "Grizzly and Brown Hackle Fibers", color: "Mixed" },
      { part: "Body", material: "Dubbed Muskrat Fur", color: "Gray" },
      { part: "Wing Post", material: "White Calf Body Hair", color: "White" },
      { part: "Hackle", material: "Brown and Grizzly Rooster Hackle (parachute)", color: "Mixed" },
      { part: "Thread", material: "8/0 Uni-Thread", color: "Gray" },
    ],
  },
  {
    name: "Light Cahill",
    category: "DRY_FLY",
    type: "IMITATOR",
    description:
      "A classic Catskill-style dry fly that imitates a range of light-colored mayflies. Originated by Dan Cahill in the late 1800s, it remains a staple on Eastern freestone streams.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING", "SUMMER"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Brown Trout", "Brook Trout", "Rainbow Trout"],
    regions: ["Eastern US", "Midwest"],
    hookSize: "12-16",
    hookType: "Standard dry fly hook",
    materials: [
      { part: "Tail", material: "Light Ginger Hackle Fibers", color: "Light Ginger" },
      { part: "Body", material: "Cream Fox Belly Fur Dubbing", color: "Cream" },
      { part: "Wing", material: "Wood Duck Flank Feather", color: "Lemon" },
      { part: "Hackle", material: "Light Ginger Rooster Hackle", color: "Light Ginger" },
      { part: "Thread", material: "8/0 Uni-Thread", color: "Cream" },
    ],
  },
  {
    name: "March Brown",
    category: "DRY_FLY",
    type: "IMITATOR",
    description:
      "One of the oldest fly patterns in existence, dating back centuries. It imitates large Rhithrogena and Stenonema mayflies that produce some of the first significant hatches of spring.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Brown Trout", "Rainbow Trout", "Brook Trout"],
    regions: ["Eastern US", "Midwest", "Pacific Northwest"],
    hookSize: "10-14",
    hookType: "Standard dry fly hook",
    materials: [
      { part: "Tail", material: "Brown Hackle Fibers", color: "Dark Brown" },
      { part: "Body", material: "Dubbed Hare's Ear and Amber Fur", color: "Tan/Amber" },
      { part: "Rib", material: "Yellow Thread or Fine Gold Wire", color: "Gold" },
      { part: "Wing", material: "Wood Duck Flank Feather", color: "Lemon" },
      { part: "Hackle", material: "Brown and Grizzly Rooster Hackle", color: "Mixed" },
    ],
  },
  {
    name: "Comparadun",
    category: "DRY_FLY",
    type: "IMITATOR",
    description:
      "Al Caucci and Bob Nastasi's revolutionary hackle-less dry fly. The deer hair fan wing provides flotation while the flush-floating body presents a lifelike mayfly silhouette.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Cutthroat Trout"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest"],
    hookSize: "14-20",
    hookType: "Standard dry fly hook",
    materials: [
      { part: "Tail", material: "Microfibbets or Hackle Fibers", color: "Dun" },
      { part: "Body", material: "Superfine Dubbing", color: "Olive or Tan" },
      { part: "Wing", material: "Coastal Deer Hair (fan style)", color: "Natural" },
      { part: "Thread", material: "8/0 Uni-Thread", color: "Olive" },
    ],
  },
  {
    name: "Sparkle Dun",
    category: "DRY_FLY",
    type: "IMITATOR",
    description:
      "Craig Mathews' emerger/dun hybrid featuring a trailing Z-lon shuck. It represents a mayfly caught between nymph and adult stages, triggering strikes from selective trout.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Cutthroat Trout"],
    regions: ["Rocky Mountain", "Pacific Northwest"],
    hookSize: "14-20",
    hookType: "Standard dry fly hook",
    materials: [
      { part: "Shuck", material: "Z-Lon or Antron Yarn", color: "Amber" },
      { part: "Body", material: "Superfine Dubbing", color: "Olive" },
      { part: "Wing", material: "Coastal Deer Hair (fan style)", color: "Natural" },
      { part: "Thread", material: "8/0 Uni-Thread", color: "Olive" },
    ],
  },
  {
    name: "Trico Spinner",
    category: "DRY_FLY",
    type: "IMITATOR",
    description:
      "Imitates the tiny Tricorythodes spent spinner fall. Trico spinners fall en masse on late summer mornings, creating some of the most challenging and rewarding dry fly fishing of the year.",
    difficulty: "ADVANCED",
    seasons: ["SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Rainbow Trout", "Brown Trout"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest", "Midwest"],
    hookSize: "20-24",
    hookType: "Standard dry fly hook",
    materials: [
      { part: "Tail", material: "Microfibbets", color: "White" },
      { part: "Abdomen", material: "Tying Thread", color: "Black" },
      { part: "Thorax", material: "Superfine Dubbing", color: "Black" },
      { part: "Wing", material: "White Hen Hackle Tips (spent)", color: "White" },
      { part: "Thread", material: "10/0 Veevus", color: "Black" },
    ],
  },
  {
    name: "Hendrickson",
    category: "DRY_FLY",
    type: "IMITATOR",
    description:
      "The premier spring hatch fly of the Eastern US. Named after Albert Everett Hendrickson, this pattern imitates the Ephemerella subvaria mayfly and signals the true start of the dry fly season.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Brown Trout", "Rainbow Trout", "Brook Trout"],
    regions: ["Eastern US", "Midwest"],
    hookSize: "12-16",
    hookType: "Standard dry fly hook",
    materials: [
      { part: "Tail", material: "Medium Dun Hackle Fibers", color: "Medium Dun" },
      { part: "Body", material: "Urine-Stained Fox Belly Fur Dubbing", color: "Pinkish Tan" },
      { part: "Wing", material: "Wood Duck Flank Feather", color: "Lemon" },
      { part: "Hackle", material: "Medium Dun Rooster Hackle", color: "Medium Dun" },
      { part: "Thread", material: "8/0 Uni-Thread", color: "Tan" },
    ],
  },

  // ===================== NYMPHS (15) =====================
  {
    name: "Pheasant Tail Nymph",
    category: "NYMPH",
    type: "IMITATOR",
    description:
      "Frank Sawyer's legendary nymph pattern made entirely from pheasant tail fibers and copper wire. Its slim profile and natural color perfectly imitate a wide range of small mayfly nymphs.",
    difficulty: "BEGINNER",
    seasons: ["SPRING", "SUMMER", "FALL", "WINTER"],
    waterTypes: ["RIVER", "STREAM", "LAKE"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Brook Trout", "Cutthroat Trout"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest", "Midwest"],
    hookSize: "14-20",
    hookType: "1XL nymph hook",
    materials: [
      { part: "Tail", material: "Pheasant Tail Fibers", color: "Natural" },
      { part: "Abdomen", material: "Pheasant Tail Fibers (wrapped)", color: "Natural" },
      { part: "Rib", material: "Copper Wire", color: "Copper" },
      { part: "Thorax", material: "Peacock Herl", color: "Natural Iridescent" },
      { part: "Wingcase", material: "Pheasant Tail Fibers", color: "Natural" },
      { part: "Legs", material: "Pheasant Tail Fiber Tips", color: "Natural" },
    ],
  },
  {
    name: "Gold Ribbed Hare's Ear",
    category: "NYMPH",
    type: "SEARCHING",
    description:
      "One of the most versatile nymph patterns ever created. The rough, buggy dubbing of hare's ear fur creates a natural silhouette that suggests a wide range of aquatic insects.",
    difficulty: "BEGINNER",
    seasons: ["SPRING", "SUMMER", "FALL", "WINTER"],
    waterTypes: ["RIVER", "STREAM", "LAKE"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Brook Trout", "Cutthroat Trout"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest", "Midwest"],
    hookSize: "10-18",
    hookType: "1XL nymph hook",
    materials: [
      { part: "Tail", material: "Hare's Ear Guard Hairs", color: "Natural" },
      { part: "Abdomen", material: "Dubbed Hare's Ear Fur", color: "Natural Tan" },
      { part: "Rib", material: "Flat Gold Tinsel", color: "Gold" },
      { part: "Wingcase", material: "Turkey Tail Feather", color: "Mottled Brown" },
      { part: "Thorax", material: "Rough Dubbed Hare's Ear Fur", color: "Natural" },
      { part: "Thread", material: "8/0 Uni-Thread", color: "Tan" },
    ],
  },
  {
    name: "Prince Nymph",
    category: "NYMPH",
    type: "ATTRACTOR",
    description:
      "Doug Prince's classic attractor nymph with distinctive white goose biot wings. The peacock herl body and flashy profile make it irresistible to trout in faster water.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Brook Trout"],
    regions: ["Rocky Mountain", "Pacific Northwest", "Eastern US"],
    hookSize: "10-16",
    hookType: "2XL nymph hook",
    materials: [
      { part: "Tail", material: "Brown Goose Biots", color: "Brown" },
      { part: "Body", material: "Peacock Herl", color: "Natural Iridescent" },
      { part: "Rib", material: "Fine Gold Tinsel", color: "Gold" },
      { part: "Wing", material: "White Goose Biots", color: "White" },
      { part: "Hackle", material: "Brown Hen Hackle", color: "Brown" },
      { part: "Thread", material: "8/0 Uni-Thread", color: "Black" },
    ],
  },
  {
    name: "Copper John",
    category: "NYMPH",
    type: "ATTRACTOR",
    description:
      "John Barr's modern classic that sinks like a stone thanks to its copper wire body and tungsten bead head. Its epoxy-coated wingcase adds durability and flash.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING", "SUMMER", "FALL", "WINTER"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Brook Trout", "Cutthroat Trout"],
    regions: ["Rocky Mountain", "Pacific Northwest", "Eastern US"],
    hookSize: "12-18",
    hookType: "2XL nymph hook",
    materials: [
      { part: "Bead", material: "Tungsten Bead", color: "Copper" },
      { part: "Tail", material: "Brown Goose Biots", color: "Brown" },
      { part: "Abdomen", material: "Copper Wire (wrapped)", color: "Copper" },
      { part: "Wingcase", material: "Thin Skin with Epoxy Coating", color: "Black" },
      { part: "Thorax", material: "Peacock Herl", color: "Natural Iridescent" },
      { part: "Legs", material: "Brown Hen Hackle Fibers", color: "Brown" },
    ],
  },
  {
    name: "Zebra Midge",
    category: "NYMPH",
    type: "IMITATOR",
    description:
      "A deadly simple midge pupa pattern consisting of just thread and wire on a small hook. Its effectiveness belies its simplicity, and it is a must-have for tailwater fishing.",
    difficulty: "BEGINNER",
    seasons: ["WINTER", "SPRING", "FALL"],
    waterTypes: ["RIVER", "STREAM", "LAKE"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Cutthroat Trout"],
    regions: ["Rocky Mountain", "Pacific Northwest", "Eastern US", "Midwest"],
    hookSize: "18-24",
    hookType: "Standard nymph hook",
    materials: [
      { part: "Bead", material: "Silver Tungsten Bead", color: "Silver" },
      { part: "Body", material: "Tying Thread", color: "Black" },
      { part: "Rib", material: "Fine Silver Wire", color: "Silver" },
      { part: "Thread", material: "8/0 Uni-Thread", color: "Black" },
    ],
  },
  {
    name: "San Juan Worm",
    category: "NYMPH",
    type: "IMITATOR",
    description:
      "A simple but devastatingly effective imitation of aquatic worms. Originally developed on the San Juan River in New Mexico, it is a top producer after rain events when worms wash into streams.",
    difficulty: "BEGINNER",
    seasons: ["SPRING", "SUMMER", "FALL", "WINTER"],
    waterTypes: ["RIVER", "STREAM", "LAKE"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Brook Trout"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest", "Midwest"],
    hookSize: "10-14",
    hookType: "Curved scud hook",
    materials: [
      { part: "Body", material: "Ultra Chenille", color: "Red" },
      { part: "Thread", material: "8/0 Uni-Thread", color: "Red" },
      { part: "Weight", material: "Lead Wire Wraps", color: "Lead" },
    ],
  },
  {
    name: "Stonefly Nymph",
    category: "NYMPH",
    type: "IMITATOR",
    description:
      "A weighted pattern imitating the large nymphs of Plecoptera stoneflies. These nymphs crawl along stream bottoms for years before hatching, making them a year-round food source for trout.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING", "SUMMER", "FALL", "WINTER"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Cutthroat Trout"],
    regions: ["Rocky Mountain", "Pacific Northwest", "Eastern US"],
    hookSize: "4-10",
    hookType: "3XL nymph hook",
    materials: [
      { part: "Tail", material: "Dark Goose Biots", color: "Dark Brown" },
      { part: "Abdomen", material: "Dubbed Synthetic Fur", color: "Dark Brown" },
      { part: "Rib", material: "Round Copper Wire", color: "Copper" },
      { part: "Wingcase", material: "Turkey Tail Section", color: "Mottled Brown" },
      { part: "Thorax", material: "Dubbed Synthetic Fur", color: "Dark Brown" },
      { part: "Legs", material: "Rubber Legs", color: "Brown/Black" },
    ],
  },
  {
    name: "Pat's Rubber Legs",
    category: "NYMPH",
    type: "IMITATOR",
    description:
      "A large, heavily weighted stonefly nymph with wiggly rubber legs. Its simple chenille construction and irresistible leg action make it a go-to guide fly across the American West.",
    difficulty: "BEGINNER",
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Cutthroat Trout"],
    regions: ["Rocky Mountain", "Pacific Northwest"],
    hookSize: "4-10",
    hookType: "3XL nymph hook",
    materials: [
      { part: "Body", material: "Variegated Chenille", color: "Brown/Black" },
      { part: "Legs", material: "Round Rubber Legs", color: "Brown with Black Barring" },
      { part: "Weight", material: "Lead Wire Wraps", color: "Lead" },
      { part: "Thread", material: "6/0 Uni-Thread", color: "Black" },
    ],
  },
  {
    name: "Lightning Bug",
    category: "NYMPH",
    type: "ATTRACTOR",
    description:
      "A flashy bead-head nymph with a tinsel body that catches light underwater. This attractor nymph works well in slightly off-color water where its flash draws strikes.",
    difficulty: "BEGINNER",
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Brook Trout"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest"],
    hookSize: "12-18",
    hookType: "1XL nymph hook",
    materials: [
      { part: "Bead", material: "Gold Tungsten Bead", color: "Gold" },
      { part: "Tail", material: "Pheasant Tail Fibers", color: "Natural" },
      { part: "Body", material: "Flat Pearl Tinsel", color: "Pearl" },
      { part: "Wingcase", material: "Pearl Flashabou", color: "Pearl" },
      { part: "Thorax", material: "Peacock Herl", color: "Natural Iridescent" },
    ],
  },
  {
    name: "Frenchie",
    category: "NYMPH",
    type: "IMITATOR",
    description:
      "A competition-style jig nymph developed by Lance Egan. The hot spot collar of dubbing near the bead triggers strikes, while the pheasant tail body provides a natural profile.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING", "SUMMER", "FALL", "WINTER"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Cutthroat Trout", "Brook Trout"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest"],
    hookSize: "14-20",
    hookType: "Jig hook",
    materials: [
      { part: "Bead", material: "Slotted Tungsten Bead", color: "Gold" },
      { part: "Tail", material: "Coq de Leon Fibers", color: "Medium Pardo" },
      { part: "Body", material: "Pheasant Tail Fibers (wrapped)", color: "Natural" },
      { part: "Collar", material: "Ice Dubbing", color: "Pink/Hot Spot" },
      { part: "Thread", material: "8/0 Uni-Thread", color: "Brown" },
    ],
  },
  {
    name: "Perdigon",
    category: "NYMPH",
    type: "IMITATOR",
    description:
      "A European competition nymph coated in UV resin for a smooth, fast-sinking profile. Originally from Spain, it has revolutionized competition fly fishing with its ability to reach fish quickly.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING", "SUMMER", "FALL", "WINTER"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Rainbow Trout", "Brown Trout"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest"],
    hookSize: "14-20",
    hookType: "Jig hook",
    materials: [
      { part: "Bead", material: "Slotted Tungsten Bead", color: "Black Nickel" },
      { part: "Tail", material: "Coq de Leon Fibers", color: "Medium Pardo" },
      { part: "Body", material: "Tying Thread (coated in UV resin)", color: "Olive/Brown" },
      { part: "Rib", material: "Fine Tinsel", color: "Silver" },
      { part: "Hot Spot", material: "Tying Thread", color: "Fluorescent Orange" },
    ],
  },
  {
    name: "Euro Nymph",
    category: "NYMPH",
    type: "SEARCHING",
    description:
      "A generic term for the slim, heavily weighted jig nymphs used in European competition fishing. Designed for tight-line nymphing techniques with minimal drag.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING", "SUMMER", "FALL", "WINTER"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Brook Trout"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest"],
    hookSize: "12-18",
    hookType: "Jig hook",
    materials: [
      { part: "Bead", material: "Slotted Tungsten Bead", color: "Copper" },
      { part: "Tail", material: "Coq de Leon Fibers", color: "Light Pardo" },
      { part: "Body", material: "Pheasant Tail or Thread", color: "Natural" },
      { part: "Rib", material: "UTC Wire", color: "Copper" },
      { part: "Collar", material: "Ice Dubbing", color: "Chartreuse Hot Spot" },
    ],
  },
  {
    name: "Flashback Pheasant Tail",
    category: "NYMPH",
    type: "IMITATOR",
    description:
      "An enhanced version of the classic Pheasant Tail with a pearl tinsel wingcase. The flash of the wingcase adds visibility and mimics the air bubble trapped under a hatching nymph's wingcase.",
    difficulty: "BEGINNER",
    seasons: ["SPRING", "SUMMER", "FALL", "WINTER"],
    waterTypes: ["RIVER", "STREAM", "LAKE"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Brook Trout"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest", "Midwest"],
    hookSize: "14-20",
    hookType: "1XL nymph hook",
    materials: [
      { part: "Bead", material: "Copper Tungsten Bead", color: "Copper" },
      { part: "Tail", material: "Pheasant Tail Fibers", color: "Natural" },
      { part: "Abdomen", material: "Pheasant Tail Fibers (wrapped)", color: "Natural" },
      { part: "Rib", material: "Copper Wire", color: "Copper" },
      { part: "Wingcase", material: "Pearl Flashabou", color: "Pearl" },
      { part: "Thorax", material: "Peacock Herl", color: "Natural Iridescent" },
    ],
  },
  {
    name: "Walt's Worm",
    category: "NYMPH",
    type: "IMITATOR",
    description:
      "Walt Young's impressionistic crane fly larva imitation using hare's ear dubbing on a curved hook. This simple pattern is incredibly effective as a searching nymph in freestone streams.",
    difficulty: "BEGINNER",
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Brook Trout"],
    regions: ["Eastern US", "Rocky Mountain"],
    hookSize: "12-16",
    hookType: "Curved scud hook",
    materials: [
      { part: "Bead", material: "Tungsten Bead", color: "Gold" },
      { part: "Body", material: "Hare's Ear Plus Dubbing (rough)", color: "Natural Tan" },
      { part: "Thread", material: "8/0 Uni-Thread", color: "Tan" },
      { part: "Weight", material: "Lead Wire Wraps", color: "Lead" },
    ],
  },
  {
    name: "Jig Head Nymph",
    category: "NYMPH",
    type: "SEARCHING",
    description:
      "A modern jig-style nymph riding hook-point-up to reduce snags. The slotted tungsten bead and streamlined body allow it to sink rapidly into the strike zone.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING", "SUMMER", "FALL", "WINTER"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Rainbow Trout", "Brown Trout"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest"],
    hookSize: "12-18",
    hookType: "60-degree jig hook",
    materials: [
      { part: "Bead", material: "Slotted Tungsten Bead", color: "Black Nickel" },
      { part: "Tail", material: "Coq de Leon Fibers", color: "Medium Pardo" },
      { part: "Body", material: "Dubbed Hare's Ear Fur", color: "Natural" },
      { part: "Rib", material: "Fine Copper Wire", color: "Copper" },
      { part: "Collar", material: "CDC Feather or Soft Hackle", color: "Natural Dun" },
    ],
  },

  // ===================== STREAMERS (10) =====================
  {
    name: "Woolly Bugger (Black)",
    category: "STREAMER",
    type: "SEARCHING",
    description:
      "Perhaps the most universally effective fly pattern ever devised. The marabou tail undulates seductively while the palmered hackle and chenille body suggest leeches, baitfish, and crayfish.",
    difficulty: "BEGINNER",
    seasons: ["SPRING", "SUMMER", "FALL", "WINTER"],
    waterTypes: ["RIVER", "STREAM", "LAKE", "POND", "RESERVOIR"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Brook Trout", "Largemouth Bass", "Smallmouth Bass"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest", "Midwest"],
    hookSize: "4-10",
    hookType: "3XL streamer hook",
    materials: [
      { part: "Bead", material: "Tungsten or Brass Bead", color: "Black" },
      { part: "Tail", material: "Black Marabou", color: "Black" },
      { part: "Body", material: "Black Chenille", color: "Black" },
      { part: "Hackle", material: "Black Saddle Hackle (palmered)", color: "Black" },
      { part: "Thread", material: "6/0 Uni-Thread", color: "Black" },
    ],
  },
  {
    name: "Woolly Bugger (Olive)",
    category: "STREAMER",
    type: "SEARCHING",
    description:
      "The olive variation of the Woolly Bugger excels as a leech and dragonfly nymph imitation. Its muted coloring is particularly effective in clear water and stillwater environments.",
    difficulty: "BEGINNER",
    seasons: ["SPRING", "SUMMER", "FALL", "WINTER"],
    waterTypes: ["RIVER", "STREAM", "LAKE", "POND", "RESERVOIR"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Brook Trout", "Largemouth Bass"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest", "Midwest"],
    hookSize: "4-10",
    hookType: "3XL streamer hook",
    materials: [
      { part: "Bead", material: "Tungsten or Brass Bead", color: "Gold" },
      { part: "Tail", material: "Olive Marabou", color: "Olive" },
      { part: "Body", material: "Olive Chenille", color: "Olive" },
      { part: "Hackle", material: "Grizzly Saddle Hackle (palmered)", color: "Grizzly" },
      { part: "Rib", material: "Fine Copper Wire", color: "Copper" },
    ],
  },
  {
    name: "Clouser Minnow",
    category: "STREAMER",
    type: "IMITATOR",
    description:
      "Bob Clouser's revolutionary weighted minnow pattern with lead dumbbell eyes that cause it to ride hook-up and dive in a jigging motion. Effective in both fresh and saltwater worldwide.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM", "LAKE", "SALTWATER", "BRACKISH"],
    targetSpecies: ["Smallmouth Bass", "Largemouth Bass", "Striped Bass", "Rainbow Trout", "Brown Trout"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest", "Coastal"],
    hookSize: "1/0-8",
    hookType: "Stainless steel streamer hook",
    materials: [
      { part: "Eyes", material: "Lead Dumbbell Eyes", color: "Red/White" },
      { part: "Belly", material: "White Bucktail", color: "White" },
      { part: "Flash", material: "Crystal Flash or Flashabou", color: "Silver" },
      { part: "Wing/Back", material: "Chartreuse Bucktail", color: "Chartreuse" },
      { part: "Thread", material: "Danville Flat Waxed Nylon", color: "White" },
    ],
  },
  {
    name: "Muddler Minnow",
    category: "STREAMER",
    type: "IMITATOR",
    description:
      "Don Gapen's legendary pattern with a spun and clipped deer hair head that pushes water and creates a lifelike sculpin silhouette. Can be fished as a streamer, wet fly, or even a dry fly.",
    difficulty: "ADVANCED",
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM", "LAKE"],
    targetSpecies: ["Brown Trout", "Rainbow Trout", "Brook Trout", "Smallmouth Bass"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest", "Midwest"],
    hookSize: "2-10",
    hookType: "3XL streamer hook",
    materials: [
      { part: "Tail", material: "Mottled Turkey Quill Slip", color: "Mottled Brown" },
      { part: "Body", material: "Flat Gold Tinsel", color: "Gold" },
      { part: "Underwing", material: "Gray Squirrel Tail", color: "Gray" },
      { part: "Wing", material: "Mottled Turkey Quill Slips", color: "Mottled Brown" },
      { part: "Head/Collar", material: "Spun and Clipped Deer Hair", color: "Natural" },
    ],
  },
  {
    name: "Zonker",
    category: "STREAMER",
    type: "IMITATOR",
    description:
      "A baitfish imitation featuring a strip of rabbit fur tied along the back for a lifelike swimming action. The undulating rabbit strip pulsates with every strip and pause.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM", "LAKE"],
    targetSpecies: ["Brown Trout", "Rainbow Trout", "Largemouth Bass", "Smallmouth Bass"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest"],
    hookSize: "2-8",
    hookType: "3XL streamer hook",
    materials: [
      { part: "Body", material: "Mylar Tubing or Pearl Braid", color: "Pearl/Silver" },
      { part: "Wing", material: "Rabbit Strip", color: "Natural or Olive" },
      { part: "Collar", material: "Rabbit Fur from Strip (picked out)", color: "Natural" },
      { part: "Thread", material: "6/0 Uni-Thread", color: "White" },
    ],
  },
  {
    name: "Sculpin Pattern",
    category: "STREAMER",
    type: "IMITATOR",
    description:
      "Imitates the bottom-dwelling sculpin, a primary forage fish for large trout. The wide, flat head and mottled coloring fool trophy fish that have keyed in on this abundant prey.",
    difficulty: "ADVANCED",
    seasons: ["SPRING", "SUMMER", "FALL", "WINTER"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Brown Trout", "Rainbow Trout"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest"],
    hookSize: "2-6",
    hookType: "60-degree jig hook or streamer hook",
    materials: [
      { part: "Weight", material: "Lead Dumbbell or Sculpin Helmet", color: "Olive/Brown" },
      { part: "Tail", material: "Rabbit Strip", color: "Olive Barred" },
      { part: "Body", material: "Dubbed Rabbit Fur", color: "Olive/Brown" },
      { part: "Pectoral Fins", material: "Hen Saddle Feathers", color: "Mottled Brown" },
      { part: "Head", material: "Spun Deer Hair or Fish Skull", color: "Sculpin Olive" },
    ],
  },
  {
    name: "Lefty's Deceiver",
    category: "STREAMER",
    type: "IMITATOR",
    description:
      "Lefty Kreh's iconic baitfish pattern designed to cast easily and move naturally. The long saddle hackle tail breathes in the water while the bucktail collar provides the baitfish profile.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["SALTWATER", "BRACKISH", "LAKE", "RIVER"],
    targetSpecies: ["Striped Bass", "Bluefish", "Redfish", "Snook", "Largemouth Bass"],
    regions: ["Eastern US", "Coastal", "Gulf Coast"],
    hookSize: "1/0-4/0",
    hookType: "Saltwater streamer hook",
    materials: [
      { part: "Tail", material: "White Saddle Hackle (4-6 feathers)", color: "White" },
      { part: "Flash", material: "Silver Flashabou", color: "Silver" },
      { part: "Collar", material: "White Bucktail", color: "White" },
      { part: "Topping", material: "Peacock Herl", color: "Natural Iridescent" },
      { part: "Eyes", material: "Stick-On Prismatic Eyes", color: "Yellow/Black" },
    ],
  },
  {
    name: "Articulated Streamer",
    category: "STREAMER",
    type: "IMITATOR",
    description:
      "A two-section streamer connected by a wire shank that creates lifelike swimming and darting action. This modern style has revolutionized trophy trout fishing with its realistic movement.",
    difficulty: "EXPERT",
    seasons: ["SPRING", "FALL", "WINTER"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Brown Trout", "Rainbow Trout"],
    regions: ["Rocky Mountain", "Pacific Northwest"],
    hookSize: "1/0-4",
    hookType: "Articulated shank with trailing hook",
    materials: [
      { part: "Rear Hook/Tail", material: "Marabou and Rabbit Strip", color: "Olive/White" },
      { part: "Connection", material: "Articulated Wire Shank", color: "Silver" },
      { part: "Body", material: "Dubbing Brush", color: "Olive" },
      { part: "Wing", material: "Saddle Hackle Feathers", color: "Olive Barred" },
      { part: "Head", material: "Spun Deer Hair or Fish Skull", color: "Natural/Olive" },
      { part: "Eyes", material: "Lead Dumbbell or Fish Skull Living Eyes", color: "Red" },
    ],
  },
  {
    name: "Circus Peanut",
    category: "STREAMER",
    type: "ATTRACTOR",
    description:
      "Russ Maddin's articulated streamer built with craft foam cylinders and flashy materials. Its exaggerated profile and buoyant design create an erratic, tantalizing action that triggers aggressive strikes.",
    difficulty: "ADVANCED",
    seasons: ["SPRING", "FALL"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Brown Trout", "Rainbow Trout"],
    regions: ["Rocky Mountain", "Pacific Northwest", "Great Lakes"],
    hookSize: "2-2/0",
    hookType: "Articulated shank with trailing hook",
    materials: [
      { part: "Rear Body", material: "Craft Foam Cylinder", color: "Chartreuse/White" },
      { part: "Rear Hackle", material: "Marabou", color: "White" },
      { part: "Connection", material: "Articulated Wire Shank" },
      { part: "Front Body", material: "Craft Foam Cylinder", color: "Chartreuse/White" },
      { part: "Flash", material: "Holographic Flashabou", color: "Silver" },
      { part: "Eyes", material: "3D Molded Eyes", color: "Yellow/Black" },
    ],
  },
  {
    name: "Slumpbuster",
    category: "STREAMER",
    type: "IMITATOR",
    description:
      "John Barr's pine squirrel streamer designed to break slumps. The natural pine squirrel zonker strip creates a mottled, sculpin-like profile that browns and rainbows find irresistible.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM", "LAKE"],
    targetSpecies: ["Brown Trout", "Rainbow Trout", "Cutthroat Trout"],
    regions: ["Rocky Mountain", "Pacific Northwest"],
    hookSize: "4-10",
    hookType: "3XL streamer hook",
    materials: [
      { part: "Bead", material: "Tungsten Cone Head", color: "Gold" },
      { part: "Weight", material: "Lead Wire Wraps", color: "Lead" },
      { part: "Tail/Wing", material: "Pine Squirrel Zonker Strip", color: "Natural" },
      { part: "Body", material: "Diamond Braid", color: "Gold" },
      { part: "Thread", material: "6/0 Uni-Thread", color: "Brown" },
    ],
  },

  // ===================== WET FLIES (5) =====================
  {
    name: "Soft Hackle",
    category: "WET_FLY",
    type: "IMITATOR",
    description:
      "One of the oldest fly patterns, featuring a sparse hen or partridge hackle that pulses with life underwater. Fished on the swing, it imitates emerging insects drifting toward the surface.",
    difficulty: "BEGINNER",
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Brook Trout"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest"],
    hookSize: "12-18",
    hookType: "Standard wet fly hook",
    materials: [
      { part: "Body", material: "Floss or Dubbed Fur", color: "Yellow or Olive" },
      { part: "Rib", material: "Fine Gold Wire" },
      { part: "Hackle", material: "Hungarian Partridge Feather", color: "Mottled Brown" },
      { part: "Thread", material: "8/0 Uni-Thread", color: "Yellow" },
    ],
  },
  {
    name: "Leadwing Coachman",
    category: "WET_FLY",
    type: "SEARCHING",
    description:
      "A classic Victorian-era wet fly with dark duck quill wings and a peacock herl body. Originally an English pattern, it remains a superb searching pattern for eastern brook trout streams.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Brook Trout", "Brown Trout", "Rainbow Trout"],
    regions: ["Eastern US", "Midwest"],
    hookSize: "10-16",
    hookType: "Standard wet fly hook",
    materials: [
      { part: "Tag", material: "Fine Gold Tinsel", color: "Gold" },
      { part: "Body", material: "Peacock Herl", color: "Natural Iridescent" },
      { part: "Hackle", material: "Brown Hen Hackle", color: "Dark Brown" },
      { part: "Wing", material: "Dark Duck Quill Slips", color: "Dark Gray" },
      { part: "Thread", material: "8/0 Uni-Thread", color: "Black" },
    ],
  },
  {
    name: "March Brown Wet",
    category: "WET_FLY",
    type: "IMITATOR",
    description:
      "The wet fly version of the ancient March Brown, designed to be fished subsurface during the early spring mayfly hatch. Its wing and hackle create movement and suggest an emerging dun.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Brown Trout", "Rainbow Trout", "Brook Trout"],
    regions: ["Eastern US", "Midwest"],
    hookSize: "10-14",
    hookType: "Standard wet fly hook",
    materials: [
      { part: "Tail", material: "Brown Hackle Fibers", color: "Brown" },
      { part: "Body", material: "Dubbed Hare's Ear Fur", color: "Tan" },
      { part: "Rib", material: "Fine Gold Wire", color: "Gold" },
      { part: "Hackle", material: "Brown Hen Hackle", color: "Brown" },
      { part: "Wing", material: "Mottled Turkey Quill", color: "Mottled Brown" },
    ],
  },
  {
    name: "Partridge and Orange",
    category: "WET_FLY",
    type: "IMITATOR",
    description:
      "A North Country spider pattern dating to at least the 1800s. The orange silk body and partridge hackle create a simple yet deadly emerger imitation, especially during caddis activity.",
    difficulty: "BEGINNER",
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Brown Trout", "Rainbow Trout", "Brook Trout"],
    regions: ["Eastern US", "Rocky Mountain", "Pacific Northwest"],
    hookSize: "12-16",
    hookType: "Standard wet fly hook",
    materials: [
      { part: "Body", material: "Orange Silk Floss", color: "Orange" },
      { part: "Hackle", material: "Hungarian Partridge Feather", color: "Mottled Brown" },
      { part: "Thread", material: "8/0 Uni-Thread", color: "Orange" },
    ],
  },
  {
    name: "Picket Pin",
    category: "WET_FLY",
    type: "SEARCHING",
    description:
      "A classic Montana wet fly and streamer combination that imitates grasshoppers and general food items. Its peacock herl body and grizzly hackle make it a versatile searching pattern.",
    difficulty: "INTERMEDIATE",
    seasons: ["SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM", "LAKE"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Cutthroat Trout"],
    regions: ["Rocky Mountain", "Pacific Northwest"],
    hookSize: "6-12",
    hookType: "2XL wet fly hook",
    materials: [
      { part: "Tail", material: "Brown Hackle Fibers", color: "Brown" },
      { part: "Body", material: "Peacock Herl", color: "Natural Iridescent" },
      { part: "Hackle", material: "Brown Rooster Hackle (palmered)", color: "Brown" },
      { part: "Wing", material: "Gray Squirrel Tail", color: "Gray" },
      { part: "Head", material: "Peacock Herl", color: "Natural Iridescent" },
    ],
  },

  // ===================== EMERGERS (5) =====================
  {
    name: "RS2",
    category: "EMERGER",
    type: "IMITATOR",
    description:
      "Rim Chung's Rim's Semblance 2, a sparse emerger that perfectly imitates blue-winged olive and midge emergers. Its minimalist design with a CDC wing tuft rides in the surface film.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING", "SUMMER", "FALL", "WINTER"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Cutthroat Trout"],
    regions: ["Rocky Mountain", "Pacific Northwest"],
    hookSize: "18-24",
    hookType: "Standard dry fly hook or emerger hook",
    materials: [
      { part: "Tail/Shuck", material: "Dun Microfibbets", color: "Dun" },
      { part: "Abdomen", material: "Beaver Fur Dubbing", color: "Gray/Olive" },
      { part: "Wing", material: "CDC Feather Tuft", color: "Natural Dun" },
      { part: "Thread", material: "10/0 Veevus", color: "Olive" },
    ],
  },
  {
    name: "Barr Emerger",
    category: "EMERGER",
    type: "IMITATOR",
    description:
      "John Barr's BWO emerger designed to imitate a Baetis mayfly struggling to break free of its nymphal shuck. The trailing shuck and partially emerged wing profile are deadly during BWO hatches.",
    difficulty: "ADVANCED",
    seasons: ["SPRING", "FALL", "WINTER"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Rainbow Trout", "Brown Trout"],
    regions: ["Rocky Mountain", "Pacific Northwest"],
    hookSize: "18-22",
    hookType: "Emerger hook or curved shank",
    materials: [
      { part: "Shuck", material: "Brown Antron Yarn", color: "Brown" },
      { part: "Abdomen", material: "BWO-Colored Dubbing", color: "Olive/Brown" },
      { part: "Wing", material: "Dun CDC and Antron", color: "Dun" },
      { part: "Thorax", material: "Peacock Herl", color: "Natural Iridescent" },
      { part: "Legs", material: "Brown Hackle Fibers", color: "Brown" },
    ],
  },
  {
    name: "Klinkhammer",
    category: "EMERGER",
    type: "IMITATOR",
    description:
      "Hans van Klinken's revolutionary emerger pattern with a curved body hanging below the surface and a parachute hackle keeping the thorax afloat. It imitates an emerging insect perfectly.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Grayling"],
    regions: ["Rocky Mountain", "Pacific Northwest", "Eastern US"],
    hookSize: "12-18",
    hookType: "Curved emerger hook (Tiemco 2487 or similar)",
    materials: [
      { part: "Abdomen", material: "Dubbed Synthetic Fur", color: "Tan or Olive" },
      { part: "Wing Post", material: "White or Hi-Vis Poly Yarn", color: "White" },
      { part: "Thorax", material: "Peacock Herl", color: "Natural Iridescent" },
      { part: "Hackle", material: "Grizzly Rooster Hackle (parachute)", color: "Grizzly" },
      { part: "Thread", material: "8/0 Uni-Thread", color: "Tan" },
    ],
  },
  {
    name: "CDC Emerger",
    category: "EMERGER",
    type: "IMITATOR",
    description:
      "A simple emerger using CDC (cul de canard) feathers for flotation. The natural oils in CDC keep the fly in the surface film, perfectly imitating a mayfly struggling to emerge.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Cutthroat Trout"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest"],
    hookSize: "16-22",
    hookType: "Emerger hook or light wire hook",
    materials: [
      { part: "Shuck", material: "Z-Lon or Antron", color: "Amber" },
      { part: "Abdomen", material: "Fine Dubbing", color: "Olive" },
      { part: "Wing", material: "CDC Feather Puffs (2-3)", color: "Natural Dun" },
      { part: "Thorax", material: "Superfine Dubbing", color: "Dark Olive" },
      { part: "Thread", material: "8/0 Uni-Thread", color: "Olive" },
    ],
  },
  {
    name: "Sparkle Pupa",
    category: "EMERGER",
    type: "IMITATOR",
    description:
      "Gary LaFontaine's innovative caddis pupa pattern featuring an Antron yarn bubble-sheath that traps air, mimicking the gas bubble a natural caddis pupa uses to ascend to the surface.",
    difficulty: "ADVANCED",
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Brook Trout"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest"],
    hookSize: "12-18",
    hookType: "Standard wet fly or nymph hook",
    materials: [
      { part: "Undersheath", material: "Antron Yarn", color: "Bright Green" },
      { part: "Oversheath", material: "Antron Yarn", color: "Dark Green/Brown" },
      { part: "Body", material: "Dubbed Fur under Antron Sheath", color: "Green" },
      { part: "Head", material: "Dubbed Hare's Ear Fur", color: "Dark Brown" },
      { part: "Thread", material: "8/0 Uni-Thread", color: "Brown" },
    ],
  },

  // ===================== TERRESTRIALS (5) =====================
  {
    name: "Dave's Hopper",
    category: "TERRESTRIAL",
    type: "IMITATOR",
    description:
      "Dave Whitlock's classic grasshopper imitation using clipped deer hair, turkey wing, and rubber legs. A summer staple that works as a standalone dry or as a dry-dropper indicator.",
    difficulty: "ADVANCED",
    seasons: ["SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM", "LAKE"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Cutthroat Trout", "Brook Trout"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest", "Midwest"],
    hookSize: "6-12",
    hookType: "2XL dry fly hook",
    materials: [
      { part: "Tail", material: "Red Deer Hair", color: "Dyed Red" },
      { part: "Body", material: "Yellow Dubbing or Yarn", color: "Yellow" },
      { part: "Rib", material: "Brown Hackle (palmered and clipped)", color: "Brown" },
      { part: "Wing", material: "Turkey Quill Feather Section", color: "Mottled Brown" },
      { part: "Legs", material: "Knotted Yellow Rubber Legs", color: "Yellow" },
      { part: "Head/Collar", material: "Spun and Clipped Deer Hair", color: "Natural" },
    ],
  },
  {
    name: "Chernobyl Ant",
    category: "TERRESTRIAL",
    type: "ATTRACTOR",
    description:
      "A large foam-bodied attractor pattern with rubber legs that imitates big terrestrial insects. Its extreme buoyancy makes it the premier dry-dropper indicator fly for Western fishing.",
    difficulty: "INTERMEDIATE",
    seasons: ["SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Cutthroat Trout"],
    regions: ["Rocky Mountain", "Pacific Northwest"],
    hookSize: "6-12",
    hookType: "2XL dry fly hook",
    materials: [
      { part: "Underbody", material: "Craft Foam", color: "Black" },
      { part: "Overbody", material: "Craft Foam", color: "Tan or Orange" },
      { part: "Legs", material: "Round Rubber Legs", color: "Black with White Barring" },
      { part: "Indicator", material: "Hi-Vis Foam or Yarn", color: "Orange" },
      { part: "Thread", material: "6/0 Uni-Thread", color: "Black" },
    ],
  },
  {
    name: "Foam Beetle",
    category: "TERRESTRIAL",
    type: "IMITATOR",
    description:
      "A simple foam-backed beetle pattern that sits flush in the surface film. Beetles are a major terrestrial food source, and this low-riding imitation fools trout feeding near overhanging vegetation.",
    difficulty: "BEGINNER",
    seasons: ["SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM", "POND"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Brook Trout", "Bluegill"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest", "Midwest"],
    hookSize: "12-18",
    hookType: "Standard dry fly hook",
    materials: [
      { part: "Body/Shellback", material: "Craft Foam (folded over)", color: "Black" },
      { part: "Underbody", material: "Peacock Herl", color: "Natural Iridescent" },
      { part: "Indicator", material: "Hi-Vis Foam Dot", color: "Orange or Chartreuse" },
      { part: "Legs", material: "Round Rubber Legs", color: "Black" },
    ],
  },
  {
    name: "Cicada",
    category: "TERRESTRIAL",
    type: "IMITATOR",
    description:
      "A large foam pattern imitating the periodical cicada. During cicada emergences, trout gorge on these large, clumsy insects, and this pattern produces explosive surface strikes.",
    difficulty: "INTERMEDIATE",
    seasons: ["SUMMER"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Brown Trout", "Rainbow Trout", "Smallmouth Bass"],
    regions: ["Eastern US", "Midwest"],
    hookSize: "4-8",
    hookType: "2XL dry fly hook",
    materials: [
      { part: "Body", material: "Layered Craft Foam", color: "Black" },
      { part: "Underbody", material: "Dubbing or Chenille", color: "Orange" },
      { part: "Wing", material: "Organza or Medallion Sheeting", color: "Clear" },
      { part: "Legs", material: "Knotted Round Rubber Legs", color: "Black" },
      { part: "Eyes", material: "Mono Eyes or Bead Chain", color: "Black" },
    ],
  },
  {
    name: "Inch Worm",
    category: "TERRESTRIAL",
    type: "IMITATOR",
    description:
      "Imitates inchworms (geometrid moth larvae) that dangle from trees on silk threads and drop onto the water. A surprisingly effective pattern when fishing under hardwood canopies in spring and summer.",
    difficulty: "BEGINNER",
    seasons: ["SPRING", "SUMMER"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Brown Trout", "Rainbow Trout", "Brook Trout", "Bluegill"],
    regions: ["Eastern US", "Midwest"],
    hookSize: "10-14",
    hookType: "Standard dry fly or curved hook",
    materials: [
      { part: "Body", material: "Chartreuse Craft Foam or Vernille", color: "Chartreuse" },
      { part: "Thread", material: "8/0 Uni-Thread", color: "Chartreuse" },
      { part: "Weight (optional)", material: "Small Brass Bead", color: "Gold" },
    ],
  },

  // ===================== SALTWATER (5) =====================
  {
    name: "Crazy Charlie",
    category: "SALTWATER",
    type: "IMITATOR",
    description:
      "Naseem Verdieu's bonefish pattern perfected by Charlie Smith in the Bahamas. The bead chain eyes and sparse dressing create a shrimp-like profile that has caught more bonefish than any other fly.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING", "SUMMER", "FALL", "WINTER"],
    waterTypes: ["SALTWATER"],
    targetSpecies: ["Bonefish", "Permit"],
    regions: ["Caribbean", "Florida Keys", "Bahamas", "Central America"],
    hookSize: "4-8",
    hookType: "Saltwater hook (stainless)",
    materials: [
      { part: "Eyes", material: "Bead Chain Eyes", color: "Silver" },
      { part: "Body", material: "Crystal Flash wrapped with Clear V-Rib", color: "Pearl" },
      { part: "Wing", material: "White Calf Tail", color: "White" },
      { part: "Thread", material: "Flat Waxed Nylon", color: "White" },
    ],
  },
  {
    name: "Gotcha",
    category: "SALTWATER",
    type: "IMITATOR",
    description:
      "A classic Bahamian bonefish fly developed in the 1980s. Its blend of craft fur and flash creates an irresistible shrimp-like profile, and its name comes from what anglers exclaim when a bonefish eats it.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING", "SUMMER", "FALL", "WINTER"],
    waterTypes: ["SALTWATER"],
    targetSpecies: ["Bonefish"],
    regions: ["Caribbean", "Bahamas", "Florida Keys"],
    hookSize: "4-8",
    hookType: "Saltwater hook (stainless)",
    materials: [
      { part: "Eyes", material: "Bead Chain or Lead Eyes", color: "Silver" },
      { part: "Body", material: "Pearl Diamond Braid or Estaz", color: "Pearl" },
      { part: "Wing", material: "Craft Fur or Calf Tail", color: "Tan/Pink" },
      { part: "Flash", material: "Pearl Krystal Flash", color: "Pearl" },
      { part: "Thread", material: "Flat Waxed Nylon", color: "Pink" },
    ],
  },
  {
    name: "Clouser Deep Minnow",
    category: "SALTWATER",
    type: "IMITATOR",
    description:
      "The saltwater-optimized version of Bob Clouser's Minnow, tied on a stainless hook with heavier dumbbell eyes for deeper water. A go-to pattern for striped bass, bluefish, and redfish.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["SALTWATER", "BRACKISH"],
    targetSpecies: ["Striped Bass", "Bluefish", "Redfish", "Snook", "False Albacore"],
    regions: ["Eastern US", "Gulf Coast", "Coastal"],
    hookSize: "1/0-4/0",
    hookType: "Saltwater stainless hook",
    materials: [
      { part: "Eyes", material: "Heavy Lead Dumbbell Eyes", color: "Red/White" },
      { part: "Belly", material: "White Bucktail", color: "White" },
      { part: "Flash", material: "Silver Flashabou", color: "Silver" },
      { part: "Back", material: "Chartreuse or Olive Bucktail", color: "Chartreuse" },
      { part: "Thread", material: "Danville Flat Waxed Nylon", color: "Chartreuse" },
    ],
  },
  {
    name: "EP Baitfish",
    category: "SALTWATER",
    type: "IMITATOR",
    description:
      "Enrico Puglisi's synthetic fiber baitfish pattern that sheds water for easy casting and maintains its profile wet or dry. The EP fibers create a translucent, lifelike baitfish imitation.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["SALTWATER", "BRACKISH"],
    targetSpecies: ["Striped Bass", "Snook", "Redfish", "Tarpon", "Bluefish"],
    regions: ["Eastern US", "Gulf Coast", "Coastal", "Caribbean"],
    hookSize: "1/0-3/0",
    hookType: "Saltwater stainless hook",
    materials: [
      { part: "Body/Wing", material: "EP Fibers (layered)", color: "White/Olive" },
      { part: "Belly", material: "EP Fibers", color: "White" },
      { part: "Lateral Line", material: "Holographic Flash", color: "Silver" },
      { part: "Eyes", material: "3D Molded Eyes with UV Resin", color: "Yellow/Black" },
      { part: "Thread", material: "Danville Flat Waxed Nylon", color: "White" },
    ],
  },
  {
    name: "Lefty's Deceiver (Saltwater)",
    category: "SALTWATER",
    type: "IMITATOR",
    description:
      "The full saltwater version of Lefty Kreh's classic, tied larger with corrosion-resistant hooks and materials. A fundamental pattern for virtually every saltwater gamefish species worldwide.",
    difficulty: "INTERMEDIATE",
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["SALTWATER", "BRACKISH"],
    targetSpecies: ["Striped Bass", "Bluefish", "Tarpon", "Snook", "Jack Crevalle"],
    regions: ["Eastern US", "Gulf Coast", "Caribbean", "Coastal"],
    hookSize: "2/0-5/0",
    hookType: "Saltwater stainless hook",
    materials: [
      { part: "Tail", material: "White Saddle Hackle (6-8 feathers)", color: "White" },
      { part: "Flash", material: "Holographic Flashabou", color: "Silver/Blue" },
      { part: "Collar", material: "White Bucktail", color: "White" },
      { part: "Topping", material: "Olive or Blue Bucktail", color: "Olive" },
      { part: "Eyes", material: "Large Prismatic Stick-On Eyes", color: "Yellow/Black" },
      { part: "Head", material: "Thread built up and coated with epoxy", color: "Black" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Bait Type Data
// ---------------------------------------------------------------------------

const baitTypes: BaitTypeInput[] = [
  // ===================== LIVE BAIT (10) =====================
  {
    name: "Nightcrawler",
    description:
      "The classic large earthworm, often 6-8 inches long. Nightcrawlers are arguably the most versatile live bait in freshwater fishing, effective for nearly every species when fished on a simple hook and split shot.",
    category: "LIVE_BAIT",
    isLive: true,
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM", "LAKE", "POND", "RESERVOIR"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Walleye", "Bass", "Catfish", "Panfish"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest", "Midwest"],
    tips: "Thread onto a bait holder hook for best presentation. Inflate with a worm blower to float above weeds. Use half a crawler for smaller species or finicky biters.",
  },
  {
    name: "Red Wiggler",
    description:
      "A smaller, more active worm than the nightcrawler. Red wigglers are excellent panfish bait and work well for stocked trout. Their constant movement on the hook attracts curious fish.",
    category: "LIVE_BAIT",
    isLive: true,
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["LAKE", "POND", "STREAM"],
    targetSpecies: ["Trout", "Bluegill", "Crappie", "Perch"],
    regions: ["Eastern US", "Midwest", "Rocky Mountain"],
    tips: "Hook through the collar for longest life on the hook. Keep in cool, moist bedding. Effective under a small bobber for panfish and stocked trout.",
  },
  {
    name: "Mealworm",
    description:
      "Larva of the darkling beetle, commonly sold at pet stores and bait shops. Mealworms are a clean, easy-to-store bait that is particularly effective for trout and panfish in still water.",
    category: "LIVE_BAIT",
    isLive: true,
    seasons: ["SPRING", "SUMMER", "FALL", "WINTER"],
    waterTypes: ["LAKE", "POND", "RESERVOIR"],
    targetSpecies: ["Trout", "Bluegill", "Crappie", "Perch"],
    regions: ["Eastern US", "Rocky Mountain", "Midwest", "Pacific Northwest"],
    tips: "Store in the refrigerator to keep them dormant and fresh. Thread 2-3 onto a small hook for panfish. Especially effective ice fishing for trout.",
  },
  {
    name: "Cricket",
    description:
      "Live crickets are a natural food source for many freshwater species. They create a commotion on the surface that attracts fish and are particularly deadly for bluegill and other sunfish.",
    category: "LIVE_BAIT",
    isLive: true,
    seasons: ["SUMMER", "FALL"],
    waterTypes: ["LAKE", "POND", "STREAM", "RIVER"],
    targetSpecies: ["Bluegill", "Trout", "Bass", "Crappie"],
    regions: ["Eastern US", "Midwest"],
    tips: "Hook through the thorax behind the head for best action. Use a small wire hook (size 8-10). Fish under a bobber near overhanging vegetation for best results.",
  },
  {
    name: "Grasshopper",
    description:
      "During summer, grasshoppers are a major food source for stream trout as they get blown into the water from grassy banks. Live hoppers create an irresistible splash and commotion.",
    category: "LIVE_BAIT",
    isLive: true,
    seasons: ["SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Brown Trout", "Rainbow Trout", "Smallmouth Bass"],
    regions: ["Rocky Mountain", "Midwest", "Pacific Northwest"],
    tips: "Catch your own in grassy meadows near the stream for the freshest bait. Hook through the collar behind the head. Cast near grassy banks where naturals fall in the water.",
  },
  {
    name: "Minnow",
    description:
      "Live minnows (fathead minnows, shiners, or chubs) are one of the most effective baits for predatory fish. They trigger the predatory instinct with their natural swimming action.",
    category: "LIVE_BAIT",
    isLive: true,
    seasons: ["SPRING", "SUMMER", "FALL", "WINTER"],
    waterTypes: ["LAKE", "RIVER", "POND", "RESERVOIR"],
    targetSpecies: ["Walleye", "Bass", "Pike", "Musky", "Crappie"],
    regions: ["Eastern US", "Midwest", "Rocky Mountain"],
    tips: "Hook through the lips for casting, through the back for bobber fishing. Keep in an aerated bucket. Match the minnow size to your target species. Use 2-3 inch minnows for walleye and crappie.",
  },
  {
    name: "Shiner",
    description:
      "Golden shiners are a premier live bait for trophy largemouth bass, especially in Southern waters. Their wide, flashy body profile and erratic swimming action trigger violent strikes.",
    category: "LIVE_BAIT",
    isLive: true,
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["LAKE", "POND", "RESERVOIR"],
    targetSpecies: ["Largemouth Bass", "Pike", "Musky"],
    regions: ["Eastern US", "Southeast"],
    tips: "Use large 4-6 inch shiners for trophy bass. Free-line under a large bobber near vegetation. Handle carefully to keep scales intact. Best fished in or near heavy cover.",
  },
  {
    name: "Leech",
    description:
      "Live ribbon leeches are devastating bait for walleye and bass. Their undulating swimming action is irresistible to predatory fish, especially in cooler water temperatures.",
    category: "LIVE_BAIT",
    isLive: true,
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["LAKE", "RIVER", "RESERVOIR"],
    targetSpecies: ["Walleye", "Smallmouth Bass", "Largemouth Bass", "Trout"],
    regions: ["Midwest", "Eastern US", "Rocky Mountain"],
    tips: "Hook through the sucker end (tail) so the leech swims naturally. Keep in cool water. Extremely effective on a jig head or live bait rig. Best in water temperatures between 50-65 degrees F.",
  },
  {
    name: "Crayfish",
    description:
      "Live crayfish are a primary food source for smallmouth bass, trophy brown trout, and channel catfish. They can be fished whole or as tails, and their scent is a powerful attractant.",
    category: "LIVE_BAIT",
    isLive: true,
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM", "LAKE"],
    targetSpecies: ["Smallmouth Bass", "Brown Trout", "Catfish", "Largemouth Bass"],
    regions: ["Eastern US", "Midwest", "Rocky Mountain"],
    tips: "Hook through the tail from underneath for natural presentation. Remove one claw to slow them down and release scent. Fish near rocky structure where natural crayfish live.",
  },
  {
    name: "Shrimp",
    description:
      "Live shrimp are the ultimate saltwater bait, attracting virtually every inshore species. Their natural scent and movement in the water are irresistible to redfish, snook, and speckled trout.",
    category: "LIVE_BAIT",
    isLive: true,
    seasons: ["SPRING", "SUMMER", "FALL", "WINTER"],
    waterTypes: ["SALTWATER", "BRACKISH"],
    targetSpecies: ["Redfish", "Snook", "Speckled Trout", "Sheepshead", "Flounder"],
    regions: ["Gulf Coast", "Eastern US", "Coastal"],
    tips: "Hook through the horn on top of the head, avoiding the dark spot (brain). Keep in a bait bucket with an aerator. Pop the tail for free-lining in current. Available year-round at coastal bait shops.",
  },

  // ===================== CUT BAIT (4) =====================
  {
    name: "Cut Herring",
    description:
      "Fresh cut herring chunks are one of the most effective saltwater and catfish baits. The oily flesh releases a powerful scent trail that draws predators from great distances.",
    category: "CUT_BAIT",
    isLive: false,
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["SALTWATER", "RIVER", "LAKE", "RESERVOIR"],
    targetSpecies: ["Catfish", "Striped Bass", "Shark", "Halibut"],
    regions: ["Eastern US", "Pacific Northwest", "Gulf Coast"],
    tips: "Cut into chunks or fillet strips depending on target species. Keep on ice for freshness. The stronger the smell, the more effective for catfish. Use a circle hook for best hook-up ratio.",
  },
  {
    name: "Cut Shad",
    description:
      "Sections of gizzard or threadfin shad are irresistible to catfish and striped bass. Shad is the natural forage base in many reservoirs, making cut shad a highly effective bait.",
    category: "CUT_BAIT",
    isLive: false,
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "LAKE", "RESERVOIR"],
    targetSpecies: ["Blue Catfish", "Channel Catfish", "Flathead Catfish", "Striped Bass"],
    regions: ["Eastern US", "Midwest", "Southeast"],
    tips: "Cast net your own for the freshest bait. Cut into 1-2 inch chunks for channel cats, larger pieces for blues. Fresh shad outperforms frozen every time. Score the skin to release more oils.",
  },
  {
    name: "Salmon Eggs",
    description:
      "Natural or cured salmon eggs (roe) are among the most effective baits for trout and steelhead. They replicate a natural food source during salmon spawning runs and work year-round.",
    category: "CUT_BAIT",
    isLive: false,
    seasons: ["FALL", "WINTER", "SPRING"],
    waterTypes: ["RIVER", "STREAM"],
    targetSpecies: ["Steelhead", "Rainbow Trout", "Brown Trout", "Chinook Salmon"],
    regions: ["Pacific Northwest", "Great Lakes", "Rocky Mountain"],
    tips: "Cure eggs in borax or commercial cure for better durability. Wrap in mesh spawn sacks for drift fishing. Single eggs on small hooks work well in clear water. Store cured eggs frozen.",
  },
  {
    name: "Fish Strips",
    description:
      "Strips of fresh fish belly or side meat create a durable, scent-releasing bait. The strip shape flutters in the current, adding visual appeal to the strong scent attractant.",
    category: "CUT_BAIT",
    isLive: false,
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["SALTWATER", "BRACKISH", "LAKE"],
    targetSpecies: ["Flounder", "Catfish", "Snapper", "Grouper"],
    regions: ["Eastern US", "Gulf Coast", "Coastal"],
    tips: "Cut strips thin and tapered for flutter action. Use fresh fish for best scent. Belly meat is toughest and stays on the hook longest. Score the flesh side to release more scent.",
  },

  // ===================== ARTIFICIAL BAIT (3) =====================
  {
    name: "PowerBait",
    description:
      "Berkley's scented, moldable trout bait infused with attractants. PowerBait is specifically formulated to appeal to hatchery-raised trout and is one of the most popular still-fishing baits for stocked trout.",
    category: "ARTIFICIAL_BAIT",
    isLive: false,
    seasons: ["SPRING", "SUMMER", "FALL", "WINTER"],
    waterTypes: ["LAKE", "POND", "RESERVOIR"],
    targetSpecies: ["Rainbow Trout", "Brown Trout", "Brook Trout"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest", "Midwest"],
    tips: "Mold onto a treble hook and float off the bottom with a sliding sinker rig. Use chartreuse, rainbow, or orange for best results. Let fish run with it before setting the hook.",
  },
  {
    name: "Gulp Worms",
    description:
      "Berkley's biodegradable soft plastic worms infused with powerful scent attractant. They combine the natural presentation of a soft plastic with 400 times more scent dispersal than regular plastics.",
    category: "ARTIFICIAL_BAIT",
    isLive: false,
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "STREAM", "LAKE", "SALTWATER"],
    targetSpecies: ["Trout", "Bass", "Panfish", "Flounder", "Redfish"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest", "Gulf Coast"],
    tips: "Keep in the original jar with attractant liquid. Thread onto a jig head for best action. Gulp worms lose scent when air-dried, so keep them moist. Effective for both fresh and saltwater species.",
  },
  {
    name: "Berkley Mice Tails",
    description:
      "Dual-tone soft bait combining a PowerBait body with a curly tail. The contrasting colors and built-in scent make Mice Tails effective for trout in stocked lakes and ponds.",
    category: "ARTIFICIAL_BAIT",
    isLive: false,
    seasons: ["SPRING", "SUMMER", "FALL", "WINTER"],
    waterTypes: ["LAKE", "POND", "RESERVOIR"],
    targetSpecies: ["Rainbow Trout", "Brown Trout"],
    regions: ["Rocky Mountain", "Eastern US", "Pacific Northwest", "Midwest"],
    tips: "Fish on a small hook with a split shot, suspended under a bobber or slowly retrieved. The curly tail provides action even on a still-fished rig. Popular ice fishing bait for stocked trout.",
  },

  // ===================== DOUGH BAIT (3) =====================
  {
    name: "Cheese Bait",
    description:
      "Processed cheese or cheese-flavored dough bait is a traditional and effective bait for trout and catfish. The strong scent and soft texture release attractants steadily into the water.",
    category: "DOUGH_BAIT",
    isLive: false,
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["LAKE", "POND", "RIVER", "STREAM"],
    targetSpecies: ["Trout", "Catfish", "Carp"],
    regions: ["Eastern US", "Rocky Mountain", "Midwest"],
    tips: "Velveeta cheese stays on the hook better than natural cheese. Mold around a treble hook for best hold. Add garlic powder for extra attraction. Fish on the bottom with a sliding sinker rig.",
  },
  {
    name: "Garlic Dough",
    description:
      "Garlic-scented dough bait is a potent attractor for stocked trout and catfish. The intense garlic aroma disperses through the water, drawing fish from a wide area.",
    category: "DOUGH_BAIT",
    isLive: false,
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["LAKE", "POND", "RESERVOIR"],
    targetSpecies: ["Trout", "Catfish", "Carp"],
    regions: ["Rocky Mountain", "Eastern US", "Midwest", "Pacific Northwest"],
    tips: "Form into small balls around a treble hook. Knead until proper consistency is achieved. Float off the bottom for trout, fish on the bottom for catfish and carp.",
  },
  {
    name: "Corn",
    description:
      "Canned sweet corn is an inexpensive and surprisingly effective bait for trout and carp. Its bright yellow color and sweet scent attract fish, though its use is prohibited in some trout waters.",
    category: "DOUGH_BAIT",
    isLive: false,
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["LAKE", "POND", "RESERVOIR", "RIVER"],
    targetSpecies: ["Trout", "Carp", "Catfish", "Panfish"],
    regions: ["Rocky Mountain", "Eastern US", "Midwest", "Pacific Northwest"],
    tips: "Thread 2-3 kernels onto a small bait hook. Check local regulations as corn is banned on some catch-and-release trout waters. Effective as part of a method feeder rig for carp fishing.",
  },

  // ===================== PREPARED BAIT (2) =====================
  {
    name: "Stink Bait",
    description:
      "A pungent, fermented bait made from cheese, blood, and other attractants, specifically formulated for catfish. The extremely strong odor draws catfish from downstream.",
    category: "PREPARED_BAIT",
    isLive: false,
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "LAKE", "RESERVOIR"],
    targetSpecies: ["Channel Catfish", "Blue Catfish"],
    regions: ["Eastern US", "Midwest", "Southeast"],
    tips: "Use with a dip bait worm or treble hook with spring attachment. Wear gloves when handling. Fish on the bottom in areas with moderate current. Most effective in warm water above 60 degrees F.",
  },
  {
    name: "Chicken Liver",
    description:
      "Raw chicken liver is a traditional and highly effective catfish bait. Its blood content and soft texture release a powerful scent trail that channel catfish find irresistible.",
    category: "PREPARED_BAIT",
    isLive: false,
    seasons: ["SPRING", "SUMMER", "FALL"],
    waterTypes: ["RIVER", "LAKE", "POND", "RESERVOIR"],
    targetSpecies: ["Channel Catfish", "Blue Catfish", "Bullhead"],
    regions: ["Eastern US", "Midwest", "Southeast"],
    tips: "Wrap in mesh or nylon stocking to keep it on the hook. Let it sit at room temperature briefly before fishing to soften and increase scent release. Use a circle hook for best results.",
  },
];

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== Fyshe Fly Pattern & Bait Seed Script ===\n");

  // --- Step 1: Truncate existing data (for idempotency) ---
  console.log("Clearing existing FlyMaterial records...");
  const deletedMaterials = await prisma.flyMaterial.deleteMany({});
  console.log(`  Deleted ${deletedMaterials.count} FlyMaterial records.`);

  console.log("Clearing existing FlyTyingStep records...");
  const deletedSteps = await prisma.flyTyingStep.deleteMany({});
  console.log(`  Deleted ${deletedSteps.count} FlyTyingStep records.`);

  console.log("Clearing existing FlyPattern records...");
  const deletedPatterns = await prisma.flyPattern.deleteMany({});
  console.log(`  Deleted ${deletedPatterns.count} FlyPattern records.`);

  console.log("Clearing existing BaitType records...");
  const deletedBait = await prisma.baitType.deleteMany({});
  console.log(`  Deleted ${deletedBait.count} BaitType records.\n`);

  // --- Step 2: Seed FlyPatterns with nested FlyMaterials ---
  console.log(`Seeding ${flyPatterns.length} fly patterns...\n`);

  for (let i = 0; i < flyPatterns.length; i++) {
    const pattern = flyPatterns[i]!;
    const created = await prisma.flyPattern.create({
      data: {
        name: pattern.name,
        category: pattern.category,
        type: pattern.type,
        description: pattern.description,
        difficulty: pattern.difficulty,
        seasons: pattern.seasons,
        waterTypes: pattern.waterTypes,
        targetSpecies: pattern.targetSpecies,
        regions: pattern.regions,
        hookSize: pattern.hookSize,
        hookType: pattern.hookType,
        isPublic: true,
        materials: {
          create: pattern.materials.map((mat, idx) => ({
            part: mat.part,
            material: mat.material,
            color: mat.color ?? null,
            sortOrder: idx,
          })),
        },
      },
    });

    const num = String(i + 1).padStart(2, " ");
    console.log(
      `  [${num}/${flyPatterns.length}] ${created.name} (${pattern.category}) — ${pattern.materials.length} materials`,
    );
  }

  console.log(`\n  Total fly patterns created: ${flyPatterns.length}`);

  // --- Step 3: Seed BaitTypes ---
  console.log(`\nSeeding ${baitTypes.length} bait types...\n`);

  for (let i = 0; i < baitTypes.length; i++) {
    const bait = baitTypes[i]!;
    const created = await prisma.baitType.create({
      data: {
        name: bait.name,
        description: bait.description,
        category: bait.category,
        isLive: bait.isLive,
        seasons: bait.seasons,
        waterTypes: bait.waterTypes,
        targetSpecies: bait.targetSpecies,
        regions: bait.regions,
        tips: bait.tips,
      },
    });

    const num = String(i + 1).padStart(2, " ");
    console.log(`  [${num}/${baitTypes.length}] ${created.name} (${bait.category})`);
  }

  console.log(`\n  Total bait types created: ${baitTypes.length}`);

  // --- Summary ---
  const totalMaterials = flyPatterns.reduce((sum, p) => sum + p.materials.length, 0);
  console.log("\n=== Seed Complete ===");
  console.log(`  Fly Patterns: ${flyPatterns.length}`);
  console.log(`  Fly Materials: ${totalMaterials}`);
  console.log(`  Bait Types:   ${baitTypes.length}`);
  console.log(`  Total Records: ${flyPatterns.length + totalMaterials + baitTypes.length}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
