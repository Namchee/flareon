import { rest } from 'msw';

import { JIRA_API_URL } from '@/constant/api';

export const handlers = [
  rest.get(`${JIRA_API_URL}/board/123/sprint`, (req, res, ctx) => {
    if (
      !req.headers.get('Authorization')
      || req.headers.get('Authorization')?.endsWith('Zm9vOmJhcg==')
    ) {
      return res(
        ctx.status(401),
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        values: [
          {
            id: 123,
            state: 'active',
          },
        ],
      }),
    );
  }),

  rest.get(`${JIRA_API_URL}/board/124/sprint`, (_, res, ctx) => res(
    ctx.status(200),
    ctx.json({
      values: [],
    }),
  )),

  rest.get(`${JIRA_API_URL}/sprint/123/issue`, (_, res, ctx) => res(
    ctx.status(200),
    ctx.json({
      issues: [
        {
          id: 123,
          key: 'BTDC',
          fields: {
            summary: 'Foo Bar',
            status: {
              name: 'Done',
            },
            assignee: {
              emailAddress: 'lorem@ipsum.com',
              displayName: 'John Smith',
            },
          },
        },
        {
          id: 124,
          key: 'BTDC',
          fields: {
            summary: '[Lorem Ipsum] Foo Bar',
            status: {
              name: 'In Progress',
            },
            assignee: {
              emailAddress: 'foo@bar.com',
              displayName: 'Jane Doe',
            },
          },
        },
      ],
    }),
  )),
];
