document.querySelectorAll(".nav-link").forEach((link) => {
  const isCurrent = new URL(link.href).pathname === window.location.pathname;
  link.classList.toggle("is-active", isCurrent);

  if (isCurrent) {
    link.setAttribute("aria-current", "page");
  }
});
