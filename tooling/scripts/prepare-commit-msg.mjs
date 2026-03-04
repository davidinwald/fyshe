#!/usr/bin/env node

/**
 * prepare-commit-msg hook
 *
 * Appends a visual roadmap progress block to every commit message.
 * Skips merge commits, amends, and squashes.
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const commitMsgFile = process.argv[2];
const commitSource = process.argv[3]; // "message", "merge", "squash", "commit" (amend)

// Skip merge commits, squash, and amend — only modify fresh commits
if (commitSource === "merge" || commitSource === "squash") {
  process.exit(0);
}

if (!commitMsgFile) {
  process.exit(0);
}

// --- Parse ROADMAP.md ---

const PHASE_EMOJIS = {
  "Phase 0: Foundation": "🏗️",
  "Phase 1: User & Gear": "🎒",
  "Phase 2: Catch Logging & Trips": "🎣",
  "Phase 3: Fly Fishing Features": "🪰",
  "Phase 4: Content & Social": "📰",
  "Phase 5: PWA & Polish": "✨",
};

function progressBar(done, total, width = 10) {
  const filled = total > 0 ? Math.round((done / total) * width) : 0;
  return "█".repeat(filled) + "░".repeat(width - filled);
}

try {
  const roadmapPath = resolve(__dirname, "../../ROADMAP.md");
  const roadmapContent = readFileSync(roadmapPath, "utf-8");

  const phases = [];
  let currentPhase = null;

  for (const line of roadmapContent.split("\n")) {
    const phaseMatch = line.match(/^## (.+)$/);
    if (phaseMatch) {
      currentPhase = { name: phaseMatch[1], tasks: [] };
      phases.push(currentPhase);
      continue;
    }

    const taskMatch = line.match(/^- \[([ x])\] (.+)$/);
    if (taskMatch && currentPhase) {
      currentPhase.tasks.push({ done: taskMatch[1] === "x" });
    }
  }

  // Build the progress block
  let totalDone = 0;
  let totalTasks = 0;
  const progressLines = [];

  progressLines.push("");
  progressLines.push("📊 Roadmap Progress");
  progressLines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  for (const phase of phases) {
    const done = phase.tasks.filter((t) => t.done).length;
    const total = phase.tasks.length;
    totalDone += done;
    totalTasks += total;

    const emoji = PHASE_EMOJIS[phase.name] ?? "📋";
    const bar = progressBar(done, total);
    const fraction = `${done}/${total}`.padStart(5);

    progressLines.push(`${emoji}  ${phase.name.padEnd(30)} ${bar} ${fraction}`);
  }

  const overallPct = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;
  const overallBar = progressBar(totalDone, totalTasks, 20);
  progressLines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  progressLines.push(
    `🐟 Overall: ${overallBar} ${totalDone}/${totalTasks} (${overallPct}%)`,
  );

  // Read existing commit message and append
  const existingMsg = readFileSync(commitMsgFile, "utf-8");

  // Don't double-append if already present
  if (existingMsg.includes("📊 Roadmap Progress")) {
    process.exit(0);
  }

  writeFileSync(commitMsgFile, existingMsg.trimEnd() + "\n" + progressLines.join("\n") + "\n");
} catch {
  // If anything fails, don't block the commit
  process.exit(0);
}
