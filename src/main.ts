import { JiraRESTService } from '@/service/jira';
import { SlackRESTService } from '@/service/slack';
import { Footer } from '@/entity/message';

/**
 * Write daily report to team's Slack channel
 */
export async function writeDailyReport(): Promise<void> {
  try {
    const jiraService = new JiraRESTService(
      JIRA_HOST,
      {
        email: EMAIL,
        token: JIRA_TOKEN,
      },
    );
    const slackService = new SlackRESTService(SLACK_TOKEN);

    const issues = await jiraService.getSprintIssues(BOARD_ID);

    console.log(issues);

    /*

    const footer: Footer = {
      link: FOOTER,
      alias: 'Remote report link',
    };

    if (issues.length) {
      await slackService.postDailyReport(TEAM_ID, CHANNEL_ID, issues, footer);
    }

    console.log('Process finished successfully');
    */
  } catch (err) {
    console.error(err);
  }
}
