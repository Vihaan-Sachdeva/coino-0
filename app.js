const root = document.documentElement;
const toggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('coino-theme');
if (savedTheme) root.setAttribute('data-theme', savedTheme);

if (toggle) {
  toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('coino-theme', next);
  });
}

const bind = (id) => document.getElementById(id);
const income = bind('income');
const needs = bind('needs');
const wants = bind('wants');
const save = bind('save');

if (income && needs && wants && save) {
  const incomeVal = bind('incomeVal');
  const needsVal = bind('needsVal');
  const wantsVal = bind('wantsVal');
  const saveVal = bind('saveVal');
  const planned = bind('planned');
  const leftover = bind('leftover');
  const tip = bind('budgetTip');
  const donut = bind('budgetDonut');

  const update = () => {
    const i = +income.value;
    const n = +needs.value;
    const w = +wants.value;
    const s = +save.value;
    const total = n + w + s;
    const left = i - total;

    incomeVal.textContent = i;
    needsVal.textContent = n;
    wantsVal.textContent = w;
    saveVal.textContent = s;
    planned.textContent = `£${total}`;
    leftover.textContent = `£${left}`;

    const p1 = Math.min(100, (n / i) * 100);
    const p2 = Math.min(100, ((n + w) / i) * 100);
    donut.style.background = `conic-gradient(#ff9f00 ${p1}%, #ffd35b ${p2}%, rgba(255,255,255,0.2) 0)`;

    if (left > 0) tip.textContent = 'Great! You still have money left.';
    else if (left === 0) tip.textContent = 'Perfect balance — everything is planned.';
    else tip.textContent = 'Oops! You planned more than your income.';
  };

  [income, needs, wants, save].forEach((el) => el.addEventListener('input', update));
  update();
}

const rings = document.querySelectorAll('.ring');
rings.forEach((ring) => {
  const target = +ring.dataset.target;
  let current = +ring.dataset.current;
  const text = ring.querySelector('span');

  const refresh = () => {
    const pct = Math.min(100, Math.round((current / target) * 100));
    ring.style.setProperty('--p', pct);
    text.textContent = `£${current} / £${target}`;
  };

  refresh();

  const card = ring.closest('.goal-card');
  card?.querySelector('.add-save')?.addEventListener('click', () => {
    current = Math.min(target, current + 5);
    refresh();
    card.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.02)' }, { transform: 'scale(1)' }], {
      duration: 300,
      easing: 'ease-out'
    });
  });
});

const filters = document.querySelectorAll('#categoryFilters .pill');
const bars = document.querySelectorAll('#insightBars .bar-wrap i');
const base = [55, 70, 48, 80, 92];

filters.forEach((btn) => {
  btn.addEventListener('click', () => {
    filters.forEach((f) => f.classList.remove('active'));
    btn.classList.add('active');
    const mult = +btn.dataset.mult;

    bars.forEach((bar, idx) => {
      bar.style.setProperty('--v', Math.round(base[idx] * mult));
    });
  });
});
