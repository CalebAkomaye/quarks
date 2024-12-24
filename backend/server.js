import "dotenv/config";
const PORT = process.env.PORT;
import app from "./app.js";
import { connectDB } from "./database/db.js";

app.listen(PORT, () => {
  connectDB();
  console.log(`🚀 server running on port http://localhost:${PORT}`);
});
