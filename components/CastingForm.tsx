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
  ACCEPTED_CASTING_PHOTO_EXTENSIONS,
  ACCEPTED_CASTING_PHOTO_MIME_TYPES,
  BRAZILIAN_STATE_NAMES,
  CASTING_AGE_RANGE_OPTIONS,
  CASTING_DAILY_RATE_OPTIONS,
  CASTING_DRIVER_LICENSE_OPTIONS,
  MAX_CASTING_PHOTOS,
  MAX_CASTING_PHOTO_SIZE_BYTES,
  MAX_CASTING_PHOTO_SIZE_MB,
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

const castingSchema = z
  .object({
    fullName: z.string().trim().min(1, "Informe o nome completo"),
    birthDate: z.string().min(1, "Informe a data de nascimento"),
    city: z.string().trim().min(1, "Informe a cidade"),
    neighborhood: z.string().trim(),
    state: z.string().min(1, "Selecione o estado"),
    email: z.string().trim(),
    phone: z.string().trim(),
    profession: z.string().trim(),
    instagram: z.string().trim(),
    tiktok: z.string().trim(),
    driverLicenseCategory: z.string(),
    ageRange: z.string(),
    hasPriorExperience: z.enum(["", "sim", "nao"]),
    speaksToCamera: z.enum(["", "sim", "nao"]),
    recordsDuringWeek: z.enum(["", "sim", "nao"]),
    availableHours: z.string().trim(),
    hasEquipment: z.enum(["", "sim", "nao"]),
    equipmentDetails: z.string().trim(),
    socialProgram: z.string().trim(),
    videoLink: z.string().trim(),
    dailyRateValue: z.string(),
    experienceReport: z.string().trim(),
    photos: fileListOrUndefined(),
  })
  .superRefine((values, ctx) => {
    if (!values.hasPriorExperience) {
      ctx.addIssue({
        code: "custom",
        path: ["hasPriorExperience"],
        message: "Selecione uma opção",
      });
    }
    if (!values.speaksToCamera) {
      ctx.addIssue({
        code: "custom",
        path: ["speaksToCamera"],
        message: "Selecione uma opção",
      });
    }
    if (!values.recordsDuringWeek) {
      ctx.addIssue({
        code: "custom",
        path: ["recordsDuringWeek"],
        message: "Selecione uma opção",
      });
    }
    if (!values.hasEquipment) {
      ctx.addIssue({
        code: "custom",
        path: ["hasEquipment"],
        message: "Selecione uma opção",
      });
    }
    if (!values.photos || values.photos.length === 0) {
      ctx.addIssue({ code: "custom", path: ["photos"], message: "Anexe pelo menos uma foto" });
    }
    if (values.photos && values.photos.length > MAX_CASTING_PHOTOS) {
      ctx.addIssue({
        code: "custom",
        path: ["photos"],
        message: `Envie no máximo ${MAX_CASTING_PHOTOS} fotos`,
      });
    }
    if (values.photos) {
      for (const file of Array.from(values.photos)) {
        if (
          !ACCEPTED_CASTING_PHOTO_MIME_TYPES.includes(
            file.type as (typeof ACCEPTED_CASTING_PHOTO_MIME_TYPES)[number],
          )
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["photos"],
            message: "Envie apenas imagens (JPG/PNG/WEBP/GIF)",
          });
          break;
        }
        if (file.size > MAX_CASTING_PHOTO_SIZE_BYTES) {
          ctx.addIssue({
            code: "custom",
            path: ["photos"],
            message: `Cada foto deve ter até ${MAX_CASTING_PHOTO_SIZE_MB}MB`,
          });
          break;
        }
      }
    }
  });

type CastingFormValues = z.infer<typeof castingSchema>;

