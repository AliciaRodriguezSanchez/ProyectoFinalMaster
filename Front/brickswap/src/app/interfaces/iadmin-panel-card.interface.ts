export interface IAdminPanelCard {
  id: 'users' | 'categories' | 'moderation';
  icon: string;
  title: string;
  description: string;
  colorClass: string;
}