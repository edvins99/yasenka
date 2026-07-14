# CODEX TASK 002 — ReplyQuest Beta 0.3: Post Understanding + Real AI Replies

## Goal

Replace all static/local reply templates with real AI-generated replies grounded in the exact X post where the user clicked **ReplyQuest**.

The feature is complete only when a tester can click ReplyQuest on posts about unrelated topics (crypto, AI, sport, politics, business, humor) and the generated replies clearly refer to the actual post content.

## Product rule

> ReplyQuest must understand the post before it writes the reply.

ReplyQuest is human-in-the-loop. It may generate, copy, or insert a draft. It must never click X's final Reply/Post button and must never like, follow, repost, delete, or perform any other account action.

## Scope

Work only inside `replyquest/` on branch `replyquest-foundation`.

Do not modify the original forked application outside `replyquest/`.

## Required behavior

### 1. Select the exact post

When the user clicks the inline **✨ ReplyQuest** button:

- keep a direct reference to the containing `article[data-testid="tweet"]`;
- extract the full visible text from that exact article;
- extract the author handle and display name when available;
- extract the canonical status URL / post ID when available;
- do not use the first visible post or any unrelated post on the timeline;
- if no usable text is found, show a clear error and do not generate generic replies.

Create a pure, testable function similar to:

```js
extractPostContext(article) => {
  text,
  authorHandle,
  authorName,
  postUrl,
  postId,
  quotedText,
  quotedAuthor
}
```

Quoted-post context is optional when unavailable, but should be included when safely detectable inside the selected article.

### 2. AI provider architecture

Add a background service worker and a provider abstraction. Content scripts must not call the external AI API directly.

Initial provider: OpenAI-compatible HTTPS endpoint.

Suggested files:

```text
replyquest/
  background.js
  providers/
    openai.js
  prompts/
    replyPrompt.js
```

Add the minimum manifest permissions required for the chosen endpoint. Keep host permissions narrow.

Store configuration in `chrome.storage.local`:

```js
{
  provider: "openai",
  apiKey: "...",
  model: "..."
}
```

Never log, render, or commit the API key. Never place a key in source code.

If no key is configured, show an actionable message such as: **“Add your AI API key in ReplyQuest settings.”**

### 3. Settings UI

Add a minimal extension popup or settings view containing:

- provider selector (OpenAI only is acceptable for this task, but keep the data shape extensible);
- API key input with password masking;
- model input/select;
- Save button;
- Test connection button with a clear success/error result.

No analytics and no remote storage.

### 4. Prompt and structured result

The model must first analyze the post and then generate replies. Use one API call with structured JSON output when supported.

Send the exact post context and selected mode.

Required modes:

- `support`
- `value`
- `question`
- `hype`
- `funny`

Require a result equivalent to:

```json
{
  "analysis": {
    "topic": "string",
    "author_intent": "string",
    "key_points": ["string"],
    "confidence": 0.0
  },
  "replies": [
    "string",
    "string",
    "string"
  ]
}
```

Prompt requirements:

- answer only using information supported by the post;
- do not invent facts, names, dates, motives, or project claims;
- each reply must be directly relevant to a concrete point in the post;
- avoid generic filler such as “Great update”, “Exciting times”, and “Looking forward” unless the post genuinely supports it;
- keep replies natural and suitable for X;
- produce three meaningfully different replies, not paraphrases;
- selected mode controls tone, not factual content;
- if the post is ambiguous or confidence is low, prefer a careful question instead of pretending certainty;
- do not include hashtags or emojis unless appropriate to the selected mode and context;
- return only the requested structured data.

### 5. Quality gate

Before displaying a reply, perform local validation:

- exactly three non-empty replies;
- reasonable X length (target <= 240 characters each for this beta);
- no duplicate or near-identical replies;
- no replies equal to known generic fallback phrases;
- analysis topic must be non-empty;
- if confidence is below a defined threshold (for example 0.55), show a visible low-confidence note.

If validation fails, retry once with a correction prompt. If the retry fails, show an error; never substitute static generic templates.

### 6. UI

Keep the current inline ReplyQuest button and modal.

After generation, show:

- detected topic;
- optional low-confidence warning;
- three generated replies;
- Copy;
- Insert into reply.

Add clear loading and error states. Disable Generate while a request is active.

Do not expose internal chain-of-thought. The `analysis` object is a short classification/summary only.

### 7. Insert behavior

Insert must:

- open the native reply composer for the selected post;
- place the chosen text in the native editor;
- dispatch the input events X needs;
- leave the final Reply/Post button untouched;
- fail visibly instead of silently inserting into the wrong composer.

### 8. Privacy and safety

- Send only the selected post context needed for generation.
- Do not scan or upload the full timeline.
- Do not send cookies, tokens, DMs, unrelated page text, or account data.
- Add a small UI note that selected post text is sent to the configured AI provider.
- No automatic posting or engagement actions.

## Remove from the current alpha

- Remove campaign-specific static templates.
- Remove topic keyword templates used as fake AI replies.
- Remove any generic fallback that can be shown as if it were AI output.
- Do not add campaigns, queues, avatars, XP, games, automatic searching, or monitoring in this task.

## Tests

Add unit tests for pure functions where practical:

- extraction of post text/author/status URL from representative DOM fixtures;
- structured AI response parsing;
- duplicate detection;
- length and generic-filler validation;
- low-confidence handling.

Manual acceptance test on X must cover at least:

1. crypto/DeFi post;
2. AI/technology post;
3. sports/news post;
4. opinion or humorous post;
5. post containing a quoted post;
6. post with no usable text (must show an error, not generic replies).

## Acceptance criteria

The task is done only when all are true:

- clicking ReplyQuest always binds to the exact clicked post;
- the full selected post text is sent to the configured AI provider;
- no static reply template is used;
- three context-specific replies are returned and displayed;
- replies are recognizably about the selected post;
- Copy works;
- Insert targets the correct native composer;
- ReplyQuest never submits the reply;
- missing key, API errors, malformed responses, and extraction failures have clear UI errors;
- API secrets are not committed or logged;
- install/test instructions are updated.

## Deliverables

- working Beta 0.3 extension under `replyquest/`;
- updated `manifest.json`;
- background service worker and provider module;
- settings UI;
- updated content script and modal UI;
- tests;
- `replyquest/TESTING_BETA_0_3.md` with exact installation and test steps;
- concise summary of changed files and any known limitations.
