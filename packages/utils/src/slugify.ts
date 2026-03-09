/**
 * URL slug utilities
 *
 * Hoisted at module level so RegExp objects are created once,
 * not on every function call (js-hoist-regexp).
 */

// Chars that act as word separators but aren't whitespace (/, |, &, +, ~, etc.)
// Replaced with a space BEFORE stripping so words don't concatenate.
// e.g. "4WD/AWD" → "4WD AWD" → "4wd-awd"  (not "4wdawd")
const SEPARATOR_RE = /[/|&+~]/g;

// Strip everything that isn't alphanumeric, spaces, or hyphens
const STRIP_RE = /[^a-z0-9\s-]/g;

// Collapse one-or-more whitespace chars OR hyphens into a single hyphen
// Handles: multiple spaces, mixed " - ", double-hyphens from stripping
const COLLAPSE_RE = /[\s-]+/g;

// Trim leading/trailing hyphens left after collapsing
// e.g. "-word-" → "word", "word-" → "word"
const EDGE_HYPHEN_RE = /^-+|-+$/g;

/**
 * Common English stop words to optionally strip from slugs.
 *
 * Only applied when `removeStopWords: true` is passed to `slugify()`.
 * Do NOT apply to free-text search queries (?q=) — removing "under"
 * from "SUV under 35k" changes the search intent.
 * Apply to canonical/indexed URL slugs (e.g. VDP, category pages).
 */
const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "from",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "it",
  "this",
  "that",
  "as",
  "up",
  "into",
  "than",
]);

export interface SlugifyOptions {
  /**
   * Strip common English stop words (a, the, and, with, for, …).
   *
   * **Use for canonical/indexed URL slugs** (vehicle detail pages, category pages).
   * **Do NOT use for search query params** — "SUV under 35k" ≠ "SUV 35k".
   * @default false
   */
  removeStopWords?: boolean;
  /**
   * Truncate the slug to this many characters, cutting at the last full word.
   * Keeps URLs concise and below the ~75-char SEO sweet-spot.
   * @default 75
   */
  maxLength?: number;
}

/**
 * Convert a plain-text string into an SEO-friendly URL slug.
 *
 * SEO properties guaranteed:
 * - Hyphens as word separators (Google treats `-` as a word boundary)
 * - Lowercase ASCII only — no encoding noise in the URL
 * - Accented chars transliterated (é→e, ñ→n) via Unicode NFD normalisation
 * - Separator chars (/ | & + ~) become hyphens, not silent drops
 * - Consecutive hyphens collapsed; leading/trailing hyphens trimmed
 * - Optional stop-word removal for canonical slugs
 * - Optional max-length truncation at word boundary
 *
 * @example — search query (keep stop words for intent fidelity)
 * slugify("SUV under 35k with Low Miles")
 * // "suv-under-35k-with-low-miles"
 *
 * @example — canonical page slug (strip stop words + cap length)
 * slugify("Used Toyota RAV4 with Leather Seats and All Wheel Drive", { removeStopWords: true, maxLength: 50 })
 * // "used-toyota-rav4-leather-seats-all-wheel-drive"
 *
 * @example — other cases
 * slugify("4WD/AWD")                      // "4wd-awd"
 * slugify("Café & Heated Seats")          // "cafe-heated-seats"
 * slugify("BMW 3-Series")                 // "bmw-3-series"
 * slugify("  Hello   --  World!  ")       // "hello-world"
 */
export function slugify(text: string, options: SlugifyOptions = {}): string {
  const { removeStopWords = false, maxLength = 75 } = options;

  let slug = text
    .trim()
    .normalize("NFD") // decompose accented chars (é → e + combining ́)
    .replace(/[\u0300-\u036f]/g, "") // strip combining diacritical marks (→ plain ASCII)
    .toLowerCase()
    .replace(SEPARATOR_RE, " ") // "/" → " " before stripping so words don't merge
    .replace(STRIP_RE, "") // remove remaining non-alphanumeric (except space/hyphen)
    .replace(COLLAPSE_RE, " ") // normalise to single spaces first
    .trim();

  if (removeStopWords) {
    slug = slug
      .split(" ")
      .filter((word) => word.length > 0 && !STOP_WORDS.has(word))
      .join(" ");
  }

  slug = slug
    .replace(COLLAPSE_RE, "-") // spaces → hyphens
    .replace(EDGE_HYPHEN_RE, ""); // trim leading/trailing hyphens

  // Truncate at word boundary — never cut mid-word
  if (slug.length > maxLength) {
    slug = slug.slice(0, maxLength).replace(/-[^-]*$/, "");
  }

  return slug;
}

/**
 * Build a search URL from an optional query string.
 *
 * Uses `slugify()` with default options (stop words kept) — preserving
 * the full search intent in the `?q=` parameter.
 *
 * @param query  Free-text search query.
 * @param base   Base path. Defaults to `"/used-cars"`.
 *
 * @example
 * toSearchUrl("SUV under 35k") // "/used-cars?q=suv-under-35k"
 * toSearchUrl("4WD/AWD")       // "/used-cars?q=4wd-awd"
 * toSearchUrl("")               // "/used-cars"
 * toSearchUrl()                 // "/used-cars"
 * toSearchUrl("SUV", "/dealer/123/inventory") // "/dealer/123/inventory?q=suv"
 */
export function toSearchUrl(query?: string, base = "/used-cars"): string {
  if (!query?.trim()) {
    return base;
  }
  // Slug is already [a-z0-9-] — all URL-safe, no encodeURIComponent needed
  const slug = slugify(query);
  return slug ? `${base}?q=${slug}` : base;
}
