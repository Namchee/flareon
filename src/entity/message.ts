export type MessageBlockType = 'section' | 'context';

export interface MessageBlock {
  type: MessageBlockType;
}

export interface MessageTextBlock extends MessageBlock {
  type: 'section';
  text: MessageBlockText;
}

export interface MessageContextBlock extends MessageBlock {
  type: 'context',
  elements: MessageBlockText[];
}

export interface MessageBlockText {
  type: 'plain_text' | 'mrkdwn';
  text: string;
}

export interface Footer {
  text: string;
  alias?: string;
}
