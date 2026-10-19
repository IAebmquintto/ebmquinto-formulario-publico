import { z } from "zod";

// O `<input type="date">` nativo mostra o formato do idioma do aparelho
// (mm/dd/yyyy em celular/PC em inglês), não do site — por isso a data de
// nascimento é um campo de texto com máscara dd/mm/aaaa, convertido pra
// aaaa-mm-dd (o que o backend espera, `@IsDateString`) só no envio.

/** Aplica a máscara dd/mm/aaaa enquanto a pessoa digita (só números). */
export function maskBrDate(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/** "31/12/1990" -> "1990-12-31"; `null` se não for uma data real. */
export function brDateToIso(value: string): string | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return `${yyyy}-${mm}-${dd}`;
}

export const birthDateSchema = z
  .string()
  .trim()
  .min(1, "Informe a data de nascimento")
  .refine((value) => {
    const iso = brDateToIso(value);
    if (!iso) return false;
    const year = Number(iso.slice(0, 4));
    return year >= 1900 && iso <= new Date().toISOString().slice(0, 10);
  }, "Data inválida (use dd/mm/aaaa)");
