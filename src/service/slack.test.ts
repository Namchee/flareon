import fetch from 'cross-fetch';
import { describe, it, beforeAll, afterEach, afterAll, expect } from 'vitest';

import { slackMockServer } from '@/mocks/server';
import { SlackRESTService } from './slack';
import { Issue } from '@/entity/issue';

describe('Slack REST Service', () => {
  beforeAll(() => {
    global.fetch = fetch;
    slackMockServer.listen();
  });

  afterEach(() => {
    slackMockServer.resetHandlers();
  });

  afterAll(() => {
    slackMockServer.close();
  });

  it('should throw an error when user is not found', async () => {
    try {
      const token = 'foo';
      const issues: Issue[] = [
        {
          id: 'BTDC',
          title: 'Foo Bar',
          label: [],
          status: 'Done',
          assignee: 'lorem@ipsum.com',
        },
      ];

      const service = new SlackRESTService(token);

      await service.postDailyReport('13', '123', issues);

      throw new Error('Should not pass as user is not found');
    } catch (err) {
      const { message } = err as Error;

      expect(message).toBe('Failed to get user by email: User Not Found');
    }
  });

  it('should throw an error when the channel is not found', async () => {
    try {
      const token = 'realToken';
      const issues: Issue[] = [
        {
          id: 'BTDC',
          title: 'Foo Bar',
          label: [],
          status: 'Done',
          assignee: 'lorem@ipsum.com',
        },
      ];

      const service = new SlackRESTService(token);

      await service.postDailyReport('13', '123', issues);

      throw new Error('Should not pass as user is not found');
    } catch (err) {
      const { message } = err as Error;

      expect(message).toBe('Failed to post daily report: Channel Not Found');
    }
  });

  it('should throw an error when the channel is not found', async () => {
    const token = 'realToken';
    const issues: Issue[] = [
      {
        id: 'BTDC-456',
        title: 'Foo Bar',
        label: [],
        status: 'Done',
        assignee: 'lorem@ipsum.com',
      },
      {
        id: 'BTDC-123',
        title: 'Bar Baz',
        label: [],
        status: 'Done',
        assignee: 'lorem@ipsum.com',
      },
      {
        id: 'BTDC-123',
        title: 'Bar Baz',
        label: [],
        status: 'Done',
        assignee: 'lorem@ipsum.com',
      },
    ];

    const service = new SlackRESTService(token);

    await service.postDailyReport('13', 'realChannel', issues);
  });
});
