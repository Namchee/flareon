import { SLACK_API_URL } from '@/constant/api';
import { rest } from 'msw';

export const handlers = [
  rest.get(`${SLACK_API_URL}/user.lookupByEmail`, (req, res, ctx) => {
    if (req.headers.get('Authorization')?.endsWith('foo')) {
      return res(
        ctx.status(404),
        ctx.json({
          ok: false,
          error: 'user_not_found',
        }),
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        ok: true,
        user: {
          id: 'ABC',
          // eslint-disable-next-line camelcase
          real_name: 'Jane Doe',
        },
      }),
    );
  }),

  rest.post(`${SLACK_API_URL}/chat.postMessage`, (req, res, ctx) => {
    if (req.headers.get('Authorization')?.endsWith('foo')) {
      return res(
        ctx.status(403),
        ctx.json({
          ok: false,
          error: 'unathorized',
        }),
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        ok: true,
      }),
    );
  }),
];
