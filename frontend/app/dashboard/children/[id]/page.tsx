"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

interface ChildDetail {
  id: string;
  nome: string;
  bairro: string;
  responsavel: string;
  revisado: boolean;
  saude: {
    vacinasEmDia: boolean;
    alertas: string[];
  } | null;
  educacao: {
    escola: string | null;
    frequenciaPercent: number | null;
    alertas: string[];
  } | null;
  assistencia: {
    cadUnico: boolean;
    beneficioAtivo: boolean;
    alertas: string[];
  } | null;
}

export default function ChildDetailPage() {
  {
    const [child, setChild] = useState<ChildDetail | null>(null);

    const params = useParams();
    const id = params.id as string;

    useEffect(() => {
      async function fetchChild() {
        const response = await axios.get(
          `http://localhost:3001/children/${id}`,
        );

        setChild(response.data);
      }

      fetchChild();
    }, [id]);

    if (!child) {
      return <p className="p-8">Carregando...</p>;
    }

    return (
      <main className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">{child.nome}</h1>

        <div className="grid md:grid-cols-3 gap-4">
          <Section title="Saúde" data={child.saude} />
          <Section title="Educação" data={child.educacao} />
          <Section title="Assistência" data={child.assistencia} />
        </div>
      </main>
    );
  }

  function Section({
    title,
    data,
  }: {
    title: string;
    data: Record<string, unknown> | null;
  }) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-bold text-lg mb-4">{title}</h2>

        {data ? (
          <pre className="text-sm whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-500">Sem dados disponíveis</p>
        )}
      </div>
    );
  }
}
