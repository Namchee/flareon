import { describe, it, expect } from 'vitest';

import { formatIssueToListItem, Issue } from '@/entity/issue';

describe('formatIssueToListItem', () => {
  it.concurrent('should format issue without label correctly', () => {
    const issue: Issue = {
      id: 'BTDC-820',
      title: 'Foo Bar',
      label: [],
      status: 'Done',
      assignee: '',
    };

    const md = formatIssueToListItem(issue);

    expect(md).toBe('*[BTDC-820]* Foo Bar — *DONE*');
  });

  it.concurrent('should format issue with labels correctly', () => {
    const issue: Issue = {
      id: 'BTDC-820',
      title: 'Foo Bar',
      label: ['Discovery', 'Bug'],
      status: 'Done',
      assignee: '',
    };

    const md = formatIssueToListItem(issue);

    expect(md).toBe('*[BTDC-820]* *[Discovery]* *[Bug]* Foo Bar — *DONE*');
  });
});
