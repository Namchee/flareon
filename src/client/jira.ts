import { API_URL } from '@/constant/jira';

import type { Credentials } from '@/entity/creds';
import type { Issue, IssueAPIResponse } from '@/entity/issue';
import type { Sprint, SprintAPIResponse } from '@/entity/sprint';

export interface JIRAClient {
  fetchCurrentIssues(boardId: number): Promise<Issue[]>;
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
   * @param {number} board JIRA board ID
   * @returns {Promise<Sprint | null>} Current sprint object or `null`
   * if there is no active sprint
   */
  private async getCurrentSprint(board: number): Promise<Sprint | null> {
    const params = new URLSearchParams({
      state: 'active',
    });
    const sprintUrl = `${API_URL}/board/${board}/sprint?${params.toString()}`;

    const response = await fetch(sprintUrl, {
      headers: this.headers,
    });

    const { values }: SprintAPIResponse = await response.json();

    return values.shift() ?? null;
  }

  private async getSprintIssues(
    boardId: number,
    sprintId: number,
  ): Promise<Issue[]> {
    const sprintUrl = `${API_URL}/board/${boardId}/sprint/${sprintId}/issue`;

    const response = await fetch(sprintUrl, {
      headers: this.headers,
    });

    const { issues }: IssueAPIResponse = await response.json();
    issues.forEach(issue => {
      Object.keys(issue.fields).forEach(k =>
        issue.fields[k] === null && delete issue.fields[k],
      );
    });

    return issues;
  }

  public async fetchCurrentIssues(boardId: number): Promise<Issue[]> {
    const sprint = await this.getCurrentSprint(boardId);

    return sprint ? this.getSprintIssues(boardId, sprint.id) : [];
  }
}
