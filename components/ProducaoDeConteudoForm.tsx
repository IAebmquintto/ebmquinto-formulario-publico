"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import api from "@/lib/api";
import BrandLogo from "@/components/BrandLogo";
import BackToChoices from "@/components/BackToChoices";
import {
  BoolField,
  Field,
  SectionLabel,
  fileInputClass,
  inputClass,
} from "@/components/form/fields";
import {
  ACCEPTED_CONTENT_PRODUCER_RESUME_EXTENSIONS,
  ACCEPTED_CONTENT_PRODUCER_RESUME_MIME_TYPES,
  BRAZILIAN_STATE_NAMES,
  EXPERIENCE_TIME_OPTIONS,
} from "@/lib/constants";

type BoolAnswer = "" | "sim" | "nao";

function toBoolOrUndefined(value: BoolAnswer): boolean | undefined {
  if (value === "sim") return true;
  if (value === "nao") return false;
  return undefined;
}

const fileListOrUndefined = () =>
  z
    .custom<FileList>(
      (val) =>
        val === undefined ||
        (typeof FileList !== "undefined" && val instanceof FileList),
    )
    .optional();

const producaoSchema = z
  .object({
    fullName: z.string().trim().min(1, "Informe o nome completo"),
    city: z.string().trim().min(1, "Informe a cidade"),
    state: z.string().min(1, "Selecione o estado"),
    experienceTime: z.string().min(1, "Selecione uma opção"),
    email: z.string().trim(),
    phone: z.string().trim(),
    portfolioUrl: z.string().trim(),
    currentOccupation: z.string().trim(),
    currentRoutine: z.string().trim(),
    coverageArea: z.string().trim(),
    eventRate: z.string().trim(),
    equipment: z.string().trim(),
    doesLiveCoverage: z.enum(["", "sim", "nao"]),
    deliversEdited: z.enum(["", "sim", "nao"]),
    capturesAndEdits: z.enum(["", "sim", "nao"]),
    resume: fileListOrUndefined(),
  })
  .superRefine((values, ctx) => {
    if (values.resume) {
      for (const file of Array.from(values.resume)) {
        if (
          !ACCEPTED_CONTENT_PRODUCER_RESUME_MIME_TYPES.includes(
            file.type as (typeof ACCEPTED_CONTENT_PRODUCER_RESUME_MIME_TYPES)[number],
          )
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["resume"],
            message: "Envie um PDF, Word (.doc/.docx), PPTX ou imagem (JPG/PNG)",
          });
          break;
        }
      }
    }
  });

type ProducaoFormValues = z.infer<typeof producaoSchema>;

