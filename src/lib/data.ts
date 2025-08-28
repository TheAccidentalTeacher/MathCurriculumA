import fs from "fs";
import path from "path";

export type DocRecord = {
  file: string;
  text: string;
  info?: any;
  metadata?: any;
};

const dataDir = path.join(process.cwd(), "data");

export function listDocs(): string[] {
  if (!fs.existsSync(dataDir)) return [];
  return fs
    .readdirSync(dataDir)
    .filter((f) => f.endsWith(".json") && f !== "all.json");
}

export function getDoc(id: string): DocRecord | null {
  const filePath = path.join(dataDir, id);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as DocRecord;
}

export function getAll(): DocRecord[] {
  const allPath = path.join(dataDir, "all.json");
  if (fs.existsSync(allPath)) {
    return JSON.parse(fs.readFileSync(allPath, "utf8"));
  }
  return listDocs().map((f) => getDoc(f)!).filter(Boolean);
}

export function search(query: string): DocRecord[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getAll().filter((d) => d.text?.toLowerCase().includes(q));
}
