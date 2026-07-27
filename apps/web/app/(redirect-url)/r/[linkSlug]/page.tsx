export default async function RedirectLink({
  params,
}: {
  params: Promise<{ linkSlug: string }>
}) {
  const { linkSlug } = await params

  return (
    <div>
      redirect page and use this slug for original link{" "}
      <span className="text-red-600">{linkSlug}</span>
    </div>
  )
}