export default function CastingForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CastingFormValues>({
    resolver: zodResolver(castingSchema),
    defaultValues: {
      fullName: "",
      birthDate: "",
      city: "",
      neighborhood: "",
      state: "",
      email: "",
      phone: "",
      profession: "",
      instagram: "",
      tiktok: "",
      driverLicenseCategory: "",
      ageRange: "",
      hasPriorExperience: "",
      speaksToCamera: "",
      recordsDuringWeek: "",
      availableHours: "",
      hasEquipment: "",
      equipmentDetails: "",
      socialProgram: "",
      videoLink: "",
      dailyRateValue: "",
      experienceReport: "",
    },
  });

  async function onSubmit(values: CastingFormValues) {
    setServerError(null);
    try {
      const formData = new FormData();
      formData.append("fullName", values.fullName);
      formData.append("birthDate", values.birthDate);
      formData.append("city", values.city);
      if (values.neighborhood) formData.append("neighborhood", values.neighborhood);
      formData.append("state", values.state);
      if (values.email) formData.append("email", values.email);
      if (values.phone) formData.append("phone", values.phone);
      formData.append("area", "Casting");
      if (values.driverLicenseCategory)
        formData.append("driverLicenseCategory", values.driverLicenseCategory);
      if (values.ageRange) formData.append("ageRange", values.ageRange);
      if (values.dailyRateValue) formData.append("dailyRateValue", values.dailyRateValue);
      if (values.profession) formData.append("profession", values.profession);
      if (values.instagram) formData.append("instagram", values.instagram);
      if (values.tiktok) formData.append("tiktok", values.tiktok);
      if (values.availableHours) formData.append("availableHours", values.availableHours);
      if (values.socialProgram) formData.append("socialProgram", values.socialProgram);
      if (values.videoLink) formData.append("videoLink", values.videoLink);
      if (values.experienceReport)
        formData.append("experienceReport", values.experienceReport);
      const hasEquipment = toBoolOrUndefined(values.hasEquipment);
      if (hasEquipment !== undefined) formData.append("hasEquipment", String(hasEquipment));
      if (values.equipmentDetails)
        formData.append("equipmentDetails", values.equipmentDetails);
      const recordsDuringWeek = toBoolOrUndefined(values.recordsDuringWeek);
      if (recordsDuringWeek !== undefined)
        formData.append("recordsDuringWeek", String(recordsDuringWeek));
      const hasPriorExperience = toBoolOrUndefined(values.hasPriorExperience);
      if (hasPriorExperience !== undefined)
        formData.append("hasPriorExperience", String(hasPriorExperience));
      const speaksToCamera = toBoolOrUndefined(values.speaksToCamera);
      if (speaksToCamera !== undefined)
        formData.append("speaksToCamera", String(speaksToCamera));
      if (values.photos) {
        Array.from(values.photos).forEach((file) => formData.append("photos", file));
      }
      await api.post("/casting-profiles", formData);
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
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-medium text-foreground">
          Recebemos seu cadastro para Casting com sucesso.
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-foreground/60">
          Agradecemos pelo seu interesse em fazer parte da EBMQUINTTO COMUNICAÇÃO.
        </p>
        <p className="mx-auto mt-3 max-w-sm text-sm text-foreground/60">
          Vamos analisar seu perfil e entrar em contato caso surja uma oportunidade
          compatível. Boa sorte! 🚀
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
          Cadastro para Casting
        </h2>
        <div className="mt-6 border-t border-line" />
      </div>

      {serverError && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/40 p-4 text-sm text-red-300">
          {serverError}
        </div>
      )}

      <div className="rounded-2xl border border-brand/30 bg-brand-soft/60 p-6 sm:p-7">
        <p className="text-base font-medium text-foreground sm:text-lg">
          Quer aparecer no digital dos nossos clientes e mostrar seu potencial diante das
          câmeras?
        </p>
        <ul className="mt-5 space-y-4">
          <li className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-base"
              aria-hidden="true"
            >
              🎬
            </span>
            <span className="text-sm text-foreground/80">
              Não precisa ter experiência — basta gostar de se comunicar!
            </span>
          </li>
          <li className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-base"
              aria-hidden="true"
            >
              💡
            </span>
            <span className="text-sm text-foreground/80">
              Necessário ter 1 ou 2 turnos livres por semana e autorizar o uso da sua imagem.
            </span>
          </li>
          <li className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-base"
              aria-hidden="true"
            >
              💰
            </span>
            <span className="text-sm text-foreground/80">
              Cachê pela diária (informado durante o contato).
            </span>
          </li>
        </ul>
      </div>

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

          <Field label="E-mail" error={errors.email?.message}>
            <input
              type="email"
              {...register("email")}
              className={inputClass(!!errors.email)}
              placeholder="seuemail@exemplo.com"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Field label="Telefone" error={errors.phone?.message}>
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
              {BRAZILIAN_STATE_NAMES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <SectionLabel>Perfil para casting</SectionLabel>
        <Field label="Profissão" error={errors.profession?.message}>
          <input
            type="text"
            {...register("profession")}
            className={inputClass(!!errors.profession)}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Instagram" error={errors.instagram?.message}>
            <input
              type="text"
              {...register("instagram")}
              className={inputClass(!!errors.instagram)}
              placeholder="@seuusuario"
            />
          </Field>
          <Field label="TikTok" error={errors.tiktok?.message}>
            <input
              type="text"
              {...register("tiktok")}
              className={inputClass(!!errors.tiktok)}
              placeholder="@seuusuario"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="CNH" error={errors.driverLicenseCategory?.message}>
            <select
              {...register("driverLicenseCategory")}
              className={inputClass(!!errors.driverLicenseCategory)}
            >
              <option value="">Selecione</option>
              {CASTING_DRIVER_LICENSE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Faixa etária" error={errors.ageRange?.message}>
            <select {...register("ageRange")} className={inputClass(!!errors.ageRange)}>
              <option value="">Selecione</option>
              {CASTING_AGE_RANGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <BoolField
            label="Já gravou antes?"
            required
            error={errors.hasPriorExperience?.message}
            {...register("hasPriorExperience")}
          />
          <BoolField
            label="Fala bem em frente à câmera?"
            required
            error={errors.speaksToCamera?.message}
            {...register("speaksToCamera")}
          />
          <BoolField
            label="Grava fim de semana?"
            required
            error={errors.recordsDuringWeek?.message}
            {...register("recordsDuringWeek")}
          />
          <BoolField
            label="Tem equipamento próprio?"
            required
            error={errors.hasEquipment?.message}
            {...register("hasEquipment")}
          />
        </div>

        <Field
          label="Se sim, quais equipamentos você possui?"
          error={errors.equipmentDetails?.message}
        >
          <textarea
            {...register("equipmentDetails")}
            rows={2}
            className={inputClass(!!errors.equipmentDetails)}
          />
        </Field>

        <Field label="Horários disponíveis" error={errors.availableHours?.message}>
          <input
            type="text"
            {...register("availableHours")}
            className={inputClass(!!errors.availableHours)}
            placeholder="Ex: manhãs e fins de semana"
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Recebe algum benefício de programa social?"
            error={errors.socialProgram?.message}
          >
            <input
              type="text"
              {...register("socialProgram")}
              className={inputClass(!!errors.socialProgram)}
            />
          </Field>
          <Field label="Valor da diária" error={errors.dailyRateValue?.message}>
            <select
              {...register("dailyRateValue")}
              className={inputClass(!!errors.dailyRateValue)}
            >
              <option value="">Selecione</option>
              {CASTING_DAILY_RATE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Link de vídeo de apresentação (opcional)" error={errors.videoLink?.message}>
          <input
            type="text"
            {...register("videoLink")}
            className={inputClass(!!errors.videoLink)}
            placeholder="https://..."
          />
          <p className="mt-1 text-xs text-foreground/50">
            Se preferir, mande um vídeo rápido se apresentando.
          </p>
        </Field>

        <Field label="Relato de experiência" error={errors.experienceReport?.message}>
          <textarea
            {...register("experienceReport")}
            rows={3}
            className={inputClass(!!errors.experienceReport)}
            placeholder="Conte rapidamente sua experiência com casting/figuração"
          />
        </Field>

        <SectionLabel>Anexos</SectionLabel>
        <Field label="Fotos" required error={errors.photos?.message as string | undefined}>
          <input
            type="file"
            multiple
            accept={ACCEPTED_CASTING_PHOTO_EXTENSIONS}
            {...register("photos")}
            className={fileInputClass(!!errors.photos)}
          />
          <p className="mt-1 text-xs text-foreground/50">
            Imagens, até {MAX_CASTING_PHOTO_SIZE_MB}MB cada, no máximo {MAX_CASTING_PHOTOS}{" "}
            fotos.
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
        className="w-full rounded-xl bg-brand px-4 py-3.5 text-base font-semibold text-ink shadow-lg shadow-brand/25 transition hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-xl hover:shadow-brand/30 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
      >
        {isSubmitting ? "Enviando..." : "Enviar cadastro"}
      </button>
    </form>
  );
}
