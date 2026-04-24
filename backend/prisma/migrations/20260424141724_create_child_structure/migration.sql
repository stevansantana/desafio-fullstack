/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Child" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "bairro" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL,
    "revisado" BOOLEAN NOT NULL,
    "revisadoPor" TEXT,
    "revisadoEm" TIMESTAMP(3),

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Health" (
    "id" SERIAL NOT NULL,
    "ultimaConsulta" TIMESTAMP(3) NOT NULL,
    "vacinasEmDia" BOOLEAN NOT NULL,
    "alertas" TEXT[],
    "childId" TEXT NOT NULL,

    CONSTRAINT "Health_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" SERIAL NOT NULL,
    "escola" TEXT,
    "frequenciaPercent" INTEGER,
    "alertas" TEXT[],
    "childId" TEXT NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialAssistance" (
    "id" SERIAL NOT NULL,
    "cadUnico" BOOLEAN NOT NULL,
    "beneficioAtivo" BOOLEAN NOT NULL,
    "alertas" TEXT[],
    "childId" TEXT NOT NULL,

    CONSTRAINT "SocialAssistance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Health_childId_key" ON "Health"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "Education_childId_key" ON "Education"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "SocialAssistance_childId_key" ON "SocialAssistance"("childId");

-- AddForeignKey
ALTER TABLE "Health" ADD CONSTRAINT "Health_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialAssistance" ADD CONSTRAINT "SocialAssistance_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
