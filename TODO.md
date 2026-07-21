# TODO: Customize Links Module - Auth & Workspace Context

## Steps

- [x] Step 1: Plan approved
- [x] Step 2: Update `links.controller.ts` — Split into two controllers (workspace-scoped CRUD + public slug lookup)
- [x] Step 3: Update `create-link.dto.ts` — Remove `workspaceId` field
- [x] Step 4: Update `links.service.ts` — Use `workspaceId` param directly instead of `dto.workspaceId`
- [x] Step 5: Update `links.module.ts` — Register both controllers
- [x] Step 6: Plan for analytics routes approved
- [x] Step 7: Add analytics methods to `links.service.ts` (overview, realtime, countries, devices, link-analytics)
- [x] Step 8: Add analytics routes to `links.controller.ts` in `WorkspaceLinksController`
