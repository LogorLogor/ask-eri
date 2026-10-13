# Ask ERI V0

Standalone Next.js 15 application styled to complement useeri.com. Public curated evidence only; no access to merchant-level raw data.

## Local run
`npm install && npm run dev`

## Vercel deployment
Import this folder into a Vercel project (framework Next.js). For a separate project, attach `ask.useeri.com` after verifying the domain is available in the owner's Vercel team. Alternatively, integrate the `app` and `lib` code into the existing website under `/ask` (move the page to `app/ask/page.tsx`, scope styles appropriately, and merge metadata).

## Editorial updates
Evidence is defined in `lib/evidence.ts`. Counts are frozen to the 89 production observations of Oct 7–11, 2026. Update only after QA approval; retain observation dates, denominators and limitations. Original 10 pilot records are described separately. No live source sheet or private merchant records are used by this application.

## V0 scope
- Natural-language keyword matching over six approved answers
- Evidence counts, context and limitations
- Honest refusal for out-of-scope questions
- Responsive UI with ERI's burnt-orange/serif visual language

## Before public launch
- Verify each metric against signed-off dataset
- Obtain editorial/legal approval for published findings
- Add privacy policy and analytics with consent as appropriate
- Confirm accessible brand treatment and QA across browsers
- Integrate question-demand capture only after privacy and rate limiting are designed
- Set up CI and source control in the owner's actual Vercel team

No LLM API key is needed. No visitor questions are persisted by this V0.


## Multi-location readiness
`lib/evidence.ts` contains a `coverage` registry. Add a location only after its approved aggregate findings are available. All public answers must be scoped to a source cohort; do not reuse Lagos results for a new city. Current V0 contains one active market cluster and no cross-market comparisons.
