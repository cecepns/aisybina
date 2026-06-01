export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const variants = {
    primary:
      "bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-soft hover:from-gold-600 hover:to-gold-700 hover:shadow-md",
    outline:
      "border-2 border-gold-400 text-gold-700 bg-white hover:bg-gold-50 hover:border-gold-500",
    ghost: "text-gold-700 hover:bg-gold-50",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
