const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const AuthRoute = require("./routes/UserRoute")
const TournamentRoute = require("./routes/TournamentRoute")
const TeamRoute = require("./routes/TeamRoute")
const ScheduleRoute = require("./routes/ScheduleRoute")
const MatchRoute = require("./routes/MatchRoute")

const app = express();

// ================= MIDDLEWARES =================
app.use(express.json());
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        credentials: true,
    })
);

// ================= DATABASE CONNECTION =================
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected ✅"))
    .catch((err) => {
        console.error("MongoDB Connection Failed ❌", err.message);
        process.exit(1);
    });

// ================= ROUTES =================

app.use("/api/auth", AuthRoute);
app.use("/api/tournaments", TournamentRoute);
app.use("/api/teams", TeamRoute);
app.use("/api/schedules", ScheduleRoute);
app.use("/api/matches", MatchRoute);

app.get("/", (req, res) => {
    res.json({ message: "RunYatra API Running " });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});