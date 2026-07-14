# ReplyQuest Alpha 0.2 — testing

## Install

1. Open the `replyquest-foundation` branch on GitHub.
2. Download the repository ZIP and extract it.
3. Open `chrome://extensions` in Chrome.
4. Enable **Developer mode**.
5. Click **Load unpacked**.
6. Select the extracted `replyquest` folder.
7. Open or refresh `https://x.com`.

## Test flow

1. Scroll the X timeline.
2. Find the **✨ ReplyQuest** button under a post.
3. Click it.
4. Choose one mode: Support, Add value, Ask question, Hype, or Funny.
5. Click **Generate 3 drafts**.
6. Test **Copy**.
7. Test **Insert into reply**.
8. Review the text and press X's Post/Reply button yourself.

## Alpha limitations

- Drafts are currently generated locally from context-aware templates, not an external AI model.
- X can change its HTML selectors; report any missing button or failed insertion.
- ReplyQuest never clicks the final Post/Reply button.

## Feedback to collect

- Does the button appear in a convenient place?
- Does the modal feel too large or too small?
- Which reply modes are useful?
- Did Insert work reliably?
- Were the local drafts relevant enough to validate the workflow?
