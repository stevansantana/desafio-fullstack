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

export const getChildById = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const child = await prisma.child.findUnique({
    where: { id },
    include: {
      saude: true,
      educacao: true,
      assistencia: true,
    },
  });

  if (!child) {
    return res.status(404).json({
      error: "Criança não encontrada",
    });
  }

  res.json(child);
};

export const getSummary = async (req: Request, res: Response) => {
  const totalCriancas = await prisma.child.count();

  const alertasSaude = await prisma.health.count({
    where: {
      alertas: {
        isEmpty: false,
      },
    },
  });

  const alertasEducacao = await prisma.education.count({
    where: {
      alertas: {
        isEmpty: false,
      },
    },
  });

  const alertasAssistencia = await prisma.socialAssistance.count({
    where: {
      alertas: {
        isEmpty: false,
      },
    },
  });

  const revisadas = await prisma.child.count({
    where: {
      revisado: true,
    },
  });

  res.json({
    totalCriancas,
    alertasSaude,
    alertasEducacao,
    alertasAssistencia,
    revisadas,
  });
};
