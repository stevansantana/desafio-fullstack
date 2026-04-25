import express from "express";
import userRoutes from "./routes/childRoutes";
import "dotenv/config";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(userRoutes);

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});
