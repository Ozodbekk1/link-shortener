import { RedirectPage } from "@/components/redirect/redirect-page"

export default async function RedirectLink({
  params,
}: {
  params: Promise<{ linkSlug: string }>
}) {
  const { linkSlug } = await params

  return <RedirectPage slug={linkSlug} />
}
