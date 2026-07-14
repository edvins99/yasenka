# ReplyQuest MVP Specification

## Product principle

ReplyQuest does not replace the user. It removes repetitive work while keeping the human in control.

## Problem

Routine X engagement for ambassador and community work consumes time. Many replies are short, supportive, or lightly contextual, while some need a more thoughtful answer. Switching between posts, deciding tone, and avoiding repetitive wording creates unnecessary friction.

## MVP goal

Reduce the time needed to review a priority X post and prepare a suitable reply draft.

## Supported platform

- X.com only
- Chrome Manifest V3 extension
- Local-first configuration and history

## Core workflow

1. The user opens X.
2. ReplyQuest identifies visible posts from monitored accounts.
3. The user selects a post.
4. The user chooses a reply mode.
5. ReplyQuest produces three editable drafts.
6. The user copies or inserts one draft.
7. The user reviews and sends it manually.
8. The post is marked done locally.

## Reply modes

- **Quick** — short, supportive, natural, suitable for routine engagement.
- **Natural** — conversational and specific to the post.
- **Insight** — more thoughtful, analytical, or technical.
- **Humor** — optional contextual light humor; never insulting or reckless.

## Campaigns

### Yellow ecosystem
- @Yellow
- @YellowPro
- @DiegoMYellow
- @yellow__capital
- @AlexisYellow
- @YellowMedia_HQ
- @DeFi_Pop

### Midnight
- @MidnightNtwrk

### External / community priority
- @CryptoRob35
- @greg16676935420
- @StarPlatinum_
- @0xburakcem
- @SAKURA_ART3

Account groups must remain editable in settings.

## MVP interface

A compact floating panel containing:

- campaign selector;
- detected priority posts;
- selected post preview;
- tone buttons;
- three generated drafts;
- Copy / Insert / Regenerate / Mark done controls;
- daily completed count.

## Safety rules

ReplyQuest must never:

- click Send;
- publish a reply automatically;
- like, follow, repost, quote, bookmark, or delete automatically;
- imitate human timing to evade platform controls;
- send page text to an AI provider without explicit user configuration.

All output is a draft. The user remains responsible for review and publication.

## Data stored locally

- campaign account lists;
- tone preferences;
- completed post IDs and timestamps;
- recent generated drafts for duplicate prevention;
- provider settings, stored locally and never committed to the repository.

## MVP acceptance criteria

- Runs as an unpacked Chrome extension.
- Activates only on x.com.
- Detects visible posts from configured accounts.
- Generates three distinct drafts for a selected post.
- Supports Quick, Natural, and Insight modes.
- Allows copying or inserting text without sending it.
- Tracks completed posts locally.
- Performs no automated account action.

## Explicitly out of scope

- animated companion;
- XP, games, achievements, or avatars;
- autonomous browsing or posting;
- analytics promises such as predicted engagement;
- multi-platform support;
- cloud accounts or team collaboration.