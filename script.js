/* ===========================================================
   ASHIK ALI LATHEEF — PORTFOLIO
   script.js
=========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  footerYear();
  navScrollState();
  mobileNav();
  scrollProgress();
  initParticles();
  typeTerminal();
  scrollReveal();
  initSkills();
  initCounters();
  initTestimonials();
  backToTop();
  contactForm();
  magneticButtons();
});

/* -----------------------------------------------------------
   Footer year
----------------------------------------------------------- */
function footerYear(){
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* -----------------------------------------------------------
   Nav: scrolled state + active link highlight
----------------------------------------------------------- */
function navScrollState(){
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });
}

function mobileNav(){
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
    });
  });
}

/* -----------------------------------------------------------
   Scroll progress bar
----------------------------------------------------------- */
function scrollProgress(){
  const bar = document.getElementById('progressBar');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = scrolled + '%';
  };
  update();
  window.addEventListener('scroll', update, { passive:true });
  window.addEventListener('resize', update);
}

/* -----------------------------------------------------------
   Canvas particle network (hero background only)
----------------------------------------------------------- */
function initParticles(){
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const hero = document.querySelector('.hero');
  let particles = [];
  const COUNT = 55;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = hero.offsetHeight;
  }

  function makeParticles(){
    particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.6
    }));
  }

  function step(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(180,216,52,0.55)';
      ctx.fill();
    });
    for (let i = 0; i < particles.length; i++){
      for (let j = i + 1; j < particles.length; j++){
        const a = particles[i], b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130){
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(255,255,255,${0.06 * (1 - d / 130)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    if (!reduced) requestAnimationFrame(step);
  }

  resize();
  makeParticles();
  step();
  if (reduced) step(); // draw a single static frame
  window.addEventListener('resize', () => { resize(); makeParticles(); });
}

/* -----------------------------------------------------------
   Hero terminal typewriter
----------------------------------------------------------- */
function typeTerminal(){
  const body = document.getElementById('terminalBody');
  if (!body) return;

  const lines = [
    { prompt: '$ whoami', out: 'Ashik Ali Latheef' },
    { prompt: '$ role --current', out: 'Senior Software Engineer · Full Stack Developer' },
    { prompt: '$ cat mission.txt', out: 'Building scalable software.\nMentoring future engineers.\nCreating real-world learning experiences.' },
    { prompt: '$ founder --of', out: 'BootChamps — 147+ students mentored' }
  ];

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced){
    body.innerHTML = lines.map(l =>
      `<div><span class="t-prompt">${l.prompt}</span></div><div class="t-out">${l.out.replace(/\n/g,'<br>')}</div>`
    ).join('');
    return;
  }

  let li = 0;
  function typeLine(){
    if (li >= lines.length){
      const cursor = document.createElement('span');
      cursor.className = 't-cursor';
      body.appendChild(cursor);
      return;
    }
    const line = lines[li];
    const promptEl = document.createElement('div');
    const promptSpan = document.createElement('span');
    promptSpan.className = 't-prompt';
    promptEl.appendChild(promptSpan);
    body.appendChild(promptEl);

    let ci = 0;
    const promptTimer = setInterval(() => {
      promptSpan.textContent = line.prompt.slice(0, ci + 1);
      ci++;
      if (ci >= line.prompt.length){
        clearInterval(promptTimer);
        setTimeout(() => {
          const out = document.createElement('div');
          out.className = 't-out';
          out.innerHTML = line.out.replace(/\n/g, '<br>');
          body.appendChild(out);
          li++;
          setTimeout(typeLine, 380);
        }, 220);
      }
    }, 28);
  }
  typeLine();
}

/* -----------------------------------------------------------
   Scroll reveal (IntersectionObserver)
----------------------------------------------------------- */
function scrollReveal(){
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  items.forEach(el => io.observe(el));
}

/* -----------------------------------------------------------
   Skills tabs + bars
----------------------------------------------------------- */
const SKILLS = {
  frontend: [
    ['React.js', 95], ['TypeScript', 90], ['JavaScript (ES6+)', 95],
    ['HTML5 / CSS3', 95], ['Redux', 80]
  ],
  backend: [
    ['Node.js', 92], ['Express.js', 90], ['Nest.js', 85],
    ['REST API Design', 92], ['GraphQL', 70]
  ],
  databases: [
    ['PostgreSQL', 85], ['MongoDB', 88], ['Redis', 75], ['MySQL', 78]
  ],
  cloud: [
    ['AWS', 80], ['Vercel', 85], ['Azure', 65], ['Firebase', 70]
  ],
  devops: [
    ['CI/CD Pipelines', 85], ['Docker', 80], ['GitHub Actions', 82], ['Jenkins', 65]
  ],
  tools: [
    ['Git', 95], ['Jest', 80], ['Postman', 88], ['Webpack', 75], ['Figma', 70]
  ]
};

function initSkills(){
  const tabs = document.querySelectorAll('.skill-tab');
  const panel = document.getElementById('skillsPanel');
  if (!tabs.length || !panel) return;

  function render(cat){
    panel.innerHTML = SKILLS[cat].map(([name, level]) => `
      <div class="skill-row">
        <div class="skill-row-top"><span>${name}</span><span>${level}%</span></div>
        <div class="skill-bar"><div class="skill-bar-fill" data-level="${level}"></div></div>
      </div>
    `).join('');

    requestAnimationFrame(() => {
      panel.querySelectorAll('.skill-bar-fill').forEach(bar => {
        const fillTo = () => { bar.style.width = bar.dataset.level + '%'; };
        const rect = bar.getBoundingClientRect();
        if (rect.top < window.innerHeight) fillTo();
        else {
          const io = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting){ fillTo(); io.disconnect(); } });
          }, { threshold: 0.4 });
          io.observe(bar);
        }
      });
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected','true');
      render(tab.dataset.cat);
    });
  });

  render('frontend');
}

