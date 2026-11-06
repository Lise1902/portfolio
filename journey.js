// =====================================================
// PROFESSIONAL JOURNEY
// Left: one card per experience on a glowing timeline.
// Right: photos and videos of that experience, shown in full.
// Click a card to open "What I did" and "Impact".
// Facts come from Lise's CV and her own notes.
// =====================================================

// media: files in images/journey-web/<id>/  (photos .jpg, videos .mp4), first one is shown first
const JOURNEY = [
  { id: "exclusive-networks",
    company: "Exclusive Networks", logo: "images/logos/exclusive-networks.png", sector: "Cybersecurity distribution",
    dates: "May – Jul 2025", place: "Madrid, Spain", role: "Sales & HR Assistant · Spanish Team",
    summary: "In the Spanish team of a global cybersecurity distributor, I supported sales and marketing: running email campaigns in Oracle NetSuite, managing the company's LinkedIn content and helping organise partner events with vendors such as Fortinet and Netskope.",
    did: [
      "Prepared email campaigns in Oracle NetSuite: content, target customers and send dates planned months ahead",
      "Planned the LinkedIn content calendar for Exclusive Networks Spain (3–4 posts a week) and monitored impressions, views and click-through rate",
      "Managed merchandising and branded gifts for customer events",
      "Visited vendors (Netskope, One Identity, Fortinet) and attended customer events with the sales team"],
    impact: [
      "Kept a <b>steady LinkedIn presence</b> for Exclusive Networks Spain, with <b>3–4 posts published every week</b>",
      "Helped deliver customer and partner events for <b>up to 100 attendees</b>",
      "Strengthened relationships with vendors alongside the sales team"],
    skills: ["CRM / ERP", "Content marketing", "Event management", "Partner relations"],
    media: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"] },

  { id: "orange-cyberdefense",
    company: "Orange Cyberdefense", logo: "images/logos/orange-cyberdefense.png", sector: "Cybersecurity services",
    dates: "May – Jun 2024", place: "London, UK", role: "Sales & HR Assistant · UK Team",
    summary: "In the UK team of Orange's cybersecurity company, I supported the office, marketing and sales teams, from setting up the offices to organising events with clients and partners, and discovered the cybersecurity industry from the inside.",
    did: [
      "Assisted the Office Manager in setting up and running the offices",
      "Supported the Marketing team in organising off-site events with clients and partners",
      "Visited partners (Zscaler, Netskope) with the sales team",
      "Attended Infosecurity Europe 2024, visited partner stands (Palo Alto Networks, Check Point, Fortinet, Microsoft, Netskope, F5 and Proofpoint), filmed meetings throughout the event and edited a highlights video for Orange Cyberdefense"],
    impact: [
      "Delivered the <b>Infosecurity Europe 2024 highlights video</b> of Orange Cyberdefense's meetings",
      "Helped <b>strengthen client and partner engagement</b> through off-site events",
      "Gained first-hand knowledge of the <b>cybersecurity vendor ecosystem</b>"],
    skills: ["Event coordination", "Marketing support", "Video editing", "Cybersecurity ecosystem"],
    media: ["1.jpg", "2.jpg", "3.jpg", "4.jpg"] },

  { id: "netskope",
    company: "Netskope", logo: "images/logos/netskope.png", sector: "Cloud security (SASE)",
    dates: "Oct 2022", place: "London, UK", role: "Sales & HR Assistant · UK Team",
    summary: "In London, I supported Netskope's UK marketing and sales teams. My main mission was lead generation for a Netskope event in Israel: analysing the prospect database, calling prospects and following up with them to boost registrations. I also prepared an HR study comparing employee benefits around the world.",
    did: [
      "Analysed and filtered the event's prospect database in Excel",
      "Made targeted cold calls and followed up with each prospect",
      "Prepared a comparison of employee benefits around the world and presented it to the HR team"],
    impact: [
      "Identified <b>200 unregistered prospects</b> in an Excel file and <b>cold called</b> them",
      "Secured <b>32 event registrations</b> (16% of the target list)"],
    skills: ["Prospecting", "Cold calling", "Excel analysis"],
    media: ["1.jpg", "v1.mp4"] }
];

(function journey() {
  const list = document.getElementById("jr-list");
  if (!list) return;

  const isVideo = (src) => /\.mp4$/i.test(src);

  // ---- reusable pieces ----
  const listHTML = (title, items, cls) => `
    <div class="jr-block ${cls}"><p class="jr-block-title">${title}</p>
      <ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul></div>`;

  function cardHTML(j, n) {
    return `
      <article class="jr-card" tabindex="0" role="button" aria-expanded="false" aria-controls="jr-more-${n}">
        <div class="jr-meta"><span>${j.dates}</span><span>📍 ${j.place}</span></div>
        <div class="jr-head">
          <span class="jr-logo-box"><img class="jr-logo" src="${j.logo}" alt="${j.company} logo"></span>
          <div><h4 class="jr-company">${j.company}</h4><p class="jr-sector">${j.sector}</p></div>
        </div>
        <p class="jr-role">${j.role}</p>
        <p class="jr-summary">${j.summary}</p>
        <div class="jr-more" id="jr-more-${n}">
          <div class="jr-more-inner">
            ${listHTML("WHAT I DID", j.did, "jr-did")}
            ${listHTML("IMPACT", j.impact, "jr-impact")}
            <div class="jr-block"><p class="jr-block-title">SKILLS DEVELOPED</p>
              <div class="jr-tags">${j.skills.map((s) => `<span>${s}</span>`).join("")}</div></div>
          </div>
        </div>
        <span class="jr-toggle" aria-hidden="true"><span class="jr-toggle-txt">See what I did &amp; my impact</span> <span class="jr-chev">↓</span></span>
      </article>`;
  }

  // one media item: a photo shown in full over a soft blurred copy, or a video
  function mediaHTML(src, alt) {
    if (isVideo(src)) {
      return `<video class="jr-media" src="${src}" controls playsinline muted preload="metadata" aria-label="${alt}"></video>`;
    }
    return `<span class="jr-media-bg" style="background-image:url('${src}')"></span>
            <img class="jr-media" src="${src}" alt="${alt}" loading="lazy">`;
  }

  function galleryHTML(j) {
    const items = j.media.map((f) => `images/journey-web/${j.id}/${f}`);
    if (!items.length) {
      return `<div class="jr-gallery jr-empty"><div class="jr-ph"><span class="jr-ph-icon">📷</span><span>Photos coming soon</span><small>${j.company}</small></div></div>`;
    }
    const many = items.length > 1;
    return `<div class="jr-gallery" data-items='${JSON.stringify(items)}'>
      <div class="jr-stage">${mediaHTML(items[0], `${j.company}, 1 of ${items.length}`)}</div>
      ${many ? `<button type="button" class="jr-gbtn jr-prev" aria-label="Previous">‹</button>
      <button type="button" class="jr-gbtn jr-next" aria-label="Next">›</button>
      <span class="jr-count">1 / ${items.length}</span>` : ""}
    </div>`;
  }

  // ---- build each row: dot · card · gallery ----
  JOURNEY.forEach((j, n) => {
    const li = document.createElement("li");
    li.className = "jr-row";
    li.innerHTML = `<span class="jr-dot" aria-hidden="true"></span>${cardHTML(j, n)}${galleryHTML(j)}`;
    list.appendChild(li);

    // open / close the card
    const card = li.querySelector(".jr-card");
    const toggle = () => {
      const open = li.classList.toggle("open");
      card.setAttribute("aria-expanded", open);
      li.querySelector(".jr-toggle-txt").textContent = open ? "Show less" : "See what I did & my impact";
    };
    card.addEventListener("click", toggle);
    card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });

    // small carousel (photos + videos)
    const gal = li.querySelector(".jr-gallery[data-items]");
    if (gal && gal.querySelector(".jr-prev")) {
      const items = JSON.parse(gal.dataset.items);
      const stage = gal.querySelector(".jr-stage"), count = gal.querySelector(".jr-count");
      let k = 0;
      const show = (to) => {
        k = (to + items.length) % items.length;
        stage.innerHTML = mediaHTML(items[k], `${j.company}, ${k + 1} of ${items.length}`);
        count.textContent = `${k + 1} / ${items.length}`;
      };
      gal.querySelector(".jr-prev").addEventListener("click", () => show(k - 1));
      gal.querySelector(".jr-next").addEventListener("click", () => show(k + 1));
    }
  });
})();
