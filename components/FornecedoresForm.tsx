"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import api from "@/lib/api";
import BrandLogo from "@/components/BrandLogo";
import BackToChoices from "@/components/BackToChoices";
import { Field, SectionLabel, fileInputClass, inputClass } from "@/components/form/fields";
import {
  ACCEPTED_SUPPLIER_MEDIA_EXTENSIONS,
  ACCEPTED_SUPPLIER_MEDIA_MIME_TYPES,
  BRAZILIAN_STATE_NAMES,
  MAX_SUPPLIER_MEDIA_FILES,
  MAX_SUPPLIER_MEDIA_SIZE_BYTES,
  MAX_SUPPLIER_MEDIA_SIZE_MB,
  SUPPLIER_SEGMENT_OPTIONS,
} from "@/lib/constants";

const fileListOrUndefined = () =>
  z
    .custom<FileList>(
      (val) =>
        val === undefined ||
        (typeof FileList !== "undefined" && val instanceof FileList),
    )
    .optional();

const fornecedorSchema = z
  .object({
    companyName: z.string().trim().min(1, "Informe o nome da empresa"),
    segment: z.string().min(1, "Selecione o segmento"),
    city: z.string().trim().min(1, "Informe a cidade"),
    state: z.string().min(1, "Selecione o estado"),
    cnpj: z.string().trim(),
    phone: z.string().trim(),
    email: z.string().trim(),
    website: z.string().trim(),
    address: z.string().trim(),
    differentials: z.string().trim(),
    media: fileListOrUndefined(),
  })
  .superRefine((values, ctx) => {
    if (values.media && values.media.length > MAX_SUPPLIER_MEDIA_FILES) {
      ctx.addIssue({
        code: "custom",
        path: ["media"],
        message: `Envie no máximo ${MAX_SUPPLIER_MEDIA_FILES} arquivos`,
      });
    }
    if (values.media) {
      for (const file of Array.from(values.media)) {
        if (
          !ACCEPTED_SUPPLIER_MEDIA_MIME_TYPES.includes(
            file.type as (typeof ACCEPTED_SUPPLIER_MEDIA_MIME_TYPES)[number],
          )
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["media"],
            message: "Envie imagens, PDF, PPTX ou compactado (ZIP/RAR)",
          });
          break;
        }
        if (file.size > MAX_SUPPLIER_MEDIA_SIZE_BYTES) {
          ctx.addIssue({
            code: "custom",
            path: ["media"],
            message: `Cada arquivo deve ter até ${MAX_SUPPLIER_MEDIA_SIZE_MB}MB`,
          });
          break;
        }
      }
    }
  });

type FornecedorFormValues = z.infer<typeof fornecedorSchema>;

