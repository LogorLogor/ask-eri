import snapshot from '../data/evidence-snapshot.json' with { type: 'json' };
import type { Evidence, Signal } from './evidence-types.ts';
export type { Signal } from './evidence-types.ts';
export const defaultEvidence = snapshot as Evidence;
export const signals = defaultEvidence.signals;
export const coverage = defaultEvidence.coverage;
export const evidenceVersion = defaultEvidence.period.label;
// Conservative routing: only answer questions clearly covered by an approved signal.
// Never use substring matches (e.g. "pos" in "possible").
const normalize = (q: string) => q.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const has = (q: string, terms: string[]) => terms.some(t => new RegExp('(?:^|\\s)' + t.replace(/ /g, '\\s+') + '(?:$|\\s)').test(q));
const routes: { id: string; terms: string[] }[] = [
  { id: 'payments', terms: ['payment', 'payments', 'transfer', 'transfers', 'cash', 'pos', 'card'] },
  { id: 'records', terms: ['record', 'records', 'recordkeeping', 'bookkeeping', 'accounting', 'sales records'] },
  { id: 'business', terms: ['trading conditions', 'business conditions', 'business improving', 'business better', 'business worse'] },
  { id: 'restock', terms: ['restock', 'restocking', 'restocking costs', 'restocking expenditure', 'inventory costs'] },
  { id: 'credit', terms: ['credit', 'borrowing', 'borrow', 'borrowed', 'loan', 'loans'] },
  { id: 'remote', terms: ['remote orders', 'online orders', 'phone orders', 'whatsapp orders', 'delivery orders'] },
  { id: 'coverage', terms: ['coverage', 'where does eri', 'where is eri', 'where have you', 'which markets', 'which locations', 'sample size', 'how many merchants'] }
];
const unsupportedPlaces = ['kano', 'abuja', 'ibadan', 'port harcourt', 'enugu', 'kaduna', 'benin', 'owerri', 'accra', 'ghana', 'kenya', 'nairobi', 'africa'];
const unsupportedClaims = ['forecast', 'predict', 'prediction', 'profit', 'profits', 'revenue', 'turnover', 'margin', 'margins', 'market share', 'national', 'nationwide', 'representative', 'caused', 'causes', 'correlation', 'cross tab', 'crosstab', 'by gender', 'by age', 'year on year', 'longitudinal'];
export function answer(q: string, availableSignals: Signal[] = signals) {
  const text = normalize(q);
  if (!text || has(text, unsupportedPlaces) || has(text, unsupportedClaims)) return null;
  const matches = routes.filter(r => has(text, r.terms));
  // Ambiguous multi-topic questions need a properly reviewed cross-tabulation.
  if (matches.length !== 1) return null;
  return availableSignals.find(s => s.id === matches[0].id) || null;
}

export function answerFor(q: string, location: string, evidence: Evidence = defaultEvidence) {
  return (location === 'all' || evidence.coverage.some(c => c.id === location)) ? answer(q, evidence.signals) : null;
}
