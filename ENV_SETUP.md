# Environment Variables Setup

Create a `.env.local` file in the root of the project with the following variables:

```env
# CMS API Configuration
# Base URL for your headless CMS API
CMS_API_URL=https://your-cms-api.com

# Optional: API endpoint path (defaults to /api/v1/pages)
# Adjust based on your CMS API structure
# This endpoint should return an array of pages
CMS_API_ENDPOINT=/api/v1/pages

# Optional: API authentication token (Bearer token)
# Leave empty if your CMS doesn't require authentication
CMS_API_TOKEN=your-api-token-here

# Webhook Configuration
# Secret key for validating webhook signatures
# This should match the secret configured in your CMS webhook settings
WEBHOOK_SECRET=your-webhook-secret-here

# Optional: Additional secret for revalidation endpoint
# Can be used as an extra layer of security
REVALIDATE_SECRET=your-revalidate-secret-here
```

## Configuration Details

### CMS_API_URL
The base URL of your headless CMS API. This should include the protocol (http:// or https://) and the root endpoint without trailing slashes.

**Important:** The URL must include the protocol. If you're using localhost, you can omit the protocol and it will automatically use `http://`.

Examples:
- `https://api.yourcms.com`
- `https://yourcms.com/api`
- `http://localhost:3000` (or just `localhost:3000` - will auto-add http://)
- `http://192.168.1.100:8080` (or just `192.168.1.100:8080` - will auto-add http://)

### CMS_API_TOKEN
Optional Bearer token for authenticating API requests. Required if your CMS API uses token-based authentication.

### WEBHOOK_SECRET
Secret key used to validate webhook signatures. This must match the secret configured in your CMS webhook settings. The webhook validator uses HMAC SHA-256 to verify signatures.

### REVALIDATE_SECRET
Optional additional secret for the revalidation endpoint. Can be used for extra security if needed.

## Webhook Setup

Configure your CMS to send webhooks to:
```
POST https://your-domain.com/api/revalidate
```

The webhook should include:
- A signature header (one of: `x-webhook-signature`, `x-signature`, `x-hub-signature-256`, `x-cms-signature`)
- A JSON payload with revalidation information (path or tag)

Example webhook payload:
```json
{
  "event": "content.updated",
  "path": "/",
  "model": "company"
}
```

**Note:** If `WEBHOOK_SECRET` is not configured, webhooks will be accepted without signature validation (useful for development).

## Manual Revalidation

You can manually trigger revalidation without setting up webhooks:

### Using GET request:
```
GET /api/revalidate?secret=YOUR_REVALIDATE_SECRET&path=/
```

### Using POST request:
```
POST /api/revalidate?secret=YOUR_REVALIDATE_SECRET
```

Query parameters:
- `secret` (required for manual revalidation) - Must match `REVALIDATE_SECRET` env var
- `path` (optional) - Path to revalidate (e.g., `/`, `/about`)
- `tag` (optional) - Cache tag to revalidate (e.g., `cms-pages`)

**Example:**
```bash
# Revalidate homepage
curl "http://localhost:3000/api/revalidate?secret=your-secret&path=/"

# Revalidate all CMS data
curl "http://localhost:3000/api/revalidate?secret=your-secret&tag=cms-pages"
```

## Troubleshooting Revalidation

If content updates aren't showing:

1. **Check cache tags:** The CMS client uses the `cms-pages` cache tag. Revalidate it:
   ```
   GET /api/revalidate?secret=YOUR_SECRET&tag=cms-pages
   ```

2. **Revalidate specific paths:**
   ```
   GET /api/revalidate?secret=YOUR_SECRET&path=/
   GET /api/revalidate?secret=YOUR_SECRET&path=/about
   ```

3. **Check ISR revalidate time:** Pages are set to revalidate every hour (3600 seconds). You can reduce this in `src/app/page.tsx`:
   ```typescript
   export const revalidate = 60; // Revalidate every minute (for testing)
   ```

4. **Development mode:** In development (`npm run dev`), pages are not cached, so changes should appear immediately.

