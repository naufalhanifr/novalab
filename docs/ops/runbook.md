# Runbook — Deploy & Rollback website NØVA Lab

Status: **DRAF**. Bagian bertanda ⏳ belum diuji di environment sebenarnya karena menunggu akun Cloudflare dan secret (NVA-6, scope 1).

## Ringkasan arsitektur

| Komponen  | Pilihan                                        | Catatan                                            |
| --------- | ---------------------------------------------- | -------------------------------------------------- |
| Framework | Astro (static) + TS + Tailwind                 | D1                                                 |
| Hosting   | Cloudflare Pages Free                          | D2; project `novalab` (var `CF_PAGES_PROJECT`)     |
| Form      | Pages Function `functions/api/contact.ts`      | D3; `FORM_MODE=dry-run` sampai backend siap        |
| Analytics | Umami Cloud                                    | D6; sudah diizinkan di CSP                         |
| CI/CD     | GitHub Actions: `ci`, `preview`, `deploy-prod` | Deploy via `wrangler pages deploy` (Direct Upload) |

Environment:

- **Production**: hanya dari branch `main` lewat workflow `deploy-prod` dan GitHub Environment `production`. URL: `vars.PROD_URL` (domain TBC-04), fallback `https://novalab.pages.dev`.
- **Preview/staging**: setiap push ke branch selain `main` → `https://<branch>.novalab.pages.dev`. Dilindungi Cloudflare Access dan `X-Robots-Tag: noindex`.

## Prasyarat (sekali saja, oleh pemilik akun)

1. GitHub Org (D7), repo privat (D9), 2FA wajib, ≥ 2 admin.
   > **Pengecualian sementara (keputusan board 2026-11-11):** repo tetap di akun personal `naufalhanifr/novalab` dulu. Risikonya: hanya 1 admin (bus factor), dan secret serta Environment terikat ke akun personal. Saat pindah ke Org: `Settings › Transfer`, lalu verifikasi secret, variable, Environment `production`, dan branch protection masih ada, terapkan aturan Org (2FA, ≥ 2 admin), dan update remote lokal (`git remote set-url`). Jalankan ulang workflow `preview` sebagai bukti setelah pindah.
2. Akun Cloudflare perusahaan (2FA, ≥ 2 admin). Buat project Pages **Direct Upload** bernama `novalab` dengan production branch `main`.
3. API token Cloudflare: permission `Account › Cloudflare Pages › Edit`, dibatasi ke akun ini saja. Simpan sebagai secret GitHub Actions:
   - `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
   - `CF_ACCESS_CLIENT_ID`, `CF_ACCESS_CLIENT_SECRET` (service token Access untuk cek header di preview)
4. Cloudflare Access: aplikasi self-hosted untuk `*.novalab.pages.dev` (policy: email domain perusahaan + service token CI). Production tidak ikut dilindungi.
5. GitHub Environment `production`: deployment branch hanya `main`, required reviewer opsional.
6. Variabel Pages project: `FORM_MODE=dry-run` (production dan preview). Lalu set repo variable `CF_PAGES_ENABLED=true` untuk mengaktifkan job deploy.
7. Branch protection `main`: wajib PR, status check `verify` (workflow `ci`) harus hijau, larang force push dan penghapusan branch.

## Deploy

### Preview (otomatis)

Push ke branch mana pun selain `main`. Workflow `preview` menjalankan CI, deploy, lalu `scripts/check-headers.sh <url> --expect-noindex`. URL preview muncul di job summary dan di tab Environments.

### Production (otomatis)

Merge PR ke `main`. Workflow `deploy-prod` menjalankan CI → deploy `--branch=main` → smoke test dan cek header ke URL production.

### Manual (darurat, dari laptop admin)

```bash
pnpm install --frozen-lockfile && pnpm run build
CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=... \
  pnpm exec wrangler pages deploy dist --project-name=novalab --branch=main
scripts/check-headers.sh https://<prod-url>
```

Token jangan ditaruh di shell history; gunakan `read -s` atau secret manager.

## Rollback ⏳

Pages menyimpan setiap deployment. Ada tiga opsi rollback, urut dari yang paling cepat:

1. **Dashboard (paling cepat, < 1 menit)**: Workers & Pages → `novalab` → Deployments → pilih deployment production terakhir yang sehat → **Rollback to this deployment**.
2. **Re-deploy commit lama**: jalankan `deploy-prod` lewat _workflow_dispatch_ dari commit yang sehat. Bisa juga dengan `git revert <sha>` lalu merge ke `main`; cara ini disarankan karena riwayat tetap sinkron.
3. **CLI**: `pnpm exec wrangler pages deployment list --project-name=novalab` untuk mencari ID, lalu rollback lewat dashboard atau API (`POST /accounts/{id}/pages/projects/novalab/deployments/{deployment_id}/rollback`).

Setelah rollback:

- Jalankan `scripts/check-headers.sh https://<prod-url>`, lalu cek manual halaman utama dan form.
- Catat insiden di issue: waktu, deployment ID sebelum/sesudah, penyebab.
- Rollback dashboard tidak mengubah `main`. Revert commit penyebab supaya deploy berikutnya tidak mengulang masalah.

**Uji rollback (wajib minimal sekali, AC NVA-6)** ⏳: deploy A → deploy B → rollback ke A → verifikasi lewat header check dan konten. Bukti dicatat di NVA-6.

## Headers

Sumbernya `public/_headers`. Verifikasi dengan `scripts/check-headers.sh`.

- HSTS `max-age=15552000` (180 hari), **tanpa** `includeSubDomains` dan **tanpa** `preload` (D5). Nilai dinaikkan atau `includeSubDomains` ditambah setelah domain (TBC-04) dan semua subdomain dipastikan HTTPS.
- CSP ketat: `'self'` ditambah Umami Cloud. Script atau origin pihak ketiga baru wajib ditambahkan di sini dan di-review Security.
- `X-Robots-Tag: noindex` hanya untuk host `*.novalab.pages.dev`. Kalau nama project berubah, rule host di `_headers` ikut diubah.

## Monitoring ⏳

- Uptime: Cloudflare Health Checks butuh plan berbayar. Usulannya **UptimeRobot Free** (interval 5 menit), cek HTTP 200 di `/` dan keyword `NØVA`, notifikasi ke email role. Biaya US$0 (dalam plafon D10). Disetup setelah domain production ada.
- Error Pages Function: Workers & Pages → `novalab` → Functions → Real-time logs.

## Kontak & eskalasi

- DevOps (Riyad): deploy, rollback, CI.
- CTO: perubahan arsitektur dan infrastruktur signifikan.
- Security: perubahan CSP/header dan token.
