// =====================================================
// CLOUD JUMPING — mini game
// Lise rides her horse. Tap / click / Space to jump
// over the clouds. They come faster and faster.
// =====================================================
(function cloudJumping() {
  const canvas = document.getElementById("game");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("game-score");
  const bestEl  = document.getElementById("game-best");

  // ---- palette ----
  const C = { navy: "#0B1930", ocean: "#173B60", sky: "#8CCDF2", ice: "#D9EEFC", cloud: "#F5F9FD", white: "#FFFFFF",
              horse: "#A65A2E", horseDark: "#6E3518", hair: "#6B4428", hairLight: "#D9AE76", skin: "#E7B28C", black: "#141414" };

  // ---- game size (drawn at 900×300, scaled to the screen) ----
  const W = 900, H = 300, GROUND = 252;
  function fit() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = W * ratio; canvas.height = H * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  fit();
  window.addEventListener("resize", fit);

  // ---- state ----
  const PLAYER_X = 110;
  let state = "ready";               // ready → running → over
  let y = 0, vy = 0;                 // height above the ground, vertical speed
  let speed, clouds, bgClouds, dist, nextGap, t = 0, last = null, running = false;
  let best = Number(localStorage.getItem("cloudJumpBest") || 0);
  bestEl.textContent = pad(best);

  function pad(n) { return String(Math.floor(n)).padStart(5, "0"); }

  function reset() {
    y = 0; vy = 0; speed = 6; dist = 0; nextGap = 380;
    clouds = [];
    bgClouds = Array.from({ length: 5 }, (_, i) => ({ x: i * 200 + Math.random() * 120, y: 30 + Math.random() * 90, s: .5 + Math.random() * .5 }));
    scoreEl.textContent = pad(0);
  }
  reset();

  // ---- controls ----
  function jump() {
    if (state === "ready") { state = "running"; }
    else if (state === "over") { reset(); state = "running"; }
    if (state === "running" && y === 0) vy = 13.5;
  }
  canvas.addEventListener("pointerdown", (e) => { e.preventDefault(); canvas.focus({ preventScroll: true }); jump(); });
  canvas.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "ArrowUp" || e.key === "Enter") { e.preventDefault(); jump(); }
  });

  // ---- drawing helpers ----
  function cloudShape(x, yb, w, h, fill, glow) {
    ctx.save();
    if (glow) { ctx.shadowColor = C.sky; ctx.shadowBlur = 14; }
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.ellipse(x + w * .5, yb - h * .32, w * .5, h * .32, 0, 0, Math.PI * 2);
    ctx.arc(x + w * .32, yb - h * .55, h * .36, 0, Math.PI * 2);
    ctx.arc(x + w * .66, yb - h * .6, h * .42, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // The shape of a fluffy cloud: a flat rounded base + 3 round "puffs" of different sizes.
  // grow = extra size, used to draw a soft outline behind the cloud.
  function puffPath(x, yb, w, h, grow) {
    const g = grow || 0;
    ctx.beginPath();
    // flat, rounded base
    const by = yb - h * 0.4 - g, bh = h * 0.4 + g, r = bh / 2;
    ctx.moveTo(x - g + r, by);
    ctx.arcTo(x + w + g, by, x + w + g, by + bh, r);
    ctx.arcTo(x + w + g, by + bh, x - g, by + bh, r);
    ctx.arcTo(x - g, by + bh, x - g, by, r);
    ctx.arcTo(x - g, by, x + w + g, by, r);
    ctx.closePath();
    // puffs: small left, big middle, medium right
    ctx.moveTo(x + w * 0.27 + h * 0.3 + g, yb - h * 0.45);
    ctx.arc(x + w * 0.27, yb - h * 0.45, h * 0.30 + g, 0, Math.PI * 2);
    ctx.moveTo(x + w * 0.52 + h * 0.4 + g, yb - h * 0.6);
    ctx.arc(x + w * 0.52, yb - h * 0.6, h * 0.40 + g, 0, Math.PI * 2);
    ctx.moveTo(x + w * 0.77 + h * 0.28 + g, yb - h * 0.44);
    ctx.arc(x + w * 0.77, yb - h * 0.44, h * 0.28 + g, 0, Math.PI * 2);
  }

  // An obstacle cloud, with shadow, glow, soft shading and a shine
  function obstacleCloud(x, yb, w, h) {
    // shadow on the ground
    ctx.fillStyle = "rgba(11,25,48,.45)";
    ctx.beginPath(); ctx.ellipse(x + w / 2, yb + 4, w * 0.5, 4, 0, 0, Math.PI * 2); ctx.fill();

    // soft sky-blue glow + outline
    ctx.save();
    ctx.shadowColor = C.sky; ctx.shadowBlur = 16;
    ctx.fillStyle = C.sky;
    puffPath(x, yb, w, h, 2); ctx.fill("nonzero");
    ctx.restore();

    // body: white at the top, ice-blue at the bottom
    const top = yb - h;
    const grad = ctx.createLinearGradient(0, top, 0, yb);
    grad.addColorStop(0, C.white); grad.addColorStop(0.65, C.cloud); grad.addColorStop(1, C.ice);
    ctx.fillStyle = grad;
    puffPath(x, yb, w, h, 0); ctx.fill("nonzero");

    // light shading under the puffs
    ctx.strokeStyle = "rgba(140,205,242,.45)"; ctx.lineWidth = 2; ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(x + w * 0.52, yb - h * 0.6, h * 0.40 - 3, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
    ctx.beginPath(); ctx.arc(x + w * 0.27, yb - h * 0.45, h * 0.30 - 3, Math.PI * 0.2, Math.PI * 0.8); ctx.stroke();

    // shine on the top-left of the big puff
    ctx.strokeStyle = "rgba(255,255,255,.95)"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x + w * 0.52, yb - h * 0.6, h * 0.40 - 6, Math.PI * 1.15, Math.PI * 1.45); ctx.stroke();
  }

  function line(x1, y1, x2, y2, w, color) {
    ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  }

  // Lise on her horse. (x, g) = back hoof position on the ground
  function drawRider(x, g) {
    const airborne = y > 0;
    const gallop = Math.sin(t * 0.35);

    // tail
    ctx.strokeStyle = C.horseDark; ctx.lineWidth = 7; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x + 4, g - 62);
    ctx.quadraticCurveTo(x - 18, g - 60 + gallop * 4, x - 22, g - 36); ctx.stroke();

    // legs (galloping, or tucked during a jump)
    const legs = [[x + 18, -1], [x + 28, 1], [x + 78, 1], [x + 88, -1]];
    legs.forEach(([lx, side], i) => {
      const front = i >= 2;
      // upper leg angle, then lower leg bends (folded under the body while jumping)
      const a  = airborne ? (front ? -0.7 : 0.6) : gallop * 0.5 * side;
      const a2 = airborne ? (front ? 1.2 : -1.0) : a * 0.4;
      const hipY = g - 48;
      const kx = lx + Math.sin(a) * 22,  ky = hipY + Math.cos(a) * 22;
      const fx = kx + Math.sin(a2) * 24, fy = Math.min(g - 3, ky + Math.cos(a2) * 24);
      line(lx, hipY, kx, ky, 8, C.horse);
      line(kx, ky, fx, fy, 6, C.horse);
      line(fx - 2, fy + 1, fx + 3, fy + 1, 6, C.black);                  // hoof
    });

    // body
    ctx.fillStyle = C.horse;
    ctx.beginPath(); ctx.ellipse(x + 52, g - 58, 50, 21, 0, 0, Math.PI * 2); ctx.fill();
    // neck
    ctx.beginPath();
    ctx.moveTo(x + 84, g - 72); ctx.lineTo(x + 108, g - 106); ctx.lineTo(x + 122, g - 98); ctx.lineTo(x + 100, g - 54);
    ctx.closePath(); ctx.fill();
    // head
    ctx.save(); ctx.translate(x + 124, g - 98); ctx.rotate(0.55);
    ctx.beginPath(); ctx.ellipse(0, 0, 19, 10, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.white; ctx.fillRect(4, -3, 12, 4);                 // white blaze
    ctx.restore();
    ctx.fillStyle = C.horse;                                              // ear
    ctx.beginPath(); ctx.moveTo(x + 112, g - 110); ctx.lineTo(x + 114, g - 122); ctx.lineTo(x + 119, g - 110); ctx.fill();
    ctx.fillStyle = C.black; ctx.beginPath(); ctx.arc(x + 122, g - 102, 2, 0, Math.PI * 2); ctx.fill();   // eye
    // mane
    line(x + 88, g - 76, x + 108, g - 108, 5, C.horseDark);
    // saddle pad
    ctx.fillStyle = C.white; ctx.fillRect(x + 40, g - 78, 30, 14);

    // ---- rider ----
    const rx = x + 58, ry = g - 76;                                       // hips
    const lean = airborne ? 0.35 : 0.22;
    // leg + boot
    line(rx, ry, rx + 12, ry + 14, 8, C.navy);
    line(rx + 12, ry + 14, rx + 6, ry + 30, 7, C.black);
    // long hair, flowing behind
    const hx = rx + 12 + Math.sin(lean) * 30, hy = ry - 40;
    ctx.fillStyle = C.hair;
    ctx.beginPath();
    ctx.moveTo(hx - 4, hy - 6);
    ctx.quadraticCurveTo(hx - 28, hy + 4 + gallop * 3, hx - 34, hy + 26 + gallop * 4);
    ctx.quadraticCurveTo(hx - 20, hy + 20, hx - 6, hy + 8);
    ctx.closePath(); ctx.fill();
    line(hx - 10, hy + 2, hx - 26, hy + 18 + gallop * 3, 2, C.hairLight);
    // body: white shirt + navy safety vest
    ctx.save(); ctx.translate(rx, ry); ctx.rotate(lean);
    ctx.fillStyle = C.white; ctx.fillRect(-7, -32, 16, 32);
    ctx.fillStyle = C.ocean; ctx.fillRect(-6, -30, 14, 22);
    ctx.restore();
    // arm to the reins
    line(rx + 10, ry - 26, rx + 30, ry - 10, 6, C.white);
    line(rx + 30, ry - 10, x + 104, g - 92, 1.5, C.black);                // reins
    // head + helmet
    ctx.fillStyle = C.skin; ctx.beginPath(); ctx.arc(hx, hy, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.black; ctx.beginPath(); ctx.arc(hx, hy - 2, 10, Math.PI, 0); ctx.fill();
    ctx.fillRect(hx, hy - 3, 13, 3);                                      // helmet peak
    ctx.fillStyle = "#3B2416"; ctx.beginPath(); ctx.arc(hx + 4, hy + 1, 1.4, 0, Math.PI * 2); ctx.fill();   // eye
  }

  // ---- one frame ----
  function frame(now) {
    if (!running) return;
    const dt = last === null ? 1 : Math.min(2.5, (now - last) / 16.67);   // 1 = one 60fps frame
    last = now; t += dt;

    if (state === "running") {
      // physics
      if (y > 0 || vy > 0) { y += vy * dt; vy -= 0.62 * dt; if (y <= 0) { y = 0; vy = 0; } }
      speed = Math.min(17, speed + 0.0028 * dt);
      dist += speed * dt / 10;
      scoreEl.textContent = pad(dist);

      // clouds coming in
      nextGap -= speed * dt;
      if (nextGap <= 0) {
        const w = 58 + Math.random() * 40, h = 42 + Math.random() * 16;   // a bit wider: looks more like a cloud
        clouds.push({ x: W + 10, w, h });
        // more space at high speed, so a jump can always land between two clouds
        nextGap = 240 + Math.random() * 260 + speed * 32;
      }
      clouds.forEach((c) => (c.x -= speed * dt));
      clouds = clouds.filter((c) => c.x + c.w > -20);

      // collision (with a forgiving margin)
      const px1 = PLAYER_X + 20, px2 = PLAYER_X + 112, pBottom = GROUND - y;
      for (const c of clouds) {
        if (c.x + 10 < px2 && c.x + c.w - 10 > px1 && pBottom > GROUND - c.h + 12) {
          state = "over";
          if (dist > best) { best = dist; localStorage.setItem("cloudJumpBest", Math.floor(best)); bestEl.textContent = pad(best); }
          break;
        }
      }
    }
    bgClouds.forEach((b) => { b.x -= (state === "running" ? speed : 1.2) * 0.25 * b.s * dt; if (b.x < -120) { b.x = W + 40; b.y = 30 + Math.random() * 90; } });

    draw();
    requestAnimationFrame(frame);
  }

  function draw() {
    // sky
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, C.navy); g.addColorStop(1, C.ocean);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // faint tech grid
    ctx.strokeStyle = "rgba(140,205,242,.06)"; ctx.lineWidth = 1;
    const off = (t * speed * 0.5) % 48;
    for (let gx = -off; gx < W; gx += 48) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
    for (let gy = 0; gy < H; gy += 48) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }
    // background clouds
    // background clouds: same fluffy shape, very faint
    ctx.fillStyle = "rgba(217,238,252,.10)";
    bgClouds.forEach((b) => { puffPath(b.x, b.y + 30 * b.s, 100 * b.s, 46 * b.s, 0); ctx.fill("nonzero"); });
    // ground
    line(0, GROUND + 1, W, GROUND + 1, 2, C.sky);
    ctx.fillStyle = "rgba(140,205,242,.08)"; ctx.fillRect(0, GROUND + 2, W, H - GROUND);
    ctx.fillStyle = "rgba(140,205,242,.35)";
    for (let mx = -((t * speed) % 60); mx < W; mx += 60) ctx.fillRect(mx, GROUND + 14, 22, 2);
    // obstacle clouds
    clouds.forEach((c) => obstacleCloud(c.x, GROUND, c.w, c.h));
    // Lise
    drawRider(PLAYER_X, GROUND - y);

    // messages
    if (state !== "running") {
      ctx.fillStyle = "rgba(11,25,48,.6)"; ctx.fillRect(0, 0, W, H);
      ctx.textAlign = "center"; ctx.fillStyle = C.white;
      ctx.font = "800 30px Inter, Arial, sans-serif";
      ctx.fillText(state === "ready" ? "Ready to ride?" : "Oops! Refusal at the cloud ☁", W / 2, 120);
      ctx.font = "600 15px 'JetBrains Mono', monospace"; ctx.fillStyle = C.sky;
      ctx.fillText(state === "ready" ? "TAP, CLICK OR PRESS SPACE TO JUMP" : `SCORE ${pad(dist)} · TAP TO TRY AGAIN`, W / 2, 158);
    }
  }

  // only run while the game is on screen (saves battery)
  new IntersectionObserver(([e]) => {
    running = e.isIntersecting;
    if (running) { last = null; requestAnimationFrame(frame); }
  }).observe(canvas);
  draw();
})();
