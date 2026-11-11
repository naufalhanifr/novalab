// Cloudflare Pages Function for the contact form (D3).
// FORM_MODE=dry-run (default) validates the payload and returns 202 without delivering anything.
// Real delivery is implemented by the backend workstream; until then any other mode returns 503.

interface Env {
  FORM_MODE?: string;
}

type Ctx = { request: Request; env: Env };

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

export const onRequestPost = async ({ request, env }: Ctx): Promise<Response> => {
  const mode = env.FORM_MODE ?? "dry-run";
  let data: Record<string, unknown>;
  try {
    const ct = request.headers.get("content-type") ?? "";
    data = ct.includes("application/json")
      ? await request.json()
      : Object.fromEntries(await request.formData());
  } catch {
    return json(400, { ok: false, error: "invalid_body" });
  }
  const email = String(data.email ?? "");
  const message = String(data.message ?? "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.trim().length < 1) {
    return json(422, { ok: false, error: "validation_failed" });
  }
  if (mode === "dry-run") return json(202, { ok: true, mode });
  return json(503, { ok: false, error: "delivery_not_configured" });
};

export const onRequest = async (): Promise<Response> =>
  new Response("Method Not Allowed", { status: 405, headers: { allow: "POST" } });
