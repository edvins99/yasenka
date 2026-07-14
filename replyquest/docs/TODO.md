# ReplyQuest TODO

## Now — Sprint 1

- [ ] Audit the existing `replyquest/` prototype against the MVP specification.
- [ ] Restrict extension execution to `https://x.com/*`.
- [ ] Centralize X DOM selectors in one module.
- [ ] Extract visible post author, post ID, URL, and text reliably.
- [ ] Add editable campaign configuration with the initial account groups.
- [ ] Show only matching priority posts in the panel.
- [ ] Add post selection and preview.
- [ ] Add Quick, Natural, and Insight tone controls.
- [ ] Return three meaningfully different drafts.
- [ ] Add Copy, Insert, Regenerate, Skip, and Mark done actions.
- [ ] Ensure Insert opens/fills the native composer but never sends.
- [ ] Save completed post IDs in `chrome.storage.local`.
- [ ] Add recent-draft duplicate checks.
- [ ] Add clear empty, loading, and error states.
- [ ] Add a visible “manual send only” notice.
- [ ] Test on Yellow and Midnight posts.

## Documentation and quality

- [ ] Document local installation.
- [ ] Document AI-provider setup without committing secrets.
- [ ] Add unit tests for handle normalization, campaign matching, and duplicate checks.
- [ ] Add a manual test checklist for X DOM changes.
- [ ] Keep all ReplyQuest work isolated from the original Yasenka source.

## Not now

- [ ] No animations or avatar work.
- [ ] No XP or game systems.
- [ ] No automated sending, liking, following, reposting, or bookmarking.
- [ ] No engagement-score predictions.