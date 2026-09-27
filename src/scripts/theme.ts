const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");

function reflect(): void {
  const theme = darkModePreference.matches ? "dark" : "light";
  const root = document.firstElementChild;
  root?.setAttribute("data-theme", theme);
  root?.classList.toggle("dark", theme === "dark");

  // Match the browser chrome to the current page background.
  const bg = window.getComputedStyle(document.body).backgroundColor;
  document
    .querySelector("meta[name='theme-color']")
    ?.setAttribute("content", bg);
}

reflect();

// Re-apply the system preference after View Transitions navigation.
document.addEventListener("astro:after-swap", reflect);

// Carry the theme-color value across View Transitions to prevent the
// browser chrome from flashing during page transitions.
document.addEventListener("astro:before-swap", event => {
  const color = document
    .querySelector("meta[name='theme-color']")
    ?.getAttribute("content");
  if (color) {
    (event as { newDocument: Document }).newDocument
      .querySelector("meta[name='theme-color']")
      ?.setAttribute("content", color);
  }
});

darkModePreference.addEventListener("change", reflect);
