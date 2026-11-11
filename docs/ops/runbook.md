# Runbook — Deploy & Rollback website Evora

Status: **DRAF**. Bagian bertanda ⏳ belum diuji di environment sebenarnya karena menunggu akun Cloudflare dan secret (NVA-6, scope 1).

## Ringkasan arsitektur

| Komponen  | Pilihan                                        | Catatan                                            |
| --------- | ---------------------------------------------- | -------------------------------------------------- |
| Framework | Astro (static) + TS + Tailwind                 | D1                                                 |
| Hosting   | Cloudflare Pages Free                          | D2; project `evora` (var `CF_PAGES_PROJECT`)       |
| Form      | Pages Function `functions/api/contact.ts`      | D3; `FORM_MODE=dry-run` sampai backend siap        |
| Analytics | Umami Cloud                                    | D6; sudah diizinkan di CSP                         |
| CI/CD     | GitHub Actions: `ci`, `preview`, `deploy-prod` | Deploy via `wrangler pages deploy` (Direct Upload) |

Environment:

- **Production**: hanya dari branch `main` lewat workflow `deploy-prod` dan GitHub Environment `production`. URL: `vars.PROD_URL` (domain TBC-04), fallback `https://evora.pages.dev`. Status 2026-11-11: `novalab.com` (pilihan Founder) sudah terdaftar pihak lain sejak 1996 dan terkunci (RDAP), jadi production/HSTS di domain kustom menunggu keputusan domain pengganti. Preview di `*.pages.dev` tidak terdampak.
- **Preview/staging**: setiap push ke branch selain `main` → `https://<branch>.evora.pages.dev`. Dilindungi Cloudflare Access dan `X-Robots-Tag: noindex`.

## Prasyarat (sekali saja, oleh pemilik akun)

1. GitHub Org (D7), repo privat (D9), 2FA wajib, ≥ 2 admin.
   > ✅ Repo **privat** sejak 2026-11-11 (D9), masih di akun personal GitHub Free.
   > **Pengecualian sementara (keputusan board 2026-11-11):** repo tetap di akun personal `naufalhanifr/evora` (dulu `novalab`, di-rename saat rebrand NVA-10; URL lama di-redirect GitHub) dulu. Risikonya: hanya 1 admin (bus factor), dan secret serta Environment terikat ke akun personal. Saat pindah ke Org: `Settings › Transfer`, lalu verifikasi secret, variable, Environment `production`, dan branch protection masih ada, terapkan aturan Org (2FA, ≥ 2 admin), dan update remote lokal (`git remote set-url`). Jalankan ulang workflow `preview` sebagai bukti setelah pindah.
2. Akun Cloudflare perusahaan (2FA, ≥ 2 admin). Buat project Pages **Direct Upload** bernama `evora` dengan production branch `main`.
3. API token Cloudflare: permission `Account › Cloudflare Pages › Edit`, dibatasi ke akun ini saja. Simpan sebagai secret GitHub Actions:
   - `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
   - `CF_ACCESS_CLIENT_ID`, `CF_ACCESS_CLIENT_SECRET` (service token Access untuk cek header di preview)
4. Cloudflare Access: aplikasi self-hosted untuk `*.evora.pages.dev` (policy: email domain perusahaan + service token CI). Production tidak ikut dilindungi.
5. GitHub Environment `production`: deployment branch hanya `main`, required reviewer opsional.
   > ✅ Sudah dibuat 2026-11-11 (deployment branch policy: `main` saja, tanpa required reviewer).
   > ⚠️ Sejak repo privat di GitHub Free (2026-11-11), deployment branch policy dan environment protection **tidak ditegakkan** GitHub. Pembatas yang tetap berlaku: `deploy-prod.yml` hanya terpicu `push` ke `main`, dan job-nya dijaga `if: github.ref == 'refs/heads/main'`.
6. Variabel Pages project: `FORM_MODE=dry-run` (production dan preview). Lalu set repo variable `CF_PAGES_ENABLED=true` untuk mengaktifkan job deploy.
7. Branch protection `main`: wajib PR, status check `verify` (workflow `ci`) harus hijau, larang force push dan penghapusan branch.
   > Dikonfigurasi 2026-11-11 (aktif selama repo publik): wajib PR (0 approval karena admin baru 1), check `verify` wajib dan branch harus up to date (strict), linear history (merge pakai squash/rebase), percakapan review harus resolved, force push dan penghapusan dilarang. `enforce_admins` mati supaya admin tunggal tetap bisa memperbaiki darurat. Saat pindah ke Org dengan ≥ 2 admin: naikkan ke 1 approval dan nyalakan `enforce_admins`.
   > ⛔ **Nonaktif sejak 2026-11-11.** Atas keputusan board, repo dijadikan **privat** (D9) dan tetap di GitHub Free. Untuk repo privat di Free, GitHub tidak menegakkan branch protection (API: `403 Upgrade to GitHub Pro`). Aturan di atas adalah konfigurasi target saat repo pindah ke Pro/Org berbayar.
   >
   > **Disiplin manual selama Free + privat** (tidak dipaksa sistem):
   >
   > - Semua perubahan lewat PR. Jangan push langsung ke `main`; push ke `main` langsung memicu deploy production setelah Cloudflare aktif.
   > - Merge hanya jika check `verify` hijau dan branch up to date. Pakai squash/rebase merge.
   > - Jangan force push atau hapus `main`.
   > - Tambahan risiko: secret Actions (termasuk `CLOUDFLARE_API_TOKEN`) bisa dibaca workflow dari branch mana pun, karena environment secret tidak tersedia. Batasi collaborator dengan akses write.
   > - Kuota Actions repo privat di Free: 2.000 menit/bulan. Pantau di `Settings › Billing`; LHCI di setiap PR adalah konsumen terbesar.
   >
   > Untuk mengaktifkan kembali: upgrade ke GitHub Pro (US$4/bulan, masih di bawah plafon D10) atau pindah ke Org Team. Setelah itu terapkan ulang aturan di atas lewat API `PUT /repos/{owner}/{repo}/branches/main/protection`.

## Deploy

### Preview (otomatis)

Push ke branch mana pun selain `main`. Workflow `preview` menjalankan CI, deploy, lalu `scripts/check-headers.sh <url> --expect-noindex`. URL preview muncul di job summary dan di tab Environments.

### Production (otomatis)

Merge PR ke `main`. Workflow `deploy-prod` menjalankan CI → deploy `--branch=main` → smoke test dan cek header ke URL production.

### Manual (darurat, dari laptop admin)

```bash
pnpm install --frozen-lockfile && pnpm run build
CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=... \
  pnpm exec wrangler pages deploy dist --project-name=evora --branch=main
