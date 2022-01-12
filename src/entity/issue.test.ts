import { describe, it, expect } from 'vitest';

import { formatIssueToListItem, Issue, mapIssuesToAssignee } from '@/entity/issue';
import { LINK_PLACEHOLDER } from '@/constant/issue';

describe('formatIssueToListItem', () => {
  it.concurrent('should format issue without label correctly', () => {
    const issue: Issue = {
      id: 'BTDC-820',
      title: 'Foo Bar',
      label: [],
      status: 'Done',
      assignee: '',
      link: 'foo',
    };

    const md = formatIssueToListItem(issue);

    expect(md).toBe(`• *[BTDC-820]* Foo Bar — *DONE* [${LINK_PLACEHOLDER}](foo)`);
  });

  it.concurrent('should format issue with labels correctly', () => {
    const issue: Issue = {
      id: 'BTDC-820',
      title: 'Foo Bar',
      label: ['Discovery', 'Bug'],
      status: 'Done',
      assignee: '',
      link: 'foo',
    };

    const md = formatIssueToListItem(issue);

    expect(md).toBe(
      `• *[BTDC-820]* *[Discovery]* *[Bug]* Foo Bar — *DONE* [${LINK_PLACEHOLDER}](foo)`,
    );
  });
});

describe('mapIssuesToAssignee', () => {
  it('should map issues to their assignee', () => {
    const issues: Issue[] = [
      {
        id: 'BTDC-1000',
        title: 'a',
        label: [],
        status: 'Done',
        assignee: 'lorem@ipsum.com',
        link: 'foo',
      },
      {
        id: 'BTDC-1020',
        title: 'b',
        label: [],
        status: 'Done',
        assignee: 'a@b.com',
        link: 'foo',
      },
      {
        id: 'BTDC-820',
        title: 'c',
        label: [],
        status: 'Done',
        assignee: 'lorem@ipsum.com',
        link: 'foo',
      },
    ];

    const issueMap = mapIssuesToAssignee(issues);

    expect(issueMap).toEqual({
      'a@b.com': [
        {
          id: 'BTDC-1020',
          title: 'b',
          label: [],
          status: 'Done',
          assignee: 'a@b.com',
          link: 'foo',
        },
      ],
      'lorem@ipsum.com': [
        {
          id: 'BTDC-820',
          title: 'c',
          label: [],
          status: 'Done',
          assignee: 'lorem@ipsum.com',
          link: 'foo',
        },
        {
          id: 'BTDC-1000',
          title: 'a',
          label: [],
          status: 'Done',
          assignee: 'lorem@ipsum.com',
          link: 'foo',
        },
      ],
    });
  });

  it('should map unassigned issues', () => {
    const issues: Issue[] = [
      {
        id: 'BTDC-1000',
        title: 'a',
        label: [],
        status: 'Done',
        assignee: 'lorem@ipsum.com',
        link: 'foo',
      },
      {
        id: 'BTDC-1020',
        title: 'b',
        label: [],
        status: 'Done',
        assignee: 'a@b.com',
        link: 'foo',
      },
      {
        id: 'BTDC-820',
        title: 'c',
        label: [],
        status: 'Done',
        assignee: 'lorem@ipsum.com',
        link: 'foo',
      },
      {
        id: 'BTDC-123',
        title: 'a',
        label: [],
        status: 'Backlog',
        assignee: null,
        link: 'foo',
      },
    ];

    const issueMap = mapIssuesToAssignee(issues);

    expect(issueMap).toEqual({
      'a@b.com': [
        {
          id: 'BTDC-1020',
          title: 'b',
          label: [],
          status: 'Done',
          assignee: 'a@b.com',
          link: 'foo',
        },
      ],
      'lorem@ipsum.com': [
        {
          id: 'BTDC-820',
          title: 'c',
          label: [],
          status: 'Done',
          assignee: 'lorem@ipsum.com',
          link: 'foo',
        },
        {
          id: 'BTDC-1000',
          title: 'a',
          label: [],
          status: 'Done',
          assignee: 'lorem@ipsum.com',
          link: 'foo',
        },
      ],
      Unassigned: [
        {
          id: 'BTDC-123',
          title: 'a',
          label: [],
          status: 'Backlog',
          assignee: null,
          link: 'foo',
        },
      ],
    });
  });
});
