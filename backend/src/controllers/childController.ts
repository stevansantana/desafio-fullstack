import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getChildren = async (req: Request, res: Response) => {
  const children = await prisma.child.findMany({
    include: {
      saude: true,
      educacao: true,
      assistencia: true,
    },
  });

  res.json(children);
};
