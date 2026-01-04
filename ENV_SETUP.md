# Environment Variables Setup

Sistem ini mendukung **dua mode** untuk fleksibilitas client:

1. **CMS Mode** - Client bisa update data sendiri melalui CMS
2. **Static Mode** - Data di-manage oleh developer (tidak ada CMS)

## Mode Selection

Sistem akan otomatis memilih mode berdasarkan konfigurasi `CMS_API_URL`:

- **Jika `CMS_API_URL` di-set** → CMS Mode (client bisa update sendiri)
- **Jika `CMS_API_URL` kosong atau 'disabled'** → Static Mode (developer only)

---

## Setup untuk CMS Mode (Client Bisa Update Sendiri)

Create a `.env.local` file dengan konfigurasi berikut:

```env
# CMS API Configuration (REQUIRED untuk CMS Mode)
CMS_API_URL=https://your-cms-api.com

# Optional: API endpoint path (defaults to /api/v1/pages)
CMS_API_ENDPOINT=/api/v1/pages

# Optional: API authentication token (Bearer token)
CMS_API_TOKEN=your-api-token-here

# Webhook Configuration
WEBHOOK_SECRET=your-webhook-secret-here

# Optional: Additional secret for revalidation endpoint
REVALIDATE_SECRET=your-revalidate-secret-here
```

### CMS Mode Details

Ketika `CMS_API_URL` di-set, sistem akan:
- ✅ Fetch data dari CMS API
- ✅ Support webhook revalidation
- ✅ Client bisa update content melalui CMS
- ✅ Auto-revalidate setiap 1 jam atau via webhook

---

## Setup untuk Static Mode (Developer Only)

Untuk client yang **tidak perlu update sendiri**, gunakan static data:

```env
# Disable CMS - kosongkan atau set ke 'disabled'
CMS_API_URL=

# Atau secara eksplisit:
CMS_API_URL=disabled
```

### Static Mode Details

Ketika CMS disabled, sistem akan:
- ✅ Load data dari `src/data/static/pages.ts` dan `src/data/static/settings.ts`
- ✅ Tidak perlu CMS API
- ✅ Data di-manage oleh developer
- ✅ Lebih cepat (tidak ada API calls)
- ✅ Perfect untuk client yang content-nya jarang berubah

### Customize Static Data

Edit file berikut untuk customize data per client:

1. **Pages Data**: `src/data/static/pages.ts`
   - Edit array `staticPages` dengan data pages client
   - Format sama dengan CMS response

2. **Settings Data**: `src/data/static/settings.ts`
   - Edit object `staticSettings` dengan settings client
   - Include logo, maintenance mode, dll

**Contoh:**
```typescript
// src/data/static/pages.ts
const staticPages: CMSPage[] = [
  {
    id: 1,
    slug: '/',
    title: 'Home',
    sections: [
      {
        id: 1,
        type: 'hero',
        fields: {
          title: { value: 'Client Company Name', type: 'text' },
          // ... more fields
        },
      },
    ],
  },
];
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

