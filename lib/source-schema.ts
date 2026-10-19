// Explicit allowlist: never request names, emails, contacts, photos or free text.
export const SOURCE_COLUMNS = [
  { key: 'submission', column: 'A', header: 'Submission ID' },
  { key: 'type', column: 'G', header: 'Observation Type' },
  { key: 'date', column: 'H', header: 'Observation Date' },
  { key: 'business', column: 'T', header: 'How would you describe business recently compared with about three months ago?' },
  { key: 'restocks', column: 'V', header: 'Does this business use goods or materials that need restocking?' },
  { key: 'restock', column: 'Y', header: 'Compared with three months ago, how would you describe your restocking costs?' },
  { key: 'payments', column: 'AC', header: 'Which receives the largest share of customer payments?' },
  { key: 'records', column: 'AG', header: 'How do you keep track of sales/business records?' },
  { key: 'credit', column: 'AK', header: 'During the last 12 months, has the business borrowed money or received goods on credit to operate?' },
  { key: 'remote', column: 'AN', header: 'Can customers place orders remotely?' },
  { key: 'canonical', column: 'BJ', header: 'ERI Canonical Merchant ID (provisional)' },
  { key: 'identity', column: 'BL', header: 'ERI Identity QA Status' },
  { key: 'source', column: 'BM', header: 'ERI Source Row / Submission ID' },
] as const;

export type SourceTable = { headers: string[]; rows: string[][] };
export const MIN_RESPONSES = 10;
export const SOURCE_COHORT = {
  id: 'yaba-lagos', country: 'Nigeria', region: 'Lagos', cluster: 'Yaba · Sabo · Tejuosho',
};

export function tableFromColumns(columns: { values?: unknown[][] }[]): SourceTable {
  if (columns.length !== SOURCE_COLUMNS.length) throw new Error('Incomplete source schema');
  const length = Math.max(...columns.map(c => c.values?.length ?? 0));
  return {
    headers: columns.map(c => String(c.values?.[0]?.[0] ?? '')),
    rows: Array.from({ length: Math.max(0, length - 1) }, (_, i) =>
      columns.map(c => String(c.values?.[i + 1]?.[0] ?? ''))),
  };
}
