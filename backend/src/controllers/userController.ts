import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createUser = async (req: Request, res: Response) => {
  const { nome, email } = req.body;

  const user = await prisma.user.create({
    data: {
      nome,
      email,
    },
  });

  res.status(201).json(user);
};

export const getUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();

  res.status(200).json(users);
};
