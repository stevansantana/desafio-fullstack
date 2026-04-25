"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface SummaryData {
  totalCriancas: number;
  alertasSaude: number;
  alertasEducacao: number;
  alertasAssistencia: number;
  revisadas: number;
}

interface Child {
  id: string;
  nome: string;
  bairro: string;
  revisado: boolean;
}

export default function Dashboard() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [children, setChildren] = useState<Child[]>([]);

  useEffect(() => {
    async function fetchData() {
      const summaryResponse = await axios.get("http://localhost:3001/summary");

      setSummary(summaryResponse.data);

      const childrenResponse = await axios.get(
        "http://localhost:3001/children",
      );

      setChildren(childrenResponse.data);
    }

    fetchData();
  }, []);

  if (!summary) {
    return <p className="p-8">Carregando...</p>;
  }

  return (
    <main className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card title="Total de Crianças" value={summary.totalCriancas} />
        <Card title="Alertas Saúde" value={summary.alertasSaude} />
        <Card title="Alertas Educação" value={summary.alertasEducacao} />
        <Card title="Alertas Assistência" value={summary.alertasAssistencia} />
        <Card title="Revisadas" value={summary.revisadas} />
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Crianças cadastradas</h2>

        <div className="space-y-4">
          {children.map((child) => (
            <div
              key={child.id}
              className="border rounded p-4 flex justify-between"
            >
              <div>
                <p className="font-semibold">{child.nome}</p>
                <p className="text-sm text-gray-500">{child.bairro}</p>
              </div>

              <span
                className={`text-sm font-medium ${
                  child.revisado ? "text-green-600" : "text-red-600"
                }`}
              >
                {child.revisado ? "Revisado" : "Pendente"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-gray-500 text-sm">{title}</h2>
      <p className="text-3xl text-black font-bold mt-2">{value}</p>
    </div>
  );
}
