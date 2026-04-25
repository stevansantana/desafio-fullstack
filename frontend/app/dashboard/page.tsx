"use client";

import { useCallback, useEffect, useState } from "react";
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
  const [bairro, setBairro] = useState("");
  const [revisado, setRevisado] = useState("");
  const [alertas, setAlertas] = useState("");
  const [page, setPage] = useState(1);

  const fetchChildren = useCallback(async () => {
    const response = await axios.get("http://localhost:3001/children", {
      params: {
        bairro: bairro || undefined,
        revisado: revisado || undefined,
        alertas: alertas || undefined,
        page,
        limit: 5,
      },
    });

    setChildren(response.data);
  }, [bairro, revisado, alertas, page]);

  useEffect(() => {
    async function fetchData() {
      const summaryResponse = await axios.get("http://localhost:3001/summary");

      setSummary(summaryResponse.data);

      await fetchChildren();
    }

    fetchData();
  }, [fetchChildren]);

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
        <h2 className="text-xl font-bold mb-4">Filtros</h2>

        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Bairro"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            className="border rounded p-2"
          />

          <select
            value={revisado}
            onChange={(e) => setRevisado(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">Status revisão</option>
            <option value="true">Revisado</option>
            <option value="false">Pendente</option>
          </select>

          <select
            value={alertas}
            onChange={(e) => setAlertas(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">Alertas</option>
            <option value="true">Com alertas</option>
          </select>

          <button
            onClick={fetchChildren}
            className="bg-blue-600 text-white rounded p-2"
          >
            Filtrar
          </button>
        </div>
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

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Anterior
        </button>

        <span className="flex items-center font-medium">Página {page}</span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Próxima
        </button>
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
