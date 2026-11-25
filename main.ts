import { accessSync, closeSync, constants, mkdirSync, openSync, writeSync } from "node:fs";

const EXCUSE =
  "I fixed production before you noticed, so the only evidence I was ever in there is this apology and one suspiciously warm server.";

function candidateDirs(): string[] {
  const dirs: string[] = [];
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv) dirs.push(fromEnv);
  dirs.push("/output", "./out");
  return dirs;
}

function writableDir(dir: string): boolean {
  try {
    mkdirSync(dir, { recursive: true });
    accessSync(dir, constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

function pickOutputDir(): string {
  for (const dir of candidateDirs()) {
    if (writableDir(dir)) return dir;
  }
  return "./out";
}

function writeEntry(dir: string, text: string): void {
  mkdirSync(dir, { recursive: true });
  const fd = openSync(`${dir}/entry.txt`, "w");
  try {
    writeSync(fd, Buffer.from(text, "utf8"));
  } finally {
    closeSync(fd);
  }
}

function main(): void {
  writeEntry(pickOutputDir(), EXCUSE);
}

main();
