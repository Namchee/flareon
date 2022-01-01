import { setupServer } from 'msw/node';
import { handlers as jiraHandlers } from './jira';
import { handlers as slackHandlers } from './slack';

export const jiraMockServer = setupServer(...jiraHandlers);
export const slackMockServer = setupServer(...slackHandlers);
