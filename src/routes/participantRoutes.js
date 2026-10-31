const express = require("express");
const crypto = require("crypto");
const QRCode = require("qrcode");
const db = require("../config/database");
const { validateParticipant } = require("../utils/validation");

const router = express.Router();

router.get("/", (req, res) => {
  const rows = db.prepare(`
    SELECT p.id, p.name, p.email, p.created_at,
           CASE WHEN a.id IS NULL THEN 0 ELSE 1 END AS is_present,
           a.checked_in_at
    FROM participants p
    LEFT JOIN attendance a ON a.participant_id = p.id
    ORDER BY p.name COLLATE NOCASE ASC
  `).all();

  res.json({ success: true, data: rows });
});

router.post("/", async (req, res) => {
  const error = validateParticipant(req.body || {});
  if (error) return res.status(400).json({ success: false, message: error });

  const name = req.body.name.trim();
  const email = req.body.email.trim().toLowerCase();
  const token = crypto.randomBytes(24).toString("hex");

  try {
    const result = db.prepare(`
      INSERT INTO participants (name, email, qr_token)
      VALUES (?, ?, ?)
    `).run(name, email, token);

    const qrDataUrl = await QRCode.toDataURL(token, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 320
    });

    const participant = db.prepare(`
      SELECT id, name, email, created_at FROM participants WHERE id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: "Peserta berhasil didaftarkan. QR berhasil dibuat.",
      data: { ...participant, qr_token: token, qr_data_url: qrDataUrl }
    });
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        success: false,
        message: "Email tersebut sudah terdaftar."
      });
    }
    console.error("Create participant error:", err);
    res.status(500).json({ success: false, message: "Gagal menyimpan peserta." });
  }
});

module.exports = router;
