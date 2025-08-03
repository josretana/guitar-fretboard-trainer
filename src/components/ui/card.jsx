export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-white rounded-lg shadow p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`mt-2 ${className}`} {...props}>
      {children}
    </div>
  );
}