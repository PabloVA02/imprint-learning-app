import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const clientDir = join(projectRoot, "dist", "client");
const indexPath = join(clientDir, "index.html");

let html = await readFile(indexPath, "utf8");

const scriptMatch = html.match(
  /<script type="module"[^>]*src="\.\/assets\/([^"]+\.js)"[^>]*><\/script>/,
);
const styleMatch = html.match(
  /<link rel="stylesheet"[^>]*href="\.\/assets\/([^"]+\.css)"[^>]*>/,
);

if (!scriptMatch || !styleMatch) {
  throw new Error("The compiled JavaScript or stylesheet could not be located.");
}

const [javaScript, styles] = await Promise.all([
  readFile(join(clientDir, "assets", scriptMatch[1]), "utf8"),
  readFile(join(clientDir, "assets", styleMatch[1]), "utf8"),
]);

html = html
  .replace(styleMatch[0], `<style>${styles}</style>`)
  .replace(scriptMatch[0], `<script type="module">${javaScript}</script>`)
  .replaceAll("__SITE_ORIGIN__", ".");

await writeFile(join(clientDir, "preview.html"), html);
