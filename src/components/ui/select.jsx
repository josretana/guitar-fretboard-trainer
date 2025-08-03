export function Select({ value, onValueChange, children }) {
  return (
    <div className="relative inline-block w-full">
      {children.map((child) =>
        React.cloneElement(child, { onValueChange, value, key: child.props.value })
      )}
    </div>
  );
}

export function SelectTrigger({ children, className }) {
  return (
    <div className={`border px-4 py-2 rounded bg-white text-left ${className}`}>
      {children}
    </div>
  );
}

export function SelectValue({ placeholder }) {
  return <span className="text-gray-500">{placeholder}</span>;
}

export function SelectContent({ children, className }) {
  return (
    <ul className={`absolute z-10 mt-2 w-full bg-white border rounded shadow ${className}`}>
      {children}
    </ul>
  );
}

export function SelectItem({ value, children, onValueChange, className, ...props }) {
  return (
    <li
      onClick={() => onValueChange(value)}
      className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${className}`}
      {...props}
    >
      {children}
    </li>
  );
}