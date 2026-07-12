import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const target = process.argv[2];
if (!["chrome", "firefox"].includes(target)) {
  console.error('Error: first argument must be "chrome" or "firefox".');
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const projectRoot = path.dirname(__filename);
const pkgPath = path.join(projectRoot, "package.json");
const manifestPath = path.join(projectRoot, "public", target, "manifest.json");

const pkgJson = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const { version } = pkgJson;

let manifestRaw = fs.readFileSync(manifestPath, "utf8");
manifestRaw = manifestRaw.replace(
  /("version"\s*:\s*)"(.*?)"/,
  `$1"${version}"`,
);

fs.writeFileSync(manifestPath, manifestRaw);
console.log(
  `[update-manifest-version] Set ${target} manifest version to ${version}`,
);
