// =====================================================
// MY SKILLS NETWORK
// 8 glass "data capsules" around the avatar, linked by glowing cables.
// Click a capsule: a light pulse runs along its cable and a
// panel opens with the skill, a short story and real evidence.
// All facts come from Lise's CV — nothing invented.
// =====================================================

const SKILLS = [
  // ---- SOFT SKILLS (left) ----
  { side: "left", icon: "🌍", title: "Open-minded & Adaptable",
    text: "Growing up between Paris, Dublin, Brussels and Dubai, then studying in London, Madrid and Berlin, taught me to settle in fast and thrive in a truly international environment.",
    evidence: ["7 countries lived in", "Bachelor across 3 ESCP campuses: London, Madrid and Berlin", "French (native), English (C1), Spanish (B1) and German (beginner)"],
    tags: ["Multicultural", "Fast to adapt", "Languages"] },
  { side: "left", icon: "🔭", title: "Curious",
    text: "Choosing to work in tech means never settling: you keep learning, updating your knowledge and improving yourself. That is exactly what makes it so exciting: you never get bored with tech!",
    evidence: [
      "Selected for an AI immersion in Singapore involving visits to AI-focused firms with a cohort of Imperial College students (April 2027)",
      "<b>AWS Cloud Quest: Cloud Practitioner Certification</b> (2026)",
      "Built this portfolio by piloting Claude Code",
      "<b>Google Cybersecurity Certificate</b> (2025)"],
    tags: ["Lifelong learner", "Tech enthusiast", "Self-improvement"] },
  { side: "left", icon: "🎯", title: "Customer Obsession",
    text: "I put the customer at the centre of every interaction, taking the time to understand their needs before recommending the right solution. I believe lasting relationships are built on trust, attentive listening and delivering value, turning positive customer experiences into long-term results.",
    evidence: [
      "Ranked #1 salesperson among employees across 30 American Vintage stores in the EU (Paris, June 2026)",
      "Generated 12+ individual sales exceeding €700 each (Paris, May–July 2026)",
      "Supported customer and partner events, coordinating experiences for up to 100 attendees at Exclusive Networks (Madrid, 2025)"],
    tags: ["Listening", "Trust", "Value"] },
  { side: "left", icon: "⚡", title: "Proactive",
    text: "I actively identify opportunities, turn them into action and follow through to deliver results. Whether working independently or as part of a team, I bring energy, initiative and a strong sense of responsibility.",
    evidence: [
      "Identified 200 unregistered prospects, conducted targeted outreach and secured 32 event registrations at Netskope (London, 2022)",
      "Set weekly sales targets, identified priorities and proactively monitored store performance as Store Manager at American Vintage (Paris, 2026)",
      "<b>Horse riding (competition level):</b> 12 years of competition, including the French Championships in 2017 and 2018, developing discipline, perseverance and the ability to take initiative"],
    tags: ["Initiative", "Ownership", "Energy"] },

  // ---- TECHNICAL SKILLS (right) ----
  { side: "right", icon: "🤖", title: "AI Agent Orchestration",
    text: "I piloted Claude Code, connected to AWS through the AWS MCP Server, to design, build and deploy this portfolio, turning my ideas into a working website by guiding an AI agent step by step.",
    evidence: ["Directed an AI coding agent from first idea to deployment", "Set up the AWS MCP Server and AWS Agent Toolkit"],
    tags: ["Claude Code", "Prompting"] },
  { side: "right", icon: "💼", title: "CRM & Digital Marketing Tools",
    text: "I use CRM, ERP and digital platforms to manage campaigns, organise customer and prospect data, plan content and monitor performance. I enjoy turning data into actionable insights to support sales and marketing activities.",
    evidence: [
      "<b>Oracle NetSuite:</b> planned and scheduled email campaigns months in advance",
      "<b>LinkedIn:</b> planned content calendars, organised posts and monitored engagement and performance for Exclusive Networks Spain",
      "<b>Excel:</b> analysed prospect databases and tracked outreach activities at Netskope"],
    tagsLabel: "TOOLS",
    tags: ["Salesforce", "Oracle NetSuite", "Excel", "LinkedIn"] },
  { side: "right", icon: "☁️", title: "Cloud Computing",
    text: "I understand core cloud computing concepts, including storage, virtual servers, Regions and Availability Zones, scalability and fault tolerance. I have applied this knowledge through hands-on experience with AWS: configuring S3 buckets, managing objects and enabling static website hosting.",
    evidence: ["<b>AWS Cloud Quest: Cloud Practitioner Certification</b> (2026)", "<b>Google Cybersecurity Certificate</b> (2025)"],
    tags: ["AWS Services", "AWS Global Infrastructure"] },
  { side: "right", icon: "🔐", title: "Cybersecurity",
    text: "Three internships showed me the cybersecurity industry from the inside, and the Google certificate gave me the fundamentals: threats, risks and how to protect networks, people and data.",
    evidence: ["3 internships in cybersecurity", "<b>Google Cybersecurity Certificate</b> (2025)"],
    tags: ["Threats & risks", "Network security", "SIEM"] }
];

