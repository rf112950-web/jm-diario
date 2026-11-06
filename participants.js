import { db, json, admin, method } from "./_lib.js";

export default async function handler(req, res) {
  if (!method(req, res, ["POST", "DELETE"])) return;
  if (!admin(req)) return json(res, 401, { error: "Senha administrativa incorreta." });
  try {
    const { diary_id, player_name, email, id } = req.body || {};
    if (req.method === "POST") {
      if (!diary_id || !player_name || !player_name.trim()) {
        return json(res, 400, { error: "Informe o diário e o nome do jogador." });
      }
      const rows = await db("participants", {
        method: "POST",
        body: JSON.stringify({
          diary_id,
          player_name: player_name.trim(),
          email: email || null,
          confirmed: true
        })
      });
      return json(res, 201, rows[0]);
    }
    if (!id) return json(res, 400, { error: "ID do jogador ausente." });
    await db(`participants?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
    return json(res, 200, { success: true });
  } catch (error) {
    return json(res, 500, { error: error.message || "Erro interno." });
  }
}
