import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.routes.js"; // ✅ import your route correctly

const app = express();

app.use(cors());
app.use(express.json());

app.use("/ai", aiRoutes); // e.g., POST /ai/get-response

export default app;
