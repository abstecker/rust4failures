// pk-table.js — pkarena0-web v0.2.2, the embed build (EPIC-56).
// One file: www/js/cards.js, table.js, actions.js and embed/pk-table.js,
// inlined by scripts/embed-bundle.mjs. Source and license:
// https://github.com/ImperialBower/pkarena0-web/tree/v0.2.2
// ── www/js/cards.js ──
const __m_cards = (() => {
// Card element factory. cardStr is 2-char ("Kh") or "__" for face-down.
const SUIT_CHAR = { s: '♠', h: '♥', d: '♦', c: '♣' };

function makeCard(cardStr, size = 'board') {
  if (!cardStr) return null;
  const el = document.createElement('div');
  el.className = 'card card-' + size;
  if (cardStr === '__') {
    el.classList.add('card-down');
    return el;
  }
  const suit = cardStr[cardStr.length - 1];
  const rank = cardStr.slice(0, -1);
  el.classList.add('suit-' + suit);
  const r = document.createElement('span');
  r.className = 'card-rank';
  r.textContent = rank === 'T' ? '10' : rank;
  const s = document.createElement('span');
  s.className = 'card-suit';
  s.textContent = SUIT_CHAR[suit] ?? '?';
  el.append(r, s);
  return el;
}

return { makeCard };
})();

