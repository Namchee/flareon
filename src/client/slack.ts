import { Issue } from '@/entity/issue';

export interface SlackClient {
  postDailyTasks(issues: Issue[]): Promise<void>;
}

export class SlackRESTClient implements SlackClient {
  private readonly headers: Record<string, string>;

  public constructor(token: string) {
    this.headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  private getUserByEmail(email: string): User {
    // foo bar
  }

  public async postDailyTasks(issues: Issue[]): Promise<void> {
    // bar baz
  }
}
