import fs from "fs";
import path from "path";
import type { FamilyEvent, FamilyMember, FamilyMotto } from "@/data/types";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const BACKUP_DIR = path.join(process.cwd(), "backups");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function backup(filename: string) {
  ensureDir(BACKUP_DIR);
  const src = path.join(DATA_DIR, filename);
  if (fs.existsSync(src)) {
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const dest = path.join(BACKUP_DIR, `${path.parse(filename).name}_${ts}.json`);
    fs.copyFileSync(src, dest);
  }
}

function readJSON<T>(filename: string): T {
  const filepath = path.join(DATA_DIR, filename);
  const raw = fs.readFileSync(filepath, "utf-8");
  return JSON.parse(raw);
}

function writeJSON<T>(filename: string, data: T) {
  backup(filename);
  const filepath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), "utf-8");
}

// Events
export function getEvents(): FamilyEvent[] {
  return readJSON<FamilyEvent[]>("events.json");
}

export function saveEvents(events: FamilyEvent[]) {
  writeJSON("events.json", events);
}

// Members
export function getMembers(): FamilyMember[] {
  return readJSON<FamilyMember[]>("members.json");
}

export function saveMembers(members: FamilyMember[]) {
  writeJSON("members.json", members);
}

// Mottos
export function getMottos(): { mottos: FamilyMotto[] } {
  return readJSON<{ mottos: FamilyMotto[] }>("motto.json");
}

export function saveMottos(mottos: { mottos: FamilyMotto[] }) {
  writeJSON("motto.json", mottos);
}
