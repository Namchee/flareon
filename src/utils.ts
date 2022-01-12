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

/**
 * Get JIRA issue link from its key
 *
 * @param {string} host JIRA host
 * @param {string} key JIRA issue key
 * @returns {string} URL to JIRA issue page
 */
export function getIssueLink(host: string, key: string): string {
  return new URL(`/browse/${key}`, host).toString();
}
