import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getChildren = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const bairro = req.query.bairro as string;
  const revisado = req.query.revisado as string;
  const alertas = req.query.alertas as string;

  const skip = (page - 1) * limit;

  const children = await prisma.child.findMany({
    where: {
      ...(bairro && { bairro }),

      ...(revisado !== undefined && {
        revisado: revisado === "true",
      }),

      ...(alertas === "true" && {
        OR: [
          { saude: { alertas: { isEmpty: false } } },
          { educacao: { alertas: { isEmpty: false } } },
          { assistencia: { alertas: { isEmpty: false } } },
        ],
      }),
    },
    skip,
    take: limit,
    select: {
      id: true,
      nome: true,
      bairro: true,
      revisado: true,
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

export const reviewChild = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const user = req.user as { preferred_username: string };

  await prisma.child.update({
    where: { id },
    data: {
      revisado: true,
      revisadoPor: user.preferred_username,
      revisadoEm: new Date(),
    },
  });

  res.json({
    message: "Criança revisada com sucesso",
  });
};
