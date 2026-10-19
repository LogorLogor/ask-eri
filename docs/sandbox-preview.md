# Sandbox placement review

This is a local concept for distributors and their field teams: explore an order-size or purchasing-budget trade-off, then identify what ERI should verify on a return visit.

- Open the development site at `http://127.0.0.1:3000/#what-if`.
- The section sits after Method and before the footer.
- `app/page.tsx` mounts it only when `NODE_ENV` is `development`. Production builds omit the section. Removing that gate is a separate publication decision.
- Nothing reads or changes the evidence engine. The evidence button uses the existing supported restocking question.
- All stalls are fictional. No merchant records, response probabilities, demand elasticities or forecasts are used.
- Budget and unit cost are scenario inputs. Unit costs are rounded to kobo; quantities are rounded down to whole units. Cash needed for the original order accounts for any unused starting budget. Delivery fees and other costs are excluded.
- The three selected responses change the trade-off and field question; they are choices supplied by the visitor, not estimated behaviour.
- At a zero cost increase, the preview explains the baseline without inventing a shock response.
- The calculations have regression coverage for zero and maximum shocks, fractional currency, unused budget, insufficient budget and invalid inputs.

Review the placement, wording and interaction locally before deciding whether to publish it. This review adds no dependencies, backend, persistence or production activation.
