import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const strings = ["E", "A", "D", "G", "B", "e"];
const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const latinNotes = {
  "C": "Do",
  "C#": "Do#",
  "D": "Re",
  "D#": "Re#",
  "E": "Mi",
  "F": "Fa",
  "F#": "Fa#",
  "G": "Sol",
  "G#": "Sol#",
  "A": "La",
  "A#": "La#",
  "B": "Si"
};

const openNotes = ["E", "A", "D", "G", "B", "E"];

function getNoteForFret(openNote, fret) {
  const index = notes.indexOf(openNote);
  return notes[(index + fret) % 12];
}

function getRandomPosition(selectedStrings, minFret, maxFret) {
  const availableStrings = selectedStrings.length ? selectedStrings : [0, 1, 2, 3, 4, 5];
  const stringIndex = availableStrings[Math.floor(Math.random() * availableStrings.length)];
  const fret = Math.floor(Math.random() * (maxFret - minFret + 1)) + minFret;
  const note = getNoteForFret(openNotes[stringIndex], fret);
  return {
    stringName: strings[stringIndex],
    stringIndex,
    fret,
    note,
  };
}

function getMatchingPositions(note) {
  const matches = [];
  for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
    for (let fret = 1; fret <= 12; fret++) {
      if (getNoteForFret(openNotes[stringIndex], fret) === note) {
        matches.push({ stringIndex, fret });
      }
    }
  }
  return matches;
}

function FretboardSVG({ note, current }) {
  const matches = getMatchingPositions(note);
  return (
    <svg viewBox="-2 0 14 6" preserveAspectRatio="none" className="w-full h-48 mt-6 mb-6">
      {/* Etiquetas de cuerdas */}
      {strings.map((s, idx) => (
        <text
          key={`label-${idx}`}
          x={-1.4}
          y={5.5 - idx + 0.2}
          fontSize="0.4"
          textAnchor="end"
        >
          {6 - idx} ({s})
        </text>
      ))}
      {/* Líneas de cuerdas */}
      {Array.from({ length: 6 }, (_, i) => (
        <line
          key={`string-${i}`}
          x1="0"
          x2="12"
          y1={5.5 - i}
          y2={5.5 - i}
          stroke="black"
          strokeWidth="0.05"
        />
      ))}
      {/* Líneas de trastes */}
      {Array.from({ length: 13 }, (_, i) => (
        <line
          key={`fret-${i}`}
          x1={i}
          x2={i}
          y1="-0.5"
          y2="5.5"
          stroke="gray"
          strokeWidth="0.03"
        />
      ))}
      {/* Notas */}
      {matches.map(({ stringIndex, fret }, idx) => (
        <circle
          key={idx}
          cx={fret - 0.5}
          cy={5.5 - stringIndex}
          r={0.2}
          fill={stringIndex === current.stringIndex && fret === current.fret ? "red" : "black"}
        >
          <title>Cuerda {6 - stringIndex}, Traste {fret}</title>
        </circle>
      ))}
    </svg>
  );
}

export default function FretboardTrainer() {
  const [selectedStrings, setSelectedStrings] = useState([0, 1, 2, 3, 4, 5]);
  const [fretRange, setFretRange] = useState([1, 12]);
  const [minFret, maxFret] = fretRange;
  const [current, setCurrent] = useState(getRandomPosition(selectedStrings, minFret, maxFret));
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  function checkAnswer(val) {
    if (!val) return;
    setInput(val);
    if (val === current.note) {
      setFeedback("✅ ¡Correcto!");
      setScore(score + 1);
    } else {
      setFeedback(`❌ Incorrecto. Era ${current.note} (${latinNotes[current.note]})`);
    }
    setAnswered(true);
  }

  function nextQuestion() {
    setCurrent(getRandomPosition(selectedStrings, minFret, maxFret));
    setInput("");
    setFeedback(null);
    setAnswered(false);
  }

  const toggleString = (index) => {
    setSelectedStrings((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleFretInput = (index, value) => {
    const newRange = [...fretRange];
    newRange[index] = Math.max(1, Math.min(12, parseInt(value) || 1));
    setFretRange(newRange);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 font-sans space-y-6">
      <style jsx>{`
        [data-hover] {
          transition: background 0.2s ease;
        }
        [data-hover]:hover {
          background-color: rgba(0, 0, 0, 0.05);
          font-weight: bold;
        }
      `}</style>
      <Card>
        <CardContent className="space-y-6 p-6">
          <h2 className="text-2xl font-bold text-center">🎸 Entrenador de Notas en el Mástil</h2>

          <div className="space-y-6">
            <div>
              <p className="font-semibold mb-2">Selecciona las cuerdas:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {strings.map((s, idx) => (
                  <label key={idx} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedStrings.includes(idx)}
                      onCheckedChange={() => toggleString(idx)}
                      className="w-5 h-5 border-gray-400"
                    />
                    <span className="text-base">Cuerda {6 - idx} ({s})</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-semibold">Rango de trastes:</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="minFret">Desde:</label>
                  <Input
                    id="minFret"
                    type="number"
                    value={minFret}
                    min={1}
                    max={12}
                    onChange={(e) => handleFretInput(0, e.target.value)}
                    className="w-20"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="maxFret">Hasta:</label>
                  <Input
                    id="maxFret"
                    type="number"
                    value={maxFret}
                    min={1}
                    max={12}
                    onChange={(e) => handleFretInput(1, e.target.value)}
                    className="w-20"
                  />
                </div>
              </div>
              <Slider
                value={fretRange}
                onValueChange={setFretRange}
                min={1}
                max={12}
                step={1}
              />
            </div>
          </div>

          <div className="text-center mt-10 space-y-6">
            <p className="text-lg">
              ¿Qué nota hay en la <strong>cuerda {6 - current.stringIndex} ({current.stringName} / {latinNotes[openNotes[current.stringIndex]]})</strong>, traste <strong>{current.fret}</strong>?
            </p>

            <div className="my-6">
              <Select value={input} onValueChange={checkAnswer}>
                <SelectTrigger className="w-40 mx-auto">
                  <SelectValue placeholder="Selecciona una nota" />
                </SelectTrigger>
                <SelectContent className="space-y-1">
                  {notes.map((note) => (
                    <SelectItem
                      key={note}
                      value={note}
                      className="py-2 text-base cursor-pointer"
                      data-hover
                    >
                      {note} ({latinNotes[note]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {feedback && <p className="text-lg font-medium">{feedback}</p>}
            <p className="text-sm text-muted-foreground">Puntos: {score}</p>

            {answered && (
              <div className="mt-10 space-y-6">
                <FretboardSVG note={current.note} current={current} />
                <div className="text-center">
                  <Button variant="secondary" onClick={nextQuestion}>Nueva pregunta</Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
