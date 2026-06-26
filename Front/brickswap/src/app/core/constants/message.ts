export const MESSAGE_TYPE = {
  TEXT: 'TEXT',
  PRICE_OFFER: 'PRICE_OFFER',
  DELIVERY_METHOD: 'DELIVERY_METHOD',
  SYSTEM: 'SYSTEM',
} as const;

export type MessageType = typeof MESSAGE_TYPE[keyof typeof MESSAGE_TYPE];

export const MESSAGE_ACTION = {
  PRICE: 'price',
  DELIVERY: 'delivery',
  BUY: 'buy',
} as const;

export type MessageAction = typeof MESSAGE_ACTION[keyof typeof MESSAGE_ACTION];
