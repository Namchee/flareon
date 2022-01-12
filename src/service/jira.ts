import { JIRA_API_URL } from '@/constant/api';

import type { Credentials } from '@/entity/creds';
import type { RawIssue, IssueAPIResponse, Issue, IssueStatus } from '@/entity/issue';
import type { Sprint, SprintAPIResponse } from '@/entity/sprint';
import type { JIRAUser } from '@/entity/user';
import { getIssueLink } from '@/utils';

export interface JIRAService {
  getSprintIssues(boardId: number): Promise<Issue[]>;
}

export class JiraRESTService implements JIRAService {
  private readonly host: string;
  private readonly apiUrl: string;
  private readonly headers: Record<string, string>;

  public constructor(host: string, { email, token }: Credentials) {
    this.host = host;
    this.apiUrl = new URL(JIRA_API_URL, host).toString();
    this.headers = {
      Accept: 'application/json',
      Authorization: 'Basic ' + btoa(`${email}:${token}`),
    };
  }

  /**
   * Get the current sprint
   *
   * @param {number} boardId JIRA board ID
   * @returns {Promise<Sprint | null>} Current sprint object or `null`
   * if there is no active sprint
   */
  private async fetchSprint(boardId: number): Promise<Sprint | null> {
    const params = new URLSearchParams({
      state: 'active',
    });
    const sprintUrl = `${this.apiUrl}/board/${boardId}/sprint?${params.toString()}`;

    const response = await fetch(sprintUrl, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to get the current sprint: ${response.statusText}`);
    }

    const { values }: SprintAPIResponse = await response.json();

    return values.shift() ?? null;
  }

  /**
   * Get all issues for a sprint
   *
   * @param {number} sprintId JIRA sprint id
   * @returns {Promise<RawIssue[]>} List of issues for the sprint
   */
  private async fetchSprintIssues(sprintId: number): Promise<RawIssue[]> {
    const sprintUrl = `${this.apiUrl}/sprint/${sprintId}/issue`;

    const response = await fetch(sprintUrl, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to get issues for sprint: ${response.statusText}`);
    }

    const { issues }: IssueAPIResponse = await response.json();

    return issues;
  }

  /**
   * Strip unneeded data from JIRA API raw issue response
   *
   * @param {RawIssue} issue raw issue from JIRA API response
   * @returns {Issue} issue with just the relevant data
   */
  private mapRawIssueToIssue(issue: RawIssue): Issue {
    const label = (issue.fields.summary as string).match(/\[(.*?)\]/g);

    let title = issue.fields.summary as string;
    label?.forEach(l => {
      title = title.replace(l, '');
    });
    title = title.trim();

    const email = issue.fields.assignee
      ? (issue.fields.assignee as JIRAUser).emailAddress
      : null;

    return {
      id: issue.key,
      label: label && label.length
        ? label.map(l => l.slice(1, l.length - 1))
        : [],
      title,
      status: (issue.fields.status as IssueStatus).name,
      assignee: email,
      link: getIssueLink(this.host, issue.key),
    };
  }

  /**
   * Get all active issues from the current sprint of the board
   *
   * @param {number} boardId JIRA board id
   * @returns {Promise<Issue[]>} list of active issues
   */
  public async getSprintIssues(boardId: number): Promise<Issue[]> {
    const sprint = await this.fetchSprint(boardId);
    if (!sprint) {
      return [];
    }

    const issues = await this.fetchSprintIssues(sprint.id);

    return issues.map(issue => this.mapRawIssueToIssue(issue));
  }
}
