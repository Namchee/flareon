export interface MessageBlock {
  type: 'section';
  text: MessageBlockText;
}

export interface MessageBlockText {
  type: 'plain_text' | 'mrkdwn';
  text: string;
}
