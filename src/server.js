require("dotenv").config();
const path = require("path");
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const participantRoutes = require("./routes/participantRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
require("./config/database");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set("io", io);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    app: process.env.APP_NAME || "QR Absensi",
    status: "running",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/participants", participantRoutes);
app.use("/api/attendance", attendanceRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint tidak ditemukan." });
});

const PORT = Number(process.env.PORT) || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`QR Absensi berjalan di http://localhost:${PORT}`);
  console.log("Tekan Ctrl + C untuk menghentikan server.");
});
