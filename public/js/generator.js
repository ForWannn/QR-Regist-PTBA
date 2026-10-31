const form = document.getElementById("participant-form");
const message = document.getElementById("message");
const result = document.getElementById("qr-result");
let currentQr = null;

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = form.querySelector("button");
  button.disabled = true;
  message.textContent = "Membuat QR Code...";
  message.className = "message";

  try {
    const response = await fetch("/api/participants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: document.getElementById("name").value,
        email: document.getElementById("email").value
      })
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message || "Gagal membuat peserta.");

    currentQr = payload.data.qr_data_url;
    document.getElementById("result-name").textContent = payload.data.name;
    document.getElementById("result-email").textContent = payload.data.email;
    document.getElementById("qr-image").src = currentQr;
    result.classList.remove("hidden");
    message.textContent = payload.message;
    message.className = "message success";
    form.reset();
  } catch (error) {
    message.textContent = error.message;
    message.className = "message error";
  } finally {
    button.disabled = false;
  }
});

document.getElementById("download-qr").addEventListener("click", () => {
  if (!currentQr) return;
  const link = document.createElement("a");
  link.href = currentQr;
  link.download = "qr-peserta.png";
  link.click();
});
