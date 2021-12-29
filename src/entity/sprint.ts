import { APIResponse } from './api';

export interface Sprint {
  id: number;
  state: 'active' | 'closed';
  name: string;
  startDate: string;
  endDate: string;
  originBoardId: number;
}

export interface SprintAPIResponse extends APIResponse {
  values: Sprint[];
}
