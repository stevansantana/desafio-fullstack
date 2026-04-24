import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getChildren = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const bairro = req.query.bairro as string;
  const revisado = req.query.revisado as string;
  const alerta = req.query.alerta as string;

  const skip = (page - 1) * limit;

  const children = await prisma.child.findMany({
    where: {
      ...(bairro && { bairro }),

      ...(revisado !== undefined && {
        revisado: revisado === "true",
      }),

      ...(alerta && {
        OR: [
          { saude: { alertas: { has: alerta } } },
          { educacao: { alertas: { has: alerta } } },
          { assistencia: { alertas: { has: alerta } } },
        ],
      }),
    },
    skip,
    take: limit,
    include: {
      saude: true,
      educacao: true,
      assistencia: true,
    },
  });

  res.json(children);
};
