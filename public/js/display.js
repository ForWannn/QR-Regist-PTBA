const socket = io();
const input = document.getElementById("scanner-input");
const card = document.getElementById("result-card");
const nameEl = document.getElementById("result-name");
const messageEl = document.getElementById("result-message");
const timeEl = document.getElementById("result-time");

function showResult(type, title, message, time = "") {
  card.className = `result-card ${type}`;
  document.querySelector(".result-symbol").textContent =
    type === "success" ? "✓" : type === "warning" ? "!" : type === "error" ? "×" : "⌁";
  nameEl.textContent = title;
  messageEl.textContent = message;
  timeEl.textContent = time;
}

async function processScan(token) {
  try {
    const response = await fetch("/api/attendance/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    });
    const payload = await response.json();
    if (payload.status === "present") {
      showResult("success", payload.data.name, payload.message, `Waktu: ${payload.data.checked_in_at}`);
    } else if (payload.status === "already_present") {
      showResult("warning", payload.data.name, payload.message, `Sudah hadir: ${payload.data.checked_in_at}`);
    } else {
      showResult("error", "QR tidak valid", payload.message);
    }
  } catch {
    showResult("error", "Koneksi bermasalah", "Tidak dapat menghubungi server absensi.");
  } finally {
    input.value = "";
    input.focus();
  }
}

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const token = input.value.trim();
    if (token) processScan(token);
  }
});

document.addEventListener("click", () => input.focus());
