"use client"

import { Download, Loader2, Palette, Plus, Save, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import type { QrCode, QrCodeStyleJson } from "@/api/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/tenant/page-header"
import { useTenantWorkspace } from "@/components/tenant/tenant-workspace-provider"
import { useLinksQuery } from "@/hooks/use-links"
import {
  useGenerateQrMutation,
  useQrCodesQuery,
  useUpdateQrMutation,
} from "@/hooks/use-qr"
import { qrService } from "@/services/qr.service"

export function QrPage() {
  const { workspace } = useTenantWorkspace()
  const workspaceId = workspace?.id ?? ""
  const [creating, setCreating] = useState(false)
  const [linkId, setLinkId] = useState("")
  const [style, setStyle] = useState<QrCodeStyleJson>({
    foregroundColor: "#000000",
    backgroundColor: "#ffffff",
    dotStyle: "square",
    cornerStyle: "square",
    margin: 2,
    size: 400,
  })
  const [editing, setEditing] = useState<QrCode | null>(null)
  const links = useLinksQuery(workspaceId, { limit: 100 })
  const qrCodes = useQrCodesQuery(workspaceId)
  const createQr = useGenerateQrMutation(workspaceId)
  const updateQr = useUpdateQrMutation(workspaceId)
  const codes = qrCodes.data?.data ?? qrCodes.data?.qrCodes ?? []
  const create = async () => {
    if (!linkId) return
    try {
      await createQr.mutateAsync({ linkId, ...style })
      setCreating(false)
      setLinkId("")
      toast.success("QR code generated")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not generate QR code"
      )
    }
  }
  const saveDesign = async () => {
    if (!editing) return
    try {
      await updateQr.mutateAsync({ qrId: editing.id, payload: style })
      setEditing(null)
      toast.success("QR code design updated")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update QR code"
      )
    }
  }
  return (
    <>
      <PageHeader
        title="QR codes"
        description="Turn any short link into a scannable QR code."
        actions={
          <Button onClick={() => setCreating((value) => !value)}>
            <Plus />
            Generate QR
          </Button>
        }
      />
      <main className="space-y-5 p-5 sm:p-8">
        {creating && (
          <Card>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <select
                aria-label="Select a link"
                value={linkId}
                onChange={(event) => setLinkId(event.target.value)}
                className="h-8 flex-1 rounded-lg border border-input bg-background px-2 text-sm"
              >
                <option value="">Choose a link</option>
                {links.data?.data?.map((link) => (
                  <option key={link.id} value={link.id}>
                    {link.title || link.shortSlug}
                  </option>
                ))}
              </select>
                <Button onClick={create} disabled={!linkId || createQr.isPending}>
                {createQr.isPending && <Loader2 className="animate-spin" />}
                Generate
              </Button>
              </div>
              <QrStyleEditor style={style} onChange={setStyle} />
            </CardContent>
          </Card>
        )}
        {editing && (
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">Redesign QR code</p>
                  <p className="text-sm text-muted-foreground">
                    Changes are saved as the QR code style JSON.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setEditing(null)}
                  aria-label="Close QR code editor"
                >
                  <X />
                </Button>
              </div>
              <QrStyleEditor style={style} onChange={setStyle} />
              <div className="flex justify-end">
                <Button onClick={saveDesign} disabled={updateQr.isPending}>
                  {updateQr.isPending ? <Loader2 className="animate-spin" /> : <Save />}
                  Save design
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {codes.map((qr) => (
            <Card key={qr.id}>
              <CardContent className="flex flex-col items-center gap-4 pt-1">
                <img
                  className="aspect-square w-full max-w-44 rounded-lg border bg-white p-2"
                  src={qrService.getQrImageUrl(workspaceId, qr.id)}
                  alt={`QR for ${qr.link?.shortSlug ?? "link"}`}
                />
                <div className="w-full">
                  <p className="truncate text-sm font-medium">
                    {qr.link?.title || `/${qr.link?.shortSlug ?? "link"}`}
                  </p>
                  <a
                    href={qrService.getQrDownloadUrl(workspaceId, qr.id)}
                    className="mt-3 inline-flex h-8 items-center gap-1 rounded-lg border px-2.5 text-sm hover:bg-muted"
                  >
                    <Download className="size-4" />
                    Download
                  </a>
                  <Button
                    className="mt-2 w-full"
                    variant="outline"
                    onClick={() => {
                      setEditing(qr)
                      setStyle(qr.styleJson)
                    }}
                  >
                    <Palette />
                    Redesign
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
        {!qrCodes.isLoading && !codes.length && (
          <Card>
            <CardContent>
              <p className="py-12 text-center text-sm text-muted-foreground">
                No QR codes yet. Generate one for any short link.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  )
}

function QrStyleEditor({
  style,
  onChange,
}: {
  style: QrCodeStyleJson
  onChange: (style: QrCodeStyleJson) => void
}) {
  const update = (patch: Partial<QrCodeStyleJson>) =>
    onChange({ ...style, ...patch })

  return (
    <div className="grid gap-3 rounded-lg border bg-muted/20 p-3 sm:grid-cols-2 lg:grid-cols-4">
      <StyleField label="Foreground">
        <input
          type="color"
          value={style.foregroundColor || "#000000"}
          onChange={(event) => update({ foregroundColor: event.target.value })}
          className="h-8 w-full cursor-pointer rounded border border-input bg-background p-1"
        />
      </StyleField>
      <StyleField label="Background">
        <input
          type="color"
          value={style.backgroundColor || "#ffffff"}
          onChange={(event) => update({ backgroundColor: event.target.value })}
          className="h-8 w-full cursor-pointer rounded border border-input bg-background p-1"
        />
      </StyleField>
      <StyleField label="Dots">
        <select
          value={style.dotStyle || "square"}
          onChange={(event) =>
            update({ dotStyle: event.target.value as QrCodeStyleJson["dotStyle"] })
          }
          className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
        >
          <option value="square">Square</option>
          <option value="dot">Dots</option>
          <option value="rounded">Rounded</option>
        </select>
      </StyleField>
      <StyleField label="Corners">
        <select
          value={style.cornerStyle || "square"}
          onChange={(event) =>
            update({ cornerStyle: event.target.value as QrCodeStyleJson["cornerStyle"] })
          }
          className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
        >
          <option value="square">Square</option>
          <option value="dot">Dots</option>
          <option value="rounded">Rounded</option>
        </select>
      </StyleField>
      <StyleField label="Size (px)">
        <input
          type="number"
          min="100"
          max="2000"
          value={style.size || 400}
          onChange={(event) => update({ size: Number(event.target.value) })}
          className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
        />
      </StyleField>
      <StyleField label="Margin">
        <input
          type="number"
          min="0"
          max="10"
          value={style.margin ?? 2}
          onChange={(event) => update({ margin: Number(event.target.value) })}
          className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
        />
      </StyleField>
      <StyleField label="Gradient start">
        <input
          type="color"
          value={style.gradientStart || "#000000"}
          onChange={(event) => update({ gradientStart: event.target.value })}
          className="h-8 w-full cursor-pointer rounded border border-input bg-background p-1"
        />
      </StyleField>
      <StyleField label="Gradient end">
        <input
          type="color"
          value={style.gradientEnd || "#000000"}
          onChange={(event) => update({ gradientEnd: event.target.value })}
          className="h-8 w-full cursor-pointer rounded border border-input bg-background p-1"
        />
      </StyleField>
      <StyleField label="Gradient direction">
        <select
          value={style.gradientDirection || "horizontal"}
          onChange={(event) =>
            update({
              gradientDirection: event.target
                .value as QrCodeStyleJson["gradientDirection"],
            })
          }
          className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
        >
          <option value="horizontal">Horizontal</option>
          <option value="vertical">Vertical</option>
          <option value="diagonal">Diagonal</option>
        </select>
      </StyleField>
      <StyleField label="Logo URL">
        <input
          type="url"
          value={style.logoUrl || ""}
          onChange={(event) => update({ logoUrl: event.target.value || undefined })}
          placeholder="https://example.com/logo.png"
          className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
        />
      </StyleField>
      <StyleField label="Logo size">
        <input
          type="number"
          min="0.05"
          max="0.5"
          step="0.05"
          value={style.logoSize ?? 0.2}
          onChange={(event) => update({ logoSize: Number(event.target.value) })}
          className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
        />
      </StyleField>
    </div>
  )
}

function StyleField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}
