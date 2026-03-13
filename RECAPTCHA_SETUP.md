# Setup reCAPTCHA v3 untuk Takshaka CMS

Google reCAPTCHA v3 telah ditambahkan ke tiga halaman untuk mencegah spam bot:

1. **Contact Form** - `/` (halaman contact-us)
2. **Login Page** - `/app/secure-access`
3. **Comment Form** - Blog posts (komentar dan balasan)

## Langkah 1: Dapatkan Key reCAPTCHA

1. Kunjungi [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Login dengan akun Google Anda
3. Klik **"+" untuk membuat situs baru**
4. Isi form dengan:
   - **Nama Label**: Takshaka CMS
   - **Tipe reCAPTCHA**: reCAPTCHA v3
   - **Domain**:
     - Development: `localhost`
     - Production: Domain Anda (contoh: `takshaka.id`)
5. Setujui terms of service dan klik **Submit**
6. Salin **Site Key** dan **Secret Key**

## Langkah 2: Konfigurasi Environment Variables

Tambahkan ke file `.env.local` (development):

```env
# reCAPTCHA Keys
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

Untuk production, tambahkan ke environment variables Anda (Vercel, Netlify, dll):

```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

**Catatan Penting:**

- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` bersifat **publik** (dapat dilihat di client-side)
- `RECAPTCHA_SECRET_KEY` harus **rahasia** (hanya untuk server-side)

## Langkah 3: Implementasi

### reCAPTCHA sudah diintegrasikan di:

#### 1. **Contact Form** (`components/public/ContactUsForm.tsx`)

- Mengirim token reCAPTCHA dengan form submission
- API endpoint: `POST /api/contact-submissions`
- Verifikasi di server-side sebelum menyimpan

#### 2. **Login Page** (`app/secure-access/page.tsx`)

- Mengirim token reCAPTCHA dengan email dan password
- API endpoint: `POST /api/auth/login`
- Verifikasi di server-side sebelum proses login

#### 3. **Comment Form** (`components/CommentForm.tsx`)

- Mengirim token reCAPTCHA untuk komentar baru dan balasan
- API endpoints:
  - `POST /api/comments` (komentar baru)
  - `POST /api/comments/[id]` (balasan)
- Verifikasi di server-side sebelum menyimpan

### Struktur File

```
lib/
  captcha.ts                    # Utility untuk verifikasi token reCAPTCHA
  RecaptchaProvider.tsx         # Provider untuk context reCAPTCHA

app/
  layout.tsx                    # Root layout dengan RecaptchaProvider
  secure-access/page.tsx        # Login page dengan reCAPTCHA
  api/
    auth/login/route.ts         # Verifikasi reCAPTCHA
    contact-submissions/        # Verifikasi reCAPTCHA
    comments/route.ts           # Verifikasi reCAPTCHA
    comments/[commentId]/route.ts  # Verifikasi reCAPTCHA untuk reply

components/
  public/ContactUsForm.tsx      # Contact form dengan reCAPTCHA
  CommentForm.tsx               # Comment form dengan reCAPTCHA
```

## Langkah 4: Cara Kerja reCAPTCHA v3

reCAPTCHA v3 bekerja secara **invisible** tanpa meminta interaksi dari user:

```javascript
// Client-side: Mendapatkan token
const { executeRecaptcha } = useGoogleReCaptcha();
const token = await executeRecaptcha("action_name");

// Server-side: Verifikasi token
const result = await verifyCaptchaToken(token);
// Mengecek:
// - success: apakah token valid
// - score: 0.0 - 1.0 (semakin tinggi = semakin manusia)
```

### Scoring System

- **1.0**: Kemungkinan besar user yang sah (human)
- **0.5**: Threshold default
- **0.0**: Kemungkinan besar bot atau spam

## Langkah 5: Customization (Opsional)

### Mengubah threshold score

Edit `lib/captcha.ts`:

```typescript
// Default threshold: 0.5
success: data.success && data.score > 0.5;

// Untuk lebih ketat (threshold 0.7):
success: data.success && data.score > 0.7;

// Untuk lebih lenient (threshold 0.3):
success: data.success && data.score > 0.3;
```

### Mengubah action names

Setiap form memiliki action name yang berbeda di reCAPTCHA console:

- `contact_form` - Contact-us form
- `login` - Login page
- `comment_form` - Comment form

### Menangani error

Semua form menampilkan pesan error yang user-friendly jika reCAPTCHA gagal:

```typescript
{error && (
  <div className="p-4 text-red-700 border border-red-200 bg-red-50">
    {error}
  </div>
)}
```

## Langkah 6: Testing

### Development (localhost)

1. Pastikan `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` dan `RECAPTCHA_SECRET_KEY` sudah set
2. Jalankan `npm run dev`
3. Kunjungi halaman form (contact-us, login, comment)
4. Submit form - reCAPTCHA akan otomatis berjalan di background
5. Cek console log untuk verifikasi status

### Production

1. Ganti dengan production domain di Google reCAPTCHA console
2. Update environment variables dengan production keys
3. Deploy dan test di production

## Troubleshooting

### ❌ "NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set"

**Solusi:**

- Set environment variable di `.env.local` atau hosting platform
- Restart development server

### ❌ "reCAPTCHA verification failed"

**Kemungkinan penyebab:**

- Token expired (lebih dari 2 menit)
- Secret key tidak valid
- Request dari IP terlarang

**Solusi:**

- Cek secret key di Google reCAPTCHA console
- Cek IP whitelist di console (jika ada)
- Pastikan server bisa connect ke Google API

### ❌ Form tidak bisa submit

**Kemungkinan penyebab:**

- reCAPTCHA script tidak load
- `useGoogleReCaptcha` hook tidak bisa diakses

**Solusi:**

- Pastikan `RecaptchaProvider` wrapping seluruh app
- Check browser console untuk error JavaScript
- Pastikan Site Key benar

## Security Best Practices

1. ✅ **Secret Key** hanya di server-side (`.env` file)
2. ✅ **Site Key** boleh di client-side (PUBLIC)
3. ✅ Verifikasi token selalu di backend sebelum menyimpan
4. ✅ Jangan percaya token client-side saja
5. ✅ Combine dengan rate limiting dan spam detection
6. ✅ Monitor score patterns untuk detect abuse

## Referensi

- [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- [reCAPTCHA v3 Documentation](https://developers.google.com/recaptcha/docs/v3)
- [react-google-recaptcha-v3](https://www.npmjs.com/package/react-google-recaptcha-v3)

---

**Status**: ✅ reCAPTCHA v3 telah diintegrasikan di semua 3 form
**Testing**: Siap untuk ditest setelah environment variables dikonfigurasi
