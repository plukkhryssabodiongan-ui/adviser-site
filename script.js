const { SUPABASE_URL, SUPABASE_ANON_KEY, BOOKING_URL } = window.CONFIG;
const steps = document.querySelectorAll('.step');
const bar = document.getElementById('bar');
const answers = {};
let current = 1;

function show(n) {
  current = n;
  steps.forEach(s => s.classList.toggle('active', Number(s.dataset.step) === n));
  bar.style.width = (Math.min(n - 1, 4) / 4) * 100 + '%';
}

document.querySelectorAll('.options').forEach(group => {
  group.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    answers[group.dataset.key] = btn.textContent.trim();
    show(current + 1);
  });
});

document.querySelectorAll('.back').forEach(b =>
  b.addEventListener('click', () => show(current - 1))
);

const form = document.getElementById('lead-form');
const statusEl = document.getElementById('form-status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = new FormData(form);
  if (f.get('website')) return; // spam trap: real people never fill this

  const btn = form.querySelector('button[type=submit]');
  btn.disabled = true;
  statusEl.textContent = 'Sending...';

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        full_name: f.get('name'),
        email: f.get('email'),
        phone: f.get('phone'),
        answers,
        consent: f.get('consent') === 'on'
      })
    });
    if (!res.ok) throw new Error();
    document.getElementById('book-link').href = BOOKING_URL;
    show(5);
  } catch {
    statusEl.textContent = 'Something went wrong. Please try again.';
    btn.disabled = false;
  }
});
