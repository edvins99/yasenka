# CODEX TASK 001 — Build the usable ReplyQuest MVP

## Objective

Upgrade the existing clean-room `replyquest/` prototype into a reliable Chrome Manifest V3 assistant for preparing replies on X.com.

Read first:

- `replyquest/docs/REPLYQUEST_SPEC.md`
- `replyquest/docs/DESIGN_PRINCIPLES.md`
- `replyquest/docs/TODO.md`

## Constraints

- Work only inside `replyquest/`.
- Do not modify or reuse original Yasenka source files outside that directory.
- Support X.com only.
- Never automate Send or any account action.
- Do not commit API keys, tokens, cookies, or personal data.
- Prefer plain JavaScript/CSS already used by the prototype unless a build system is clearly necessary.

## Required implementation

### 1. Post detection

Create a centralized X adapter that extracts from visible timeline articles:

- author handle;
- post ID;
- canonical post URL;
- visible text.

Ignore malformed entries and deduplicate by post ID. Keep selectors centralized because X markup changes frequently.

### 2. Campaign configuration

Store editable campaign groups in `chrome.storage.local`, seeded with the accounts listed in the specification. Normalize handles by trimming whitespace, removing `@`, and comparing lowercase values.

### 3. Panel workflow

The floating panel must show:

- campaign selector;
- matching visible posts;
- selected-post preview;
- Quick, Natural, and Insight controls;
- three draft cards;
- Copy, Insert, Regenerate, Skip, and Mark done controls;
- completed-today count;
- clear loading, empty, and error states.

### 4. Draft generation boundary

Implement a provider abstraction. A deterministic local fallback may be used for development, but it must generate three distinct contextual drafts and be clearly labelled as local/demo mode. External provider integration must be isolated behind the abstraction and must require explicit user configuration.

Prompts must:

- use the selected post text and campaign context;
- avoid fabricated facts;
- avoid repetitive generic hype;
- match the selected reply mode;
- return drafts only, without explanation.

### 5. Safe composer insertion

The Insert action may open the native X reply composer and place the chosen text into its textbox. It must never locate or click the Send/Reply button. The user must review and publish manually.

### 6. Local history

Persist:

- completed post IDs and timestamps;
- recent generated drafts;
- campaign settings;
- daily completed counter.

Prune old history to prevent unbounded storage growth.

### 7. Tests and documentation

Add unit tests for:

- handle normalization;
- campaign matching;
- post-ID deduplication;
- recent-draft duplicate detection;
- daily counter reset.

Update the ReplyQuest README with installation, testing, safety behavior, and known X DOM limitations.

## Acceptance criteria

- Loading `replyquest/` as an unpacked extension works without console-breaking errors.
- On X.com, matching visible posts from configured accounts appear in the panel.
- Selecting a post and tone produces three distinct drafts.
- Copy works.
- Insert fills the native composer but does not send.
- Mark done survives page refresh and prevents repeated work.
- No code performs automated likes, follows, reposts, bookmarks, or publishing.
- Changes remain isolated to `replyquest/`.

## Delivery

Commit the implementation to `replyquest-foundation` or a child feature branch and summarize:

1. files changed;
2. tests run;
3. manual test results;
4. known limitations;
5. exact next recommended task.