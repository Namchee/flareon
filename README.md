<h1 align="center">
  Flareon
</h1>

<p align="center">
  <img src="https://marriland.com/wp-content/plugins/marriland-core/images/pokemon/sprites/home/full/flareon.png" title="Flareon" alt="Flareon" />
</p>

Flareon is a Slack bot that writes daily standup report for Flareon Growth Team at Tokopedia. For internal use only.

Designed to be executed under [Cloudflare Workers](https://workers.cloudflare.com/)

## Configuration

Flareon requires the following configuration that *must* be stored on [environment variables](https://developers.cloudflare.com/workers/platform/environment-variables)

| Name | Description |
| ---- | ----------- |
| `JIRA_HOST` | JIRA workspace hostname |
| `JIRA_TOKEN` | JIRA access token. [How to get access token](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/) |
| `EMAIL` | Workspace email. Make sure that this email has an access to the JIRA workboard
| `BOARD_ID` | JIRA board ID. You can get this easily by examining your board URL |
| `TEAM_ID` | Slack team ID |
| `CHANNEL_ID` | Slack channel ID. The daily report will be posted on this channel |
| `SLACK_TOKEN` | Slack access token for the workspace |
| `FOOTER` | Footer link. Optional |

## Final Words

Have fun! Focus on what matters.
