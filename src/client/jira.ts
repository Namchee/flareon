import { API_URL } from '@/constant/jira';

import type { Credentials } from '@/entity/creds';
import type { RawIssue, IssueAPIResponse, Issue, IssueStatus } from '@/entity/issue';
import type { Sprint, SprintAPIResponse } from '@/entity/sprint';
import type { JIRAUser } from '@/entity/user';

export interface JIRAClient {
  getIssues(boardId: number): Promise<Issue[]>;
}

export class JIRARestClient implements JIRAClient {
  private readonly headers: Headers;

  public constructor({ email, token }: Credentials) {
    this.headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Basic ' + btoa(`${email}:${token}`),
    });
  }

  /**
   * Get the current sprint
   *
   * @param {number} boardId JIRA board ID
   * @returns {Promise<Sprint | null>} Current sprint object or `null`
   * if there is no active sprint
   */
  private async fetchCurrentSprint(boardId: number): Promise<Sprint | null> {
    const params = new URLSearchParams({
      state: 'active',
    });
    const sprintUrl = `${API_URL}/board/${boardId}/sprint?${params.toString()}`;

    const response = await fetch(sprintUrl, {
      headers: this.headers,
    });

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
    const sprintUrl = `${API_URL}/sprint/${sprintId}/issue`;

    const response = await fetch(sprintUrl, {
      headers: this.headers,
    });

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
    const label = (issue.fields.summary as string).match(/(\[(.*?)\])/g);

    let title = issue.fields.summary as string;
    label?.forEach(l => {
      title = title.replace(l, '');
    });
    title = title.trim();

    const jiraUser = issue.fields.assignee as JIRAUser;

    return {
      id: issue.key,
      label: label ?? [],
      title,
      status: (issue.fields.status as IssueStatus).name,
      assignee: {
        email: jiraUser.emailAddress,
        name: jiraUser.displayName,
      },
    };
  }

  /**
   * Get all active issues from the current sprint of the board
   *
   * @param {number} boardId JIRA board id
   * @returns {Promise<Issue[]>} list of active issues
   */
  public async getIssues(boardId: number): Promise<Issue[]> {
    const sprint = await this.fetchCurrentSprint(boardId);
    if (!sprint) {
      return [];
    }

    const issues = await this.fetchSprintIssues(sprint.id);

    return issues.map(issue => this.mapRawIssueToIssue(issue));
  }
}
