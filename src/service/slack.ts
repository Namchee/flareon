import { SLACK_API_URL } from '@/constant/api';
import { SlackError } from '@/entity/api';
import { formatIssueToListItem, Issue, mapIssuesToAssignee } from '@/entity/issue';
import { User, UserAPIResponse } from '@/entity/user';
import { bold, snakecaseToCapitalized } from '@/service/formatter';
import { getCurrentDate } from '@/utils';

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

  /**
   * Format a string for Slack mentions
   *
   * @param {string} id entity ID
   * @param {boolean} group whether if the mention target is a Slack team
   * @returns {string} string in Slack mention format
   */
  private mention(id: string, group: boolean): string {
    return group ? `<!subteam^${id}>` : `<@${id}>`;
  }

  /**
   * Format daily report to Slack markdown
   *
   * @param {string} teamId Slack team ID
   * @param {Record<string, Issue[]>} issueMap assignee to issues object map
   * @returns {string} daily standup report string
   */
  private async formatTasks(
    teamId: string,
    issueMap: Record<string, Issue[]>,
  ): Promise<string> {
    const header = bold(`Daily Standup ${getCurrentDate()} — ${this.mention(teamId, true)}`);
    const content = Object.entries(issueMap).map(async ([mail, issues]) => {
      const { id, name } = await this.getUserByEmail(mail);
      const head = `${name} — ${this.mention(id, false)}`;

      const tasks = issues.map(i => formatIssueToListItem(i)).join('\n');

      return [head, tasks].join('\n\n');
    });

    const body = await Promise.all(content);

    return [header, ...body].join('\n\n');
  }

  public async postDailyTasks(
    teamId: string,
    issues: Issue[],
  ): Promise<void> {
    const issueMap = mapIssuesToAssignee(issues);

    const content = this.formatTasks(teamId, issueMap);

    const response = await fetch(`${SLACK_API_URL}/chat.postMessage`, {
      method: 'POST',
      headers: this.headers,
    });
  }
}
