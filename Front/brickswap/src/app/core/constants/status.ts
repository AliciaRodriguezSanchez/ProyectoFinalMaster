export const ARTICLE_SALE_STATUS = {
  available: 'Disponible',
  reserved: 'Reservado',
  sold: 'Vendido',
} as const;

export type ArticleSaleStatus = typeof ARTICLE_SALE_STATUS[keyof typeof ARTICLE_SALE_STATUS];

export const REPORT_STATUS = {
  pending: 'Pendiente',
  kept: 'Revisado_Mantenido',
  removed: 'Revisado_Retirado',
} as const;

export type ReportStatus = typeof REPORT_STATUS[keyof typeof REPORT_STATUS];

export const CONVERSATION_STATUS = {
  unreaded: 'unreaded',
  readed: 'readed',
  pending: 'pending',
  resolved: 'resolved',
} as const;

export type ConversationStatus = typeof CONVERSATION_STATUS[keyof typeof CONVERSATION_STATUS];

export const TAG_STATUS_VARIANT = {
  neutral: 'neutral',
  brand: 'brand',
  dark: 'dark',
} as const;
