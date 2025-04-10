import express from "express";
import cors from "cors";
import { PORT } from "./config/env.js";
import millleniumBimRouter from "./routes/milleniumbim.routes.js";
import errorMiddleware from "./middlewares/error.midleware.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use(errorMiddleware);
app.use("/api/v1/payments", millleniumBimRouter);
app.get("/api/v1/", (req, res) => {
    res.send(`welcome to the payments api`);
});
app.listen(PORT, () => {
    console.log(`Payments API running on http://localhost:${PORT}`);
});
export default app;
