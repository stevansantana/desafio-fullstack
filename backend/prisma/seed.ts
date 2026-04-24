import { PrismaClient } from "@prisma/client";
import seed from "./seed.json";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed...");

  for (const child of seed) {
    await prisma.child.create({
      data: {
        id: child.id,
        nome: child.nome,
        dataNascimento: new Date(child.data_nascimento),
        bairro: child.bairro,
        responsavel: child.responsavel,
        revisado: child.revisado,
        revisadoPor: child.revisado_por,
        revisadoEm: child.revisado_em ? new Date(child.revisado_em) : null,

        saude: child.saude
          ? {
              create: {
                ultimaConsulta: new Date(child.saude.ultima_consulta),
                vacinasEmDia: child.saude.vacinas_em_dia,
                alertas: child.saude.alertas,
              },
            }
          : undefined,

        educacao: child.educacao
          ? {
              create: {
                escola: child.educacao.escola,
                frequenciaPercent: child.educacao.frequencia_percent,
                alertas: child.educacao.alertas,
              },
            }
          : undefined,

        assistencia: child.assistencia_social
          ? {
              create: {
                cadUnico: child.assistencia_social.cad_unico,
                beneficioAtivo: child.assistencia_social.beneficio_ativo,
                alertas: child.assistencia_social.alertas,
              },
            }
          : undefined,
      },
    });
  }

  console.log("Seed finalizado!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
