const socket = io();
const rowsEl = document.getElementById("participant-rows");
const searchEl = document.getElementById("search");
let participants = [];

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

function render() {
  const keyword = searchEl.value.trim().toLowerCase();
  const filtered = participants.filter(p =>
    p.name.toLowerCase().includes(keyword) || p.email.toLowerCase().includes(keyword)
  );

  if (!filtered.length) {
    rowsEl.innerHTML = '<tr><td colspan="4" class="empty">Tidak ada data peserta.</td></tr>';
    return;
  }

  rowsEl.innerHTML = filtered.map(p => `
    <tr>
      <td>${escapeHtml(p.name)}</td>
      <td>${escapeHtml(p.email)}</td>
      <td><span class="badge ${p.is_present ? "present" : "absent"}">${p.is_present ? "HADIR" : "BELUM HADIR"}</span></td>
      <td>${p.checked_in_at ? escapeHtml(p.checked_in_at) : "—"}</td>
    </tr>
  `).join("");
}

async function loadData() {
  const [participantsResponse, summaryResponse] = await Promise.all([
    fetch("/api/participants"),
    fetch("/api/attendance/summary")
  ]);
  const participantsPayload = await participantsResponse.json();
  const summaryPayload = await summaryResponse.json();
  participants = participantsPayload.data || [];
  document.getElementById("total-count").textContent = summaryPayload.data.total;
  document.getElementById("present-count").textContent = summaryPayload.data.present;
  document.getElementById("absent-count").textContent = summaryPayload.data.absent;
  render();
}

searchEl.addEventListener("input", render);
socket.on("attendance:updated", loadData);
loadData().catch(() => {
  rowsEl.innerHTML = '<tr><td colspan="4" class="empty">Gagal memuat data. Periksa server.</td></tr>';
});
