import 'server-only';
import { GoogleAuth } from 'google-auth-library';
import { SOURCE_COLUMNS, tableFromColumns } from './source-schema.ts';

const SHEET_ID = '110iYfoI0ejYI7FmLVY_QnMK0PnUQxMp6KEvVM4Zjjtc';
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly';
const ROOT = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}`;
const MAX_ROWS = 10_000;

export function sourceConfigured() {
  return Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);
}

let auth: GoogleAuth | undefined;
export async function loadGoogleSource() {
  if (!sourceConfigured()) throw new Error('Source not configured');
  auth ??= new GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    },
    scopes: [SCOPE],
  });
  const client = await auth.getClient();
  const metadata = await client.request<{
    sheets: { properties: { sheetId: number; title: string; gridProperties: { rowCount: number; columnCount: number } } }[];
  }>({ url: `${ROOT}?fields=sheets.properties`, timeout: 10_000, retry: false });
  // Resolve by immutable gid, not a guessed tab title. Reject growth beyond the
  // safety bound instead of silently truncating the cohort.
  const sheet = metadata.data.sheets.find(s => s.properties.sheetId === 0)?.properties;
  if (!sheet || sheet.gridProperties.rowCount > MAX_ROWS || sheet.gridProperties.columnCount < 65) throw new Error('Source bounds changed');
  const quotedTitle = `'${sheet.title.replace(/'/g, "''")}'`;
  const params = new URLSearchParams({ valueRenderOption: 'FORMATTED_VALUE', majorDimension: 'ROWS' });
  for (const { column } of SOURCE_COLUMNS) params.append('ranges', `${quotedTitle}!${column}1:${column}${sheet.gridProperties.rowCount}`);
  const response = await client.request<{ valueRanges: { values?: unknown[][] }[] }>({
    url: `${ROOT}/values:batchGet?${params}`, timeout: 10_000, retry: false,
  });
  return tableFromColumns(response.data.valueRanges);
}
