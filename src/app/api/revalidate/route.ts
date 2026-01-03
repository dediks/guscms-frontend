import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import {
  validateWebhookSignature,
  validateWebhookHeaders,
  validateWebhookPayload,
  extractRevalidationInfo,
  type WebhookPayload,
} from '@/lib/webhook-validator';

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature validation
    const body = await request.text();
    const headers = request.headers;
    const searchParams = request.nextUrl.searchParams;
    
    // Allow manual revalidation via ?secret=REVALIDATE_SECRET query param
    const revalidateSecret = process.env.REVALIDATE_SECRET;
    const providedSecret = searchParams.get('secret');
    const isManualRevalidation = revalidateSecret && providedSecret === revalidateSecret;

    // If not manual revalidation, validate webhook signature
    if (!isManualRevalidation) {
      // Validate webhook headers
      const headerValidation = validateWebhookHeaders(headers);
      if (!headerValidation.isValid) {
        // If no signature header and no manual secret, allow but log warning
        const hasWebhookSecret = process.env.WEBHOOK_SECRET;
        if (hasWebhookSecret) {
          return NextResponse.json(
            { error: 'Missing webhook signature. Use ?secret=REVALIDATE_SECRET for manual revalidation.' },
            { status: 401 }
          );
        }
        // If no webhook secret configured, allow without signature (for development)
        console.warn('Revalidating without signature validation (WEBHOOK_SECRET not configured)');
      } else if (headerValidation.signature) {
        // Validate webhook signature if provided
        const isValid = validateWebhookSignature(
          body,
          headerValidation.signature
        );
        if (!isValid) {
          return NextResponse.json(
            { error: 'Invalid webhook signature' },
            { status: 401 }
          );
        }
      }
    }

    // Parse and validate payload
    let payload: WebhookPayload;
    try {
      payload = JSON.parse(body);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    if (!validateWebhookPayload(payload)) {
      return NextResponse.json(
        { error: 'Invalid webhook payload structure' },
        { status: 400 }
      );
    }

    // Extract revalidation information
    let path: string | undefined;
    let tag: string | undefined;

    if (body) {
      try {
        const payload = JSON.parse(body);
        const extracted = extractRevalidationInfo(payload);
        path = extracted.path;
        tag = extracted.tag;
      } catch (error) {
        // If body is not JSON, that's okay for manual revalidation
        console.log('Body is not JSON, using defaults');
      }
    }

    // Also check query params for manual revalidation
    const queryPath = searchParams.get('path');
    const queryTag = searchParams.get('tag');
    if (queryPath) path = queryPath;
    if (queryTag) tag = queryTag;

    const revalidatedPaths: string[] = [];
    const revalidatedTags: string[] = [];

    // Perform revalidation
    if (path) {
      revalidatePath(path, 'page');
      revalidatedPaths.push(path);
      console.log(`Revalidated path: ${path}`);
    } else if (tag) {
      revalidateTag(tag, 'default');
      revalidatedTags.push(tag);
      console.log(`Revalidated tag: ${tag}`);
    } else {
      // Default: revalidate all pages and cache tag
      revalidatePath('/', 'page');
      revalidatePath('/about', 'page'); // Common page
      revalidateTag('cms-pages', 'default'); // Revalidate all CMS data
      revalidatedPaths.push('/', '/about');
      revalidatedTags.push('cms-pages');
      console.log('Revalidated default paths and cache tag');
    }

    return NextResponse.json({
      revalidated: true,
      paths: revalidatedPaths,
      tags: revalidatedTags,
      path: path || null,
      tag: tag || null,
      timestamp: new Date().toISOString(),
      method: isManualRevalidation ? 'manual' : 'webhook',
    });
  } catch (error) {
    console.error('Error revalidating:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Add GET endpoint for manual revalidation
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const revalidateSecret = process.env.REVALIDATE_SECRET;
  const providedSecret = searchParams.get('secret');

  // Allow manual revalidation via GET with secret
  if (revalidateSecret && providedSecret === revalidateSecret) {
    const path = searchParams.get('path') || '/';
    const tag = searchParams.get('tag');

    if (tag) {
      revalidateTag(tag, 'default');
      console.log(`GET: Revalidated tag: ${tag}`);
    } else {
      revalidatePath(path, 'page');
      revalidateTag('cms-pages', 'default'); // Also revalidate cache
      console.log(`GET: Revalidated path: ${path} and cache tag`);
    }

    return NextResponse.json({
      revalidated: true,
      path: path || null,
      tag: tag || 'cms-pages',
      timestamp: new Date().toISOString(),
      method: 'manual-get',
    });
  }

  return NextResponse.json({
    message: 'Revalidation endpoint',
    methods: ['POST', 'GET'],
    description: 'Send POST requests with webhook payload, or GET with ?secret=REVALIDATE_SECRET&path=/',
    note: 'For manual revalidation: GET /api/revalidate?secret=YOUR_SECRET&path=/',
  });
}

