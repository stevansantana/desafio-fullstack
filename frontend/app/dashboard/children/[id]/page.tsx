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

        <div className="mb-6">
          {child.revisado ? (
            <span className="text-green-600 font-medium">Caso já revisado</span>
          ) : (
            <button
              onClick={handleReview}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Marcar como revisado
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Section title="Saúde" data={child.saude} />
          <Section title="Educação" data={child.educacao} />
          <Section title="Assistência" data={child.assistencia} />
        </div>
      </main>
    );

    async function handleReview() {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:3001/children/${id}/review`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setChild((prev) =>
        prev
          ? {
              ...prev,
              revisado: true,
            }
          : prev,
      );

      alert("Criança marcada como revisada!");
    }
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
          <div className="space-y-2 text-sm text-gray-700">
            {Object.entries(data).map(([key, value]) => (
              <p key={key}>
                <strong>{formatLabel(key)}:</strong> {formatValue(value)}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Sem dados disponíveis</p>
        )}
      </div>
    );
  }

  function formatLabel(label: string) {
    const labels: Record<string, string> = {
      vacinasEmDia: "Vacinas em dia",
      alertas: "Alertas",
      escola: "Escola",
      frequenciaPercent: "Frequência",
      cadUnico: "CadÚnico",
      beneficioAtivo: "Benefício ativo",
    };

    return labels[label] || label;
  }

  function formatValue(value: unknown) {
    if (Array.isArray(value)) {
      return value.length ? value.join(", ") : "Nenhum";
    }

    if (typeof value === "boolean") {
      return value ? "Sim" : "Não";
    }

    if (value === null) {
      return "Não informado";
    }

    return String(value);
  }
}
