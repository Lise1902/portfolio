// =====================================================
// LET'S CONNECT
// Lise stands on her platform, lit by two spotlights.
// Below her: 3 ways to connect (email / LinkedIn / Calendly call).
// Click: a small animation, then the right app or page opens.
// =====================================================

const CONTACT = {
  email: "lise.bousquet@gmail.com",
  linkedin: "https://www.linkedin.com/in/lise-bousquet-4b2091265",
  callLink: "https://calendly.com/lise-bousquet-r7cg"
};

(function connect() {
  const plane = document.getElementById("ct-plane");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // spotlight stage: the lamps switch on the first time the page comes into view
  const stage = document.getElementById("ct-spotstage");
  if (stage) {
    if (reduce || !("IntersectionObserver" in window)) stage.classList.add("lit");
    else new IntersectionObserver(([e], obs) => {
      if (e.isIntersecting) { stage.classList.add("lit"); obs.disconnect(); }
    }, { threshold: 0.35 }).observe(stage);
  }

  const enc = encodeURIComponent;
  const LINKS = {
    email: `mailto:${CONTACT.email}?subject=${enc("Hello Lise, from your portfolio")}&body=${enc("Hi Lise,\n\nI came across your portfolio and would love to connect.\n\n")}`,
    linkedin: CONTACT.linkedin,
    call: CONTACT.callLink,
    cv: "cv/Lise_Bousquet_CV.pdf"
  };

  document.querySelectorAll(".ct-opt").forEach((btn) => {
    const kind = btn.dataset.kind;
    btn.addEventListener("click", () => {
      btn.classList.remove("go"); void btn.offsetWidth; btn.classList.add("go");

      // email: a paper plane flies away from the button
      if (kind === "email" && plane && !reduce) {
        const b = btn.getBoundingClientRect(), s = plane.parentElement.getBoundingClientRect();
        plane.style.left = `${b.left - s.left + 30}px`;
        plane.style.top  = `${b.top - s.top + 10}px`;
        plane.classList.remove("fly"); void plane.offsetWidth; plane.classList.add("fly");
      }

      // open the right app or page after the little animation
      setTimeout(() => {
        if (kind === "email") window.location.href = LINKS.email;
        else window.open(LINKS[kind], "_blank", "noopener");
      }, reduce ? 0 : 600);
    });
  });
})();
