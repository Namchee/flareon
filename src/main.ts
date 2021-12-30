import { JiraRESTService } from '@/service/jira';

export async function writeDaily(): Promise<void> {
  const jiraService = new JiraRESTService({
    email: EMAIL,
    token: JIRA_TOKEN,
  });

  const issues = await jiraService.getSprintIssues(BOARD_ID);

  console.log(issues);
}
