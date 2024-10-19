import express from "express";
import cors from "cors";
import { config } from "./config/config";
import { connectToDatabase } from "./config/db";
import { router as companyRouter } from "./routes/company.routes";
import { router as jobRouter } from "./routes/jobs.route";

const app = express();

//middleware
app.use(cors());
app.use(express.json());

app.use("/api/companies", companyRouter);
app.use("/api/jobs", jobRouter);

async function startServer() {
  await connectToDatabase();

  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

startServer().catch(console.error);
