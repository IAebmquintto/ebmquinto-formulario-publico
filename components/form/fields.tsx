import type { UseFormRegisterReturn } from "react-hook-form";

export function inputClass(hasError: boolean) {
  return [
    "mt-1.5 block w-full rounded-xl border bg-white/[0.06] px-3.5 py-2.5 text-sm text-foreground shadow-sm transition-all duration-200 ease-out focus:bg-white/[0.09] focus:outline-none focus:ring-4 focus:ring-brand/15",
    hasError ? "border-red-400" : "border-white/15 focus:border-brand/40",
  ].join(" ");
}

export function fileInputClass(hasError: boolean) {
  return [
    "mt-1.5 block w-full cursor-pointer rounded-xl border bg-white/[0.06] px-3.5 py-2.5 text-sm text-foreground/80 shadow-sm transition-all duration-200 ease-out file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-brand-soft file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-dark file:transition-colors hover:file:bg-brand/20 focus:outline-none focus:ring-4 focus:ring-brand/15",
    hasError ? "border-red-400" : "border-white/15 focus:border-brand/40",
  ].join(" ");
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="pt-2 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-brand-dark first:pt-0">
      {children}
    </p>
  );
}

export function Field({
  label,
  required,
  error,
  labelClassName,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  labelClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span
        className={["text-sm font-medium text-foreground/80", labelClassName]
          .filter(Boolean)
          .join(" ")}
      >
        {label} {required && <span className="text-brand">*</span>}
      </span>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </label>
  );
}

export function BoolField({
  label,
  required,
  error,
  name,
  onChange,
  onBlur,
  ref,
}: {
  label: string;
  required?: boolean;
  error?: string;
} & UseFormRegisterReturn) {
  return (
    <label className="block">
      <span className="block min-h-10 text-sm font-medium text-foreground/80">
        {label} {required && <span className="text-brand">*</span>}
      </span>
      <select
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        ref={ref}
        defaultValue=""
        className={inputClass(!!error)}
      >
        <option value="">–</option>
        <option value="sim">Sim</option>
        <option value="nao">Não</option>
      </select>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </label>
  );
}