(function skillsNetwork() {
  const net    = document.getElementById("sk-net");
  if (!net) return;
  const nodesEl = document.getElementById("sk-nodes");
  const cables  = document.getElementById("sk-cables");
  const avatar  = net.querySelector(".sk-avatar");
  const panel   = document.getElementById("sk-panel");
  const reduce  = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const NS = "http://www.w3.org/2000/svg";

  // ---- build the 8 nodes ----
  const counters = { left: 0, right: 0 };
  const nodes = SKILLS.map((s, i) => {
    const n = ++counters[s.side];
    s.kicker = `${s.side === "left" ? "SOFT SKILL" : "TECHNICAL SKILL"} 0${n}`;
    const b = document.createElement("button");
    b.type = "button";
    b.className = `sk-node sk-${s.side} sk-pos${n}`;
    b.style.setProperty("--delay", `${-i * 0.7}s`);
    b.setAttribute("aria-label", `${s.title}: click to explore`);
    b.innerHTML = `<span class="sk-cap"><span class="sk-cap-code">${s.side === "left" ? "SOFT" : "TECH"}·0${n}</span><span class="sk-cap-led"></span><span class="sk-icon"><span class="sk-icon-glyph">${s.icon}</span></span><span class="sk-title">${s.title}</span><span class="sk-more"><span class="sk-more-plus">+</span> Explore</span></span>
      <span class="sk-explore">CLICK TO EXPLORE</span>`;
    b.addEventListener("click", () => { stopNudge(); openPanel(i); });
    nodesEl.appendChild(b);
    return b;
  });

  // ---- "nudge": until the first click, light up one module after another ----
  let nudgeTimer = null, nudgeIdx = 0;
  function startNudge() {
    if (reduce || nudgeTimer) return;
    nudgeTimer = setInterval(() => {
      nodes.forEach((n) => n.classList.remove("nudge"));
      nodes[nudgeIdx % nodes.length].classList.add("nudge");
      nudgeIdx++;
    }, 1400);
  }
  function stopNudge() {
    clearInterval(nudgeTimer); nudgeTimer = null;
    nodes.forEach((n) => n.classList.remove("nudge"));
  }
  // only while the section is on screen
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !nodes.some((n) => n.dataset.seen)) startNudge(); else if (!e.isIntersecting) stopNudge();
  }).observe(nodesEl.parentElement);
  nodes.forEach((n) => n.addEventListener("click", () => nodes.forEach((m) => (m.dataset.seen = "1"))));

  // ---- cables: one path per node, with flowing particles ----
  const paths = SKILLS.map((s, i) => {
    const glow = document.createElementNS(NS, "path"); glow.setAttribute("class", "sk-cable-glow");
    const p = document.createElementNS(NS, "path"); p.setAttribute("class", "sk-cable"); p.id = `sk-cable-${i}`;
    cables.append(glow, p);
    if (!reduce) {
      // two small lights travelling from the cloud to Lise
      for (let k = 0; k < 2; k++) {
        const dot = document.createElementNS(NS, "circle");
        dot.setAttribute("r", "2.6"); dot.setAttribute("class", "sk-particle");
        const anim = document.createElementNS(NS, "animateMotion");
        anim.setAttribute("dur", `${3 + (i % 3) * 0.6}s`);
        anim.setAttribute("begin", `-${k * 1.6 + i * 0.3}s`);   // negative start: already on the cable at load
        anim.setAttribute("repeatCount", "indefinite");
        const mp = document.createElementNS(NS, "mpath"); mp.setAttribute("href", `#sk-cable-${i}`);
        anim.appendChild(mp); dot.appendChild(anim); cables.appendChild(dot);
      }
    }
    // the bright pulse sent when a cloud is clicked (Lise → cloud)
    const burst = document.createElementNS(NS, "circle");
    burst.setAttribute("r", "6"); burst.setAttribute("class", "sk-burst");
    const banim = document.createElementNS(NS, "animateMotion");
    banim.setAttribute("dur", "0.7s"); banim.setAttribute("begin", "indefinite"); banim.setAttribute("fill", "remove");
    banim.setAttribute("keyPoints", "1;0"); banim.setAttribute("keyTimes", "0;1"); banim.setAttribute("calcMode", "linear");
    const bmp = document.createElementNS(NS, "mpath"); bmp.setAttribute("href", `#sk-cable-${i}`);
    banim.appendChild(bmp); burst.appendChild(banim); cables.appendChild(burst);
    return { glow, p, burst, banim };
  });

  // draw each cable from the cloud's inner side to the avatar
  function drawCables() {
    const box = net.getBoundingClientRect();
    const a = avatar.getBoundingClientRect();
    const ax = a.left + a.width / 2 - box.left, ay = a.top + a.height * 0.55 - box.top;
    cables.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
    nodes.forEach((n, i) => {
      const r = n.getBoundingClientRect();   // the node itself does not bob, so the cable stays steady
      const left = SKILLS[i].side === "left";
      const x1 = (left ? r.right - 10 : r.left + 10) - box.left, y1 = r.top + r.height * 0.6 - box.top;
      const x2 = ax + (left ? -a.width * 0.18 : a.width * 0.18), y2 = ay;
      const mx = (x1 + x2) / 2;
      const d = `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
      paths[i].p.setAttribute("d", d); paths[i].glow.setAttribute("d", d);
    });
  }
  window.addEventListener("resize", drawCables);
  window.addEventListener("load", drawCables);
  document.fonts && document.fonts.ready.then(drawCables);
  // the section may be hidden at first (behind the login): redraw when it shows up
  new IntersectionObserver(([e]) => { if (e.isIntersecting) drawCables(); }).observe(net);

  // ---- info panel ----
  let openIdx = -1;
  function openPanel(i) {
    const s = SKILLS[i];
    openIdx = i;
    document.getElementById("sk-panel-kicker").textContent = `${s.icon}  ${s.kicker}`;
    document.getElementById("sk-panel-title").textContent = s.title;
    document.getElementById("sk-panel-text").textContent = s.text;
    document.getElementById("sk-panel-list").innerHTML = s.evidence.map((e) => `<li>${e}</li>`).join("");
    document.getElementById("sk-tags-label").textContent = s.tagsLabel || "KEYWORDS";
    document.getElementById("sk-panel-tags").innerHTML = s.tags.map((t) => `<span>${t}</span>`).join("");
    panel.dataset.side = s.side;
    panel.hidden = false;
    panel.classList.remove("in"); void panel.offsetWidth; panel.classList.add("in");

    nodes.forEach((n, k) => n.classList.toggle("active", k === i));
    paths.forEach((p, k) => { p.p.classList.toggle("active", k === i); p.glow.classList.toggle("active", k === i); });
    if (!reduce && paths[i].banim.beginElement) {          // light pulse along the cable
      const b = paths[i].burst;
      b.classList.add("go");
      paths[i].banim.beginElement();
      setTimeout(() => b.classList.remove("go"), 700);
    }
    document.getElementById("sk-close").focus({ preventScroll: true });
  }
  function closePanel() {
    if (openIdx < 0) return;
    const last = nodes[openIdx];
    panel.hidden = true; openIdx = -1;
    nodes.forEach((n) => n.classList.remove("active"));
    paths.forEach((p) => { p.p.classList.remove("active"); p.glow.classList.remove("active"); });
    last.focus({ preventScroll: true });
  }
  document.getElementById("sk-close").addEventListener("click", closePanel);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePanel(); });
})();