// ── www/js/table.js ──
const __m_table = (() => {
// design2.0 table component. Builds felt + 9 seats + center inside rootEl and
// returns an update(view) API. Never clears rootEl — it only appends.
const { makeCard } = __m_cards;
// Physical seat coordinates (percent), desktop (x,y) and mobile (mx,my),
// from the SEATS array in docs/design2.0/Poker Table.dc.html. Seat 0 = hero.
const SEAT_POS = [
  { x: 71, y: 90, mx: 50, my: 92 },
  { x: 29, y: 90, mx: 13, my: 82 },
  { x: 8,  y: 64, mx: 8,  my: 60 },
  { x: 8,  y: 30, mx: 8,  my: 36 },
  { x: 27, y: 12, mx: 16, my: 16 },
  { x: 50, y: 11, mx: 50, my: 11 },
  { x: 73, y: 12, mx: 84, my: 16 },
  { x: 92, y: 30, mx: 92, my: 36 },
  { x: 92, y: 64, mx: 92, my: 60 },
];
const POS_NAMES = ['BTN', 'SB', 'BB', 'UTG', 'UTG+1', 'MP', 'LJ', 'HJ', 'CO'];
const SLOT_LABELS = ['FLOP', 'FLOP', 'FLOP', 'TURN', 'RIVER'];

function positionTag(seat, dealerSeat) {
  if (dealerSeat == null) return '';
  return POS_NAMES[((seat - dealerSeat) % 9 + 9) % 9];
}

function pillVariant(label) {
  const l = (label ?? '').toLowerCase();
  if (!l) return null;
  if (l.includes('fold')) return 'fold';
  if (l.includes('raise') || l.includes('bet') || l.includes('all-in')) return 'raise';
  if (l.includes('post') || l.includes('sb ') || l.includes('bb ') || l.includes('blind')) return 'blind';
  if (l.includes('win') || l.includes('to act')) return 'hero';
  return 'blind'; // neutral: check / call
}

const fmt = n => '$' + (n ?? 0).toLocaleString('en-US');

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

function buildSeat(i) {
  const seat = el('div', 'seat');
  seat.dataset.seat = String(i);
  seat.style.setProperty('--x', SEAT_POS[i].x + '%');
  seat.style.setProperty('--y', SEAT_POS[i].y + '%');
  seat.style.setProperty('--mx', SEAT_POS[i].mx + '%');
  seat.style.setProperty('--my', SEAT_POS[i].my + '%');

  const stack = el('div', 'seat-stack-col');
  const cards = el('div', 'seat-cards');
  const ring = el('div', 'seat-ring');
  const plate = el('div', 'seat-plate');
  const row1 = el('div', 'seat-row1');
  const name = el('a', 'seat-name', '—');
  name.rel = 'noopener noreferrer';
  name.target = '_blank';
  const tag = el('span', 'seat-tag');
  row1.append(name, tag);
  const row2 = el('div', 'seat-row2');
  row2.append(el('span', 'seat-stack'), el('span', 'seat-bb'));
  const hud = el('div', 'seat-hud');
  plate.append(row1, row2, hud);
  const badge = el('div', 'seat-badge');
  ring.append(plate, badge);
  const pill = el('div', 'seat-pill');
  pill.append(el('span', 'act-full'), el('span', 'act-short'));
  const chipamt = el('div', 'seat-chipamt');
  stack.append(cards, ring, pill, chipamt);
  seat.append(stack);
  return seat;
}

// EPIC-47 Phase 4: format a seat's opponent-model stats as a compact
// "VPIP/PFR/AF" HUD string. VPIP/PFR are fractions → whole percents; AF is a
// ratio to one decimal. A missing stat (not enough sample) renders as "·".
function formatHud(s) {
  const pct = v => (v == null ? '·' : Math.round(v * 100));
  const af = s.af == null ? '·' : s.af.toFixed(1);
  return `${pct(s.vpip)}/${pct(s.pfr)}/${af}`;
}

// Populate a HUD element (.seat-hud / .list-hud) from a player's stats, or hide
// it when the seat has no tracked hands yet. `base` is the element's base class.
function renderHud(hudEl, base, stats) {
  if (stats) {
    hudEl.textContent = formatHud(stats);
    hudEl.className = base + ' hud-' + (stats.confidence || 'low');
    hudEl.title = `VPIP/PFR/AF · ${stats.hands} hand${stats.hands === 1 ? '' : 's'}`;
    hudEl.style.display = '';
  } else {
    hudEl.textContent = '';
    hudEl.className = base;
    hudEl.style.display = 'none';
  }
}

// Abbreviate an action label for the mobile pill. Handles both button-style
// labels ("Raise $400") and pkcore's verb labels ("raises to $400", "calls $100").
function shortLabel(label) {
  return label
    .replace(/^raises?\s*(?:to\s*)?/i, 'R ').replace(/^bets?\s*/i, 'B ')
    .replace(/^calls?\s*/i, 'C ').replace(/^checks?.*/i, 'CHK')
    .replace(/^folds?.*/i, 'FOLD').replace(/^all-?in\s*/i, 'AI ')
    .toUpperCase().trim();
}

function createTable(rootEl, { replay = false } = {}) {
  const zone = el('div', 'table-inner');
  const felt = el('div', 'felt');
  const ringOuter = el('div', 'felt-ring');
  ringOuter.append(el('div', 'felt-ring-inner'));
  const center = el('div', 'table-center');
  const pot = el('div', 'pot', 'POT $0');
  const board = el('div', 'board');
  const slots = SLOT_LABELS.map(lbl => {
    const s = el('div', 'board-slot');
    s.append(el('span', 'slot-label', lbl));
    board.append(s);
    return s;
  });
  const label = el('div', 'table-label', "NO LIMIT HOLD'EM");
  center.append(pot, board, label);
  zone.append(felt, ringOuter, center);
  const seats = [];
  for (let i = 0; i < 9; i++) {
    const s = buildSeat(i);
    seats.push(s);
    zone.append(s);
  }
  rootEl.append(zone);

  // Mobile seat-list + board-strip. Hidden on desktop and in table-mode via CSS;
  // populated from the same view on every update().
  const listWrap = el('div', 'seat-list-wrap');
  const strip = el('div', 'board-strip');
  const stripPot = el('span', 'strip-pot', 'POT $0');
  const stripBoard = el('div', 'strip-board');
  const stripSlots = SLOT_LABELS.map(() => {
    const s = el('div', 'strip-slot');
    stripBoard.append(s);
    return s;
  });
  const stripBlinds = el('span', 'strip-blinds', '');
  strip.append(stripPot, stripBoard, stripBlinds);
  const list = el('div', 'seat-list');
  const listRows = [];
  for (let i = 0; i < 9; i++) {
    const row = el('div', 'list-row');
    row.dataset.listSeat = String(i);
    const tag = el('span', 'list-tag');
    const mid = el('div', 'list-mid');
    mid.append(el('span', 'list-name', '—'), el('span', 'list-hud'));
    const right = el('div', 'list-right');
    right.append(el('span', 'list-stack'), el('span', 'list-bb'));
    const pill = el('span', 'list-pill');
    row.append(tag, mid, right, pill);
    list.append(row);
    listRows.push(row);
  }
  listWrap.append(strip, list);
  rootEl.append(listWrap);

  const q = (i, sel) => seats[i].querySelector(sel);
  const actionLabels = new Array(9).fill(null);

  function setActionLabel(i, lbl) {
    actionLabels[i] = lbl;
    const pill = q(i, '.seat-pill');
    const variant = pillVariant(lbl);
    pill.className = 'seat-pill' + (variant ? ' pill-' + variant : '');
    q(i, '.act-full').textContent = lbl ?? '';
    q(i, '.act-short').textContent = lbl ? shortLabel(lbl) : '';
    pill.style.visibility = lbl ? 'visible' : 'hidden';
  }

  function renderSeat(i, p, view) {
    const seatEl = seats[i];
    if (!p || p.state === 'Out' || !p.name) {
      seatEl.className = 'seat seat-empty';
      q(i, '.seat-name').textContent = '—';
      q(i, '.seat-stack').textContent = '';
      q(i, '.seat-bb').textContent = '';
      q(i, '.seat-cards').replaceChildren();
      q(i, '.seat-badge').style.display = 'none';
      renderHud(q(i, '.seat-hud'), 'seat-hud', null);
      setActionLabel(i, null);
      q(i, '.seat-chipamt').style.visibility = 'hidden';
      return;
    }
    seatEl.className = 'seat' + (p.state === 'Fold' ? ' seat-fold' : '');

    const nameEl = q(i, '.seat-name');
    const emoji = view.emoji && i !== view.heroSeat ? view.emoji(p.name) : '';
    nameEl.textContent = (emoji ? emoji + ' ' : '') + p.name;
    const href = view.nameHref && i !== view.heroSeat ? view.nameHref(p.name) : null;
    if (href) nameEl.setAttribute('href', href);
    else nameEl.removeAttribute('href');

    q(i, '.seat-tag').textContent = positionTag(i, view.dealerSeat);

    const allIn = p.state === 'AllIn'
      ? (view.allInAmounts?.get(i) ?? (p.bet > 0 ? p.bet : null))
      : null;
    const stackEl = q(i, '.seat-stack');
    stackEl.textContent = allIn != null ? fmt(allIn) : fmt(p.chips);
    stackEl.classList.toggle('allin', allIn != null);
    q(i, '.seat-bb').textContent =
      view.bigBlind > 0 && allIn == null
        ? Math.round((p.chips ?? 0) / view.bigBlind) + 'BB' : '';

    renderHud(q(i, '.seat-hud'), 'seat-hud', p.stats);

    const chipEl = q(i, '.seat-chipamt');
    if (p.bet > 0 && p.state !== 'AllIn') {
      chipEl.textContent = fmt(p.bet);
      chipEl.style.visibility = 'visible';
    } else {
      chipEl.style.visibility = 'hidden';
    }

    const badge = q(i, '.seat-badge');
    const b = p.is_dealer ? 'D' : p.is_sb ? 'SB' : p.is_bb ? 'BB' : null;
    badge.textContent = b ?? '';
    badge.style.display = b ? '' : 'none';

    const ring = q(i, '.seat-ring');
    ring.classList.toggle('hero-ring', i === view.heroSeat);
    ring.classList.toggle('to-act',
      view.currentSeat === i || (view.heroTurn && i === view.heroSeat));

    // Seat hole cards (face-down markers / showdown reveal). Hero's big cards
    // live in the dock, so the (non-replay) hero seat shows none.
    const cardsEl = q(i, '.seat-cards');
    cardsEl.replaceChildren();
    if (replay || i !== view.heroSeat) {
      for (const c of p.hole_cards ?? []) {
        const node = makeCard(c, 'mini');
        if (node) cardsEl.append(node);
      }
    }

    if (actionLabels[i] == null && (p.state === 'Fold' || p.state === 'AllIn')) {
      setActionLabel(i, p.state === 'Fold' ? 'Fold' : 'All-In');
    }
  }

  // Mobile seat-list row — same data as renderSeat, laid out as a flat row.
  function renderListRow(i, p, view) {
    const row = listRows[i];
    const q2 = sel => row.querySelector(sel);
    if (!p || p.state === 'Out' || !p.name) {
      row.className = 'list-row list-empty';
      q2('.list-tag').textContent = '';
      q2('.list-name').textContent = '—';
      renderHud(q2('.list-hud'), 'list-hud', null);
      q2('.list-stack').textContent = '';
      q2('.list-bb').textContent = '';
      q2('.list-pill').className = 'list-pill';
      q2('.list-pill').textContent = '';
      return;
    }
    row.className = 'list-row'
      + (i === view.heroSeat ? ' list-hero' : '')
      + (p.state === 'Fold' ? ' list-fold' : '');
    q2('.list-tag').textContent = positionTag(i, view.dealerSeat);
    const emoji = view.emoji && i !== view.heroSeat ? view.emoji(p.name) : '';
    q2('.list-name').textContent = (emoji ? emoji + ' ' : '') + p.name;
    renderHud(q2('.list-hud'), 'list-hud', p.stats);
    const allIn = p.state === 'AllIn'
      ? (view.allInAmounts?.get(i) ?? (p.bet > 0 ? p.bet : null)) : null;
    q2('.list-stack').textContent = allIn != null ? fmt(allIn) : fmt(p.chips);
    q2('.list-bb').textContent =
      view.bigBlind > 0 && allIn == null
        ? Math.round((p.chips ?? 0) / view.bigBlind) + 'BB' : '';
    const lbl = actionLabels[i];
    const variant = pillVariant(lbl);
    const pill = q2('.list-pill');
    pill.className = 'list-pill' + (variant ? ' pill-' + variant : '');
    pill.textContent = lbl ? shortLabel(lbl) : '';
    pill.style.visibility = lbl ? 'visible' : 'hidden';
  }

  function update(view) {
    pot.textContent = 'POT ' + fmt(view.pot);
    label.textContent = view.smallBlind
      ? `NO LIMIT HOLD'EM · ${view.smallBlind}/${view.bigBlind}` : "NO LIMIT HOLD'EM";
    slots.forEach((slot, idx) => {
      const c = view.board?.[idx] ?? null;
      slot.replaceChildren();
      if (c) slot.append(makeCard(c, 'board'));
      else slot.append(el('span', 'slot-label', SLOT_LABELS[idx]));
    });
    const bySeat = new Map((view.seats ?? []).map(p => [p.seat, p]));
    for (let i = 0; i < 9; i++) renderSeat(i, bySeat.get(i) ?? null, view);

    stripPot.textContent = 'POT ' + fmt(view.pot);
    stripBlinds.textContent = view.smallBlind ? `${view.smallBlind}/${view.bigBlind}` : '';
    stripSlots.forEach((slot, idx) => {
      const c = view.board?.[idx] ?? null;
      slot.replaceChildren();
      if (c) slot.append(makeCard(c, 'mini'));
    });
    for (let i = 0; i < 9; i++) renderListRow(i, bySeat.get(i) ?? null, view);
  }

  function clear() {
    for (let i = 0; i < 9; i++) {
      renderSeat(i, null, { heroSeat: null });
      actionLabels[i] = null;
    }
    pot.textContent = 'POT $0';
    slots.forEach((slot, idx) => {
      slot.replaceChildren(el('span', 'slot-label', SLOT_LABELS[idx]));
    });
    stripPot.textContent = 'POT $0';
    stripBlinds.textContent = '';
    stripSlots.forEach(slot => slot.replaceChildren());
    for (let i = 0; i < 9; i++) renderListRow(i, null, { heroSeat: null });
  }

  return { update, setActionLabel, clear };
}

return { positionTag, pillVariant, createTable };
})();

