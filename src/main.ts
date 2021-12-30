import { JIRARestClient } from './client/jira';

export async function writeDaily(): Promise<void> {
  const jiraClient = new JIRARestClient({
    email: EMAIL,
    token: JIRA_TOKEN,
  });

  const issues = await jiraClient.getIssues(BOARD_ID);

  console.log(issues);
}
