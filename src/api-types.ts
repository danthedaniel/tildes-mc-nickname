export interface HMACRequest {
  mcUsername?: string;
  tildesUsername?: string;
};

export type HMACResponse =
  | { success: true, hmac: string }
  | { success: false, message: string };

export interface VerifyRequest {
  mcUsername?: string;
  tildesUsername?: string;
};

export type VerifyResponse =
  | { success: true }
  | { success: false, message: string };