scripts/check-headers.sh https://<prod-url>
```

Token jangan ditaruh di shell history; gunakan `read -s` atau secret manager.

## Rollback ⏳

Pages menyimpan setiap deployment. Ada tiga opsi rollback, urut dari yang paling cepat:

1. **Dashboard (paling cepat, < 1 menit)**: Workers & Pages → `evora` → Deployments → pilih deployment production terakhir yang sehat → **Rollback to this deployment**.
2. **Re-deploy commit lama**: jalankan `deploy-prod` lewat _workflow_dispatch_ dari commit yang sehat. Bisa juga dengan `git revert <sha>` lalu merge ke `main`; cara ini disarankan karena riwayat tetap sinkron.
3. **CLI**: `pnpm exec wrangler pages deployment list --project-name=evora` untuk mencari ID, lalu rollback lewat dashboard atau API (`POST /accounts/{id}/pages/projects/evora/deployments/{deployment_id}/rollback`).

Setelah rollback:

- Jalankan `scripts/check-headers.sh https://<prod-url>`, lalu cek manual halaman utama dan form.
- Catat insiden di issue: waktu, deployment ID sebelum/sesudah, penyebab.
- Rollback dashboard tidak mengubah `main`. Revert commit penyebab supaya deploy berikutnya tidak mengulang masalah.

**Uji rollback (wajib minimal sekali, AC NVA-6)** ⏳: deploy A → deploy B → rollback ke A → verifikasi lewat header check dan konten. Bukti dicatat di NVA-6.

## Headers

Sumbernya `public/_headers`. Verifikasi dengan `scripts/check-headers.sh`.

- HSTS `max-age=15552000` (180 hari), **tanpa** `includeSubDomains` dan **tanpa** `preload` (D5). Nilai dinaikkan atau `includeSubDomains` ditambah setelah domain (TBC-04) dan semua subdomain dipastikan HTTPS.
- CSP ketat: `'self'` ditambah Umami Cloud. Script atau origin pihak ketiga baru wajib ditambahkan di sini dan di-review Security.
- `X-Robots-Tag: noindex` hanya untuk host `*.evora.pages.dev`. Kalau nama project berubah, rule host di `_headers` ikut diubah.

## Monitoring ⏳

- Uptime: Cloudflare Health Checks butuh plan berbayar. Usulannya **UptimeRobot Free** (interval 5 menit), cek HTTP 200 di `/` dan keyword `Evora`, notifikasi ke email role. Biaya US$0 (dalam plafon D10). Disetup setelah domain production ada.
- Error Pages Function: Workers & Pages → `evora` → Functions → Real-time logs.

## Kontak & eskalasi

- DevOps (Riyad): deploy, rollback, CI.
- CTO: perubahan arsitektur dan infrastruktur signifikan.
- Security: perubahan CSP/header dan token.
