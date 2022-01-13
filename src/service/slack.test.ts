import fetch from 'cross-fetch';

import { describe, it, beforeAll, afterEach, afterAll, expect } from 'vitest';

import { SlackRESTService } from '@/service/slack';

import { slackMockServer } from '@/mocks/server';

import type { Issue } from '@/entity/issue';
import type { Footer } from '@/entity/message';

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

  it('should throw an error when token is invalid', async () => {
    try {
      const token = 'foo';
      const issues: Issue[] = [
        {
          id: 'BTDC',
          title: 'Foo Bar',
          label: [],
          status: 'Done',
          assignee: 'lorem@ipsum.com',
          link: '',
        },
      ];

      const service = new SlackRESTService(token);

      await service.postDailyReport('13', '123', issues);

      throw new Error('Should not pass as token is invalid');
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
          link: '',
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

  it('should post daily report successfully', async () => {
    const token = 'realToken';
    const issues: Issue[] = [
      {
        id: 'BTDC-456',
        title: 'Foo Bar',
        label: ['Bar', 'Baz'],
        status: 'Done',
        assignee: 'lorem@ipsum.com',
        link: '',
      },
      {
        id: 'BTDC-123',
        title: 'Bar Baz',
        label: [],
        status: 'Done',
        assignee: 'lorem@ipsum.com',
        link: '',
      },
      {
        id: 'BTDC-123',
        title: 'Bar Baz',
        label: [],
        status: 'Done',
        assignee: 'lorem@ipsum.com',
        link: '',
      },
      {
        id: 'BTDC-456',
        title: 'Bar Baz',
        label: [],
        status: 'Done',
        assignee: null,
        link: '',
      },
    ];

    const service = new SlackRESTService(token);

    await service.postDailyReport('13', 'realChannel', issues);
  });

  it('should post daily report successfully with footer', async () => {
    const token = 'realToken';
    const issues: Issue[] = [
      {
        id: 'BTDC-456',
        title: 'Foo Bar',
        label: [],
        status: 'Done',
        assignee: 'lorem@ipsum.com',
        link: '',
      },
      {
        id: 'BTDC-123',
        title: 'Bar Baz',
        label: [],
        status: 'Done',
        assignee: 'lorem@ipsum.com',
        link: '',
      },
      {
        id: 'BTDC-123',
        title: 'Bar Baz',
        label: [],
        status: 'Done',
        assignee: 'lorem@ipsum.com',
        link: '',
      },
    ];
    const footer: Footer = {
      link: 'https://www.google.com',
      alias: 'Google link',
    };

    const service = new SlackRESTService(token);

    await service.postDailyReport('13', 'realChannel', issues, footer);
  });
});
