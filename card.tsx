export function Card({ children }) {
  return <div className="rounded-xl border border-gray-200 bg-white shadow">{children}</div>;
}
export function CardContent({ children, className }) {
  return <div className={className}>{children}</div>;
}
