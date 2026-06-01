export default function PageShell({ children, className = "" }) {
  return (
    <div className={`pt-24 md:pt-28 pb-16 md:pb-20 ${className}`}>{children}</div>
  );
}
