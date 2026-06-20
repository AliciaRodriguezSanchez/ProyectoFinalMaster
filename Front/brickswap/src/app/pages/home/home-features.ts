import type { HomeCategoryStyle, HomeFeature } from './interfaces/ihome.interface';

export const CATEGORY_STYLES: HomeCategoryStyle[] = [
  { icon: '🎨', color: 'linear-gradient(135deg, #ff9f1c, #ff6b00)' },
  { icon: '🧙', color: 'linear-gradient(135deg, #5b8cff, #4b3be8)' },
  { icon: '🥷', color: 'linear-gradient(135deg, #ff5f6d, #dc2f6b)' },
  { icon: '💜', color: 'linear-gradient(135deg, #42dc8a, #14b8a6)' },
  { icon: '🏛️', color: 'linear-gradient(135deg, #a855f7, #7c3aed)' },
  { icon: '🧱', color: 'linear-gradient(135deg, #f6b21a, #d97706)' },
  { icon: '📦', color: 'linear-gradient(135deg, #22d3ee, #2563eb)' },
];

export const HOME_FEATURES: HomeFeature[] = [
  {
    icon: '👥',
    title: 'Comunidad de confianza',
    description: 'Miles de fans LEGO comprando y vendiendo cada día.',
  },
  {
    icon: '🛡️',
    title: 'Transacciones seguras',
    description: 'Pagos protegidos y envío asegurado en cada compra.',
  },
  {
    icon: '📦',
    title: 'Vende fácilmente',
    description: 'Publica tus sets en minutos y llega a más compradores.',
  },
  {
    icon: '🎧',
    title: 'Soporte especializado',
    description: 'Nuestro equipo te ayuda en todo lo que necesites.',
  },
];
