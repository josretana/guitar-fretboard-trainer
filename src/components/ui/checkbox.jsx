export function Checkbox({ checked, onCheckedChange, className = "" }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className={`rounded border-gray-300 ${className}`}
    />
  );
}