const express = require("express");
const db = require("../config/database");

const router = express.Router();

router.post("/scan", (req, res) => {
  const token = typeof req.body?.token === "string" ? req.body.token.trim() : "";
  if (!token) {
    return res.status(400).json({ success: false, message: "Token QR kosong." });
  }

  const participant = db.prepare(`
    SELECT id, name, email FROM participants WHERE qr_token = ?
  `).get(token);

  if (!participant) {
    return res.status(404).json({
      success: false,
      status: "invalid",
      message: "QR tidak dikenali. Peserta tidak ditemukan."
    });
  }

  const existing = db.prepare(`
    SELECT checked_in_at FROM attendance WHERE participant_id = ?
  `).get(participant.id);

  if (existing) {
    return res.status(409).json({
      success: false,
      status: "already_present",
      message: "Peserta sudah melakukan absensi sebelumnya.",
      data: { ...participant, checked_in_at: existing.checked_in_at }
    });
  }

  db.prepare(`INSERT INTO attendance (participant_id) VALUES (?)`).run(participant.id);

  const attendance = db.prepare(`
    SELECT checked_in_at FROM attendance WHERE participant_id = ?
  `).get(participant.id);

  const payload = {
    ...participant,
    checked_in_at: attendance.checked_in_at,
    status: "present"
  };

  req.app.get("io").emit("attendance:updated", payload);

  res.json({
    success: true,
    status: "present",
    message: "Absensi berhasil. Selamat datang!",
    data: payload
  });
});

router.get("/summary", (req, res) => {
  const total = db.prepare(`SELECT COUNT(*) AS count FROM participants`).get().count;
  const present = db.prepare(`SELECT COUNT(*) AS count FROM attendance`).get().count;
  res.json({
    success: true,
    data: { total, present, absent: total - present }
  });
});

module.exports = router;
