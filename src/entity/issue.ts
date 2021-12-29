import { APIResponse } from './api';

export interface Issue {
  expand?: string;
  id: string;
  self: string;
  key: string;
  fields: Record<string, unknown>;
}

export interface IssueAPIResponse extends APIResponse {
  issues: Issue[];
}
