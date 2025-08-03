export function Slider({ value, onValueChange, min, max, step = 1 }) {
  const handleChange = (e) => {
    const newValue = [Number(e.target.value), value[1]];
    onValueChange(newValue);
  };

  const handleChangeEnd = (e) => {
    const newValue = [value[0], Number(e.target.value)];
    onValueChange(newValue);
  };

  return (
    <div className="flex items-center space-x-4">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={handleChange}
        className="w-full"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[1]}
        onChange={handleChangeEnd}
        className="w-full"
      />
    </div>
  );
}