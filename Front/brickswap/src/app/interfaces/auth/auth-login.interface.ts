import { UserRole } from '../../core/constants/user-role';

export interface AuthLoginResponse {
  message: string;
  token: string;
}

export interface AuthTokenPayload {
  userId: number;
  role: UserRole;
}
