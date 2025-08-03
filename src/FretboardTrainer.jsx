// Versión anterior restaurada sin diseño responsive completo
import { useState, useEffect } from "react";

const strings = ["E", "A", "D", "G", "B", "e"];
const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const latinNotes = {
  "C": "Do", "C#": "Do#", "D": "Re", "D#": "Re#", "E": "Mi", "F": "Fa",
  "F#": "Fa#", "G": "Sol", "G#": "Sol#", "A": "La", "A#": "La#", "B": "Si"
};
const openNotes = ["E", "A", "D", "G", "B", "E"];

function getNoteForFret(openNote, fret) {
  const index = notes.indexOf(openNote);
  return notes[(index + fret) % 12];
}

function getRandomPosition(selectedStrings, minFret, maxFret) {
  const availableStrings = selectedStrings.length ? selectedStrings : [0, 1, 2, 3, 4, 5];
  if (availableStrings.length === 0) return null;
  const stringIndex = availableStrings[Math.floor(Math.random() * availableStrings.length)];
  const fret = Math.floor(Math.random() * (maxFret - minFret + 1)) + minFret;
  const note = getNoteForFret(openNotes[stringIndex], fret);
  return { stringName: strings[stringIndex], stringIndex, fret, note };
}

export default function App() {
  const [selectedStrings, setSelectedStrings] = useState([0, 1, 2, 3, 4, 5]);
  const [fretRange, setFretRange] = useState([1, 12]);
  const [current, setCurrent] = useState(getRandomPosition([0, 1, 2, 3, 4, 5], 1, 12));
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  const regenerate = () => {
    const pos = getRandomPosition(selectedStrings, fretRange[0], fretRange[1]);
    if (pos) {
      setCurrent(pos);
      setInput("");
      setFeedback(null);
      setAnswered(false);
      setStartTime(Date.now());
    }
  };

  const check = (val) => {
    if (!val) return;
    setInput(val);
    setAttempts(a => a + 1);
    setTotalTime(t => t + (Date.now() - startTime));
    const correct = val === current.note;
    if (correct) setScore(s => s + 1);
    const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
    setFeedback(correct ? `✅ ¡Correcto! Has tardado ${timeTaken} segundos` : `❌ Incorrecto. Era ${current.note} (${latinNotes[current.note]})`);
    setAnswered(true);
  };

  const accuracy = attempts > 0 ? ((score / attempts) * 100).toFixed(1) : "0.0";
  const avgTime = attempts > 0 ? (totalTime / attempts / 1000).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen bg-[#C6C6C6] p-6 text-center">
      <div className="max-w-3xl mx-auto bg-white/70 rounded-lg shadow p-6 space-y-6">
        <h1 className="text-2xl font-bold">🎸 Entrenador de notas en el mástil</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {strings.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                const updated = selectedStrings.includes(i)
                  ? selectedStrings.filter(idx => idx !== i)
                  : [...selectedStrings, i];
                setSelectedStrings(updated);
                regenerate();
              }}
              className={`flex flex-col items-center justify-center px-2 py-2 rounded-lg shadow transition-all ${selectedStrings.includes(i) ? 'bg-[#00A19C] text-white' : 'bg-white text-black border'} min-w-[80px]`}
            >
              <span className="text-xs">Cuerda {6 - i}</span>
              <span className="text-lg font-bold">{s}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-6">
          <label>
            Desde:
            <select value={fretRange[0]} onChange={e => setFretRange([+e.target.value, fretRange[1]])} className="ml-2 p-1 border">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <label>
            Hasta:
            <select value={fretRange[1]} onChange={e => setFretRange([fretRange[0], +e.target.value])} className="ml-2 p-1 border">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        </div>

        {current && (
          <>
            <p className="text-lg mt-6">
              ¿Qué nota hay en la <strong>cuerda {6 - current.stringIndex} ({current.stringName} / {latinNotes[openNotes[current.stringIndex]]})</strong>, traste <strong>{current.fret}</strong>?
            </p>

            <svg viewBox="-2 0 14 6" className="w-full h-48 mt-6 mb-6">
              {Array.from({ length: 6 }, (_, i) => (
                <line key={i} x1="0" x2="12" y1={5.5 - i} y2={5.5 - i} stroke="black" strokeWidth="0.05" />
              ))}
              {Array.from({ length: 13 }, (_, i) => (
                <line key={i} x1={i} x2={i} y1="-0.5" y2="5.5" stroke="gray" strokeWidth="0.03" />
              ))}
              <circle
                cx={current.fret - 0.5}
                cy={5.5 - current.stringIndex}
                r={0.2}
                fill="#80142B"
              />
            </svg>

            <select
              value={input}
              onChange={e => check(e.target.value)}
              className="block mx-auto mt-4 p-2 border bg-[#80142B] text-white font-semibold rounded"
            >
              <option value="">Selecciona una nota</option>
              {notes.map(n => <option key={n} value={n}>{n} ({latinNotes[n]})</option>)}
            </select>

            {feedback && <p className="text-lg font-semibold mt-4">{feedback}</p>}
          </>
        )}

        <div className="space-x-4 mt-6">
          <button onClick={regenerate} className="bg-gray-200 px-4 py-2 rounded">Nueva pregunta</button>
        </div>

        <div className="flex justify-center gap-8 mt-4">
          <div><strong>Puntos:</strong><br />{score}</div>
          <div><strong>% Aciertos:</strong><br />{accuracy}%</div>
          <div><strong>Tiempo medio:</strong><br />{avgTime}s</div>
        </div>
      </div>
    </div>
  );
}