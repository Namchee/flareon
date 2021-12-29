export interface APIResponse {
  maxResults: number;
  startAt: number;
  isLast: boolean;
  expand?: string;
  total?: number;
}
