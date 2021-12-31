import { SLACK_API_URL } from '@/constant/api';
import { SlackError } from '@/entity/api';
import { Issue } from '@/entity/issue';
import { User, UserAPIResponse } from '@/entity/user';
import { snakecaseToCapitalized } from '@/service/formatter';

export interface SlackService {
  postDailyTasks(issues: Issue[]): Promise<void>;
}

export class SlackRESTService implements SlackService {
  private readonly headers: Record<string, string>;

  public constructor(token: string) {
    this.headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Search Slack user by its email
   *
   * @param {string} email user email
   * @returns {Promise<User>} slack user
   */
  private async getUserByEmail(email: string): Promise<User> {
    const params = new URLSearchParams({
      email,
    });
    const url = `${SLACK_API_URL}/user.lookupByEmail?${params.toString()}`;
    const response = await fetch(url, {
      headers: this.headers,
    });
    const result = await response.json();

    if (!response.ok) {
      const { error } = result as SlackError;

      throw new Error(`Failed to get user by email: ${snakecaseToCapitalized(error)}`);
    }

    const { user } = result as UserAPIResponse;

    return {
      id: user.id,
      name: user.real_name,
    };
  }

  public async postDailyTasks(issues: Issue[]): Promise<void> {
    const issueMap: Record<string, Issue[]> = {};

    issues.forEach(i => {
      if (!issueMap[i.assignee]) {
        issueMap[i.assignee] = [];
      }

      issueMap[i.assignee].push(i);
    });
  }
}
