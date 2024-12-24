import express from "express";
import "dotenv/config";
import router from "./routes/tasks.routes.js";
import authRoutes from "./routes/auth.routes.js";

export const app = express();

app.use(express.json()); // allows parsing of incoming requests:req.body
app.use("/api/auth", authRoutes);
app.use("/api", router);

app.get("/", (req, res) => {
  res.send("<h1>Home Page</h1>");
});

export default app;