// ── www/js/actions.js ──
const __m_actions = (() => {
// The action row, as data. Pure: a GameState (the JSON `get_state()` returns)
// in, the buttons to offer out — label, class, and what pressing one does.
// No DOM and no closure state, so main.js's dock and the embed's own row
// (EPIC-56) render the same choices from the same function.
//
// Lifted from main.js's renderActionButtons (EPIC-56 Phase 1). The pre-action
// Check/Fold check that preceded it stays in main.js: it is the dock's
// behaviour, not the row's.

/** @returns {Array<{label: string, cls: string, action: string, betAction?: string, amount?: number}>} */
function buttonsFor(state) {
  const actions = state.legal_actions ?? [];
  const btns = [];

  for (const action of actions) {
    if (action === 'Fold') {
      btns.push({ label: 'Fold', cls: 'danger', action });
    } else if (action === 'Check') {
      btns.push({ label: 'Check', cls: 'safe', action });
    } else if (action === 'Call') {
      // pkcore always offers Call and converts a short stack into a partial
      // all-in call, so clamp the label to what the hero can actually put in.
      const stack = state.max_bet ?? 0;
      const amt = Math.min(state.to_call ?? 0, stack);
      const short = amt < (state.to_call ?? 0);
      btns.push({ label: 'Call $' + amt.toLocaleString() + (short ? ' (all-in)' : ''), cls: '', action });
    } else if (action === 'Bet' || action === 'Raise') {
      const minRaise = state.min_raise ?? 100;
      const maxBet   = state.max_bet   ?? 10000;
      const pot      = state.pot       ?? 0;
      // Min raise — always shown
      btns.push({ label: 'Min $' + minRaise.toLocaleString(), cls: 'primary', action: 'bet-direct', betAction: action, amount: minRaise });
      // ½ pot — shown when it's meaningfully above min and below max
      const halfPot = Math.round(pot / 2);
      if (halfPot > minRaise && halfPot < maxBet)
        btns.push({ label: '½ Pot $' + halfPot.toLocaleString(), cls: 'primary', action: 'bet-direct', betAction: action, amount: halfPot });
      // Full pot — shown when it's above min and below max (all-in handles the rest)
      if (pot > minRaise && pot < maxBet)
        btns.push({ label: 'Pot $' + pot.toLocaleString(), cls: 'primary', action: 'bet-direct', betAction: action, amount: pot });
      // Custom slider
      btns.push({ label: action + '…', cls: 'primary', action: 'bet-open', betAction: action });
    } else if (action === 'AllIn') {
      const amt = state.max_bet ?? 0;
      btns.push({ label: 'All-In $' + amt.toLocaleString(), cls: 'danger', action: 'allin', amount: amt });
    }
  }

  // Undo — step back to before your last action (within the current hand
  // only; the stack is cleared at each next_hand boundary). Surfaced by the
  // engine as `can_undo`.
  if (state.can_undo) {
    btns.push({ label: '↶ Undo', cls: '', action: 'undo' });
  }

  return btns;
}

return { buttonsFor };
})();

