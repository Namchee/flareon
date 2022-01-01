import fetch from 'cross-fetch';
import { describe, it, beforeAll, afterEach, afterAll, expect } from 'vitest';

import { JiraRESTService } from '@/service/jira';
import { jiraMockServer } from '@/mocks/server';

describe('JIRA REST Service', () => {
  beforeAll(() => {
    global.fetch = fetch;
    jiraMockServer.listen();
  });

  afterEach(() => {
    jiraMockServer.resetHandlers();
  });

  afterAll(() => {
    jiraMockServer.close();
  });

  it.concurrent('should return empty array when there is no active sprint', async () => {
    const service = new JiraRESTService({
      email: 'bar',
      token: 'baz',
    });

    const issues = await service.getSprintIssues(124);

    expect(issues.length).toBe(0);
  });

  it.concurrent('should throw an unauthenticated error', async () => {
    try {
      const service = new JiraRESTService({
        email: 'foo',
        token: 'bar',
      });

      await service.getSprintIssues(123);

      throw new Error('Test should fail');
    } catch (err) {
      const { message } = err as Error;

      expect(message).toBe('Failed to get the current sprint: Unauthorized');
    }
  });

  it.concurrent('should return a list of issues', async () => {
    const service = new JiraRESTService({
      email: 'bar',
      token: 'baz',
    });

    const issues = await service.getSprintIssues(123);

    expect(issues.length).toBe(2);
    expect(issues[0]).toEqual({
      id: 'BTDC',
      title: 'Foo Bar',
      label: [],
      status: 'Done',
      assignee: 'lorem@ipsum.com',
    });
    expect(issues[1]).toEqual({
      id: 'BTDC',
      title: 'Foo Bar',
      label: ['Lorem Ipsum'],
      status: 'In Progress',
      assignee: 'foo@bar.com',
    });
  });
});
