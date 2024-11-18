// libs/shared/src/messaging/messaging-strategy.interface.ts
export interface MessagingStrategy {
    sendMessage(topic: string, message: string): Promise<void>;
  }