export default function ProducaoDeConteudoForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProducaoFormValues>({
    resolver: zodResolver(producaoSchema),
    defaultValues: {
      fullName: "",
      city: "",
      state: "",
      experienceTime: "",
      email: "",
      phone: "",
      portfolioUrl: "",
      currentOccupation: "",
      currentRoutine: "",
      coverageArea: "",
      eventRate: "",
      equipment: "",
      doesLiveCoverage: "",
      deliversEdited: "",
      capturesAndEdits: "",
    },
  });

  async function onSubmit(values: ProducaoFormValues) {
    setServerError(null);
    try {
      const formData = new FormData();
      formData.append("fullName", values.fullName);
      formData.append("state", values.state);
      formData.append("city", values.city);
      formData.append("area", "PRODUÇÃO DE CONTEÚDO");
      formData.append("experienceTime", values.experienceTime);
      if (values.email) formData.append("email", values.email);
      if (values.phone) formData.append("phone", values.phone);
      if (values.portfolioUrl) formData.append("portfolioUrl", values.portfolioUrl);
      if (values.currentOccupation)
        formData.append("currentOccupation", values.currentOccupation);
      if (values.currentRoutine) formData.append("currentRoutine", values.currentRoutine);
      if (values.coverageArea) formData.append("coverageArea", values.coverageArea);
      if (values.eventRate) formData.append("eventRate", values.eventRate);
      if (values.equipment) formData.append("equipment", values.equipment);
      const doesLiveCoverage = toBoolOrUndefined(values.doesLiveCoverage);
      if (doesLiveCoverage !== undefined)
        formData.append("doesLiveCoverage", String(doesLiveCoverage));
      const deliversEdited = toBoolOrUndefined(values.deliversEdited);
      if (deliversEdited !== undefined)
        formData.append("deliversEdited", String(deliversEdited));
      const capturesAndEdits = toBoolOrUndefined(values.capturesAndEdits);
      if (capturesAndEdits !== undefined)
        formData.append("capturesAndEdits", String(capturesAndEdits));
      if (values.resume) {
        Array.from(values.resume).forEach((file) => formData.append("resume", file));
      }
      await api.post("/content-producers", formData);
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
          Candidatura enviada com sucesso!
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-foreground/60">
          Obrigado por se candidatar na EBM Quintto. Vamos analisar seu perfil e entrar em
          contato caso avance para as próximas etapas.
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
          Produção de Conteúdo
        </h2>
        <p className="mt-2 text-sm text-foreground/60">
          Capta, edita ou cobre eventos pra gente? Conte pra gente sobre seu trabalho.
        </p>
        <div className="mt-6 border-t border-line" />
      </div>

      {serverError && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/40 p-4 text-sm text-red-300">
          {serverError}
        </div>
      )}

      <div className="space-y-6">
        <SectionLabel>Dados pessoais</SectionLabel>
        <Field label="Nome completo" required error={errors.fullName?.message}>
          <input
            type="text"
            {...register("fullName")}
            className={inputClass(!!errors.fullName)}
            placeholder="Seu nome completo"
          />
        </Field>

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
              placeholder="seuemail@exemplo.com"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Cidade (onde reside)" required error={errors.city?.message}>
            <input
              type="text"
              {...register("city")}
              className={inputClass(!!errors.city)}
              placeholder="Sua cidade"
            />
          </Field>
          <Field label="Estado (onde reside)" required error={errors.state?.message}>
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

        <SectionLabel>Área de atuação</SectionLabel>
        <Field
          label="Há quanto tempo atua nesta área?"
          required
          error={errors.experienceTime?.message}
        >
          <select
            {...register("experienceTime")}
            className={inputClass(!!errors.experienceTime)}
          >
            <option value="">Selecione</option>
            {EXPERIENCE_TIME_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Área de cobertura" error={errors.coverageArea?.message}>
          <input
            type="text"
            {...register("coverageArea")}
            className={inputClass(!!errors.coverageArea)}
            placeholder="Ex: Ceará todo, disponível para viagens"
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Preços" error={errors.eventRate?.message}>
            <input
              type="text"
              {...register("eventRate")}
              className={inputClass(!!errors.eventRate)}
              placeholder="Ex: R$ 500 por evento"
            />
          </Field>
          <Field label="Link Portfólio/LinkedIn" error={errors.portfolioUrl?.message}>
            <input
              type="text"
              {...register("portfolioUrl")}
              className={inputClass(!!errors.portfolioUrl)}
              placeholder="https://..."
            />
          </Field>
        </div>

        <Field label="Equipamentos" error={errors.equipment?.message}>
          <textarea
            {...register("equipment")}
            rows={2}
            className={inputClass(!!errors.equipment)}
            placeholder="Ex: Sony A6400, gimbal, drone"
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <BoolField label="Faz cobertura ao vivo?" {...register("doesLiveCoverage")} />
          <BoolField label="Entrega editado?" {...register("deliversEdited")} />
          <BoolField label="Capta e edita?" {...register("capturesAndEdits")} />
        </div>

        <SectionLabel>Sobre você</SectionLabel>
        <Field
          label="Onde estuda ou trabalha atualmente?"
          error={errors.currentOccupation?.message}
        >
          <input
            type="text"
            {...register("currentOccupation")}
            className={inputClass(!!errors.currentOccupation)}
            placeholder="Empresa, instituição ou 'não estou trabalhando/estudando'"
          />
        </Field>

        <Field
          label="Fale um pouco sobre sua rotina de trabalho/estudo atual"
          error={errors.currentRoutine?.message}
        >
          <textarea
            {...register("currentRoutine")}
            rows={4}
            className={inputClass(!!errors.currentRoutine)}
            placeholder="Descreva rapidamente sua rotina atual"
          />
        </Field>

        <SectionLabel>Anexos</SectionLabel>
        <Field
          label="Apresentação ou currículo (opcional)"
          error={errors.resume?.message as string | undefined}
        >
          <input
            type="file"
            multiple
            accept={ACCEPTED_CONTENT_PRODUCER_RESUME_EXTENSIONS}
            {...register("resume")}
            className={fileInputClass(!!errors.resume)}
          />
          <p className="mt-1 text-xs text-foreground/50">
            PDF, Word (.doc/.docx), PPTX ou imagem (JPG/PNG).
          </p>
        </Field>
      </div>

      <p className="text-xs text-foreground/50">
        Ao enviar, você concorda que seus dados e anexos sejam usados pela EBM Quintto
        exclusivamente para fins de recrutamento e seleção. Eles não são compartilhados com
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
