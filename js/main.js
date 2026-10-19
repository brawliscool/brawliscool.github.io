import { business, validateBooking } from './business.js';

const form = document.getElementById('quoteForm');
if (form) {
  const status = document.getElementById('formStatus');
  const submit = form.querySelector('[type="submit"]');
  const select = form.elements.service;
  let startedAt = Date.now();
  let requestId = crypto.randomUUID();
  let sending = false;

  form.elements.date.min = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago' }).format(new Date());
  const selectedPackage = select.value;
  function option(text, value) {
    const element = document.createElement('option');
    element.textContent = text;
    element.value = value;
    return element;
  }
  select.replaceChildren(option('Choose a package', ''), ...business.packages.map(
    p => option(`${p.name} — from $${p.price}`, p.id)
  ));
  select.value = selectedPackage;
  document.querySelectorAll('[data-package]').forEach(link => {
    link.addEventListener('click', () => { select.value = link.dataset.package; });
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    const input = { ...Object.fromEntries(new FormData(form)), startedAt, requestId };
    try { validateBooking(input); }
    catch (error) { status.textContent = error.message; return; }
    sending = true;
    submit.disabled = true;
    const label = submit.textContent;
    submit.textContent = 'Sending…';
    status.textContent = '';
    try {
      const { submitBooking } = await import('./booking-api.js');
      const data = await submitBooking(input);
      form.reset();
      requestId = crypto.randomUUID();
      startedAt = Date.now();
      status.textContent = data.message;
    } catch (error) {
      const reason = error.name === 'TimeoutError' ? 'The request timed out. You can retry safely.' : error.message;
      status.textContent = `${reason || 'Unable to submit.'} Please try again later. Your details have been kept.`;
    } finally {
      sending = false;
      submit.disabled = false;
      submit.textContent = label;
    }
  });
}
