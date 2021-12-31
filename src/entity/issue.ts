import { JiraAPIResponse } from '@/entity/api';
import { bold, bracketize } from '@/service/formatter';

export interface RawIssue {
  expand?: string;
  id: string;
  self: string;
  key: string;
  fields: Record<string, unknown>;
}

export interface Issue {
  id: string;
  assignee: string;
  title: string;
  label: string[];
  status: string;
}

export interface IssueStatus {
  self: string;
  description: string;
  name: string;
  id: string;
}

export interface IssueAPIResponse extends JiraAPIResponse {
  issues: RawIssue[];
}

/**
 * Formats issue to one-liner list item
 *
 * @param {Issue} issue issue
 * @returns {string} issue in one-liner format
 */
export function formatIssueToListItem(
  { id, title, label, status }: Issue,
): string {
  const key = bold(bracketize(id));
  const labels = label.map(l => bold(bracketize(l))).join(' ');
  const stat = bold(status.toUpperCase());

  return [
    key,
    labels,
    title,
    '—',
    stat,
  ].filter(s => Boolean(s)).join(' ');
}

/**
 * Map each issues to its assignee in sorted fashion
 *
 * @param {Issue[]} issues list of issues
 * @returns {Record<string, Issue[]>} assignee to issue map
 */
export function mapIssuesToAssignee(issues: Issue[]): Record<string, Issue[]> {
  const sorted = issues.sort((i, j) => {
    const firstTokens = i.id.split('-');
    const secondTokens = j.id.split('-');

    if (firstTokens[0] !== secondTokens[0]) {
      return firstTokens[0].localeCompare(secondTokens[0]);
    }

    return Number(firstTokens[1]) <= Number(secondTokens[1]) ? -1 : 1;
  });

  const issueMap: Record<string, Issue[]> = {};

  sorted.forEach(i => {
    if (!issueMap[i.assignee]) {
      issueMap[i.assignee] = [];
    }

    issueMap[i.assignee].push(i);
  });

  return issueMap;
}
