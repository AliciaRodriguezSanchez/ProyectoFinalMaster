export type ConversationMessageType = 'text' | 'priceProposal' | 'deliveryMethod';

export interface ConversationMessage {
  id: number;
  type: ConversationMessageType;
  text?: string;
  title?: string;
  amount?: number;
  time: string;
  mine: boolean;
}
