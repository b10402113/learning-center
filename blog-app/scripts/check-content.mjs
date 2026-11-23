import { readLibrary } from "../lib/content.mjs";
import { validateLibrary } from "../lib/schema.mjs";
const library = readLibrary();
const errors = validateLibrary(library);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `Content OK: ${library.articles.length} articles, ${library.blocks.length} blocks, ${library.roadmaps.length} roadmaps`,
  );
