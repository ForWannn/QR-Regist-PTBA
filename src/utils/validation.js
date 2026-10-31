function validateParticipant({ name, email }) {
  if (typeof name !== "string" || !name.trim()) {
    return "Nama peserta wajib diisi.";
  }

  if (name.trim().length > 120) {
    return "Nama maksimal 120 karakter.";
  }

  if (typeof email !== "string" || !email.trim()) {
    return "Email peserta wajib diisi.";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.trim())) {
    return "Format email tidak valid.";
  }

  if (email.trim().length > 190) {
    return "Email terlalu panjang.";
  }

  return null;
}

module.exports = { validateParticipant };
