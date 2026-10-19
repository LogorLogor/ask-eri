# Repository change workflow

## Repositories and PR direction

- `origin`: our fork, `LogorLogor/ask-eri`.
- `upstream`: the parent, `Malokunlabs/ask-eri`.
- Final PR head: **`LogorLogor:main`**.
- Final PR base: **`Malokunlabs/ask-eri:main`**.
- Working branches must be integrated into the fork's `main` before opening the parent PR. Do not open the parent PR directly from a working branch.

## Fetch, pull, integrate, test, then push

1. Read this file and applicable `AGENTS.md` instructions. Verify remote URLs, working-tree status, branch history, and existing PRs. Preserve unrelated work; never discard edits to synchronize branches.
2. Before starting work, fetch both remotes (`git fetch origin --prune` and `git fetch upstream --prune`). Repeat before integration and every push. If a fetch fails, stop publishing and report that freshness could not be verified.
3. Switch to local `main` with a clean working tree. Pull the fork's latest `main` with `git pull --ff-only origin main`. If histories have diverged, inspect and explicitly merge the intended remote history; do not reset or force-push to bypass the divergence.
4. Integrate the fetched parent `main` into local `main` with `git merge upstream/main`. This fast-forwards when possible and preserves existing fork commits when a merge is needed. Do not use an implicit rebase or rewrite shared history.
5. Resolve conflicts locally before proceeding. Review both sides, preserve intended parent behavior, and rerun relevant checks. Ask for clarification when the correct resolution is ambiguous. Never push unresolved conflicts or blindly choose one side.
6. Start focused working branches from this synchronized `main`. For an existing working branch, integrate the refreshed `main` and review its full diff before continuing.
7. Freshness checks reduce avoidable conflicts but cannot guarantee that the parent will not change later. Re-fetch and repeat integration and checks whenever either remote advances.

## Confirm, test, and commit each change

1. Keep each change focused on one intended outcome within the agreed task scope.
2. Confirm it meets the requested behavior by reviewing the actual diff and running relevant available checks.
3. For application changes, run relevant tests and the production build when available. For documentation-only changes, review accuracy and formatting and run `git diff --check`.
4. Fix failures caused by the change before treating it as confirmed and tested. Record unavailable checks or unrelated failures explicitly; never claim a check passed when it did not run.
5. Create a separate commit for every confirmed and tested change, with a clear message describing its purpose. Do not combine unrelated changes into a single end-of-task commit.
6. Stage only intended files. Never commit secrets, generated dependencies, temporary files, or unrelated edits.
7. Repeat for each additional change. Task authorization covers routine commits and integration into the fork; ask only when intent or scope is unclear.

## Complete the work through fork main

1. Fetch both remotes again, pull the fork's `main`, and integrate the latest parent `main` using the sequence above.
2. Merge each working branch created for the task into local `main`, after reviewing its contents. Integrate only completed, intended work; do not merge unrelated or unfinished branches.
3. Resolve any conflicts and run the relevant checks on the combined `main` result. Previously passing branch checks do not establish that a new conflict resolution is correct.
4. Review `git diff upstream/main...main` and the outgoing commits. Confirm only intended changes remain, no unresolved conflicts exist, and `git merge-base --is-ancestor upstream/main main` succeeds.
5. Fetch again immediately before pushing. If either remote advanced, integrate it and repeat affected checks. Push local `main` to the fork with `git push origin main`. Never force-push or push directly to the parent. If the push is rejected, fetch and inspect before retrying.
6. Recheck the parent `main` after pushing and before creating or updating the PR. If it advanced, repeat synchronization, testing, and the fork push.
7. Check for an existing PR from `LogorLogor:main` to parent `main`. Update it if present; otherwise open one in `Malokunlabs/ask-eri` with **head `LogorLogor:main` and base `main` explicitly set**.
8. Describe the problem, resulting behavior, included changes, checks, and limitations. Report blockers honestly and do not mark unverified work ready for review.
9. Verify the PR's source and target and report its URL and check results. Leave the parent PR open for review; do not merge it without a separate user request. This restriction does not prohibit the required working-branch merges into the fork's `main`.
10. If the parent advances while the PR is open, repeat the same fetch, pull, integrate, test, and push process when continuing work on that PR.

If no new changes remain relative to parent `main`, report the empty diff and any PR that already delivered the work. Do not manufacture a commit or duplicate PR.
