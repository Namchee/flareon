export interface JiraAPIResponse {
  maxResults: number;
  startAt: number;
  isLast: boolean;
  expand?: string;
  total?: number;
}

export interface SlackAPIResponse {
  ok: boolean;
}
