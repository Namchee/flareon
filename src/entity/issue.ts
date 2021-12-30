import { APIResponse } from '@/entity/api';
import { User } from '@/entity/user';

export interface RawIssue {
  expand?: string;
  id: string;
  self: string;
  key: string;
  fields: Record<string, unknown>;
}

export interface Issue {
  id: string;
  assignee: User;
  title: string;
  label: string[];
  status: string;
}

export interface IssueStatus {
  self: string;
  description: string;
  name: string;
  id: string;
}

export interface IssueAPIResponse extends APIResponse {
  issues: RawIssue[];
}
