const root = document.documentElement;
const toggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('coino-theme');
if (savedTheme) root.setAttribute('data-theme', savedTheme);
if (toggle) toggle.addEventListener('click', () => { const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; root.setAttribute('data-theme', next); localStorage.setItem('coino-theme', next); });

const bind = (id) => document.getElementById(id);

// Budget planner
const income = bind('income');
if (income) {
  const needs = bind('needs'); const wants = bind('wants'); const save = bind('save');
  const incomeVal = bind('incomeVal'); const needsVal = bind('needsVal'); const wantsVal = bind('wantsVal'); const saveVal = bind('saveVal');
  const planned = bind('planned'); const leftover = bind('leftover'); const tip = bind('budgetTip'); const donut = bind('budgetDonut');
  const update = () => {
    const i = +income.value, n = +needs.value, w = +wants.value, s = +save.value;
    const total = n + w + s, left = i - total;
    incomeVal.textContent = i; needsVal.textContent = n; wantsVal.textContent = w; saveVal.textContent = s; planned.textContent = `£${total}`; leftover.textContent = `£${left}`;
    donut.style.background = `conic-gradient(#ff9f00 ${Math.min(100, (n / i) * 100)}%, #ffd35b ${Math.min(100, ((n + w) / i) * 100)}%, rgba(255,255,255,0.2) 0)`;
    tip.textContent = left > 0 ? 'Great! You still have money left.' : left === 0 ? 'Perfect balance — everything is planned.' : 'Oops! You planned more than your income.';
  };
  [income, needs, wants, save].forEach((el) => el.addEventListener('input', update)); update();
}

// Homepage snapshot dynamic filters (max 4)
const snapshotList = bind('snapshotList');
if (snapshotList) {
  const snapshotBars = bind('snapshotBars'); const form = bind('snapshotForm');
  const nameInput = bind('snapshotName'); const valueInput = bind('snapshotValue');
  let filters = [{ name: 'Food', value: 58 }, { name: 'Games', value: 44 }, { name: 'Transport', value: 31 }, { name: 'Save', value: 77 }];
  const draw = () => {
    snapshotList.innerHTML = ''; snapshotBars.innerHTML = '';
    filters.forEach((item, idx) => {
      const row = document.createElement('div'); row.className = 'edit-item';
      row.innerHTML = `<input value="${item.name}" maxlength="12" /><input type="number" min="1" max="100" value="${item.value}" /><button type="button">Delete</button>`;
      const [n, v, d] = row.children;
      n.addEventListener('input', () => { filters[idx].name = n.value || 'Item'; renderBars(); });
      v.addEventListener('input', () => { filters[idx].value = Math.max(1, Math.min(100, +v.value || 1)); renderBars(); });
      d.addEventListener('click', () => { filters.splice(idx, 1); draw(); });
      snapshotList.appendChild(row);
    });
    renderBars();
  };
  const renderBars = () => {
    snapshotBars.innerHTML = '';
    filters.forEach((f) => {
      const g = document.createElement('div'); g.className = 'bar-group';
      g.innerHTML = `<span>${f.name}</span><div class="bar" style="--v:${f.value}"></div><small>${f.value}</small><input class="bar-slider" type="range" min="1" max="100" value="${f.value}" />`;
      const slider = g.querySelector(".bar-slider");
      slider.addEventListener("input", () => { f.value = +slider.value; g.querySelector(".bar").style.setProperty("--v", f.value); g.querySelector("small").textContent = f.value; const row = snapshotList.children[filters.indexOf(f)]; if (row) row.children[1].value = f.value; });
      snapshotBars.appendChild(g);
    });
  };
  form.addEventListener('submit', (e) => {
    e.preventDefault(); if (filters.length >= 4) return;
    const name = nameInput.value.trim(); const value = +valueInput.value;
    if (!name || !value) return;
    filters.push({ name, value: Math.max(1, Math.min(100, value)) }); nameInput.value = ''; valueInput.value = ''; draw();
  });
  draw();
}

