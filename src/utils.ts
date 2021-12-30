/**
 * Get current date in localized Indonesian format
 *
 * @returns {string} localized Indonesian date string
 */
export function getCurrentDate(): string {
  const date = new Date();

  return date.toLocaleDateString('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
