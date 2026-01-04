# Client Setup Guide

Panduan setup untuk dua tipe client: yang bisa update sendiri dan yang tidak.

## 🎯 Quick Decision

**Client bisa update sendiri?**
- ✅ **YA** → Gunakan **CMS Mode**
- ❌ **TIDAK** → Gunakan **Static Mode**

---

## 📋 Setup CMS Mode (Client Bisa Update Sendiri)

### Step 1: Setup Environment Variables

Buat file `.env.local` di root project:

```env
CMS_API_URL=https://your-cms-api.com
CMS_API_TOKEN=your-token-here
CMS_API_ENDPOINT=/api/v1/pages
WEBHOOK_SECRET=your-webhook-secret
REVALIDATE_SECRET=your-revalidate-secret
```

### Step 2: Verify CMS Connection

1. Pastikan CMS API accessible
2. Test endpoint: `GET {CMS_API_URL}/api/v1/pages`
3. Verify response format sesuai dengan `CMSPage[]`

### Step 3: Setup Webhook (Optional tapi Recommended)

Configure CMS untuk send webhook ke:
```
POST https://your-domain.com/api/revalidate
```

### Step 4: Deploy

Sistem akan otomatis:
- ✅ Fetch data dari CMS
- ✅ Support client updates via CMS
- ✅ Auto-revalidate content

---

## 📋 Setup Static Mode (Developer Only)

### Step 1: Disable CMS

Buat file `.env.local`:

```env
# Kosongkan atau set ke 'disabled'
CMS_API_URL=
```

### Step 2: Customize Static Data

Edit file berikut dengan data client:

#### A. Pages Data (`src/data/static/pages.ts`)

```typescript
import type { CMSPage } from '@/types/cms';

const staticPages: CMSPage[] = [
  {
    id: 1,
    slug: '/',
    title: 'Home',
    template: null,
    published_at: new Date().toISOString(),
    meta: {
      title: 'Home | Client Name',
      description: 'Client description',
      keywords: 'keyword1, keyword2',
      og_image: null,
      canonical_url: null,
      robots: null,
    },
    sections: [
      {
        id: 1,
        type: 'hero',
        order: 1,
        is_active: true,
        settings: [],
        fields: {
          badge: { value: 'Your Badge', type: 'text' },
          title: { value: 'Your Title', type: 'text' },
          description: { value: 'Your description', type: 'text' },
          // ... more fields
        },
      },
      // Add more sections
    ],
  },
  // Add more pages
];

export default staticPages;
```

#### B. Settings Data (`src/data/static/settings.ts`)

```typescript
import type { CMSSettings } from '@/types/cms';

const staticSettings: CMSSettings = {
  maintenance_mode_enabled: '0', // '0' = off, '1' = on
  maintenance_message: null,
  logo: null,
  logo_url: '/images/logo.png',
};

export default staticSettings;
```

### Step 3: Update Content

Untuk update content di static mode:
1. Edit `src/data/static/pages.ts` atau `settings.ts`
2. Rebuild project: `npm run build`
3. Deploy

**Note:** Perubahan hanya akan muncul setelah rebuild & deploy.

---

## 🔄 Switching Between Modes

### From Static to CMS

1. Set `CMS_API_URL` di `.env.local`
2. Setup CMS API
3. Deploy
4. Sistem akan otomatis switch ke CMS mode

### From CMS to Static

1. Set `CMS_API_URL=` (kosong) atau `CMS_API_URL=disabled`
2. Customize `src/data/static/pages.ts` dan `settings.ts`
3. Deploy
4. Sistem akan otomatis switch ke static mode

---

## 📊 Comparison

| Feature | CMS Mode | Static Mode |
|---------|----------|-------------|
| Client bisa update | ✅ Ya | ❌ Tidak |
| Setup complexity | Medium | Low |
| Performance | Good | Excellent |
| Content updates | Real-time (via CMS) | Via code (rebuild) |
| Best for | Content yang sering berubah | Content yang jarang berubah |

---

## 🛠️ Development Tips

### Check Current Mode

Sistem akan log data source type di console:
```
[Data Source] Using CMS
[Data Source] Using static data
```

### Testing Both Modes

1. **Test CMS Mode:**
   ```env
   CMS_API_URL=http://localhost:8000
   ```

2. **Test Static Mode:**
   ```env
   CMS_API_URL=
   ```

### Debugging

- Check logs untuk melihat data source yang digunakan
- Verify data format sesuai dengan `CMSPage` dan `CMSSettings` types
- Use `logger.debug()` untuk detailed logs (development only)

---

## 📝 Best Practices

### CMS Mode
- ✅ Setup webhook untuk auto-revalidation
- ✅ Monitor CMS API health
- ✅ Use proper authentication tokens
- ✅ Cache strategy sudah optimal (1 hour ISR)

### Static Mode
- ✅ Keep static data files organized
- ✅ Use TypeScript untuk type safety
- ✅ Version control untuk track changes
- ✅ Document data structure untuk team

---

## ❓ FAQ

**Q: Bisa switch mode tanpa rebuild?**
A: Ya, cukup ubah `CMS_API_URL` dan restart server.

**Q: Bisa mix CMS dan static data?**
A: Tidak, sistem hanya support satu mode pada satu waktu.

**Q: Bagaimana jika CMS API down?**
A: CMS mode akan error. Static mode tidak terpengaruh.

**Q: Bisa customize static data per environment?**
A: Ya, bisa buat file berbeda untuk dev/prod atau gunakan env-based logic.

---

## 🚀 Next Steps

1. Pilih mode sesuai kebutuhan client
2. Setup sesuai guide di atas
3. Customize data/content
4. Test dan deploy

