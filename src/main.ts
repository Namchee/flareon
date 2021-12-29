import { JIRARestClient } from './client/jira';

export async function writeDaily(): Promise<void> {
  const jiraClient = new JIRARestClient({
    email: EMAIL,
    token: API_TOKEN,
  });

  const issues = await jiraClient.fetchCurrentIssues(BOARD_ID);

  console.log(issues[0].fields['assignee']);
}
