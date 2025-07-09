import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.routes.js"; // add .js extension

const app = express();

app.use(cors());
app.use(express.json());
app.use("/ai", aiRoutes);

export default app;
