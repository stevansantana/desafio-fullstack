import express from "express";
import { prisma } from "./lib/prisma";

const app = express();

app.use(express.json());

app.post("/users", async (req, res) => {
  const { nome, email } = req.body;

  const user = await prisma.user.create({
    data: {
      nome,
      email,
    },
  });

  res.status(201).json(user);
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();

  res.status(200).json(users);
});

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});
