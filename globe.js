// =====================================================
// MY WORLD — interactive globe
// Dots on the places Lise has lived and travelled.
// Click a dot to see a photo gallery and what she did there.
// Drag to spin. Uses d3 + topojson + world-atlas.
// =====================================================

// kind: "lived" (solid dot) · "travel" (small dot) · "future" (dashed dot)
// photos: how many photos are in images/world-web/<id>/ (1.jpg, 2.jpg, …)
// one entry per COUNTRY. kind: "lived" (big dot) or "travel" (small dot)
// photos/videos: files in images/world-web/<id>/ · more: extra folders merged into the same country
const PLACES = [
  { "id": "brussels", "name": "Belgium", "country": "Belgium", "flag": "🇧🇪", "coords": [ 4.3517, 50.8503 ], "kind": "lived", "photos": 3, "videos": 1, "when": "Childhood", "text": "Growing up in Brussels, the capital of Europe, surrounded by many languages and cultures." },
  { "id": "paris", "name": "France", "country": "France", "flag": "🇫🇷", "coords": [ 2.3522, 48.8566 ], "kind": "lived", "photos": 2, "more": [ { "id": "capbenat", "photos": 4 } ], "extra": [ "images/web/boat.jpg" ], "when": "Home", "text": "Where I'm from. From Paris, where I became Store Manager at American Vintage in 2026 and was ranked #1 salesperson out of 30 stores in the EU, to summers on the Mediterranean coast." },
  { "id": "berlin", "name": "Germany", "country": "Germany", "flag": "🇩🇪", "coords": [ 13.405, 52.52 ], "kind": "lived", "photos": 7, "when": "ESCP Year 3 · 2025–2026", "text": "My final Bachelor year in Berlin, and my first role at American Vintage as a Salesperson, before moving to Paris as Store Manager." },
  { "id": "ireland", "name": "Ireland", "country": "Ireland", "flag": "🇮🇪", "coords": [ -6.2603, 53.3498 ], "kind": "lived", "photos": 7, "videos": 1, "when": "Childhood", "text": "Part of my childhood in Dublin: my first years speaking English every day, and learning to feel at home somewhere new." },
  { "id": "spain", "name": "Spain", "country": "Spain", "flag": "🇪🇸", "coords": [ -3.7038, 40.4168 ], "kind": "lived", "photos": 4, "videos": 1, "more": [ { "id": "fuerteventura", "photos": 2, "videos": 3 } ], "extra": [ "images/web/spain.jpg" ], "when": "ESCP Year 2 · 2024–2025", "text": "My second Bachelor year in Madrid and a Sales & HR internship at Exclusive Networks. I also explored the Spanish coast and the Canary Islands, Fuerteventura and Lanzarote." },
  { "id": "dubai", "name": "United Arab Emirates", "country": "United Arab Emirates", "flag": "🇦🇪", "coords": [ 55.2708, 25.2048 ], "kind": "lived", "photos": 6, "when": "Childhood", "text": "Dubai: a city built on ambition and technology. It shaped how I see the future." },
  { "id": "london", "name": "United Kingdom", "country": "United Kingdom", "flag": "🇬🇧", "coords": [ -0.1278, 51.5074 ], "kind": "lived", "photos": 6, "videos": 1, "extra": [ "images/web/imperial.jpg" ], "when": "2022 → today", "text": "London: internships at Netskope (2022) and Orange Cyberdefense (2024), ESCP Year 1, and since September 2026, my MSc in Management at Imperial College London." },
  { "id": "china", "name": "China", "country": "China", "flag": "🇨🇳", "coords": [ 116.4074, 39.9042 ], "kind": "travel", "photos": 0, "when": "Trip", "text": "Discovering a fascinating culture and history." },
  { "id": "costarica", "name": "Costa Rica", "country": "Costa Rica", "flag": "🇨🇷", "coords": [ -84.0907, 9.9281 ], "kind": "travel", "photos": 1, "when": "Trip", "text": "Rainforests, volcanoes and the pura vida spirit." },
  { "id": "czechia", "name": "Czech Republic", "country": "Czech Republic", "flag": "🇨🇿", "coords": [ 14.4378, 50.0755 ], "kind": "travel", "photos": 3, "when": "Trip", "text": "Prague's bridges, towers and old town." },
  { "id": "puntacana", "name": "Dominican Republic", "country": "Dominican Republic", "flag": "🇩🇴", "coords": [ -68.3725, 18.5601 ], "kind": "travel", "photos": 5, "when": "Trip", "text": "Punta Cana's white sand beaches in the Caribbean." },
  { "id": "athens", "name": "Greece", "country": "Greece", "flag": "🇬🇷", "coords": [ 23.7275, 37.9838 ], "kind": "travel", "photos": 0, "when": "Trip", "text": "The Acropolis and the birthplace of democracy." },
  { "id": "hongkong", "name": "Hong Kong", "country": "Hong Kong", "flag": "🇭🇰", "coords": [ 114.1694, 22.3193 ], "kind": "travel", "photos": 1, "when": "Trip", "text": "Skyscrapers, harbour lights and dim sum." },
  { "id": "hungary", "name": "Hungary", "country": "Hungary", "flag": "🇭🇺", "coords": [ 19.0402, 47.4979 ], "kind": "travel", "photos": 4, "when": "Trip", "text": "Budapest and the Danube by night." },
  { "id": "israel", "name": "Israel", "country": "Israel", "flag": "🇮🇱", "coords": [ 34.7818, 32.0853 ], "kind": "travel", "photos": 0, "when": "Trip", "text": "History, lively markets and Mediterranean beaches." },
  { "id": "rome", "name": "Italy", "country": "Italy", "flag": "🇮🇹", "coords": [ 12.4964, 41.9028 ], "kind": "travel", "photos": 1, "when": "Trip", "text": "Rome, the Eternal City: history on every corner." },
  { "id": "jordan", "name": "Jordan", "country": "Jordan", "flag": "🇯🇴", "coords": [ 35.4444, 30.3285 ], "kind": "travel", "photos": 3, "when": "Trip", "text": "Desert landscapes and ancient history, from Petra to Wadi Rum." },
  { "id": "mauritius", "name": "Mauritius", "country": "Mauritius", "flag": "🇲🇺", "coords": [ 57.5522, -20.3484 ], "kind": "travel", "photos": 0, "when": "Trip", "text": "Lagoons and turquoise water in the Indian Ocean." },
  { "id": "morocco", "name": "Morocco", "country": "Morocco", "flag": "🇲🇦", "coords": [ -7.9811, 31.6295 ], "kind": "travel", "photos": 2, "when": "Trip", "text": "Colourful souks, the desert and warm hospitality." },
  { "id": "netherlands", "name": "Netherlands", "country": "Netherlands", "flag": "🇳🇱", "coords": [ 4.9041, 52.3676 ], "kind": "travel", "photos": 0, "when": "Trip", "text": "Canals, bikes and Amsterdam's narrow houses." },
  { "id": "portugal", "name": "Portugal", "country": "Portugal", "flag": "🇵🇹", "coords": [ -9.1393, 38.7223 ], "kind": "travel", "photos": 4, "when": "Trip", "text": "Ocean, light and colourful streets." },
  { "id": "grenadines", "name": "Saint Vincent & the Grenadines", "country": "Saint Vincent & the Grenadines", "flag": "🇻🇨", "coords": [ -61.24, 12.98 ], "kind": "travel", "photos": 4, "when": "Trip", "videos": 1, "text": "Turquoise water between the Caribbean islands." },
  { "id": "seychelles", "name": "Seychelles", "country": "Seychelles", "flag": "🇸🇨", "coords": [ 55.492, -4.6796 ], "kind": "travel", "photos": 0, "when": "Trip", "text": "Granite beaches and crystal-clear water." },
  { "id": "singapore", "name": "Singapore", "country": "Singapore", "flag": "🇸🇬", "coords": [ 103.8198, 1.3521 ], "kind": "travel", "photos": 1, "when": "Trip", "text": "A futuristic city where nature meets technology." },
  { "id": "switzerland", "name": "Switzerland", "country": "Switzerland", "flag": "🇨🇭", "coords": [ 7.4474, 46.948 ], "kind": "travel", "photos": 3, "when": "Trip", "text": "Mountains, lakes and fresh Alpine air." },
  { "id": "tanzania", "name": "Tanzania", "country": "Tanzania", "flag": "🇹🇿", "coords": [ 34.8888, -6.369 ], "kind": "travel", "photos": 0, "when": "Trip", "text": "Wild landscapes and unforgettable nature." },
  { "id": "thailand", "name": "Thailand", "country": "Thailand", "flag": "🇹🇭", "coords": [ 100.5018, 13.7563 ], "kind": "travel", "photos": 7, "when": "Trip", "videos": 1, "text": "Temples, islands and street food." },
  { "id": "newyork", "name": "United States", "country": "United States", "flag": "🇺🇸", "coords": [ -74.006, 40.7128 ], "kind": "travel", "photos": 8, "when": "Trip", "text": "New York, the city that never sleeps: exploring Manhattan." }
];

