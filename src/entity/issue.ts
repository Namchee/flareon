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