export default function FornecedoresForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FornecedorFormValues>({
    resolver: zodResolver(fornecedorSchema),
    defaultValues: {
      companyName: "",
      segment: "",
      city: "",
      state: "",
      cnpj: "",
      phone: "",
      email: "",
      website: "",
      address: "",
      differentials: "",
    },
  });

  async function onSubmit(values: FornecedorFormValues) {
    setServerError(null);
    try {
      const formData = new FormData();
      formData.append("companyName", values.companyName);
      formData.append("segment", values.segment);
      formData.append("city", values.city);
      formData.append("state", values.state);
      if (values.cnpj) formData.append("cnpj", values.cnpj);
      if (values.phone) formData.append("phone", values.phone);
      if (values.email) formData.append("email", values.email);
      if (values.website) formData.append("website", values.website);
      if (values.address) formData.append("address", values.address);
      if (values.differentials) formData.append("differentials", values.differentials);
      if (values.media) {
        Array.from(values.media).forEach((file) => formData.append("media", file));
      }
      await api.post("/suppliers", formData);
      setSubmitted(true);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        const { message } = err.response.data;
        setServerError(Array.isArray(message) ? message.join(", ") : message);
      } else {
        setServerError("Não foi possível enviar seu cadastro. Tente novamente em instantes.");
      }
    }
  }

  if (submitted) {
    return (
      <div className="animate-rise-in relative mx-auto max-w-xl rounded-3xl border border-line bg-ink p-10 text-center shadow-xl shadow-black/30 sm:p-14">
        <BrandLogo variant="light" />
        <div className="mx-auto mb-5 mt-10 flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
            <path
              d="M5 13l4 4L19 7"
              pathLength={1}
              className="animate-draw-check"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-medium text-foreground">
          Recebemos seu cadastro com sucesso.
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-foreground/60">
          Agradecemos o interesse em ser fornecedor(a) da EBMQUINTTO COMUNICAÇÃO.
        </p>
        <p className="mx-auto mt-3 max-w-sm text-sm text-foreground/60">
          Vamos analisar as informações e entrar em contato quando surgir uma oportunidade
          compatível. Obrigado! 🚀
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="animate-rise-in relative mx-auto max-w-3xl space-y-8 rounded-3xl border border-line bg-ink p-6 shadow-xl shadow-black/30 sm:p-12"
    >
      <div>
        <BackToChoices />
        <h2 className="font-display text-2xl font-medium text-foreground sm:text-3xl">
          Cadastro de fornecedor
        </h2>
        <p className="mt-2 text-sm text-foreground/60">
          ✅ Nosso cadastro de fornecedores é consultado por todas as áreas da EBMQUINTTO no
          início de cada trabalho. Preencha seus dados de forma completa :).
        </p>
        <div className="mt-6 border-t border-line" />
      </div>

      {serverError && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/40 p-4 text-sm text-red-300">
          {serverError}
        </div>
      )}

      <div className="space-y-6">
        <SectionLabel>Dados da empresa</SectionLabel>
        <Field label="Nome da empresa" required error={errors.companyName?.message}>
          <input
            type="text"
            {...register("companyName")}
            className={inputClass(!!errors.companyName)}
            placeholder="Nome da sua empresa"
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Qual o segmento de atuação?" required error={errors.segment?.message}>
            <select {...register("segment")} className={inputClass(!!errors.segment)}>
              <option value="">Selecione</option>
              {SUPPLIER_SEGMENT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
          <Field label="CNPJ" error={errors.cnpj?.message}>
            <input
              type="text"
              {...register("cnpj")}
              className={inputClass(!!errors.cnpj)}
              placeholder="00.000.000/0000-00"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Cidade" required error={errors.city?.message}>
            <input
              type="text"
              {...register("city")}
              className={inputClass(!!errors.city)}
              placeholder="Sua cidade"
            />
          </Field>
          <Field label="Estado" required error={errors.state?.message}>
            <select {...register("state")} className={inputClass(!!errors.state)}>
              <option value="">Selecione</option>
              {BRAZILIAN_STATE_NAMES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Endereço" error={errors.address?.message}>
          <input
            type="text"
            {...register("address")}
            className={inputClass(!!errors.address)}
            placeholder="Rua, número, bairro"
          />
        </Field>

        <SectionLabel>Contato</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Telefone" error={errors.phone?.message}>
            <input
              type="text"
              {...register("phone")}
              className={inputClass(!!errors.phone)}
              placeholder="(00) 00000-0000"
            />
          </Field>
          <Field label="E-mail" error={errors.email?.message}>
            <input
              type="email"
              {...register("email")}
              className={inputClass(!!errors.email)}
              placeholder="contato@empresa.com"
            />
          </Field>
        </div>

        <Field label="Link (site ou Instagram)" error={errors.website?.message}>
          <input
            type="text"
            {...register("website")}
            className={inputClass(!!errors.website)}
            placeholder="https://... ou @seuusuario"
          />
        </Field>

        <SectionLabel>Sobre a empresa</SectionLabel>
        <Field label="Diferenciais / Produtos" error={errors.differentials?.message}>
          <textarea
            {...register("differentials")}
            rows={3}
            className={inputClass(!!errors.differentials)}
            placeholder="O que destaca sua empresa dos concorrentes"
          />
        </Field>

        <SectionLabel>Anexos</SectionLabel>
        <Field
          label="Mídia Kit ou Portfólio (PDF)"
          error={errors.media?.message as string | undefined}
        >
          <input
            type="file"
            multiple
            accept={ACCEPTED_SUPPLIER_MEDIA_EXTENSIONS}
            {...register("media")}
            className={fileInputClass(!!errors.media)}
          />
          <p className="mt-1 text-xs text-foreground/50">
            Imagens, PDF, PPTX ou compactado (ZIP/RAR), até {MAX_SUPPLIER_MEDIA_SIZE_MB}MB
            cada, no máximo {MAX_SUPPLIER_MEDIA_FILES} arquivos.
          </p>
        </Field>
      </div>

      <p className="text-xs text-foreground/50">
        Ao enviar, você concorda que os dados e anexos sejam usados pela EBM Quintto
        exclusivamente para fins de relacionamento comercial. Eles não são compartilhados com
        terceiros e podem ser removidos mediante solicitação.
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-brand px-4 py-3.5 text-base font-semibold text-ink shadow-lg shadow-brand/25 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-xl hover:shadow-brand/30 active:translate-y-0 active:scale-[0.98] active:shadow-md disabled:cursor-not-allowed disabled:translate-y-0 disabled:scale-100 disabled:opacity-60 disabled:shadow-none"
      >
        {isSubmitting ? "Enviando..." : "Enviar cadastro"}
      </button>
    </form>
  );
}
