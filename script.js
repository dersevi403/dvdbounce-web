(function() {
  const stage = document.getElementById('stage');
  const logo1 = document.getElementById('logo1');
  const logo2 = document.getElementById('logo2');

  // =====================
  // CONFIGURATION
  // =====================
  const logos = [
    { el: logo1, desiredSpeed: 80, ratio: 0.7, width: 60 },
    { el: logo2, desiredSpeed: 100, ratio: 0.5, width: 80 }
  ];

  // Helper function: random starting position
  function getRandomPosition(stageWidth, stageHeight, logoWidth, logoHeight) {
    return {
      x: Math.random() * (stageWidth - logoWidth),
      y: Math.random() * (stageHeight - logoHeight)
    };
  }

  // Initialize a single logo
  function initLogo(logo) {
    // set custom size
    logo.el.style.width = logo.width + 'px';
    logo.el.style.height = 'auto';

    // calculate velocities
    logo.vx = logo.desiredSpeed / Math.sqrt(1 + logo.ratio * logo.ratio);
    logo.vy = logo.vx * logo.ratio;

    function positionLogo() {
      const S = stage.getBoundingClientRect();
      const L = logo.el.getBoundingClientRect();
      logo.width = L.width;
      logo.height = L.height;

      const pos = getRandomPosition(S.width, S.height, logo.width, logo.height);
      logo.x = pos.x;
      logo.y = pos.y;

      logo.el.style.transform = `translate(${logo.x}px, ${logo.y}px)`;
    }

    // Handle cached images or newly loaded images
    if (logo.el.complete) {
      positionLogo();
    } else {
      logo.el.addEventListener('load', positionLogo);
    }
  }

  // Initialize all logos
  logos.forEach(initLogo);

  // =====================
  // Animation loop
  // =====================
  let last = null;
  function step(ts) {
    if (!last) last = ts;
    const dt = (ts - last) / 1000;
    last = ts;

    const S = stage.getBoundingClientRect();

    logos.forEach(logo => {
      logo.x += logo.vx * dt;
      logo.y += logo.vy * dt;

      const maxX = Math.max(0, S.width - logo.width);
      const maxY = Math.max(0, S.height - logo.height);

      // bounce
      if (logo.x <= 0) { logo.x = 0; logo.vx = Math.abs(logo.vx); }
      else if (logo.x >= maxX) { logo.x = maxX; logo.vx = -Math.abs(logo.vx); }

      if (logo.y <= 0) { logo.y = 0; logo.vy = Math.abs(logo.vy); }
      else if (logo.y >= maxY) { logo.y = maxY; logo.vy = -Math.abs(logo.vy); }

      logo.el.style.transform = `translate(${logo.x}px, ${logo.y}px)`;
    });

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);

  // =====================
  // Keep logos inside stage on resize
  // =====================
  window.addEventListener('resize', () => {
    const S = stage.getBoundingClientRect();
    logos.forEach(logo => {
      logo.x = Math.min(logo.x, Math.max(0, S.width - logo.width));
      logo.y = Math.min(logo.y, Math.max(0, S.height - logo.height));
      logo.el.style.transform = `translate(${logo.x}px, ${logo.y}px)`;
    });
  });

})();
