const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");
const galleryItems = document.querySelectorAll(".gallery-item");
const revealTargets = document.querySelectorAll(".section, .hero-copy, .hero-card");

// Close the mobile menu and restore normal page scrolling.
const closeMenu = () => {
  if (!navToggle || !navMenu) {
    return;
  }

  navMenu.classList.remove("open");
  navToggle.classList.remove("active");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
};

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");

    navToggle.classList.toggle("active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });
}

// Intercept anchor clicks so navigation feels smooth across sections.
navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = targetId ? document.querySelector(targetId) : null;

    if (!target) {
      return;
    }

    event.preventDefault();
    closeMenu();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});

// Keep the current section reflected in the sticky navigation state.
const updateActiveLink = () => {
  const currentPosition = window.scrollY + 140;

  sections.forEach((section) => {
    const id = section.getAttribute("id");
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);

    if (!link) {
      return;
    }

    const inView =
      currentPosition >= section.offsetTop &&
      currentPosition < section.offsetTop + section.offsetHeight;

    link.classList.toggle("active", inView);
  });
};

window.addEventListener("scroll", updateActiveLink);
window.addEventListener("load", updateActiveLink);
window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    closeMenu();
  }
});

// Add a small JS-powered hover state for gallery tiles.
galleryItems.forEach((item) => {
  item.addEventListener("mouseenter", () => item.classList.add("is-hovered"));
  item.addEventListener("mouseleave", () => item.classList.remove("is-hovered"));
});

// Reveal sections progressively as they enter the viewport.
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18
    }
  );

  revealTargets.forEach((target) => {
    target.classList.add("reveal");
    revealObserver.observe(target);
  });
}
