"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Check, Loader2 } from "lucide-react"
import { BLOCKED_DOMAINS } from "@/common/constants/reversed-subdomains"
import { ComicText } from "@/components/ui/comic-text"
import TargetCursor from "@/components/TargetCursor"
import { useTranslation } from "@/hooks/use-translation"
import { useLocale } from "@/hooks/use-locale"
import { useCreateOrganizationMutation } from "@/hooks/use-organizations"
import { useAuth } from "@/common/providers/auth-provider"
import { AuthGuard } from "@/components/auth/auth-guard"
import {
  resolvePostAuthRedirect,
  executeRedirect,
} from "@/lib/auth/post-auth-redirect"
import { toast } from "sonner"

export default function CreateOrganization() {
  const { mutateAsync, isPending, isError, error } =
    useCreateOrganizationMutation()
  const { refetchUser } = useAuth()
  const { t } = useTranslation()
  const locale = useLocale()

  const createOrgSchema = z.object({
    name: z.string().min(2, t("onboarding.organization.errors.nameMin")),
    slug: z
      .string()
      .min(3, t("onboarding.organization.errors.slugMin"))
      .regex(/^[a-z0-9-]+$/, t("onboarding.organization.errors.slugRegex"))
      .refine((slug) => !BLOCKED_DOMAINS.includes(slug.toLowerCase()), {
        message: t("onboarding.organization.errors.slugReserved"),
      }),
  })

  type CreateOrgFormValues = z.infer<typeof createOrgSchema>
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateOrgFormValues>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  })

  const currentSlug = watch("slug")

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setValue("name", value)
    const generatedSlug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
    setValue("slug", generatedSlug, { shouldValidate: true })
  }

  const onSubmit = async (data: CreateOrgFormValues) => {
    try {
      await mutateAsync(data)

      toast.success("Organization created successfully!")

      const updatedProfile = await refetchUser()

      if (updatedProfile?.user) {
        const redirectTarget = resolvePostAuthRedirect(
          updatedProfile.user,
          locale
        )
        executeRedirect(redirectTarget)
      } else {
        const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "uurl.uz"
        const protocol = window.location.protocol
        window.location.replace(
          `${protocol}//${data.slug}.${rootDomain}/${locale}/dashboard`
        )
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create organization"
      )
    }
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen w-full flex-col justify-between bg-gradient-to-br from-pink-50 via-purple-50/30 to-indigo-50/40 p-4 font-sans text-slate-800 md:p-8">
        <TargetCursor
          spinDuration={2}
          hideDefaultCursor
          parallaxOn
          hoverDuration={0.2}
          cursorColor="#ffffff"
          cursorColorOnTarget="#B497CF"
        />
        <main className="mx-auto my-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 py-12 lg:grid-cols-12">
          <div className="space-y-6 pr-0 lg:col-span-6 lg:pr-6">
            <h1 className="cursor-target text-4xl leading-[1.15] font-extrabold tracking-tight text-slate-900 md:text-5xl">
              <ComicText fontSize={2}>
                {t("onboarding.organization.title")}
              </ComicText>
            </h1>

            <p className="cursor-target max-w-md text-base leading-relaxed text-slate-500 md:text-lg">
              {t("onboarding.organization.subtitle")}
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-white bg-white/90 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-md md:p-10">
              <div className="mb-6 flex items-center justify-center gap-3 py-6">
                <div className="cursor-target flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-500 shadow-sm">
                  <Plus className="h-5 w-5 stroke-[2.5]" />
                </div>
                <div className="w-12 border-t-2 border-dashed border-rose-200"></div>
                <div className="cursor-target flex h-12 w-12 items-center justify-center rounded-xl border-2 border-rose-300 bg-rose-50 text-rose-500 shadow-sm">
                  <Check className="h-6 w-6 stroke-[2.5]" />
                </div>
                <div className="w-12 border-t-2 border-dashed border-rose-200"></div>
                <div className="cursor-target flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-400 shadow-sm">
                  <Check className="h-5 w-5 stroke-[2.5]" />
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    {t("onboarding.organization.nameLabel")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("onboarding.organization.namePlaceholder")}
                    {...register("name")}
                    onChange={handleNameChange}
                    className="cursor-target w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                  {errors.name && (
                    <p className="text-xs font-medium text-rose-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    {t("onboarding.organization.slugLabel")}{" "}
                    <span className="text-green-600">
                      {t("onboarding.organization.slugEditHint")}
                    </span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder={t("onboarding.organization.slugPlaceholder")}
                      {...register("slug")}
                      className="cursor-target w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-20 pl-4 text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    />
                    <span className="pointer-events-none absolute right-4 text-sm font-semibold text-slate-400 select-none">
                      {t("onboarding.organization.slugSuffix")}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-500">
                    {t("onboarding.organization.availableAt")}{" "}
                    <span className="font-semibold text-rose-500">
                      {currentSlug
                        ? `${currentSlug}.uurl.uz`
                        : `${t("onboarding.organization.slugPlaceholder")}.uurl.uz`}
                    </span>
                  </p>

                  {errors.slug && (
                    <p className="text-xs font-medium text-rose-500">
                      {errors.slug.message}
                    </p>
                  )}

                  {isError && (
                    <p className="text-sm text-red-500">
                      {(error as Error).message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="cursor-target mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-rose-400 px-4 py-3.5 font-bold text-white shadow-md transition-all duration-200 hover:bg-rose-500 active:scale-[0.99] disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>
                        {t("onboarding.organization.submittingButton")}
                      </span>
                    </>
                  ) : (
                    <span>{t("onboarding.organization.submitButton")}</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
