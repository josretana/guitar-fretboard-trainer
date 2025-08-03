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

// Resto del código omitido por brevedad
export default function App() {
  return <div>App funcionando</div>;
}
