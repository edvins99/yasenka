# ReplyQuest

ReplyQuest is a clean-room Chrome extension prototype for turning repetitive X engagement work into a guided daily workflow.

## Current MVP

- Runs only on X/Twitter.
- Floating companion panel.
- Campaign modes: Yellow, Midnight, General.
- Reads the currently visible post text.
- Shows three reply suggestions.
- Copy button; the user reviews and sends manually.
- Daily goal progress and streak stored locally.
- No automatic posting, liking, following, or other account actions.

## Install locally

1. Download or clone this repository.
2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the `replyquest` folder.
6. Open `https://x.com`.

## Safety rule

ReplyQuest is human-in-the-loop by design. It may prepare or copy a draft, but the user must review it and press X's native Reply button.

## Next milestones

1. Detect the exact post selected by the user instead of the first visible post.
2. Add editable campaign profiles and daily targets.
3. Add AI provider configuration.
4. Generate context-aware replies instead of static examples.
5. Track replied post IDs to prevent duplicates.
6. Add style memory and banned phrases.
7. Add XP, levels, achievements, and companion animation.

## Repository note

The original forked project remains untouched on `main`. ReplyQuest work is isolated in the `replyquest-foundation` branch and the new `replyquest/` directory.
