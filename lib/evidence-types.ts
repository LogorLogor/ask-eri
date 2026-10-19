export type Metric = { value: string; label: string };
export type Signal = {
  id: string;
  question: string;
  title: string;
  answer: string;
  metrics: Metric[];
  context: string;
  limitations: string;
  denominator: number;
  excludedResponses: number;
  observed?: { count: number; denominator: number };
};

export type FieldQuality = {
  valid: number;
  missing: number;
  unknown: number;
  ambiguous: number;
  notApplicable: number;
};

export type Distribution = FieldQuality & { counts: Record<string, number> };
export type Analysis = {
  analyzedAt: string;
  period: { start: string; end: string };
  quality: {
    sourceRows: number;
    includedRows: number;
    heldRows: number;
    duplicateRows: number;
    invalidRows: number;
    pilotRows: number;
    revisitRows: number;
    provisionalIdentityRows: number;
    identityReviewRows: number;
  };
  distributions: Record<'payments' | 'records' | 'business' | 'restock' | 'credit' | 'remote', Distribution>;
  collection: { date: string; observations: number }[];
};

export type Evidence = {
  version: string;
  analyzedAt: string;
  collection: { date: string; observations: number }[];
  period: { start: string; end: string; label: string };
  quality: Analysis['quality'];
  fields: Record<string, FieldQuality>;
  signals: Signal[];
  coverage: {
    id: string;
    country: string;
    region: string;
    cluster: string;
    publishedRecords: number;
    period: string;
  }[];
};

export type EvidenceResponse = {
  evidence: Evidence;
  connection: {
    mode: 'live' | 'snapshot' | 'stale';
    checkedAt: string | null;
    refreshSeconds: number;
    message: string;
  };
};
