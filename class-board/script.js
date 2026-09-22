/*
 * 모든 페이지 공용 스크립트.
 * 각 페이지는 <body data-page="폴더이름" data-root="상대경로"> 만 다르다.
 * 나머지(이름 그리드, 링크, 타이머, 방명록)는 전부 config.js 를 읽어서 그린다.
 */
(() => {
  'use strict';

  const C = window.CONFIG || {};
  const STUDENTS = C.STUDENTS || [];
  const PAGE = document.body.dataset.page || 'home';
  const ROOT = document.body.dataset.root || '.';
  const $ = (sel, el = document) => el.querySelector(sel);

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
  const pageHref = (id) => (id === 'home' ? `${ROOT}/index.html` : `${ROOT}/${id}/index.html`);

  // ── 지금 페이지가 누구인가 (폴더 이름 = 시트 이름) ─────────────
  function currentEntry() {
    if (PAGE === 'home') return { id: 'home', ...(C.HOME || {}) };
    if (PAGE === (C.EVERYONE && C.EVERYONE.id)) return { ...C.EVERYONE };
    return STUDENTS.find((s) => s.id === PAGE) || { id: PAGE, name: PAGE };
  }
  const entry = currentEntry();
  const SHEET = entry.id;

  // 주소가 비어 있을 때 iframe에 띄울 안내 화면 (data: URL → target="board" 링크로도 열 수 있다)
  function placeholder(title, msg) {
    const html = `<!doctype html><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Gowun+Batang&display=swap" rel="stylesheet">
<style>html,body{height:100%;margin:0}body{display:grid;place-items:center;background:#fff;color:#111;
font-family:'Gowun Batang',serif;text-align:center;word-break:keep-all;padding:24px;box-sizing:border-box}
h1{font-size:30px;font-weight:400;margin:0 0 14px}p{color:#888;margin:0;line-height:1.7}</style>
<div><h1>${esc(title)}</h1><p>${msg}</p></div>`;
    return 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
  }
  const who = PAGE === 'home' ? C.SITE_TITLE : (entry.name || entry.id);
  const urlOr = (url, what) => url || placeholder(who, `아직 ${what}가 연결되지 않았어요.<br>config.js 에서 주소를 넣어주세요.`);

  // ── 1. iframe ──────────────────────────────────────────────
  const board = $('#board');
  if (board) board.src = urlOr(entry.doc, '문서');

  // ── 2. 상단 "다들 뭐하고 있나요?" 링크 ─────────────────────────
  const everyone = $('#everyone');
  if (everyone && C.EVERYONE) {
    everyone.href = pageHref(C.EVERYONE.id);
    everyone.textContent = C.SITE_TITLE;
    if (PAGE === C.EVERYONE.id) everyone.setAttribute('aria-current', 'page');
  }
  const home = $('#home');
  if (home) {
    home.href = pageHref('home');
    if (PAGE === 'home') home.setAttribute('aria-current', 'page');
  }

  // ── 3. 이름 버튼 그리드 (그냥 페이지 이동) ──────────────────────
  const names = $('#names');
  if (names) {
    STUDENTS.forEach((s) => {
      const a = document.createElement('a');
      a.className = 'name';
      a.href = pageHref(s.id);
      a.textContent = s.name;
      if (s.id === PAGE) a.setAttribute('aria-current', 'page');
      names.append(a);
    });
  }

  // ── 4. iframe 스위처: target="board" — JS는 링크를 그리기만 하고, 전환은 HTML이 한다 ──
  const links = $('#links');
  if (links) {
    const items = [
      [PAGE === 'home' ? '안녕' : `안녕(${entry.name || who})`, urlOr(entry.doc, '문서')],
      ['드라이브', urlOr(entry.drive, '드라이브 폴더')],
    ];
    links.innerHTML = items
      .map(([label, href]) => `<a href="${esc(href)}" target="board">${esc(label)}</a>`)
      .join('');
    if (entry.doc) {
      links.insertAdjacentHTML('beforeend',
        `<a class="newtab" href="${esc(entry.doc)}" target="_blank" rel="noopener" title="새 탭에서 열기">↗</a>`);
    }
  }

  // ── 5. 듀얼 타이머 (D-day ↔ 발표 타이머) ────────────────────────
  const timer = $('#timer');
  if (timer) initTimer(timer);

  function initTimer(el) {
    const presets = C.TALK_PRESETS || [3, 5, 7, 10, 15];
    el.innerHTML = `
      <div class="timer-head">
        <span class="timer-label"></span>
        <button type="button" class="timer-toggle" title="발표 타이머 전환 (T)" aria-pressed="false">T</button>
      </div>
      <div class="timer-big"></div>
      <div class="timer-sub"></div>
      <div class="timer-controls" hidden>
        <div class="presets">${presets.map((m) => `<button type="button" data-min="${m}">${m}분</button>`).join('')}</div>
        <div class="actions">
          <button type="button" data-act="start">시작</button>
          <button type="button" data-act="reset">리셋</button>
        </div>
      </div>`;

    const label = $('.timer-label', el);
    const big = $('.timer-big', el);
    const sub = $('.timer-sub', el);
    const controls = $('.timer-controls', el);
    const toggle = $('.timer-toggle', el);
    const startBtn = $('[data-act="start"]', el);

    const target = new Date((C.EXHIBITION && C.EXHIBITION.date) || Date.now()).getTime();
    const exLabel = (C.EXHIBITION && C.EXHIBITION.label) || 'D-day';
    const pad = (n) => String(n).padStart(2, '0');
    const kstDay = (t) => Math.floor((t + 9 * 3600e3) / 86400e3); // 한국 날짜 기준 일수

    const talk = { duration: presets[0] * 60e3, remaining: presets[0] * 60e3, endAt: 0, running: false };
    let mode = 'dday';

    function setDone(done) {
      el.classList.toggle('time-up', done);
      document.body.classList.toggle('time-up', done);
    }

    function selectPreset(min) {
      talk.duration = talk.remaining = min * 60e3;
      talk.running = false;
      setDone(false);
      el.querySelectorAll('[data-min]').forEach((b) => b.classList.toggle('on', Number(b.dataset.min) === min));
      render();
    }

    function render() {
      const now = Date.now();
      if (mode === 'dday') {
        const diff = target - now;
        const dd = kstDay(target) - kstDay(now);
        label.textContent = `${exLabel}까지`;
        big.textContent = dd > 0 ? `D-${dd}` : dd === 0 ? 'D-DAY' : `D+${-dd}`;
        if (diff > 0) {
          const s = Math.floor(diff / 1000);
          sub.textContent = `${Math.floor(s / 86400)}일 ${pad(Math.floor(s / 3600) % 24)}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
        } else {
          sub.textContent = '오픈!';
        }
        el.classList.remove('warn');
        return;
      }
      if (talk.running) {
        talk.remaining = Math.max(0, talk.endAt - now);
        if (talk.remaining === 0) {
          talk.running = false;
          setDone(true);
        }
      }
      const s = Math.ceil(talk.remaining / 1000);
      label.textContent = '발표 타이머';
      big.textContent = `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
      sub.textContent = talk.remaining === 0 ? '끝!' : `${Math.round(talk.duration / 60e3)}분 중`;
      startBtn.textContent = talk.running ? '일시정지' : (talk.remaining < talk.duration && talk.remaining > 0 ? '계속' : '시작');
      el.classList.toggle('warn', talk.remaining > 0 && talk.remaining <= 60e3);
    }

    function switchMode() {
      mode = mode === 'dday' ? 'talk' : 'dday';
      controls.hidden = mode !== 'talk';
      toggle.setAttribute('aria-pressed', String(mode === 'talk'));
      el.classList.toggle('talk', mode === 'talk');
      if (mode === 'dday') setDone(false);
      else if (talk.remaining === 0) setDone(true);
      render();
    }

    toggle.addEventListener('click', switchMode);
    el.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.min) selectPreset(Number(b.dataset.min));
      if (b.dataset.act === 'start') {
        if (talk.running) {
          talk.running = false;
          talk.remaining = Math.max(0, talk.endAt - Date.now());
        } else {
          if (talk.remaining === 0) talk.remaining = talk.duration;
          setDone(false);
          talk.endAt = Date.now() + talk.remaining;
          talk.running = true;
        }
        render();
      }
      if (b.dataset.act === 'reset') selectPreset(Math.round(talk.duration / 60e3));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 't' && e.key !== 'T') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target.closest('input, textarea, [contenteditable]')) return;
      switchMode();
    });

    selectPreset(presets[0]);
    render();
    setInterval(render, 250);
  }

  // ── 6. 페이지별 방명록 (Google Sheets via Apps Script) ─────────
  const gb = $('#guestbook');
  if (gb) initGuestbook(gb);

  function initGuestbook(el) {
    const form = $('form', el);
    const input = $('textarea', el);
    const count = $('.gb-count', el);
    const btn = $('button[type="submit"]', el);
    const list = $('.gb-list', el);
    const status = $('.gb-status', el);
    const URL_ = (C.SCRIPT_URL || '').trim();
    const MAX = Number(input.getAttribute('maxlength')) || 500;
    const demo = [];
    let loadSeq = 0;

    const fmt = new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
    });

    function say(msg) {
      status.textContent = msg || '';
      status.hidden = !msg;
    }

    function item(c, pending) {
      const li = document.createElement('li');
      if (pending) li.className = 'pending';
      const t = document.createElement('time');
      const d = new Date(c.timestamp);
      if (!isNaN(d)) {
        t.dateTime = d.toISOString();
        const v = Object.fromEntries(fmt.formatToParts(d).map((x) => [x.type, x.value]));
        t.textContent = `${v.month}.${v.day} ${v.hour}:${v.minute}`;
      }
      const p = document.createElement('p');
      p.textContent = c.message; // textContent → HTML 주입 불가
      li.append(t, p);
      return li;
    }

    function render(comments) {
      comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      list.replaceChildren(...comments.map((c) => item(c)));
      if (!comments.length) {
        const li = document.createElement('li');
        li.className = 'empty';
        li.textContent = '아직 아무도 안 왔어요.';
        list.append(li);
      }
    }

    async function load() {
      if (!URL_) {
        say('미리보기 모드 — config.js 에 SCRIPT_URL을 넣기 전까지 댓글은 저장되지 않아요.');
        render(demo.slice());
        return;
      }
      const seq = ++loadSeq;
      try {
        const res = await fetch(`${URL_}?sheet=${encodeURIComponent(SHEET)}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(res.status);
        const data = await res.json();
        if (seq !== loadSeq) return; // 더 최근 요청이 있으면 버린다
        render(Array.isArray(data) ? data : []);
        say('');
      } catch (err) {
        if (seq === loadSeq) say('댓글을 불러오지 못했어요.');
      }
    }

    async function submit() {
      const message = input.value.trim().slice(0, MAX);
      if (!message) return;
      const comment = { timestamp: new Date().toISOString(), message, sheet: SHEET };

      list.querySelector('.empty')?.remove();
      list.prepend(item(comment, true)); // 일단 화면에 먼저 보여준다
      input.value = '';
      updateCount();

      if (!URL_) {
        demo.push(comment);
        return;
      }
      btn.disabled = true;
      try {
        // Apps Script는 POST 응답에 CORS 헤더를 잘 안 준다 → no-cors로 던지고 응답은 안 읽는다.
        // (문자열 body = text/plain → preflight도 안 생긴다)
        await fetch(URL_, { method: 'POST', mode: 'no-cors', body: JSON.stringify(comment) });
        // 성공 여부를 알 수 없으니 잠시 뒤 목록을 다시 불러와서 확인
        setTimeout(load, 1200);
      } catch (err) {
        say('전송에 실패했어요. 잠시 뒤 다시 시도해주세요.');
        list.querySelector('.pending')?.remove();
        input.value = message;
        updateCount();
      } finally {
        btn.disabled = false;
      }
    }

    function updateCount() {
      count.textContent = `${input.value.length}/${MAX}`;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submit();
    });
    input.addEventListener('input', updateCount);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        submit();
      }
    });

    updateCount();
    load();
    // 다른 사람이 남긴 댓글도 보이게 가끔 새로고침 (탭이 보일 때만)
    setInterval(() => { if (URL_ && !document.hidden) load(); }, 60e3);
  }
})();
