import { UserRole } from '../../../core/constants/user-role';

export interface HeaderTokenPayload {
  role: UserRole;
  name?: string;
  surname?: string;
  username?: string;
}

export interface HeaderNavItem {
  label: string;
  route: string;
  icon?: 'home' | 'search' | 'messages';
}
