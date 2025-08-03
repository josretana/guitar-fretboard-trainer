// Versión final con estadísticas por cuerda y traste, nueva pregunta, reinicios y mástil completo
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

function FretboardSVG({ note, current, highlightAllMatches }) {
  const matches = [];
  for (let s = 0; s < 6; s++) {
    for (let f = 1; f <= 12; f++) {
      if (getNoteForFret(openNotes[s], f) === note) {
        matches.push({ stringIndex: s, fret: f });
      }
    }
  }
  const highlight = [3, 5, 7, 9, 12];
  return (
    <svg viewBox="-2 0 14 6" className="w-full h-48 mt-6 mb-6">
      {highlight.map(f => (
        <rect key={f} x={f - 1} y="-0.5" width="1" height="6" fill={f === 12 ? "#ddd" : "#f2f2f2"} />
      ))}
      {strings.map((s, i) => (
        <text key={i} x={-1.4} y={5.5 - i + 0.2} fontSize="0.4" textAnchor="end">{6 - i} ({s})</text>
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <line key={i} x1="0" x2="12" y1={5.5 - i} y2={5.5 - i} stroke="black" strokeWidth="0.05" />
      ))}
      {Array.from({ length: 13 }, (_, i) => (
        <line key={i} x1={i} x2={i} y1="-0.5" y2="5.5" stroke="gray" strokeWidth="0.03" />
      ))}
      {matches.map(({ stringIndex, fret }, i) => {
        const isMain = stringIndex === current.stringIndex && fret === current.fret;
        if (!highlightAllMatches && !isMain) return null;
        return <circle key={i} cx={fret - 0.5} cy={5.5 - stringIndex} r={0.2} fill={isMain ? "red" : "black"} />;
      })}
    </svg>
  );
}

export default function App() {
  const [view, setView] = useState("trainer");
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
  const [stringStats, setStringStats] = useState(Array(6).fill().map(() => ({ correct: 0, total: 0 })));
  const [fretStats, setFretStats] = useState(Array(12).fill().map(() => ({ correct: 0, total: 0 })));

  const regenerate = (strings = selectedStrings, [minFret, maxFret] = fretRange) => {
    const pos = getRandomPosition(strings, minFret, maxFret);
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
    setStringStats(stats => {
      const copy = [...stats];
      const entry = { ...copy[current.stringIndex] };
      entry.total++;
      if (correct) entry.correct++;
      copy[current.stringIndex] = entry;
      return copy;
    });
    setFretStats(stats => {
      const copy = [...stats];
      const entry = { ...copy[current.fret - 1] };
      entry.total++;
      if (correct) entry.correct++;
      copy[current.fret - 1] = entry;
      return copy;
    });
  };

  const resetPeriod = () => {
    setScore(0);
    setAttempts(0);
    setTotalTime(0);
    setStringStats(Array(6).fill().map(() => ({ correct: 0, total: 0 })));
    setFretStats(Array(12).fill().map(() => ({ correct: 0, total: 0 })));
  };

  const accuracy = attempts > 0 ? ((score / attempts) * 100).toFixed(1) : "0.0";
  const avgTime = attempts > 0 ? (totalTime / attempts / 1000).toFixed(2) : "0.00";

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">🎸 Entrenador de notas en el mástil</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {strings.map((s, i) => (
          <label key={i} className="flex gap-2 items-center">
            <input type="checkbox" checked={selectedStrings.includes(i)} onChange={() => {
              const copy = [...selectedStrings];
              const idx = copy.indexOf(i);
              if (idx >= 0) copy.splice(idx, 1); else copy.push(i);
              setSelectedStrings(copy);
              regenerate(copy);
            }} />
            Cuerda {6 - i} ({s})
          </label>
        ))}
      </div>

      <div className="flex gap-4">
        <label>Desde traste: <input type="number" min={1} max={12} value={fretRange[0]} onChange={e => setFretRange([+e.target.value, fretRange[1]])} /></label>
        <label>Hasta traste: <input type="number" min={1} max={12} value={fretRange[1]} onChange={e => setFretRange([fretRange[0], +e.target.value])} /></label>
      </div>

      {current && (
        <>
          <p className="text-lg text-center">
            ¿Qué nota hay en la <strong>cuerda {6 - current.stringIndex} ({current.stringName} / {latinNotes[openNotes[current.stringIndex]]})</strong>, traste <strong>{current.fret}</strong>?
          </p>

          <FretboardSVG note={current.note} current={current} highlightAllMatches={answered} />

          <select value={input} onChange={e => check(e.target.value)} className="block mx-auto mt-4 p-2 border">
            <option value="">Selecciona una nota</option>
            {notes.map(n => <option key={n} value={n}>{n} ({latinNotes[n]})</option>)}
          </select>

          {feedback && <p className="text-lg font-semibold text-center">{feedback}</p>}
        </>
      )}

      <div className="text-center space-x-4">
        <button onClick={() => { setView('trainer'); regenerate(); }} className="bg-gray-200 px-4 py-2 rounded">Nueva pregunta</button>
        <button onClick={() => setView('stats')} className="underline text-sm">Ver estadísticas</button>
      </div>

      <div className="flex justify-center gap-8 mt-4">
        <div><strong>Puntos:</strong><br />{score}</div>
        <div><strong>% Aciertos:</strong><br />{accuracy}%</div>
        <div><strong>Tiempo medio:</strong><br />{avgTime}s</div>
      </div>

      {view === "stats" && (
        <div className="mt-10 space-y-6">
          <h2 className="text-xl font-bold text-center">📊 Estadísticas por cuerda</h2>
          <table className="w-full text-center border">
            <thead><tr><th>Cuerda</th><th>Aciertos</th><th>Intentos</th><th>%</th></tr></thead>
            <tbody>
              {stringStats.map((s, i) => (
                <tr key={i}><td>{6 - i} ({strings[i]})</td><td>{s.correct}</td><td>{s.total}</td><td>{s.total ? ((s.correct / s.total) * 100).toFixed(1) : "-"}%</td></tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-xl font-bold text-center">🎯 Estadísticas por traste</h2>
          <table className="w-full text-center border">
            <thead><tr><th>Traste</th><th>Aciertos</th><th>Intentos</th><th>%</th></tr></thead>
            <tbody>
              {fretStats.map((f, i) => (
                <tr key={i}><td>{i + 1}</td><td>{f.correct}</td><td>{f.total}</td><td>{f.total ? ((f.correct / f.total) * 100).toFixed(1) : "-"}%</td></tr>
              ))}
            </tbody>
          </table>

          <div className="text-center space-x-4">
            <button onClick={resetPeriod} className="bg-gray-300 px-4 py-2 rounded">Reiniciar período</button>
            <button onClick={() => { if (window.confirm("¿Estás seguro de que deseas reiniciar el histórico? Esta acción no se puede deshacer.")) resetPeriod(); }} className="bg-red-400 text-white px-4 py-2 rounded">Reiniciar histórico</button>
            <button onClick={() => setView("trainer")} className="underline">Volver</button>
          </div>
        </div>
      )}
    </div>
  );
}