/* -----------------------------------------------------------
   Animated counters
----------------------------------------------------------- */
function initCounters(){
  const counters = document.querySelectorAll('.count');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1400;
    const start = performance.now();
    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));
}

/* -----------------------------------------------------------
   Testimonial slider (dots + swipe)
----------------------------------------------------------- */
function initTestimonials(){
  const track = document.getElementById('testiTrack');
  const dotsWrap = document.getElementById('testiDots');
  if (!track || !dotsWrap) return;

  const slides = track.children.length;
  let index = 0;

  for (let i = 0; i < slides; i++){
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  }

  function goTo(i){
    index = (i + slides) % slides;
    track.style.transform = `translateX(-${index * 100}%)`;
    [...dotsWrap.children].forEach((d, di) => d.classList.toggle('active', di === index));
  }

  let timer = setInterval(() => goTo(index + 1), 6000);
  const reset = () => { clearInterval(timer); timer = setInterval(() => goTo(index + 1), 6000); };

  // touch swipe
  let startX = 0;
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive:true });
  track.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 40){
      goTo(index + (diff < 0 ? 1 : -1));
      reset();
    }
  }, { passive:true });
}

/* -----------------------------------------------------------
   Back to top
----------------------------------------------------------- */
function backToTop(){
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive:true });
  btn.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
}

/* -----------------------------------------------------------
   Contact form (front-end only — wire to a backend/Formspree
   endpoint to actually receive submissions)
----------------------------------------------------------- */
function contactForm(){
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    note.textContent = "Thanks — this form isn't wired to a backend yet. Email hello@ashikali.dev directly for now.";
    form.reset();
  });
}

/* -----------------------------------------------------------
   Magnetic buttons (subtle pointer-follow on primary CTAs)
----------------------------------------------------------- */
function magneticButtons(){
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}