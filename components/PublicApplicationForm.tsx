"use client";

import { useMemo, useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import api from "@/lib/api";
import BrandLogo from "@/components/BrandLogo";
import {
  routeDesiredPosition,
  type ApplicationDestination,
} from "@/lib/desired-position-routing";
import {
  ACCEPTED_CASTING_PHOTO_EXTENSIONS,
  ACCEPTED_CASTING_PHOTO_MIME_TYPES,
  ACCEPTED_CONTENT_PRODUCER_RESUME_EXTENSIONS,
  ACCEPTED_CONTENT_PRODUCER_RESUME_MIME_TYPES,
  ACCEPTED_RESUME_EXTENSIONS,
  ACCEPTED_RESUME_MIME_TYPES,
  BRAZILIAN_STATE_NAMES,
  CASTING_AGE_RANGE_OPTIONS,
  CASTING_DAILY_RATE_OPTIONS,
  CASTING_DRIVER_LICENSE_OPTIONS,
  DESIRED_POSITION_OPTIONS,
  EXPERIENCE_TIME_OPTIONS,
  MAX_CASTING_PHOTOS,
  MAX_CASTING_PHOTO_SIZE_BYTES,
  MAX_CASTING_PHOTO_SIZE_MB,
  MAX_RESUME_SIZE_BYTES,
  MAX_RESUME_SIZE_MB,
  UF_OPTIONS,
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

/**
 * Um único schema cobrindo os 3 destinos possíveis (Candidatos/Casting/Produção
 * de Conteúdo). A validação condicional (o que é obrigatório em cada destino)
 * acontece no `superRefine`, com base em `routeDesiredPosition(desiredPosition)`
 * — não em três resolvers separados, porque o destino só é conhecido depois que
 * o usuário escolhe a área de interesse.
 */
const applicationSchema = z
  .object({
    fullName: z.string().trim().min(1, "Informe o nome completo"),
    birthDate: z.string().min(1, "Informe a data de nascimento"),
    email: z.string().trim(),
    phone: z.string().trim(),
    city: z.string().trim().min(1, "Informe a cidade"),
    state: z.string().min(1, "Selecione o estado"),
    desiredPosition: z.string().min(1, "Selecione a área de interesse"),
    experienceTime: z.string(),
    portfolioUrl: z.string().trim(),
    currentOccupation: z.string().trim(),
    currentRoutine: z.string().trim(),
    resume: fileListOrUndefined(),

    // Casting
    neighborhood: z.string().trim(),
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

    // Produção de Conteúdo
    coverageArea: z.string().trim(),
    eventRate: z.string().trim(),
    equipment: z.string().trim(),
    doesLiveCoverage: z.enum(["", "sim", "nao"]),
    deliversEdited: z.enum(["", "sim", "nao"]),
    capturesAndEdits: z.enum(["", "sim", "nao"]),
  })
  .superRefine((values, ctx) => {
    const destination = routeDesiredPosition(values.desiredPosition);

    if (destination === "candidate") {
      if (!values.email.trim() || !z.string().email().safeParse(values.email).success) {
        ctx.addIssue({
          code: "custom",
          path: ["email"],
          message: "E-mail inválido",
        });
      }
      if (values.phone.trim().length < 8) {
        ctx.addIssue({
          code: "custom",
          path: ["phone"],
          message: "Informe um telefone válido com DDD",
        });
      }
      if (!values.experienceTime) {
        ctx.addIssue({
          code: "custom",
          path: ["experienceTime"],
          message: "Selecione uma opção",
        });
      }
      if (
        values.portfolioUrl &&
        !z.string().url().safeParse(values.portfolioUrl).success
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["portfolioUrl"],
          message: "Link inválido",
        });
      }
      if (!values.currentRoutine.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["currentRoutine"],
          message: "Conte um pouco sobre sua rotina atual",
        });
      }
      if (!values.resume || values.resume.length !== 1) {
        ctx.addIssue({
          code: "custom",
          path: ["resume"],
          message: "Anexe o seu currículo",
        });
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
    }

    if (destination === "casting") {
      if (!values.photos || values.photos.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["photos"],
          message: "Anexe pelo menos uma foto",
        });
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
    }

    if (destination === "content-producer") {
      if (!values.experienceTime) {
        ctx.addIssue({
          code: "custom",
          path: ["experienceTime"],
          message: "Selecione uma opção",
        });
      }
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
    }
  });

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export default function PublicApplicationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: "",
      birthDate: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      desiredPosition: "",
      experienceTime: "",
      portfolioUrl: "",
      currentOccupation: "",
      currentRoutine: "",
      neighborhood: "",
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
      coverageArea: "",
      eventRate: "",
      equipment: "",
      doesLiveCoverage: "",
      deliversEdited: "",
      capturesAndEdits: "",
    },
  });

  const desiredPosition = watch("desiredPosition");
  const destination = useMemo(
    () => routeDesiredPosition(desiredPosition || ""),
    [desiredPosition],
  );

  async function onSubmit(values: ApplicationFormValues) {
    setServerError(null);

    try {
      if (destination === "candidate") {
        const formData = new FormData();
        formData.append("fullName", values.fullName);
        formData.append("birthDate", values.birthDate);
        formData.append("email", values.email);
        formData.append("phone", values.phone);
        formData.append("city", values.city);
        formData.append("state", values.state);
        formData.append("desiredPosition", values.desiredPosition);
        formData.append("experienceTime", values.experienceTime);
        if (values.portfolioUrl) formData.append("portfolioUrl", values.portfolioUrl);
        if (values.currentOccupation)
          formData.append("currentOccupation", values.currentOccupation);
        formData.append("currentRoutine", values.currentRoutine);
        formData.append("resume", values.resume![0]);
        await api.post("/candidates", formData);
      } else if (destination === "casting") {
        const formData = new FormData();
        formData.append("fullName", values.fullName);
        formData.append("birthDate", values.birthDate);
        formData.append("city", values.city);
        if (values.neighborhood) formData.append("neighborhood", values.neighborhood);
        formData.append("state", values.state);
        if (values.email) formData.append("email", values.email);
        if (values.phone) formData.append("phone", values.phone);
        formData.append("area", values.desiredPosition);
        if (values.driverLicenseCategory)
          formData.append("driverLicenseCategory", values.driverLicenseCategory);
        if (values.ageRange) formData.append("ageRange", values.ageRange);
        if (values.dailyRateValue) formData.append("dailyRateValue", values.dailyRateValue);
        if (values.profession) formData.append("profession", values.profession);
        if (values.instagram) formData.append("instagram", values.instagram);
        if (values.tiktok) formData.append("tiktok", values.tiktok);
        if (values.availableHours)
          formData.append("availableHours", values.availableHours);
        if (values.socialProgram)
          formData.append("socialProgram", values.socialProgram);
        if (values.videoLink) formData.append("videoLink", values.videoLink);
        if (values.experienceReport)
          formData.append("experienceReport", values.experienceReport);
        const hasEquipment = toBoolOrUndefined(values.hasEquipment);
        if (hasEquipment !== undefined)
          formData.append("hasEquipment", String(hasEquipment));
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
          Array.from(values.photos).forEach((file) =>
            formData.append("photos", file),
          );
        }
        await api.post("/casting-profiles", formData);
      } else {
        const formData = new FormData();
        formData.append("fullName", values.fullName);
        formData.append("state", values.state);
        formData.append("city", values.city);
        formData.append("area", values.desiredPosition);
        formData.append("experienceTime", values.experienceTime);
        if (values.email) formData.append("email", values.email);
        if (values.phone) formData.append("phone", values.phone);
        if (values.portfolioUrl) formData.append("portfolioUrl", values.portfolioUrl);
        if (values.currentOccupation)
          formData.append("currentOccupation", values.currentOccupation);
        if (values.currentRoutine)
          formData.append("currentRoutine", values.currentRoutine);
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
          Array.from(values.resume).forEach((file) =>
            formData.append("resume", file),
          );
        }
        await api.post("/content-producers", formData);
      }
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
      <div className="animate-rise-in relative mx-auto max-w-xl rounded-3xl border border-line bg-white p-10 text-center shadow-xl shadow-ink/5 sm:p-14">
        <BrandLogo />
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
          Candidatura enviada com sucesso!
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-foreground/60">
          Obrigado por se candidatar na EBM Quintto. Vamos analisar seu perfil e entrar em
          contato caso avance para as próximas etapas.
        </p>
      </div>
    );
  }

  const stateOptions = destination === "candidate" ? UF_OPTIONS : BRAZILIAN_STATE_NAMES;
  const destinationLabel =
    desiredPosition && destination !== "casting"
      ? DESTINATION_LABELS[destination]
      : null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="animate-rise-in relative mx-auto max-w-3xl space-y-8 rounded-3xl border border-line bg-white p-6 shadow-xl shadow-ink/5 sm:p-12"
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand-dark">
            Formulário de candidatura
          </p>
          {destinationLabel && (
            <span className="rounded-full bg-brand-soft px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-brand-dark">
              {destinationLabel}
            </span>
          )}
        </div>
        <h2 className="mt-3 font-display text-2xl font-medium text-foreground sm:text-3xl">
          Conte pra gente sobre você
        </h2>
        <div className="mt-6 border-t border-line" />
      </div>

      {serverError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
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

          <Field
            label="E-mail"
            required={destination === "candidate"}
            error={errors.email?.message}
          >
            <input
              type="email"
              {...register("email")}
              className={inputClass(!!errors.email)}
              placeholder="seuemail@exemplo.com"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field
            label="Telefone (DDD + número)"
            required={destination === "candidate"}
            error={errors.phone?.message}
          >
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

          <Field label="Estado (onde reside)" required error={errors.state?.message}>
            <select {...register("state")} className={inputClass(!!errors.state)}>
              <option value="">Selecione</option>
              {stateOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <SectionLabel>Área de interesse</SectionLabel>
        <Field
          label="Qual a área de interesse?"
          required
          error={errors.desiredPosition?.message}
        >
          <select
            {...register("desiredPosition")}
            className={inputClass(!!errors.desiredPosition)}
          >
            <option value="">Selecione</option>
            {DESIRED_POSITION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        {destination !== "casting" && (
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
        )}

        {destination === "casting" && (
          <>
            <div className="rounded-2xl border border-brand/30 bg-brand-soft/60 p-5 sm:p-6">
              <span className="inline-block rounded-full bg-white px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-brand-dark">
                Cadastro de Casting
              </span>
              <p className="mt-3 text-sm text-foreground/80">
                Quer aparecer no digital dos nossos clientes e mostrar seu potencial diante
                das câmeras?
              </p>
              <ul className="mt-4 space-y-2 text-sm text-foreground/80">
                <li className="flex gap-2">
                  <span aria-hidden="true">🎬</span>
                  <span>Não precisa ter experiência — basta gostar de se comunicar!</span>
                </li>
                <li className="flex gap-2">
                  <span aria-hidden="true">💡</span>
                  <span>
                    Necessário ter 1 ou 2 turnos livres por semana e autorizar o uso da sua
                    imagem.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span aria-hidden="true">💰</span>
                  <span>Cachê pela diária (informado durante o contato).</span>
                </li>
              </ul>
            </div>

            <SectionLabel>Perfil para casting</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Bairro" error={errors.neighborhood?.message}>
                <input
                  type="text"
                  {...register("neighborhood")}
                  className={inputClass(!!errors.neighborhood)}
                />
              </Field>
              <Field label="Profissão" error={errors.profession?.message}>
                <input
                  type="text"
                  {...register("profession")}
                  className={inputClass(!!errors.profession)}
                />
              </Field>
            </div>

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
                <select
                  {...register("ageRange")}
                  className={inputClass(!!errors.ageRange)}
                >
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
              <BoolField label="Já gravou antes?" {...register("hasPriorExperience")} />
              <BoolField label="Fala bem em frente à câmera?" {...register("speaksToCamera")} />
              <BoolField label="Grava fim de semana?" {...register("recordsDuringWeek")} />
              <BoolField label="Tem equipamento próprio?" {...register("hasEquipment")} />
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

            <Field
              label="Link de vídeo de apresentação"
              error={errors.videoLink?.message}
            >
              <input
                type="text"
                {...register("videoLink")}
                className={inputClass(!!errors.videoLink)}
                placeholder="https://..."
              />
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
            <Field
              label="Fotos"
              required
              error={errors.photos?.message as string | undefined}
            >
              <input
                type="file"
                multiple
                accept={ACCEPTED_CASTING_PHOTO_EXTENSIONS}
                {...register("photos")}
                className={fileInputClass(!!errors.photos)}
              />
              <p className="mt-1 text-xs text-foreground/50">
                Imagens, até {MAX_CASTING_PHOTO_SIZE_MB}MB cada, no máximo{" "}
                {MAX_CASTING_PHOTOS} fotos.
              </p>
            </Field>
          </>
        )}

        {destination === "content-producer" && (
          <>
            <SectionLabel>Detalhes de produção de conteúdo</SectionLabel>
            <Field label="Área que cobre" error={errors.coverageArea?.message}>
              <input
                type="text"
                {...register("coverageArea")}
                className={inputClass(!!errors.coverageArea)}
                placeholder="Ex: Ceará todo, disponível para viagens"
              />
            </Field>

            <Field label="Valor por cobertura" error={errors.eventRate?.message}>
              <input
                type="text"
                {...register("eventRate")}
                className={inputClass(!!errors.eventRate)}
                placeholder="Ex: R$ 500 por evento"
              />
            </Field>

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
          </>
        )}

        {destination !== "casting" && <SectionLabel>Sobre você</SectionLabel>}

        {destination !== "casting" && (
          <Field
            label="Caso possua um link para portfólio, LinkedIn, site pessoal, insira aqui"
            error={errors.portfolioUrl?.message}
          >
            <input
              type="text"
              {...register("portfolioUrl")}
              className={inputClass(!!errors.portfolioUrl)}
              placeholder="https://linkedin.com/in/seuusuario"
            />
          </Field>
        )}

        {destination !== "casting" && (
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
        )}

        {destination !== "casting" && (
          <Field
            label="Fale um pouco sobre sua rotina de trabalho/estudo atual"
            required={destination === "candidate"}
            error={errors.currentRoutine?.message}
          >
            <textarea
              {...register("currentRoutine")}
              rows={4}
              className={inputClass(!!errors.currentRoutine)}
              placeholder="Descreva rapidamente sua rotina atual"
            />
          </Field>
        )}

        {destination === "candidate" && (
          <>
            <SectionLabel>Anexos</SectionLabel>
            <Field label="Currículo (PDF ou DOC)" required error={errors.resume?.message as string | undefined}>
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
          </>
        )}

        {destination === "content-producer" && (
          <>
            <SectionLabel>Anexos</SectionLabel>
            <Field label="Currículo/portfólio (opcional)" error={errors.resume?.message as string | undefined}>
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
          </>
        )}
      </div>

      <p className="text-xs text-foreground/50">
        Ao enviar, você concorda que seus dados e anexos sejam usados pela EBM Quintto
        exclusivamente para fins de recrutamento e seleção. Eles não são compartilhados com
        terceiros e podem ser removidos mediante solicitação.
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-brand px-4 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand/25 transition hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-xl hover:shadow-brand/30 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
      >
        {isSubmitting ? "Enviando..." : "Enviar candidatura"}
      </button>
    </form>
  );
}

const DESTINATION_LABELS: Record<
  Exclude<ApplicationDestination, "casting">,
  string
> = {
  candidate: "Currículo",
  "content-producer": "Produção de conteúdo",
};

function inputClass(hasError: boolean) {
  return [
    "mt-1.5 block w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-foreground shadow-sm transition focus:outline-none focus:ring-2 focus:ring-brand/25",
    hasError ? "border-red-400" : "border-line focus:border-brand/40",
  ].join(" ");
}

function fileInputClass(hasError: boolean) {
  return [
    "mt-1.5 block w-full cursor-pointer rounded-xl border bg-white px-3.5 py-2.5 text-sm text-foreground/80 shadow-sm transition file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-brand-soft file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-dark hover:file:bg-brand/20 focus:outline-none focus:ring-2 focus:ring-brand/25",
    hasError ? "border-red-400" : "border-line focus:border-brand/40",
  ].join(" ");
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="pt-2 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-brand-dark first:pt-0">
      {children}
    </p>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground/80">
        {label} {required && <span className="text-brand">*</span>}
      </span>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </label>
  );
}

function BoolField({
  label,
  name,
  onChange,
  onBlur,
  ref,
}: {
  label: string;
} & UseFormRegisterReturn) {
  return (
    <label className="block">
      <span className="block min-h-10 text-sm font-medium text-foreground/80">
        {label}
      </span>
      <select
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        ref={ref}
        defaultValue=""
        className="mt-1.5 block w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-foreground shadow-sm transition focus:border-brand/40 focus:outline-none focus:ring-2 focus:ring-brand/25"
      >
        <option value="">–</option>
        <option value="sim">Sim</option>
        <option value="nao">Não</option>
      </select>
    </label>
  );
}
