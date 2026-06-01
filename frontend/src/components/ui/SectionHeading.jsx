export default function SectionHeading({ label, title, subtitle, align = "center" }) {
  const alignClass =
    align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-3xl mb-12 ${alignClass}`}>
      {label && (
        <p className="text-gold-600 text-sm font-semibold tracking-[0.2em] uppercase mb-3">
          {label}
        </p>
      )}
      <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
        <span className="gold-gradient-text">{title}</span>
      </h2>
      {subtitle && (
        <p className="text-slate-600 text-base md:text-lg leading-relaxed">{subtitle}</p>
      )}
      <div className="section-divider mt-8" />
    </div>
  );
}
