import { db, json, admin, method } from "./_lib.js";

export default async function handler(req, res) {
  if (!method(req, res, ["GET", "POST", "PATCH"])) return;
  try {
    if (req.method === "GET") {
      const token = req.query.token;
      if (token) {
        const rows = await db(`diaries?access_token=eq.${encodeURIComponent(token)}&select=id,title,event_date,rules,room_code,room_password,room_release_at,status,access_token`);
        if (!rows.length) return json(res, 404, { error: "Diário não encontrado." });
        const diary = rows[0];
        const released = diary.room_release_at
          ? new Date(diary.room_release_at).getTime() <= Date.now()
          : !!diary.room_code;
        const players = await db(`participants?diary_id=eq.${diary.id}&confirmed=eq.true&select=id,player_name,created_at&order=created_at.asc`);
        return json(res, 200, {
          diary: {
            ...diary,
            room_code: released ? diary.room_code : null,
            room_password: released ? diary.room_password : null,
            room_released: released
          },
          participants: players
        });
      }
      if (!admin(req)) return json(res, 401, { error: "Acesso administrativo não autorizado." });
      return json(res, 200, await db("diaries?select=*&order=event_date.desc"));
    }
    if (!admin(req)) return json(res, 401, { error: "Senha administrativa incorreta." });
    if (req.method === "POST") {
      const { title, event_date, rules } = req.body || {};
      if (!title || !event_date) return json(res, 400, { error: "Informe o nome e a data do diário." });
      const rows = await db("diaries", {
        method: "POST",
        body: JSON.stringify({ title, event_date, rules: rules || "", status: "open" })
      });
      return json(res, 201, rows[0]);
    }
    const { id, title, event_date, rules, room_code, room_password, room_release_at, status } = req.body || {};
    if (!id) return json(res, 400, { error: "ID do diário ausente." });
    const patch = {};
    for (const [key, value] of Object.entries({ title, event_date, rules, room_code, room_password, room_release_at, status })) {
      if (value !== undefined) patch[key] = value;
    }
    const rows = await db(`diaries?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(patch)
    });
    if (!rows.length) return json(res, 404, { error: "Diário não encontrado." });
    return json(res, 200, rows[0]);
  } catch (error) {
    return json(res, 500, { error: error.message || "Erro interno." });
  }
}
