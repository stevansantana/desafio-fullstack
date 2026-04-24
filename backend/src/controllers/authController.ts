import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const generateToken = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email !== "tecnico@prefeitura.rio" || password !== "painel@2024") {
    return res.status(401).json({
      error: "Credenciais inválidas",
    });
  }

  const token = jwt.sign(
    {
      preferred_username: email,
    },
    "segredo_super_seguro",
    {
      expiresIn: "1h",
    },
  );

  res.json({ token });
};