// ── www/js/embed/pk-table.js ──
const __m_embed = (() => {
// <pk-table> — pkarena0-web in someone else's page (EPIC-56).
//
// Two lines mount it:
//
//   <script type="module" src="pk-table.js"></script>
//   <pk-table seed="42"><img src="table.png" alt="…"></pk-table>
//
// The <img> is the whole of what paper, script-off and file:// readers see.
// The element adds a Deal button under it and fetches nothing until Deal is
// pressed; then it imports the engine (its own instance), swaps the picture
// for the live table, and plays one hand at a time. If the engine will not
// load, the picture stays and the status line says so. The rules this file
// keeps, numbered 1–8, are tested in tests/embed.spec.ts.
const { createTable } = __m_table;
const { makeCard } = __m_cards;
const { buttonsFor } = __m_actions;
const HERE = new URL('./', import.meta.url);
let nextInstance = 0;
// pk-table.css is fetched once per page and shared by every instance.
const sheets = new Map();

const POS_TAGS = ['BTN', 'SB', 'BB', 'UTG', 'UTG+1', 'MP', 'LJ', 'HJ', 'CO'];
const ACT_OF = { Fold: 'fold', Check: 'check', Call: 'call', allin: 'allin', undo: 'undo', 'bet-open': 'raise' };

// The pre-Deal look: enough for a button and a line of text. The full sheet
// arrives with the engine (rule 1: nothing fetched before Deal).
const BOOT_CSS = `
  :host { display: block; }
  .pk-frame { font: 14px/1.4 system-ui, sans-serif; }
  .pk-actions { padding: 6px 0; }
  .pk-actions button { font: inherit; font-weight: 600; padding: 8px 16px; border-radius: 8px; border: 1px solid currentColor; background: transparent; color: inherit; cursor: pointer; }
  .pk-actions button:disabled { opacity: .45; cursor: default; }
  .pk-status { font: 12px/1.4 ui-monospace, Menlo, Consolas, monospace; min-height: 1.4em; opacity: .8; }
  .pk-badge { font: 10px ui-monospace, Menlo, Consolas, monospace; opacity: .55; text-align: right; }
  .pk-zone[hidden], .pk-raise[hidden] { display: none; }
  .pk-frame.pk-live slot { display: none; }
`;

class PkTable extends HTMLElement {
  #root; #zone; #hero; #status; #actions; #raise; #badge; #dealBtn;
  #mod = null; #table = null; #state = null; #hands = 0; #busy = false;
  #id = nextInstance++;

  connectedCallback() {
    if (this.#root) return;
    this.#root = this.attachShadow({ mode: 'open' });
    const boot = new CSSStyleSheet();
    boot.replaceSync(BOOT_CSS);
    this.#root.adoptedStyleSheets = [boot];

    const frame = el('div', 'pk-frame');
    const stage = el('div', 'pk-stage');
    stage.append(el('slot'));                       // the host's <img>, untouched
    this.#zone = el('div', 'pk-zone'); this.#zone.hidden = true;
    stage.append(this.#zone);
    this.#hero = el('div', 'pk-hero');
    this.#status = el('div', 'pk-status');
    this.#status.setAttribute('aria-live', 'polite');
    this.#actions = el('div', 'pk-actions');
    this.#raise = el('div', 'pk-raise'); this.#raise.hidden = true;
    this.#badge = el('div', 'pk-badge', 'pkarena0-web');
    frame.append(stage, this.#hero, this.#status, this.#actions, this.#raise, this.#badge);
    this.#root.append(frame);

    if (this.hasAttribute('bots')) {
      console.warn('<pk-table bots> is reserved (pkarena0-web EPIC-54) and ignored: eight bots.');
    }
    this.#showDeal();
    this.dataset.phase = 'idle';
  }

  // ── Public ────────────────────────────────────────────────────────────────

  /** The engine's state as `get_state()` last returned it, or null. */
  getState() { return this.#state; }

  /** Re-render the table and the action row from the last state (rule 6). */
  refresh() { if (this.#state) this.#render(this.#state, { row: true }); }

  /** Press Deal: load the engine on first use (rule 2), start a session. */
  async deal() {
    if (this.#busy) return;
    this.#busy = true;
    this.#setButtons([]);
    this.#say('Loading the table…');
    try {
      if (!this.#mod) await this.#load();
    } catch (err) {
      this.#fail(err);
      this.#busy = false;
      return;
    }
    const seed = this.hasAttribute('seed') ? Number(this.getAttribute('seed')) : Math.random();
    // The picture steps aside — it stays in the light DOM for rule 3.
    this.#root.querySelector('.pk-frame').classList.add('pk-live');
    this.#zone.hidden = false;
    this.#raise.hidden = true;
    this.#table?.clear?.();
    this.#state = JSON.parse(this.#mod.init_game(seed));
    this.#render(this.#state);
    this.#say('Dealing…');
    this.#busy = false;
    await this.#runBots();
  }

  // ── Loading ───────────────────────────────────────────────────────────────

  // Where pk-table.css is. In the release tarball everything is flat, so it
  // sits beside this module; a checkout keeps it under css/, hence `css`.
  get #cssUrl() {
    const c = this.getAttribute('css');
    return c ? new URL(c, document.baseURI) : new URL('pk-table.css', HERE);
  }

  get #base() {
    const b = this.getAttribute('base');
    return b ? new URL(b.endsWith('/') ? b : b + '/', document.baseURI) : HERE;
  }

  async #load() {
    const base = this.#base;
    // Rule 2: the module cache keys on the full URL, so a distinct query per
    // element yields a distinct module with its own thread_local! state —
    // the trick main.js plays with ?tab=play / ?tab=arena, written down.
    const glue = new URL(`pkarena0_web.js?instance=${this.#id}`, base);
    const [mod] = await Promise.all([
      import(glue.href).then(async m => {
        await m.default({ module_or_path: new URL('pkarena0_web_bg.wasm', base) });
        return m;
      }),
      this.#adoptSheet(this.#cssUrl),
    ]);
    this.#mod = mod;
    this.#table = createTable(this.#zone);
    this.#badge.textContent = 'pkarena0-web v' + mod.version();
    this.#emit('pk-table:ready', { version: mod.version() });
  }

  async #adoptSheet(url) {
    const key = url.href;
    if (!sheets.has(key)) {
      sheets.set(key, fetch(url).then(async r => {
        if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
        const sheet = new CSSStyleSheet();
        await sheet.replace(await r.text());
        return sheet;
      }));
    }
    const sheet = await sheets.get(key);
    this.#root.adoptedStyleSheets = [sheet];
  }

  // Rule 3: failure keeps the picture. The slot never moved, the zone stays
  // hidden, Deal is disabled, one sentence says why, and nothing spins.
  #fail(err) {
    const file = location.protocol === 'file:';
    const message = file
      ? 'The table needs to be served over http; from a file you get the picture.'
      : 'The table did not load; the picture stays. (' + (err?.message ?? err) + ')';
    this.#zone.hidden = true;
    this.#root.querySelector('.pk-frame').classList.remove('pk-live');
    this.#say(message);
    this.#showDeal(true);
    this.dataset.phase = 'error';
    this.#emit('pk-table:error', { message });
  }

  // ── The loop (rule 5), as main.js plays it ────────────────────────────────

  get #delay() {
    const d = Number(this.getAttribute('delay'));
    return Number.isFinite(d) && this.hasAttribute('delay') ? Math.max(0, d) : 1000;
  }

  async #runBots() {
    if (this.#busy) return;
    this.#busy = true;
    const mod = this.#mod;
    this.dataset.phase = 'BotsActing';
    while (this.isConnected && this.#mod === mod) {
      const result = JSON.parse(mod.step_bot());
      if (result.done) break;
      if (result.seat != null && result.action_label) {
        this.#say(`${result.name} ${result.action_label}`);
        this.#table.setActionLabel(result.seat, result.action_label);
      }
      this.#state = JSON.parse(mod.get_state());
      this.#render(this.#state);
      await sleep(this.#delay);
    }
    this.#busy = false;
    if (this.#mod !== mod) return;
    this.#state = JSON.parse(mod.get_state());
    this.#afterBots(this.#state);
  }

  #afterBots(state) {
    if (!state || state.phase === 'Error') {
      this.#say('Engine error: ' + (state?.error ?? 'unknown'));
      this.#showDeal();
      this.dataset.phase = 'error';
      return;
    }
    this.#render(state);
    if (state.phase === 'SessionOver' || busted(state)) {
      this.#say(state.phase === 'SessionOver'
        ? 'Session over. Final chips: $' + n(state.hero?.chips)
        : 'You are out of chips.');
      this.#showDeal();
      this.dataset.phase = 'SessionOver';
      return;
    }
    if (state.phase === 'HandComplete') {
      // Settle the hand: next_hand() pays the pot and reports who won, then
      // leaves the engine at the top of the next hand, waiting for Next hand.
      const next = JSON.parse(this.#mod.next_hand());
      this.#hands += 1;
      this.dataset.hands = String(this.#hands);
      const text = resultText(next) ?? 'Hand complete.';
      this.#say(text + (next.phase === 'SessionOver' ? ' — Session over.' : ''));
      this.#render({ ...state, hero: next.hero ?? state.hero, players: next.players ?? state.players }, { row: false });
      this.#emit('pk-table:hand-over', { state: next });
      this.#state = next;
      this.dataset.phase = 'HandComplete';
      if (next.phase === 'SessionOver' || busted(next)) { this.#showDeal(); return; }
      this.#setButtons([{ label: 'Next hand', cls: 'primary', act: 'next', onClick: () => this.#nextHand() }]);
      return;
    }
    // WaitingForHuman
    this.dataset.phase = 'WaitingForHuman';
    this.#say(`Hand #${state.hand_number} — ${state.street ?? 'Preflop'} — your turn.`);
    this.#renderRow(state);
  }

  #nextHand() {
    this.#table.clear?.();
    this.#raise.hidden = true;
    this.#render(this.#state);
    this.#say('Dealing…');
    this.#runBots();
  }

  #act(action, amount, state) {
    this.#raise.hidden = true;
    this.#setButtons([]);
    this.#table.setActionLabel(0, heroLabel(action, amount, state));
    const next = JSON.parse(this.#mod.human_action(JSON.stringify({ action, amount: amount ?? 0 })));
    if (next.error && next.phase === 'WaitingForHuman') {
      this.#say('Not allowed: ' + next.error);
      this.#state = next;
      this.#renderRow(next);
      return;
    }
    this.#state = next;
    this.#render(next);
    this.#runBots();
  }

  #undo() {
    const s = JSON.parse(this.#mod.undo_action());
    this.#state = s;
    this.#raise.hidden = true;
    this.#render(s);
    this.#say(`Undone — Hand #${s.hand_number} — ${s.street ?? 'Preflop'} — your turn.`);
    this.#renderRow(s);
  }

  // ── Rendering ─────────────────────────────────────────────────────────────

  #render(state, { row = false } = {}) {
    if (!this.#table || !state || state.phase === 'Error') return;
    this.#table.update({
      pot: state.pot ?? 0,
      board: state.board ?? [],
      smallBlind: state.small_blind ?? 0,
      bigBlind: state.big_blind ?? 0,
      seats: [state.hero, ...(state.players ?? [])].filter(Boolean),
      dealerSeat: state.dealer_seat ?? null,
      currentSeat: null,
      heroSeat: 0,
      heroTurn: state.phase === 'WaitingForHuman',
      allInAmounts: null,
      showHud: false,
      nameHref: null,
      emoji: null,
    });
    this.#hero.replaceChildren();
    const hero = state.hero;
    if (hero) {
      const cards = el('div', 'pk-hero-cards');
      for (const c of hero.hole_cards ?? []) { const node = makeCard(c, 'hero'); if (node) cards.append(node); }
      const pos = state.dealer_seat != null ? POS_TAGS[((0 - state.dealer_seat) % 9 + 9) % 9] : '';
      const bb = state.big_blind > 0 ? Math.round((hero.chips ?? 0) / state.big_blind) : 0;
      const title = el('div', 'pk-hero-title',
        `${hero.name || 'You'}${pos ? ' · ' + pos : ''} · $${n(hero.chips)} (${bb} BB)` +
        (state.to_call ? ` · to call $${n(state.to_call)}` : ''));
      this.#hero.append(cards, title);
    }
    if (row && state.phase === 'WaitingForHuman') this.#renderRow(state);
  }

  // Rule 6: the row is rebuilt from buttonsFor(state); focus follows the
  // button with the same data-act, else the first button.
  #renderRow(state) {
    const had = this.#root.activeElement?.dataset?.act ?? null;
    const btns = buttonsFor(state).map(b => ({
      label: b.label, cls: b.cls, act: actOf(b),
      onClick: () => {
        if (b.action === 'undo') return this.#undo();
        if (b.action === 'bet-open') return this.#openRaise(state, b.betAction);
        if (b.action === 'bet-direct') return this.#act(b.betAction, b.amount, state);
        if (b.action === 'allin') return this.#act('AllIn', b.amount, state);
        return this.#act(b.action, 0, state);
      },
    }));
    this.#setButtons(btns);
    const buttons = [...this.#actions.querySelectorAll('button')];
    (buttons.find(x => x.dataset.act === had) ?? buttons[0])?.focus({ preventScroll: true });
  }

  #openRaise(state, betAction) {
    const min = state.min_raise ?? state.big_blind ?? 0;
    const max = state.max_bet ?? state.hero?.chips ?? 0;
    this.#raise.replaceChildren();
    const label = el('span', null, `${betAction} to $${n(min)}`);
    const range = el('input'); range.type = 'range';
    range.min = String(min); range.max = String(max); range.step = String(state.big_blind || 50); range.value = String(min);
    range.setAttribute('aria-label', `${betAction} amount`);
    range.addEventListener('input', () => { label.textContent = `${betAction} to $${n(Number(range.value))}`; });
    const ok = el('button', 'primary', 'Confirm'); ok.dataset.act = 'confirm';
    ok.addEventListener('click', () => this.#act(betAction, Number(range.value), state));
    const cancel = el('button', null, 'Cancel'); cancel.dataset.act = 'cancel';
    cancel.addEventListener('click', () => { this.#raise.hidden = true; });
    this.#raise.append(label, range, ok, cancel);
    this.#raise.hidden = false;
    range.focus({ preventScroll: true });
  }

  #setButtons(btns) {
    this.#actions.replaceChildren();
    for (const b of btns) {
      const btn = el('button', b.cls || null, b.label);
      btn.dataset.act = b.act;
      if (b.disabled) btn.disabled = true;
      btn.addEventListener('click', b.onClick);
      this.#actions.append(btn);
    }
  }

  #showDeal(disabled = false) {
    this.#setButtons([{ label: this.#hands ? 'Deal again' : 'Deal', cls: 'primary pk-deal', act: 'deal', disabled, onClick: () => this.deal() }]);
    this.#dealBtn = this.#actions.querySelector('button');
  }

  #say(text) { this.#status.textContent = text; }

  #emit(type, detail) {
    this.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
  }
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}
const sleep = ms => (ms > 0 ? new Promise(r => setTimeout(r, ms)) : Promise.resolve());
const n = v => (v ?? 0).toLocaleString('en-US');

function actOf(b) {
  if (b.action === 'bet-direct') return /min/i.test(b.label) ? 'min' : 'pot';
  return ACT_OF[b.action] ?? ACT_OF[b.betAction] ?? '';
}

function busted(state) {
  return (state?.hand_number ?? 0) >= 1 && state?.hero?.state === 'Out' && (state?.hero?.chips ?? null) === 0;
}

function heroLabel(action, amount, state) {
  if (action === 'Call') return 'Call $' + n(Math.min(state.to_call ?? 0, state.max_bet ?? 0));
  if (action === 'Bet' || action === 'Raise') return action + ' $' + n(amount);
  if (action === 'AllIn') return 'All-In $' + n(amount);
  return action;
}

// "You won $450 — Two Pair", from next_hand()'s last_result, as main.js words it.
function resultText(next) {
  const result = next?.last_result?.[0];
  if (!result) return null;
  const names = result.names ?? [];
  const split = names.length > 1;
  const who = split ? names.slice(0, -1).join(', ') + ' & ' + names.at(-1) : (names[0] ?? 'Unknown');
  const hand = result.hand ? ` — ${result.hand}` : '';
  return `${who} ${split ? 'split' : 'won'} $${n(result.amount)}${hand}`;
}

customElements.define('pk-table', PkTable);

return { PkTable };
})();

export const { PkTable } = __m_embed;
