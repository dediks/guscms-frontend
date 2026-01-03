import { createHmac } from 'crypto';

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';

export interface WebhookPayload {
  event?: string;
  data?: unknown;
  [key: string]: unknown;
}

/**
 * Validates webhook signature using HMAC SHA-256
 * Common pattern used by many CMS platforms
 */
export function validateWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string = WEBHOOK_SECRET
): boolean {
  if (!secret) {
    console.warn('WEBHOOK_SECRET not configured, skipping signature validation');
    return true; // Allow if no secret is configured (for development)
  }

  if (!signature) {
    return false;
  }

  if (!signature) {
    return false;
  }

  // Remove 'sha256=' prefix if present (common in webhook signatures)
  const cleanSignature = signature.replace(/^sha256=/, '');
  
  const hmac = createHmac('sha256', secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');

  // Use timing-safe comparison to prevent timing attacks
  return timingSafeEqual(
    Buffer.from(cleanSignature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

/**
 * Timing-safe string comparison
 */
function timingSafeEqual(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
}

/**
 * Validates webhook request headers
 */
export function validateWebhookHeaders(
  headers: Headers
): { isValid: boolean; signature?: string } {
  // Common header names used by different CMS platforms
  const signatureHeader =
    headers.get('x-webhook-signature') ||
    headers.get('x-signature') ||
    headers.get('x-hub-signature-256') ||
    headers.get('x-cms-signature');

  if (!signatureHeader) {
    return { isValid: false };
  }

  return { isValid: true, signature: signatureHeader };
}

/**
 * Validates webhook payload structure
 */
export function validateWebhookPayload(
  payload: unknown
): payload is WebhookPayload {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  // Basic validation - adjust based on your CMS webhook format
  return true;
}

/**
 * Extracts revalidation path or tag from webhook payload
 */
export function extractRevalidationInfo(
  payload: WebhookPayload
): { path?: string; tag?: string } {
  // Adjust based on your CMS webhook payload structure
  // Common patterns:
  // - payload.path or payload.url
  // - payload.model or payload.contentType
  // - payload.data.path

  const path =
    (payload.path as string) ||
    (payload.url as string) ||
    (payload.data as { path?: string })?.path;

  const tag =
    (payload.model as string) ||
    (payload.contentType as string) ||
    (payload.data as { model?: string })?.model;

  return { path, tag };
}

