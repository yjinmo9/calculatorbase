import express from "express";
import mongoose from "mongoose";
import { DATABASE_URL } from "./env.js";
import Calculation from "./models/calculation.js";

const app = express();
app.use(express.json());
app.use(express.static("public"));

// MongoDB 연결
mongoose
    .connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Database connection failed:", err));

// 계산 기록 저장
app.post("/calculate", async (req, res) => {
    const { formula, result, isValid } = req.body;
    try {
        const newCalc = await Calculation.create({ formula, result, isValid });
        res.status(201).json(newCalc);
    } catch (err) {
        console.error("Failed to save calculation:", err);
        res.status(500).json({ error: "Failed to save calculation" });
    }
});

// 계산 기록 조회
app.get("/history", async (req, res) => {
    try {
        const history = await Calculation.find().sort({ createdAt: -1 });
        res.json(history);
    } catch (err) {
        console.error("Failed to retrieve history:", err);
        res.status(500).json({ error: "Failed to retrieve history" });
    }
});

// 서버 실행
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