// ISO codes of countries to colour on the globe
const LIVED_ISO  = ["250", "372", "056", "784", "826", "724", "276"];
const TRAVEL_ISO = ["188", "376", "504", "690", "702", "840", "764", "620", "400", "670",            // USA, Thailand, Portugal, Jordan, St Vincent
                    "156", "344", "380", "300", "834", "203", "348", "480", "214",
                    "528", "756"];  // Netherlands, Switzerland  // China, HK, Italy, Greece, Tanzania, Czechia, Hungary, Mauritius, Dominican Rep.

(function initWorld() {
  const svgEl    = document.getElementById("globe");
  const card     = document.getElementById("place-card");
  const list     = document.getElementById("place-list");
  const fallback = document.getElementById("globe-fallback");
  if (!svgEl) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const photosOf = (p) => [p, ...(p.more || [])].flatMap((src) => [
    ...Array.from({ length: src.photos || 0 }, (_, i) => `images/world-web/${src.id}/${i + 1}.jpg`),
    ...Array.from({ length: src.videos || 0 }, (_, i) => `images/world-web/${src.id}/v${i + 1}.mp4`)
  ]).concat(p.extra || []);
  const kindLabel = { lived: "LIVED HERE", travel: "TRAVELLED", future: "UPCOMING" };

  // =====================================================
  // Info card with a photo gallery
  // =====================================================
  let gallery = [], idx = 0, current = null;

  function showPhoto(i) {
    if (!gallery.length) return;
    idx = (i + gallery.length) % gallery.length;
    const src = gallery[idx], alt = `${current.name}, ${idx + 1} of ${gallery.length}`;
    const stage = card.querySelector(".gal-stage");
    // photos are shown in full (a blurred copy fills the sides); videos get controls
    stage.innerHTML = /\.mp4$/i.test(src)
      ? `<video class="gal-media show" src="${src}" controls playsinline muted preload="metadata" aria-label="${alt}"></video>`
      : `<span class="gal-bg" style="background-image:url('${src}')"></span><img class="gal-media show" src="${src}" alt="${alt}">`;
    card.querySelector(".gal-count").textContent = `${idx + 1} / ${gallery.length}`;
    card.querySelectorAll(".gal-dots button").forEach((d, n) => d.classList.toggle("on", n === idx));
    // load the next photo in advance, so it appears instantly
    if (gallery.length > 1 && !/\.mp4$/i.test(gallery[(idx + 1) % gallery.length])) { const pre = new Image(); pre.src = gallery[(idx + 1) % gallery.length]; }
  }

  function showPlace(p) {
    current = p; gallery = photosOf(p); idx = 0;
    const many = gallery.length > 1;
    card.innerHTML = `
      <p class="place-kicker"><span class="kind kind-${p.kind}">${kindLabel[p.kind]}</span> ${p.when.toUpperCase()}</p>
      <h3 class="place-title">${p.flag} ${p.name}${p.name !== p.country ? `<span>, ${p.country}</span>` : ""}</h3>
      ${gallery.length ? `
      <div class="gallery" tabindex="0" aria-label="Photos and videos of ${p.name}. Use the arrows to browse.">
        <div class="gal-stage"></div>
        ${many ? `
        <button type="button" class="gal-btn gal-prev" aria-label="Previous photo">‹</button>
        <button type="button" class="gal-btn gal-next" aria-label="Next photo">›</button>` : ""}
        <span class="gal-count"></span>
      </div>
      ${many ? `<div class="gal-dots">${gallery.map((_, n) => `<button type="button" aria-label="Photo ${n + 1}"></button>`).join("")}</div>` : ""}` : ""}`;

    if (gallery.length) {
      const gal = card.querySelector(".gallery");
      if (many) {
        card.querySelector(".gal-prev").onclick = () => showPhoto(idx - 1);
        card.querySelector(".gal-next").onclick = () => showPhoto(idx + 1);
        card.querySelectorAll(".gal-dots button").forEach((d, n) => (d.onclick = () => showPhoto(n)));
        gal.addEventListener("keydown", (e) => {
          if (e.key === "ArrowLeft") showPhoto(idx - 1);
          if (e.key === "ArrowRight") showPhoto(idx + 1);
        });
        // swipe on phones
        let startX = null;
        gal.addEventListener("pointerdown", (e) => { startX = e.clientX; });
        gal.addEventListener("pointerup", (e) => {
          if (startX === null) return;
          const dx = e.clientX - startX; startX = null;
          if (Math.abs(dx) > 40) showPhoto(idx + (dx < 0 ? 1 : -1));
        });
      }
      showPhoto(0);
    }

    card.classList.remove("pop"); void card.offsetWidth; card.classList.add("pop");
    list.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b.dataset.id === p.id));
    svgEl.querySelectorAll(".dot").forEach((d) => d.classList.toggle("active", d.dataset.id === p.id));
  }

  // =====================================================
  // List of places (works even without the globe)
  // =====================================================
  [["lived", "Lived"], ["travel", "Travelled"]].forEach(([kind, label]) => {
    if (!PLACES.some((p) => p.kind === kind)) return;
    const group = document.createElement("div");
    group.className = "place-group";
    group.innerHTML = `<span class="place-group-label kind-${kind}">${label}</span>`;
    PLACES.filter((p) => p.kind === kind).sort((x, y) => x.name.localeCompare(y.name, "en")).forEach((p) => {
      const b = document.createElement("button");
      b.type = "button"; b.dataset.id = p.id; b.className = p.kind;
      b.textContent = `${p.flag} ${p.name}`;
      b.addEventListener("click", () => { showPlace(p); if (window.__spinTo) window.__spinTo(p); });
      group.appendChild(b);
    });
    list.appendChild(group);
  });

  // =====================================================
  // The globe
  // =====================================================
  if (!window.d3 || !window.topojson) { fallback.hidden = false; return; }

  const size = 600, R = 270;
  const svg = d3.select(svgEl);
  const projection = d3.geoOrthographic().scale(R * 1.8).translate([size / 2, size / 2]).clipAngle(90).rotate([-12, -46]);
  // zoom: 1 = whole globe, up to 4 = close on Europe
  const ZMIN = 1, ZMAX = 4;
  let zoom = 1.8;
  const path = d3.geoPath(projection);

  const defs = svg.append("defs");
  const grad = defs.append("radialGradient").attr("id", "ocean").attr("cx", "40%").attr("cy", "35%");
  grad.append("stop").attr("offset", "0%").attr("stop-color", "#1E4C7A");
  grad.append("stop").attr("offset", "100%").attr("stop-color", "#173B60");

  const halo = svg.append("circle").attr("class", "globe-halo").attr("cx", size / 2).attr("cy", size / 2).attr("r", R * zoom + 14);
  svg.append("path").datum({ type: "Sphere" }).attr("class", "sphere").attr("fill", "url(#ocean)");
  svg.append("path").datum(d3.geoGraticule10()).attr("class", "graticule");
  const land = svg.append("g");
  const dots = svg.append("g");

  const dot = dots.selectAll("g").data(PLACES).join("g")
    .attr("class", (d) => `dot ${d.kind}`)
    .attr("data-id", (d) => d.id)
    .attr("tabindex", 0).attr("role", "button")
    .attr("aria-label", (d) => `${d.name}, ${d.country}`)
    .on("click", (e, d) => { e.stopPropagation(); showPlace(d); spinTo(d); })
    .on("keydown", (e, d) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showPlace(d); spinTo(d); } });
  dot.append("circle").attr("class", "dot-ring").attr("r", (d) => (d.kind === "travel" ? 10 : 13));
  dot.append("circle").attr("class", "dot-core").attr("r", (d) => (d.kind === "travel" ? 4.5 : 6));
  dot.append("text").attr("class", "dot-label").attr("x", 11).attr("y", -9).text((d) => d.name);

  function render() {
    halo.attr("r", R * zoom + 14);
    svg.selectAll(".sphere, .graticule").attr("d", path);
    land.selectAll("path").attr("d", path);
    const center = projection.invert([size / 2, size / 2]);
    dot.each(function (d) {
      const visible = d3.geoDistance(d.coords, center) < Math.PI / 2 - 0.05;
      const [x, y] = projection(d.coords);
      d3.select(this).attr("transform", `translate(${x},${y})`).style("display", visible ? null : "none");
    });
  }

  fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
    .then((r) => r.json())
    .then((world) => {
      const countries = topojson.feature(world, world.objects.countries).features;
      const code = (d) => String(d.id).padStart(3, "0");
      land.selectAll("path").data(countries).join("path")
        .attr("class", (d) => "land" + (LIVED_ISO.includes(code(d)) ? " visited" : TRAVEL_ISO.includes(code(d)) ? " travelled" : ""));
      render();
    })
    .catch(() => { fallback.hidden = false; });
  render();

  // ---- spinning ----
  let auto = !reduce, timer = null;
  function startAuto() {
    if (!auto || timer) return;
    let last = performance.now();
    timer = d3.timer(() => {
      const now = performance.now(), r = projection.rotate();
      projection.rotate([r[0] + (now - last) * 0.006 / zoom, r[1]]);
      last = now; render();
    });
  }
  function stopAuto() { if (timer) { timer.stop(); timer = null; } }
  new IntersectionObserver(([e]) => (e.isIntersecting ? startAuto() : stopAuto())).observe(svgEl);

  svg.call(d3.drag()
    .clickDistance(5)
    .on("start", () => { auto = false; stopAuto(); })
    .on("drag", (e) => {
      const r = projection.rotate(), k = 75 / projection.scale();
      projection.rotate([r[0] + e.dx * k, Math.max(-70, Math.min(70, r[1] - e.dy * k))]);
      render();
    }));

  // ---- zoom (buttons + double click) ----
  function zoomTo(z, ms = 500) {
    z = Math.max(ZMIN, Math.min(ZMAX, z));
    const from = zoom;
    if (reduce || !ms) { zoom = z; projection.scale(R * zoom); return render(); }
    d3.transition().duration(ms).ease(d3.easeCubicOut)
      .tween("zoom", () => (t) => { zoom = from + (z - from) * t; projection.scale(R * zoom); render(); });
  }
  const zb = document.createElement("div");
  zb.className = "globe-zoom";
  zb.innerHTML = '<button type="button" aria-label="Zoom in">+</button><button type="button" aria-label="Zoom out">−</button>';
  svgEl.parentElement.appendChild(zb);
  const [zin, zout] = zb.querySelectorAll("button");
  zin.addEventListener("click", () => zoomTo(zoom * 1.4));
  zout.addEventListener("click", () => zoomTo(zoom / 1.4));
  svg.on("dblclick", (e) => { e.preventDefault(); zoomTo(zoom * 1.6); });

  function spinTo(p) {
    auto = false; stopAuto();
    const from = projection.rotate(), to = [-p.coords[0], -p.coords[1] * 0.8];
    to[0] = from[0] + ((((to[0] - from[0]) % 360) + 540) % 360 - 180);
    if (reduce) { projection.rotate(to); return render(); }
    const interp = d3.interpolate(from, to);
    d3.transition().duration(1000).ease(d3.easeCubicInOut)
      .tween("spin", () => (t) => { projection.rotate(interp(t)); render(); });
  }
  window.__spinTo = spinTo;
})();
