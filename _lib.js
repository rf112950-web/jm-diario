const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function json(res, status, data) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8").send(JSON.stringify(data));
}
export function admin(req) {
  const expected = process.env.ADMIN_PASSWORD || "";
  const supplied = req.headers["x-admin-password"] || "";
  return !!expected && supplied === expected;
}
export async function db(path, options = {}) {
  if (!SUPABASE_URL || !SERVICE_KEY) throw new Error("Supabase não configurado na Vercel.");
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: options.prefer || "return=representation",
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  if (!response.ok) throw new Error(text || `Supabase HTTP ${response.status}`);
  return text ? JSON.parse(text) : null;
}
export function method(req, res, allowed) {
  if (!allowed.includes(req.method)) {
    res.setHeader("Allow", allowed.join(", "));
    json(res, 405, { error: "Método não permitido." });
    return false;
  }
  return true;
}
