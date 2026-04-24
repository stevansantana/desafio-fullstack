import express from "express";
import userRoutes from "./routes/childRoutes";

const app = express();

app.use(express.json());

app.use(userRoutes);

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});
