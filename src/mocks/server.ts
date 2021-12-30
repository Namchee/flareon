import { setupServer } from 'msw/node';
import { handlers as jiraHandlers } from './jira';

export const jiraMockServer = setupServer(...jiraHandlers);
