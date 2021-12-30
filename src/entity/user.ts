import { SlackAPIResponse } from './api';

export interface JIRAUser {
  emailAddress: string;
  displayName: string;
}

export interface SlackUser {
  id: string;
  name: string;
  real_name: string;
}

export interface User {
  id: string;
  name: string;
}

export interface UserAPIResponse extends SlackAPIResponse {
  user: SlackUser;
}
