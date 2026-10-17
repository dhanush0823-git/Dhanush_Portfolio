(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const body = document.body;
  const toast = $('#toast');
  let toastTimer;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  };

  // Progressive enhancement: content is visible by default; reveal effects start only after setup.
  try {
    const revealItems = $$('.reveal');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
      revealItems.forEach((item) => observer.observe(item));
      body.classList.add('js');
      revealItems.filter((item) => item.getBoundingClientRect().top < window.innerHeight * .9).forEach((item) => item.classList.add('visible'));
    }
  } catch (error) {
    // Never hide portfolio content if an animation fails.
    body.classList.remove('js');
    $$('.reveal').forEach((item) => item.classList.add('visible'));
  }

  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') !== 'true';
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      navLinks.classList.toggle('open', open);
    });
    $$('#navLinks a').forEach((link) => link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation');
    }));
  }

  const progress = $('#readingProgress');
  const topbar = $('#topbar');
  const updateScroll = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`;
    if (topbar) topbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  const sections = $$('main section[id]');
  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        $$('#navLinks a').forEach((link) => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-28% 0px -60% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Project filters work without changing or reloading the page.
  const projectCards = $$('.project-card[data-category]');
  const filterButtons = $$('.filter-btn');
  const projectCount = $('#projectCount');
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.filter || 'all';
    let count = 0;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    projectCards.forEach((card) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !show);
      if (show) {
        count += 1;
        card.classList.remove('visible');
        requestAnimationFrame(() => card.classList.add('visible'));
      }
    });
    if (projectCount) projectCount.textContent = `SHOWING ${String(count).padStart(2, '0')} PROJECT${count === 1 ? '' : 'S'}`;
  }));

  // Copy the profile snippet as plain text.
  const copyButton = $('#copyCode');
  const codeBlock = $('#profileCode code');
  if (copyButton && codeBlock) {
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(codeBlock.innerText);
        showToast('Profile snippet copied');
      } catch (_) {
        const range = document.createRange();
        range.selectNodeContents(codeBlock);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        showToast('Select the highlighted snippet and copy it');
      }
    });
  }

  // Certificate viewer supports image files and the newly added PDF letter.
  const modal = $('#credentialModal');
  const modalBody = $('#modalBody');
  const modalTitle = $('#modalTitle');
  const modalOpen = $('#modalOpen');
  const closeModal = () => {
    if (!modal || !modalBody) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    body.classList.remove('modal-open');
    modalBody.replaceChildren();
  };
  const openCredential = (source, kind) => {
    if (!modal || !modalBody || !source) return;
    modalBody.replaceChildren();
    if (kind === 'pdf') {
      const frame = document.createElement('iframe');
      frame.src = source;
      frame.title = 'Internship experience letter PDF';
      frame.loading = 'lazy';
      modalBody.appendChild(frame);
      if (modalTitle) modalTitle.textContent = 'VCodez · Data Science Internship Experience Letter';
    } else {
      const image = document.createElement('img');
      image.src = source;
      image.alt = 'Certificate document preview';
      modalBody.appendChild(image);
      if (modalTitle) modalTitle.textContent = 'Certificate preview';
    }
    if (modalOpen) modalOpen.href = source;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    body.classList.add('modal-open');
    $('#modalClose')?.focus();
  };
  $$('[data-image]').forEach((button) => button.addEventListener('click', () => openCredential(button.dataset.image, 'image')));
  $$('[data-pdf]').forEach((button) => button.addEventListener('click', () => openCredential(button.dataset.pdf, 'pdf')));
  $('#modalClose')?.addEventListener('click', closeModal);
  $$('[data-close-modal]').forEach((item) => item.addEventListener('click', closeModal));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modal?.classList.contains('open')) closeModal(); });

  // Subtle cursor light and pointer tilt on larger screens only.
  const glow = $('#cursorGlow');
  if (glow && window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('pointermove', (event) => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
      glow.style.opacity = '1';
    }, { passive: true });
    document.addEventListener('pointerleave', () => { glow.style.opacity = '0'; });
  }
  const heroArt = $('#heroArt');
  if (heroArt && window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroArt.addEventListener('pointermove', (event) => {
      const rect = heroArt.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      const frame = $('.portrait-frame', heroArt);
      if (frame) frame.style.transform = `translate(calc(-50% + ${x * 9}px), calc(-50% + ${y * 9}px)) rotate(${2 + x * 2}deg)`;
    });
    heroArt.addEventListener('pointerleave', () => {
      const frame = $('.portrait-frame', heroArt);
      if (frame) frame.style.transform = '';
    });
  }

  // Skill Studio: filter the skills dashboard by discipline.
  const skillCards = $$('.skill-card[data-skill]');
  const skillTabs = $$('.skill-tab[data-skill-filter]');
  const skillCount = $('#skillVisibleCount');
  skillTabs.forEach((tab) => tab.addEventListener('click', () => {
    const filter = tab.dataset.skillFilter || 'all';
    let visible = 0;
    skillTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    skillCards.forEach((card) => {
      const show = filter === 'all' || card.dataset.skill === filter;
      card.classList.toggle('is-hidden', !show);
      if (show) { visible += 1; card.style.animationDelay = `${Math.min(visible, 8) * 22}ms`; }
      else card.style.animationDelay = '0ms';
    });
    if (skillCount) skillCount.textContent = String(visible);
  }));

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
