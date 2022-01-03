import { formatIssueToListItem, mapIssuesToAssignee } from '@/entity/issue';

import { bold, linkify, snakecaseToCapitalized } from '@/service/formatter';
import { getCurrentDate } from '@/utils';

import { SLACK_API_URL } from '@/constant/api';

import type { Issue } from '@/entity/issue';
import type { Footer, MessageBlock, MessageContextBlock, MessageTextBlock } from '@/entity/message';
import type { User, UserAPIResponse } from '@/entity/user';
import type { SlackError } from '@/entity/api';

export interface SlackService {
  postDailyReport(
    teamId: string,
    channelId: string,
    issues: Issue[],
  ): Promise<void>;
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
   * @returns {Promise<MessageTextBlock[]>} Slack message blocks
   */
  private async formatTasks(
    teamId: string,
    issueMap: Record<string, Issue[]>,
  ): Promise<MessageTextBlock[]> {
    const header: MessageTextBlock = {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: bold(`Daily Standup ${getCurrentDate()} — ${this.mention(teamId, true)}`),
      },
    };

    const content = Object.entries(issueMap).map(async ([mail, issues]) => {
      const { id, name } = await this.getUserByEmail(mail);
      const head = `${name} — ${this.mention(id, false)}`;

      const tasks = issues.map(i => formatIssueToListItem(i)).join('\n');

      return {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: [head, tasks].join('\n\n'),
        },
      } as MessageTextBlock;
    });

    const body = await Promise.all(content);

    return [header, ...body];
  }

  private formatFooter(footer: Footer): MessageContextBlock {
    return {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: footer.alias ? linkify(footer.text, footer.alias) : footer.text,
        },
      ],
    };
  }

  /**
   * Post daily standup report to appropriate channel
   *
   * @param {string} teamId Slack team id
   * @param {string} channelId Slack channel id
   * @param {Issue[]} issues list of issues
   * @param {Footer?} footer message footer
   */
  public async postDailyReport(
    teamId: string,
    channelId: string,
    issues: Issue[],
    footer?: Footer,
  ): Promise<void> {
    const issueMap = mapIssuesToAssignee(issues);

    const content: MessageBlock[] = await this.formatTasks(teamId, issueMap);
    if (footer) {
      content.push(this.formatFooter(footer));
    }

    const reqBody = {
      channel: channelId,
      blocks: content,
    };

    const response = await fetch(`${SLACK_API_URL}/chat.postMessage`, {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: this.headers,
    });

    const result = await response.json();

    if (!response.ok) {
      const { error } = result as SlackError;

      throw new Error(`Failed to post daily report: ${snakecaseToCapitalized(error)}`);
    }
  }
}
