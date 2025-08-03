// Página de estadísticas por cuerda y traste
import { useState } from "react";

const strings = ["E", "A", "D", "G", "B", "e"];
const trastes = Array.from({ length: 12 }, (_, i) => i + 1);

export default function StatsPage() {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Simulación de datos
  const mockData = strings.map((s, i) => ({
    string: `Cuerda ${6 - i} (${s})`,
    hits: Math.floor(Math.random() * 100),
    attempts: Math.floor(Math.random() * 120),
    time: (Math.random() * 5).toFixed(2),
  }));

  const mockTrasteData = trastes.map((t) => ({
    fret: `Traste ${t}`,
    hits: Math.floor(Math.random() * 100),
    attempts: Math.floor(Math.random() * 120),
    time: (Math.random() * 5).toFixed(2),
  }));

  return (
    <div className="min-h-screen bg-[#C6C6C6] p-6 text-center">
      <div className="max-w-5xl mx-auto bg-white/70 rounded-lg shadow p-6 space-y-6">
        <h2 className="text-2xl font-bold mb-4">📊 Estadísticas por cuerda</h2>

        <table className="w-full table-auto text-sm text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Cuerda</th>
              <th className="p-2">Aciertos</th>
              <th className="p-2">Intentos</th>
              <th className="p-2">% Aciertos</th>
              <th className="p-2">Tiempo medio</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((row, i) => (
              <tr key={i} className="border-b">
                <td className="p-2">{row.string}</td>
                <td className="p-2">{row.hits}</td>
                <td className="p-2">{row.attempts}</td>
                <td className="p-2">{((row.hits / row.attempts) * 100).toFixed(1)}%</td>
                <td className="p-2">{row.time}s</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="text-2xl font-bold mt-10 mb-4">📈 Estadísticas por traste</h2>

        <table className="w-full table-auto text-sm text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Traste</th>
              <th className="p-2">Aciertos</th>
              <th className="p-2">Intentos</th>
              <th className="p-2">% Aciertos</th>
              <th className="p-2">Tiempo medio</th>
            </tr>
          </thead>
          <tbody>
            {mockTrasteData.map((row, i) => (
              <tr key={i} className="border-b">
                <td className="p-2">{row.fret}</td>
                <td className="p-2">{row.hits}</td>
                <td className="p-2">{row.attempts}</td>
                <td className="p-2">{((row.hits / row.attempts) * 100).toFixed(1)}%</td>
                <td className="p-2">{row.time}s</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-center gap-4">
          <button className="bg-gray-300 px-4 py-2 rounded">Reiniciar período actual</button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => setShowConfirmReset(true)}
          >
            Reiniciar histórico
          </button>
        </div>

        {showConfirmReset && (
          <div className="mt-4 text-center">
            <p className="text-sm font-medium mb-2">Estás seguro de que deseas borrar el histórico?</p>
            <button className="bg-red-600 text-white px-4 py-2 rounded mr-2">Confirmar</button>
            <button
              className="bg-gray-200 px-4 py-2 rounded"
              onClick={() => setShowConfirmReset(false)}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}