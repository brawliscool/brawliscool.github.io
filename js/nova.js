const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation?.classList.remove('open');
  menu?.setAttribute('aria-expanded', 'false');
  menu?.setAttribute('aria-label', 'Open navigation');
}
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  navigation?.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
navigation?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

// Keep the assistant's styles, dialog, audio code and connection off the critical path.
const launch = document.querySelector('.nova-reception-launch');
let assistant;
let loading;
function loadAssistantStyles() {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/receptionist.css?v=performance-20261019';
    link.onload = resolve;
    link.onerror = () => { link.remove(); reject(new Error('Unable to load Nova')); };
    document.head.append(link);
  });
}
launch?.addEventListener('click', async () => {
  if (loading) return;
  if (assistant) { assistant.toggleReceptionist(); return; }
  launch.setAttribute('aria-busy', 'true');
  launch.textContent = 'Loading Nova…';
  loading = Promise.all([loadAssistantStyles(), import('./receptionist.js?v=performance-20261019')]);
  try {
    const [, module] = await loading;
    assistant = module;
    assistant.toggleReceptionist();
  } catch {
    launch.textContent = 'Retry Nova';
  } finally {
    loading = undefined;
    launch.removeAttribute('aria-busy');
    if (assistant) launch.textContent = '✦ Ask Nova';
  }
});


// Activate booking near the viewport or on interaction, including direct #contact links.
const bookingForm = document.querySelector('#quoteForm');
if (bookingForm) {
  let ready = false;
  let pending;
  function loadBooking() {
    if (!pending) pending = import('./main.js?v=performance-20261019').then(() => { ready = true; });
    return pending.catch(error => { pending = undefined; throw error; });
  }
  function prepareBooking() {
    loadBooking().catch(() => {
      document.querySelector('#formStatus').textContent = 'Unable to load booking. Please try again.';
    });
  }
  bookingForm.addEventListener('focusin', prepareBooking, { once: true });
  bookingForm.addEventListener('submit', event => {
    if (ready) return;
    event.preventDefault();
    loadBooking().then(() => bookingForm.requestSubmit()).catch(() => {
      document.querySelector('#formStatus').textContent = 'Unable to load booking. Please try again.';
    });
  });
  document.querySelectorAll('[data-package]').forEach(link => {
    link.addEventListener('click', () => {
      bookingForm.elements.service.value = link.dataset.package;
      prepareBooking();
    });
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); prepareBooking(); }
    }, { rootMargin: '600px' });
    observer.observe(bookingForm);
  } else prepareBooking();
}
