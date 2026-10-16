const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

document.addEventListener("DOMContentLoaded", () => {
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Mobile navigation
  const menuToggle = $("#menuToggle");
  const navLinks = $("#navLinks");
  menuToggle?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  $$("#navLinks a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // Scroll progress
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
    $("#progressBar").style.width = `${percent}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // Reveal on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  $$(".reveal").forEach(el => {
    el.classList.add("reveal-pending");
    observer.observe(el);
  });

  // Active navigation
  const sections = $$("main section[id]");
  const navItems = $$("#navLinks a");
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });

  sections.forEach(section => sectionObserver.observe(section));

  // Case-study modal
  const caseData = {
    ecommerce: {
      title: "E-Commerce Sales Analytics Dashboard",
      problem: "Turn 50,000+ sales transactions into understandable business intelligence around purchasing behavior, revenue trends and performance.",
      approach: "Processed and analyzed transactions using SQL and Python, performed data cleaning and feature preparation, explored customer and regional patterns, and presented the insights in Power BI.",
      result: "The resume documents KPI tracking, customer segmentation, regional sales analysis and forecasting, with reporting time reduced by 30%."
    },
    student: {
      title: "Student Performance Analytics Dashboard",
      problem: "Understand academic performance patterns and factors influencing outcomes.",
      approach: "Performed data cleaning and exploratory data analysis, then built Power BI dashboards visualizing attendance, marks and pass percentage.",
      result: "The dashboard supports early identification of students who may be at risk based on the documented analytical views."
    },
    healthcare: {
      title: "Healthcare Analytics Dashboard",
      problem: "Transform healthcare datasets into useful patient and operational reporting.",
      approach: "Processed and transformed healthcare datasets using SQL and Python and developed interactive Power BI dashboards.",
      result: "The dashboard monitors hospital KPIs, patient trends and operational performance."
    }
  };

  const modal = $("#caseModal");
  const modalContent = $("#modalContent");

  $$(".case-btn").forEach(button => {
    button.addEventListener("click", () => {
      const data = caseData[button.dataset.modal];
      if (!data) return;
      modalContent.innerHTML = `
        <h2>${data.title}</h2>
        <h4>PROBLEM</h4><p>${data.problem}</p>
        <h4>APPROACH</h4><p>${data.approach}</p>
        <h4>RESULT / DOCUMENTED OUTCOME</h4><p>${data.result}</p>
      `;
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  // Certificate viewer
  const imageModal = $("#imageModal");
  const preview = $("#certificatePreview");

  $$(".cert-image").forEach(button => {
    button.addEventListener("click", () => {
      preview.src = button.dataset.image;
      imageModal.classList.add("open");
      imageModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  const closeAll = () => {
    modal.classList.remove("open");
    imageModal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    imageModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  $$("[data-close]").forEach(button => button.addEventListener("click", closeAll));

  [modal, imageModal].forEach(layer => {
    layer.addEventListener("click", e => {
      if (e.target === layer) closeAll();
    });
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeAll();
  });
});