import { JiraRESTService } from '@/service/jira';
import { SlackRESTService } from './service/slack';

/**
 * Write daily report to team's Slack channel
 */
export async function writeDailyReport(): Promise<void> {
  try {
    const jiraService = new JiraRESTService({
      email: EMAIL,
      token: JIRA_TOKEN,
    });
    const slackService = new SlackRESTService(SLACK_TOKEN);

    const issues = await jiraService.getSprintIssues(BOARD_ID);

    if (issues.length) {
      await slackService.postDailyReport(TEAM_ID, CHANNEL_ID, issues);
    }

    console.log('Process finished successfully');
  } catch (err) {
    console.error(err);
  }
}
