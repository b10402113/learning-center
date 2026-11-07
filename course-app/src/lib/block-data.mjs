const blockLoaders = import.meta.glob("../data/blocks/*/*.json");
const cache = new Map();

/**
 * Load one block's JSON on demand. Missing files resolve to a `missing` stub
 * so the viewer can show a message instead of waiting forever.
 */
export async function loadBlock(subjectId, blockId) {
  if (!subjectId || !blockId) return null;
  const key = `${subjectId}/${blockId}`;
  if (cache.has(key)) return cache.get(key);

  const loader = blockLoaders[`../data/blocks/${subjectId}/${blockId}.json`];
  if (!loader) {
    const missing = { id: blockId, missing: true };
    cache.set(key, missing);
    return missing;
  }

  const mod = await loader();
  cache.set(key, mod.default);
  return mod.default;
}
