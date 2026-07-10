(() => {
  'use strict';

  if (window.__replyQuestLoaded) return;
  window.__replyQuestLoaded = true;

  const STORAGE_KEY = 'replyquestState';
  const DEFAULT_STATE = {
    campaign: 'Yellow',
    dailyGoal: 20,
    completed: 0,
    streak: 1,
    minimized: false
  };

  const campaignPrompts = {
    Yellow: [
      'Strong progress. The focus on real infrastructure is what stands out most.',
      'This is the kind of update that builds long-term confidence in the project.',
      'Good to see the team staying focused on real usage rather than short-term noise.'
    ],
    Midnight: [
      'Privacy infrastructure becomes much more important as onchain adoption grows.',
      'The strongest part is the focus on practical privacy, not privacy as a slogan.',
      'This feels like an important step toward making privacy usable at scale.'
    ],
    General: [
      'Interesting direction. Execution will matter more than the announcement itself.',
      'The real test will be whether users feel the improvement in practice.',
      'Good signal, especially if the team can keep this momentum consistent.'
    ]
  };

  function loadState() {
    return new Promise((resolve) => {
      chrome.storage.local.get([STORAGE_KEY], (result) => {
        resolve({ ...DEFAULT_STATE, ...(result[STORAGE_KEY] || {}) });
      });
    });
  }

  function saveState(state) {
    chrome.storage.local.set({ [STORAGE_KEY]: state });
  }

  function getVisiblePostText() {
    const articles = [...document.querySelectorAll('article[data-testid="tweet"]')];
    const visible = articles.find((article) => {
      const rect = article.getBoundingClientRect();
      return rect.top >= 0 && rect.top < window.innerHeight * 0.75;
    });
    return visible?.querySelector('[data-testid="tweetText"]')?.innerText?.trim() || '';
  }

  function createCompanion(state) {
    const root = document.createElement('aside');
    root.id = 'replyquest-root';
    root.innerHTML = `
      <div class="rq-card ${state.minimized ? 'rq-minimized' : ''}">
        <div class="rq-header">
          <div>
            <div class="rq-brand">ReplyQuest</div>
            <div class="rq-subtitle">Human-in-the-loop X companion</div>
          </div>
          <button class="rq-icon-btn" data-action="toggle" aria-label="Minimize">${state.minimized ? '+' : '–'}</button>
        </div>

        <div class="rq-body">
          <label class="rq-label" for="rq-campaign">Campaign</label>
          <select id="rq-campaign" class="rq-select">
            ${['Yellow', 'Midnight', 'General'].map((name) => `<option ${name === state.campaign ? 'selected' : ''}>${name}</option>`).join('')}
          </select>

          <div class="rq-progress-row">
            <span>Today</span>
            <strong id="rq-count">${state.completed}/${state.dailyGoal}</strong>
          </div>
          <div class="rq-progress"><span id="rq-progress-bar" style="width:${Math.min(100, state.completed / state.dailyGoal * 100)}%"></span></div>
          <div class="rq-streak">🔥 ${state.streak} day streak</div>

          <button class="rq-primary" data-action="generate">Generate 3 replies</button>
          <div id="rq-context" class="rq-context">Open a post in view, then generate suggestions.</div>
          <div id="rq-suggestions" class="rq-suggestions"></div>
        </div>
      </div>
    `;

    document.documentElement.appendChild(root);

    root.addEventListener('click', async (event) => {
      const button = event.target.closest('button');
      if (!button) return;

      if (button.dataset.action === 'toggle') {
        state.minimized = !state.minimized;
        saveState(state);
        root.remove();
        createCompanion(state);
      }

      if (button.dataset.action === 'generate') {
        renderSuggestions(root, state);
      }

      if (button.dataset.action === 'copy') {
        const text = button.dataset.text || '';
        await navigator.clipboard.writeText(text);
        button.textContent = 'Copied';
        setTimeout(() => { button.textContent = 'Copy'; }, 1200);
      }

      if (button.dataset.action === 'done') {
        state.completed = Math.min(state.dailyGoal, state.completed + 1);
        saveState(state);
        root.querySelector('#rq-count').textContent = `${state.completed}/${state.dailyGoal}`;
        root.querySelector('#rq-progress-bar').style.width = `${Math.min(100, state.completed / state.dailyGoal * 100)}%`;
        button.textContent = 'Counted ✓';
        button.disabled = true;
      }
    });

    root.querySelector('#rq-campaign')?.addEventListener('change', (event) => {
      state.campaign = event.target.value;
      saveState(state);
      root.querySelector('#rq-suggestions').innerHTML = '';
    });
  }

  function renderSuggestions(root, state) {
    const postText = getVisiblePostText();
    const context = root.querySelector('#rq-context');
    const suggestions = root.querySelector('#rq-suggestions');
    const replies = campaignPrompts[state.campaign] || campaignPrompts.General;

    context.textContent = postText
      ? `Detected post: “${postText.slice(0, 120)}${postText.length > 120 ? '…' : ''}”`
      : 'No visible post detected. Scroll until a post is near the top of the page.';

    suggestions.innerHTML = replies.map((reply) => `
      <div class="rq-suggestion">
        <p>${escapeHtml(reply)}</p>
        <div class="rq-actions">
          <button data-action="copy" data-text="${escapeAttribute(reply)}">Copy</button>
          <button data-action="done">Mark done</button>
        </div>
      </div>
    `).join('');
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[char]);
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/\n/g, '&#10;');
  }

  loadState().then(createCompanion);
})();
