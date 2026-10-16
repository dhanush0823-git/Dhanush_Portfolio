(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  document.addEventListener('DOMContentLoaded', () => {
    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();

    const menuToggle = $('#menuToggle');
    const navLinks = $('#navLinks');
    menuToggle?.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
    $$('#navLinks a').forEach(link => link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    }));

    const progress = $('#progressBar');
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = `${max > 0 ? window.scrollY / max * 100 : 0}%`;
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    // Content stays visible even when IntersectionObserver is unavailable.
    const revealItems = $$('.reveal');
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('motion-ready');
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      }), { threshold: 0.08 });
      revealItems.forEach(el => observer.observe(el));
      window.setTimeout(() => revealItems.forEach(el => el.classList.add('visible')), 1600);
    } else {
      revealItems.forEach(el => el.classList.add('visible'));
    }

    const sections = $$('main section[id]');
    if ('IntersectionObserver' in window) {
      const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) $$('#navLinks a').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }), { rootMargin: '-35% 0px -55% 0px' });
      sections.forEach(section => sectionObserver.observe(section));
    }

    const toast = $('#toast');
    let toastTimer;
    const showToast = message => {
      if (!toast) return;
      toast.textContent = message;
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('show'), 2100);
    };

    $('#copyProfile')?.addEventListener('click', async () => {
      const code = $('#profileCode')?.innerText || '';
      try {
        await navigator.clipboard.writeText(code);
        showToast('Profile snippet copied to clipboard');
      } catch {
        const range = document.createRange();
        range.selectNodeContents($('#profileCode'));
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        showToast('Select and copy the highlighted snippet');
      }
    });

    const imageModal = $('#imageModal');
    const preview = $('#certificatePreview');
    const closeModal = () => {
      imageModal?.classList.remove('open');
      imageModal?.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (preview) preview.src = '';
    };
    $$('.credential-image').forEach(button => button.addEventListener('click', () => {
      if (!imageModal || !preview) return;
      preview.src = button.dataset.image;
      imageModal.classList.add('open');
      imageModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }));
    $('#imageClose')?.addEventListener('click', closeModal);
    imageModal?.addEventListener('click', event => { if (event.target === imageModal) closeModal(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });
  });
})();
