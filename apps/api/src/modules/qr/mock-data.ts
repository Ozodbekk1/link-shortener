/**
 * QR Code Mock Data & API Test Examples
 *
 * This file provides mock data payloads for testing QR code generation
 * with various styling options. Use these with curl or Postman.
 *
 * Prerequisites:
 * 1. Have a valid JWT access token (from login/register)
 * 2. Have an existing link in a workspace (or the mock creates one)
 * 3. API running at http://localhost:3000
 */

// ─── Mock QR Generation Payloads ─────────────────────────────────

/** Basic QR — square modules, default colors */
export const basicQr = {
  linkId: 'REPLACE_WITH_LINK_ID', // Get from GET /:workspaceId/links
  // No style fields = default black on white square QR
};

/** Branded QR — custom colors, rounded modules */
export const brandedQr = {
  linkId: 'REPLACE_WITH_LINK_ID',
  foregroundColor: '#6366f1', // Indigo
  backgroundColor: '#ffffff',
  size: 500,
  margin: 2,
  dotStyle: 'rounded', // 'square' | 'dot' | 'rounded'
  cornerStyle: 'rounded', // 'square' | 'dot' | 'rounded'
};

/** Gradient QR — colorful gradient overlay */
export const gradientQr = {
  linkId: 'REPLACE_WITH_LINK_ID',
  foregroundColor: '#000000',
  backgroundColor: '#ffffff',
  size: 600,
  dotStyle: 'dot',
  cornerStyle: 'dot',
  gradientStart: '#ff6b6b', // Red
  gradientEnd: '#4ecdc4', // Teal
  gradientDirection: 'diagonal', // 'horizontal' | 'vertical' | 'diagonal'
};

/** Logo QR — with centered logo overlay */
export const logoQr = {
  linkId: 'REPLACE_WITH_LINK_ID',
  foregroundColor: '#1a1a2e',
  backgroundColor: '#ffffff',
  size: 800,
  margin: 4,
  dotStyle: 'rounded',
  cornerStyle: 'square',
  logoUrl: 'https://inks.uz/favicon.png', // Replace with your logo URL
  logoSize: 0.2, // 20% of QR size
};

/** Dark QR — dark mode style */
export const darkQr = {
  linkId: 'REPLACE_WITH_LINK_ID',
  foregroundColor: '#ffffff',
  backgroundColor: '#0f172a', // Slate 900
  size: 400,
  dotStyle: 'dot',
  cornerStyle: 'dot',
};

/** Full-featured QR — all options combined */
export const premiumQr = {
  linkId: 'REPLACE_WITH_LINK_ID',
  foregroundColor: '#111827',
  backgroundColor: '#fafafa',
  size: 1000,
  margin: 4,
  dotStyle: 'rounded',
  cornerStyle: 'rounded',
  logoUrl: 'https://inks.uz/logo.png',
  logoSize: 0.25,
  gradientStart: '#8b5cf6',
  gradientEnd: '#ec4899',
  gradientDirection: 'horizontal',
};

// ─── Curl Command Examples ──────────────────────────────────────

/**
 * 1. First, create a link to get a linkId:
 *
 * curl -X POST http://localhost:3000/api/v1/YOUR_WORKSPACE_ID/links \
 *   -H "Content-Type: application/json" \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 *   -d '{
 *     "originalUrl": "https://example.com/awesome-product",
 *     "title": "My Awesome Link",
 *     "tags": ["product", "launch"]
 *   }'
 *
 * 2. Generate a basic QR code:
 *
 * curl -X POST http://localhost:3000/api/v1/YOUR_WORKSPACE_ID/qr \
 *   -H "Content-Type: application/json" \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 *   -d '{
 *     "linkId": "REPLACE_WITH_LINK_ID",
 *     "foregroundColor": "#6366f1",
 *     "backgroundColor": "#ffffff",
 *     "size": 500,
 *     "dotStyle": "rounded",
 *     "cornerStyle": "rounded"
 *   }'
 *
 * 3. View QR image in browser:
 *    Open: http://localhost:3000/api/v1/YOUR_WORKSPACE_ID/qr/QR_ID/image
 *
 * 4. Download QR as PNG:
 *    Open: http://localhost:3000/api/v1/YOUR_WORKSPACE_ID/qr/QR_ID/download
 *
 * 5. Update QR style:
 *
 * curl -X PATCH http://localhost:3000/api/v1/YOUR_WORKSPACE_ID/qr/QR_ID \
 *   -H "Content-Type: application/json" \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 *   -d '{
 *     "dotStyle": "dot",
 *     "gradientStart": "#ff6b6b",
 *     "gradientEnd": "#4ecdc4",
 *     "gradientDirection": "diagonal"
 *   }'
 *
 * 6. List all QR codes in workspace:
 *
 * curl http://localhost:3000/api/v1/YOUR_WORKSPACE_ID/qr \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 *
 * 7. Delete a QR code:
 *
 * curl -X DELETE http://localhost:3000/api/v1/YOUR_WORKSPACE_ID/qr/QR_ID \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 */