// Savings goals dynamic create/delete
const goalList = bind('goalList');
if (goalList) {
  const form = bind('goalForm'); const goalName = bind('goalName'); const goalTarget = bind('goalTarget'); const goalCurrent = bind('goalCurrent');
  let goals = [{ name: '🎧 Headphones', target: 120, current: 45 }, { name: '🚲 Bike Upgrade', target: 200, current: 80 }, { name: '🎮 New Game', target: 60, current: 20 }];
  const drawGoals = () => {
    goalList.innerHTML = '';
    goals.forEach((g, idx) => {
      const pct = Math.min(100, Math.round((g.current / g.target) * 100));
      const card = document.createElement('article'); card.className = 'glass goal-card reveal';
      card.innerHTML = `<input value="${g.name}" maxlength="20"/><div class="ring" style="--p:${pct}"><span>£${g.current} / £${g.target}</span></div><div class="inline-form"><input type="number" min="1" value="${g.target}" /><input type="number" min="0" value="${g.current}" /><button class="btn btn-primary" type="button">+£5</button><button type="button">Delete</button></div>`;
      const [nameEl, , controls] = card.children;
      const [targetEl, currentEl, addBtn, delBtn] = controls.children;
      nameEl.addEventListener('input', () => { goals[idx].name = nameEl.value || 'Goal'; });
      targetEl.addEventListener('input', () => { goals[idx].target = Math.max(1, +targetEl.value || 1); drawGoals(); });
      currentEl.addEventListener('input', () => { goals[idx].current = Math.max(0, +currentEl.value || 0); drawGoals(); });
      addBtn.addEventListener('click', () => { goals[idx].current = Math.min(goals[idx].target, goals[idx].current + 5); drawGoals(); });
      delBtn.addEventListener('click', () => { goals.splice(idx, 1); drawGoals(); });
      goalList.appendChild(card);
    });
  };
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = goalName.value.trim(); const target = +goalTarget.value; const current = +goalCurrent.value;
    if (!name || !target || current < 0) return;
    goals.push({ name, target: Math.max(1, target), current: Math.min(target, Math.max(0, current)) });
    goalName.value = ''; goalTarget.value = ''; goalCurrent.value = ''; drawGoals();
  });
  drawGoals();
}

// Spending insights custom filters with per-day values
const insightBars = bind('insightBars');
if (insightBars) {
  const form = bind('insightFilterForm'); const nameInput = bind('insightFilterName'); const list = bind('insightFilterList');
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let filters = [{ name: 'All', values: [55, 70, 48, 80, 92, 66, 44] }];
  let active = 0;

  const renderBars = () => {
    insightBars.innerHTML = '';
    const data = filters[active]?.values || [];
    days.forEach((d, i) => {
      const wrap = document.createElement('div'); wrap.className = 'bar-wrap';
      const val = data[i] || 0;
      wrap.innerHTML = `<span>${d}</span><i style="--v:${val || 1}"></i><small>${val}</small><input class="bar-slider" type="range" min="0" max="100" value="${val}" />`;
      wrap.querySelector(".bar-slider").addEventListener("input", (e) => {
        const v = +e.target.value;
        filters[active].values[i] = v;
        wrap.querySelector("i").style.setProperty("--v", v || 1);
        wrap.querySelector("small").textContent = v;
        const activeBox = list.children[active];
        if (activeBox) {
          const dayInput = activeBox.querySelector(`[data-di="${i}"]`);
          if (dayInput) dayInput.value = v;
        }
      });
      insightBars.appendChild(wrap);
    });
  };

  const renderFilters = () => {
    list.innerHTML = '';
    filters.forEach((f, idx) => {
      const box = document.createElement('div'); box.className = 'glass'; box.style.padding = '.75rem';
      const dayInputs = days.map((d, di) => `<label>${d}<input type="number" min="0" max="100" data-di="${di}" value="${f.values[di]}" /></label>`).join(' ');
      box.innerHTML = `<div class="inline-form"><input value="${f.name}" maxlength="14" /><button type="button">Use</button><button type="button">Delete</button></div><div class="inline-form">${dayInputs}</div>`;
      const top = box.querySelector('.inline-form');
      const nameEl = top.children[0], useBtn = top.children[1], delBtn = top.children[2];
      nameEl.addEventListener('input', () => { filters[idx].name = nameEl.value || 'Filter'; });
      useBtn.addEventListener('click', () => { active = idx; renderBars(); });
      delBtn.addEventListener('click', () => { filters.splice(idx, 1); active = Math.max(0, active - (idx <= active ? 1 : 0)); renderFilters(); renderBars(); });
      box.querySelectorAll('[data-di]').forEach((inp) => inp.addEventListener('input', () => { filters[idx].values[+inp.dataset.di] = Math.max(0, Math.min(100, +inp.value || 0)); if (idx === active) renderBars(); }));
      list.appendChild(box);
    });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    if (!name) return;
    filters.push({ name, values: [20, 20, 20, 20, 20, 20, 20] });
    nameInput.value = ''; renderFilters();
  });

  renderFilters(); renderBars();
}
