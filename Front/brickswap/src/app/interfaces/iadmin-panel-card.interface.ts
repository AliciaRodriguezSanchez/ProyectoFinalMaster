export interface IAdminPanelCard {
  id: 'users' | 'categories' | 'moderation' | 'promotions';
  icon: string;
  title: string;
  description: string;
  colorClass: string;
}
