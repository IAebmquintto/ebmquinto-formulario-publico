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
  ACCEPTED_RESUME_EXTENSIONS,
  ACCEPTED_RESUME_MIME_TYPES,
  DESIRED_POSITION_OPTIONS,
  EXPERIENCE_TIME_OPTIONS,
  MAX_RESUME_SIZE_BYTES,
  MAX_RESUME_SIZE_MB,
  UF_OPTIONS,
} from "@/lib/constants";

const fileListOrUndefined = () =>
  z
    .custom<FileList>(
      (val) =>
        val === undefined ||
        (typeof FileList !== "undefined" && val instanceof FileList),
    )
    .optional();

const curriculoSchema = z
  .object({
    fullName: z.string().trim().min(1, "Informe o nome completo"),
    birthDate: z.string().min(1, "Informe a data de nascimento"),
    email: z.string().trim(),
    phone: z.string().trim(),
    city: z.string().trim().min(1, "Informe a cidade"),
    neighborhood: z.string().trim(),
    state: z.string().min(1, "Selecione o estado"),
    desiredPosition: z.string().min(1, "Selecione a área de interesse"),
    experienceTime: z.string().min(1, "Selecione uma opção"),
    portfolioUrl: z.string().trim(),
    currentOccupation: z.string().trim(),
    currentRoutine: z.string().trim().min(1, "Conte um pouco sobre sua rotina atual"),
    resume: fileListOrUndefined(),
  })
  .superRefine((values, ctx) => {
    if (!values.email.trim() || !z.string().email().safeParse(values.email).success) {
      ctx.addIssue({ code: "custom", path: ["email"], message: "E-mail inválido" });
    }
    if (values.phone.trim().length < 8) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Informe um telefone válido com DDD",
      });
    }
    if (!values.resume || values.resume.length !== 1) {
      ctx.addIssue({ code: "custom", path: ["resume"], message: "Anexe o seu currículo" });
    } else {
      const file = values.resume[0];
      if (
        !ACCEPTED_RESUME_MIME_TYPES.includes(
          file.type as (typeof ACCEPTED_RESUME_MIME_TYPES)[number],
        )
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["resume"],
          message: "Envie um arquivo PDF ou Word (.doc/.docx)",
        });
      } else if (file.size > MAX_RESUME_SIZE_BYTES) {
        ctx.addIssue({
          code: "custom",
          path: ["resume"],
          message: `O arquivo deve ter até ${MAX_RESUME_SIZE_MB}MB`,
        });
      }
    }
  });

type CurriculoFormValues = z.infer<typeof curriculoSchema>;

export default function CurriculoForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CurriculoFormValues>({
    resolver: zodResolver(curriculoSchema),
    defaultValues: {
      fullName: "",
      birthDate: "",
      email: "",
      phone: "",
      city: "",
      neighborhood: "",
      state: "",
      desiredPosition: "",
      experienceTime: "",
      portfolioUrl: "",
      currentOccupation: "",
      currentRoutine: "",
    },
  });

  async function onSubmit(values: CurriculoFormValues) {
    setServerError(null);
    try {
      const formData = new FormData();
      formData.append("fullName", values.fullName);
      formData.append("birthDate", values.birthDate);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("city", values.city);
      if (values.neighborhood) formData.append("neighborhood", values.neighborhood);
      formData.append("state", values.state);
      formData.append("desiredPosition", values.desiredPosition);
      formData.append("experienceTime", values.experienceTime);
      if (values.portfolioUrl) formData.append("portfolioUrl", values.portfolioUrl);
      if (values.currentOccupation)
        formData.append("currentOccupation", values.currentOccupation);
      formData.append("currentRoutine", values.currentRoutine);
      formData.append("resume", values.resume![0]);
      await api.post("/candidates", formData);
      setSubmitted(true);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        const { message } = err.response.data;
        setServerError(Array.isArray(message) ? message.join(", ") : message);
      } else {
        setServerError("Não foi possível enviar sua candidatura. Tente novamente em instantes.");
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
          Recebemos seu currículo com sucesso.
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-foreground/60">
          Agradecemos pelo seu interesse em fazer parte da EBMQUINTTO COMUNICAÇÃO.
        </p>
        <p className="mx-auto mt-3 max-w-sm text-sm text-foreground/60">
          Vamos analisar suas informações e, caso seu perfil seja compatível com as
          oportunidades disponíveis, entraremos em contato. Boa sorte! 🚀
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
          Envie seu currículo
        </h2>
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
          <Field label="Data de nascimento" required error={errors.birthDate?.message}>
            <input
              type="date"
              {...register("birthDate")}
              className={inputClass(!!errors.birthDate)}
            />
          </Field>

          <Field label="E-mail" required error={errors.email?.message}>
            <input
              type="email"
              {...register("email")}
              className={inputClass(!!errors.email)}
              placeholder="seuemail@exemplo.com"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Field label="Telefone" required error={errors.phone?.message}>
            <input
              type="text"
              {...register("phone")}
              className={inputClass(!!errors.phone)}
              placeholder="(00) 00000-0000"
            />
          </Field>

          <Field label="Cidade (onde reside)" required error={errors.city?.message}>
            <input
              type="text"
              {...register("city")}
              className={inputClass(!!errors.city)}
              placeholder="Sua cidade"
            />
          </Field>

          <Field label="Bairro" error={errors.neighborhood?.message}>
            <input
              type="text"
              {...register("neighborhood")}
              className={inputClass(!!errors.neighborhood)}
              placeholder="Seu bairro"
            />
          </Field>

          <Field label="Estado (onde reside)" required error={errors.state?.message}>
            <select {...register("state")} className={inputClass(!!errors.state)}>
              <option value="">Selecione</option>
              {UF_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <SectionLabel>Área de interesse</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Qual a área de interesse?"
            required
            error={errors.desiredPosition?.message}
          >
            <select
              {...register("desiredPosition")}
              className={`${inputClass(!!errors.desiredPosition)} uppercase`}
            >
              <option value="">Selecione</option>
              {DESIRED_POSITION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>

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
        </div>

        <SectionLabel>Sobre você</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Caso possua um link para portfólio, LinkedIn, site pessoal, insira aqui"
            error={errors.portfolioUrl?.message}
            labelClassName="block min-h-10"
          >
            <input
              type="text"
              {...register("portfolioUrl")}
              className={inputClass(!!errors.portfolioUrl)}
              placeholder="https://linkedin.com/in/seuusuario"
            />
          </Field>

          <Field
            label="Onde estuda ou trabalha atualmente?"
            error={errors.currentOccupation?.message}
            labelClassName="block min-h-10"
          >
            <input
              type="text"
              {...register("currentOccupation")}
              className={inputClass(!!errors.currentOccupation)}
              placeholder="Empresa, instituição ou 'não estou trabalhando/estudando'"
            />
          </Field>
        </div>

        <Field
          label="Fale um pouco sobre sua rotina de trabalho/estudo atual"
          required
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
          label="Currículo (PDF ou DOC)"
          required
          error={errors.resume?.message as string | undefined}
        >
          <input
            type="file"
            accept={ACCEPTED_RESUME_EXTENSIONS}
            {...register("resume")}
            className={fileInputClass(!!errors.resume)}
          />
          <p className="mt-1 text-xs text-foreground/50">
            PDF ou Word (.doc/.docx), até {MAX_RESUME_SIZE_MB}MB.
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
        {isSubmitting ? "Enviando..." : "Enviar candidatura"}
      </button>
    </form>
  );
}
