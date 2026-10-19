import { createEvidenceService } from '../../../lib/evidence-service';
import { loadGoogleSource, sourceConfigured } from '../../../lib/google-source';
import snapshot from '../../../data/evidence-snapshot.json';
import type { Evidence } from '../../../lib/evidence-types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const getEvidence = createEvidenceService({
  snapshot: snapshot as Evidence,
  configured: sourceConfigured,
  load: loadGoogleSource,
});

export async function GET() {
  return Response.json(await getEvidence(), {
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
  });
}
