/**
 * Transform snake_case string to capitalized string
 *
 * @param {string} str snake_case string
 * @returns {string} capitalized string
 */
export function snakecaseToCapitalized(str: string): string {
  return str.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

/**
 * Apply bold markdown formatting
 *
 * @param {string} str input string
 * @returns {string} bold markdown string
 */
export function bold(str: string): string {
  return `*${str}*`;
}

/**
 * Enclose a string in square brackets
 *
 * @param {string} str input string
 * @returns {string} square bracketed string
 */
export function bracketize(str: string): string {
  return `[${str}]`;
}

/**
 * Generate markdown link from an URl
 *
 * @param {string} link input URL
 * @param {string} alias URL alias
 * @returns {string} markdown link
 */
export function linkify(link: string, alias: string): string {
  return `[${alias}](${link})`;
}
