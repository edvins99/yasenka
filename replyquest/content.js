(() => {
  'use strict';

  if (window.__replyQuestAlphaLoaded) return;
  window.__replyQuestAlphaLoaded = true;

  const MODES = [
    { id: 'support', label: '👍 Support' },
    { id: 'value', label: '🧠 Add value' },
    { id: 'question', label: '❓ Ask question' },
    { id: 'hype', label: '🔥 Hype' },
    { id: 'funny', label: '😂 Funny' }
  ];

  let activeArticle = null;
  let activeMode = 'support';
  let modal = null;

  function getPostText(article) {
    return article?.querySelector('[data-testid="tweetText"]')?.innerText?.trim() || '';
  }

  function getAuthor(article) {
    const statusLink = article?.querySelector('a[href*="/status/"]');
    const match = statusLink?.getAttribute('href')?.match(/^\/([^/]+)\/status\//);
    return match ? '@' + match[1] : 'the author';
  }

  function topicHint(text) {
    const lower = text.toLowerCase();
    if (/privacy|zero.?knowledge|zk|midnight/.test(lower)) return 'privacy and practical adoption';
    if (/defi|liquidity|yield|dex|trading/.test(lower)) return 'real DeFi utility and execution';
    if (/ai|agent|model|llm|artificial intelligence/.test(lower)) return 'how this translates into real user value';
    if (/yellow|clearing|state channel/.test(lower)) return 'scalable infrastructure and real usage';
    return 'the practical impact and what comes next';
  }

  function buildReplies(mode, text, author) {
    const topic = topicHint(text);
    const short = text.replace(/\s+/g, ' ').slice(0, 90);
    const replies = {
      support: [
        `Strong update, ${author}. The focus on ${topic} is what stands out most.`,
        `Good to see this moving forward. Consistent execution like this matters more than short-term noise.`,
        `This is the kind of progress that builds long-term confidence. Looking forward to the next step.`
      ],
      value: [
        `The interesting part is ${topic}. The real test now is whether users can feel the improvement in practice.`,
        `This matters because strong infrastructure only becomes valuable when it reduces friction for real users.`,
        `A useful direction. Adoption will depend on execution, clear UX, and whether the ecosystem can build on top of it.`
      ],
      question: [
        `What do you see as the biggest bottleneck between this update and broader adoption?`,
        `Which part of this will users notice first in practice?`,
        `How are you thinking about measuring success after this ships?`
      ],
      hype: [
        `This is getting seriously interesting. Real progress, real momentum. 🔥`,
        `Big step forward. The pieces are starting to come together.`,
        `Exactly the kind of update the ecosystem needed. Keep building. 🚀`
      ],
      funny: [
        `Meanwhile my timeline finally delivered something worth stopping the scroll for 😄`,
        `Okay, this is much better than the usual “huge announcement soon” post.`,
        `My attention span approved this update. That is a high bar on X.`
      ]
    };

    if (short && mode === 'value') {
      replies[mode][0] = `“${short}${text.length > 90 ? '…' : ''}” — the key question is how this turns into measurable user value.`;
    }
    return replies[mode] || replies.support;
  }

  function injectButtons() {
    document.querySelectorAll('article[data-testid="tweet"]').forEach((article) => {
      if (article.dataset.replyquestReady === '1') return;
      const actionBar = article.querySelector('[role="group"]');
      if (!actionBar) return;

      article.dataset.replyquestReady = '1';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'rq-inline-button';
      button.innerHTML = '<span>✨</span><span>ReplyQuest</span>';
      button.setAttribute('aria-label', 'Open ReplyQuest for this post');
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        activeArticle = article;
        activeMode = 'support';
        openModal();
      });
      actionBar.appendChild(button);
    });
  }

  function openModal() {
    closeModal();
    const text = getPostText(activeArticle);
    const author = getAuthor(activeArticle);

    modal = document.createElement('div');
    modal.id = 'replyquest-modal-root';
    modal.innerHTML = `
      <div class="rq-backdrop" data-action="close"></div>
      <section class="rq-modal" role="dialog" aria-modal="true" aria-label="ReplyQuest">
        <header class="rq-modal-header">
          <div><strong>ReplyQuest Alpha</strong><small>One click. Better replies.</small></div>
          <button class="rq-close" data-action="close">×</button>
        </header>
        <div class="rq-post-preview"><b>${escapeHtml(author)}</b><p>${escapeHtml(text || 'No post text detected.')}</p></div>
        <div class="rq-mode-list">
          ${MODES.map((mode) => `<button class="rq-mode ${mode.id === activeMode ? 'active' : ''}" data-mode="${mode.id}">${mode.label}</button>`).join('')}
        </div>
        <button class="rq-generate" data-action="generate">Generate 3 drafts</button>
        <div class="rq-note">Alpha uses local draft templates. AI connection comes next. Nothing is posted automatically.</div>
        <div class="rq-results" id="rq-results"></div>
      </section>`;

    document.documentElement.appendChild(modal);
    modal.addEventListener('click', handleModalClick);
  }

  async function handleModalClick(event) {
    const button = event.target.closest('button, [data-action="close"]');
    if (!button) return;

    if (button.dataset.action === 'close') return closeModal();
    if (button.dataset.mode) {
      activeMode = button.dataset.mode;
      modal.querySelectorAll('.rq-mode').forEach((item) => item.classList.toggle('active', item.dataset.mode === activeMode));
      return;
    }
    if (button.dataset.action === 'generate') return renderReplies();
    if (button.dataset.action === 'copy') {
      await navigator.clipboard.writeText(button.dataset.reply || '');
      button.textContent = 'Copied ✓';
      setTimeout(() => { button.textContent = 'Copy'; }, 1200);
      return;
    }
    if (button.dataset.action === 'insert') {
      await insertIntoComposer(button.dataset.reply || '');
    }
  }

  function renderReplies() {
    const text = getPostText(activeArticle);
    const author = getAuthor(activeArticle);
    const replies = buildReplies(activeMode, text, author);
    modal.querySelector('#rq-results').innerHTML = replies.map((reply, index) => `
      <article class="rq-result-card">
        <div class="rq-result-number">${index + 1}</div>
        <p>${escapeHtml(reply)}</p>
        <div class="rq-result-actions">
          <button data-action="copy" data-reply="${escapeAttribute(reply)}">Copy</button>
          <button class="primary" data-action="insert" data-reply="${escapeAttribute(reply)}">Insert into reply</button>
        </div>
      </article>`).join('');
  }

  async function insertIntoComposer(reply) {
    const replyButton = activeArticle?.querySelector('button[data-testid="reply"]');
    if (!replyButton) {
      await navigator.clipboard.writeText(reply);
      alert('Reply box was not found. The draft was copied instead.');
      return;
    }

    replyButton.click();
    const deadline = Date.now() + 4000;
    const timer = setInterval(() => {
      const textbox = document.querySelector('div[role="dialog"] div[role="textbox"], div[data-testid="tweetTextarea_0"]');
      if (textbox) {
        clearInterval(timer);
        textbox.focus();
        document.execCommand('insertText', false, reply);
        textbox.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: reply }));
        closeModal();
      } else if (Date.now() > deadline) {
        clearInterval(timer);
        navigator.clipboard.writeText(reply);
        alert('Could not open the reply box. The draft was copied instead.');
      }
    }, 120);
  }

  function closeModal() {
    modal?.remove();
    modal = null;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/\n/g, '&#10;');
  }

  const observer = new MutationObserver(injectButtons);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  injectButtons();
})();