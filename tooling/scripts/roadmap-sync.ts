/**
 * roadmap-sync.ts
 *
 * Parses ROADMAP.md and generates a progress report.
 *
 * Usage:
 *   pnpm --filter @fyshe/tooling roadmap:sync          # Markdown report (for PRs)
 *   pnpm --filter @fyshe/tooling roadmap:sync:commit    # Commit message block (for git hooks)
 */

import { readFileSync } from "fs";
import { resolve } from "path";

interface RoadmapPhase {
  name: string;
  tasks: { text: string; done: boolean }[];
}

const PHASE_EMOJIS: Record<string, string> = {
  "Phase 0: Foundation": "🏗️",
  "Phase 1: User & Gear": "🎒",
  "Phase 2: Catch Logging & Trips": "🎣",
  "Phase 3: Fly Fishing Features": "🪰",
  "Phase 4: Content & Social": "📰",
  "Phase 5: PWA & Polish": "✨",
};

function parseRoadmap(content: string): RoadmapPhase[] {
  const phases: RoadmapPhase[] = [];
  let currentPhase: RoadmapPhase | null = null;

  for (const line of content.split("\n")) {
    const phaseMatch = line.match(/^## (.+)$/);
    if (phaseMatch) {
      currentPhase = { name: phaseMatch[1]!, tasks: [] };
      phases.push(currentPhase);
      continue;
    }

    const taskMatch = line.match(/^- \[([ x])\] (.+)$/);
    if (taskMatch && currentPhase) {
      currentPhase.tasks.push({
        done: taskMatch[1] === "x",
        text: taskMatch[2]!,
      });
    }
  }

  return phases;
}

function progressBar(done: number, total: number, width: number = 10): string {
  const filled = total > 0 ? Math.round((done / total) * width) : 0;
  return "█".repeat(filled) + "░".repeat(width - filled);
}

function generateMarkdownReport(phases: RoadmapPhase[]): string {
  const lines: string[] = ["# Fyshe Project Progress", ""];

  let totalDone = 0;
  let totalTasks = 0;

  for (const phase of phases) {
    const done = phase.tasks.filter((t) => t.done).length;
    const total = phase.tasks.length;
    totalDone += done;
    totalTasks += total;

    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const bar = "=".repeat(Math.round(pct / 5)) + "-".repeat(20 - Math.round(pct / 5));

    lines.push(`**${phase.name}** [${bar}] ${pct}% (${done}/${total})`);
  }

  const overallPct = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;
  lines.push("");
  lines.push(`**Overall**: ${overallPct}% complete (${totalDone}/${totalTasks} tasks)`);

  return lines.join("\n");
}

function generateCommitBlock(phases: RoadmapPhase[]): string {
  const lines: string[] = [];
  lines.push("📊 Roadmap Progress");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  let totalDone = 0;
  let totalTasks = 0;

  for (const phase of phases) {
    const done = phase.tasks.filter((t) => t.done).length;
    const total = phase.tasks.length;
    totalDone += done;
    totalTasks += total;

    const emoji = PHASE_EMOJIS[phase.name] ?? "📋";
    const bar = progressBar(done, total);
    const fraction = `${done}/${total}`.padStart(5);

    lines.push(`${emoji} ${phase.name.padEnd(30)} ${bar} ${fraction}`);
  }

  const overallPct = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;
  const overallBar = progressBar(totalDone, totalTasks, 20);
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push(`🐟 Overall: ${overallBar} ${totalDone}/${totalTasks} (${overallPct}%)`);

  return lines.join("\n");
}

// --- Main ---

const format = process.argv[2] ?? "markdown";
const roadmapPath = resolve(import.meta.dirname, "../../ROADMAP.md");
const content = readFileSync(roadmapPath, "utf-8");
const phases = parseRoadmap(content);

if (format === "commit") {
  console.log(generateCommitBlock(phases));
} else {
  console.log(generateMarkdownReport(phases));
}
