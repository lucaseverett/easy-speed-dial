import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Parse and validate CLI argument
const target = process.argv[2];
if (!["chrome", "firefox"].includes(target)) {
  console.error('Error: first argument must be "chrome" or "firefox".');
  process.exit(1);
}

// Resolve paths
const __filename = fileURLToPath(import.meta.url);
const projectRoot = path.dirname(__filename);
const pkgPath = path.join(projectRoot, "package.json");
const manifestPath = path.join(projectRoot, "public", target, "manifest.json");

// Read version from package.json
const pkgJson = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const { version } = pkgJson;

// Read manifest.json as text and replace version only
let manifestRaw = fs.readFileSync(manifestPath, "utf8");
manifestRaw = manifestRaw.replace(
  /("version"\s*:\s*)"(.*?)"/,
  `$1"${version}"`,
);

// Write back the modified manifest
fs.writeFileSync(manifestPath, manifestRaw);
console.log(
  `[update-manifest-version] Set ${target} manifest version to ${version}`,
);
