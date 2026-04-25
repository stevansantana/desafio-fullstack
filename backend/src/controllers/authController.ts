import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";

const authSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const generateToken = async (req: Request, res: Response) => {
  try {
    const { email, password } = authSchema.parse(req.body);

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
  } catch {
    return res.status(400).json({
      error: "Dados inválidos",
    });
  }
};
