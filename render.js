/* render.js – builds every portfolio section from window.portfolioData */
(function () {
  const D = window.portfolioData;

  // ── HERO ─────────────────────────────────────────────────────────────────
  function renderHero() {
    const p = D.profile;

    // avatar
    const imgs = (p.avatars && p.avatars.length) ? p.avatars : (p.avatar ? [p.avatar] : []);
    const avatarSlides = imgs.map((img, i) =>
      `<div class="proj-slide${i === 0 ? ' active' : ''}"><img src="${img}" alt="${p.name}" /></div>`
    ).join('');
    
    const avatarInner = `<div class="proj-slideshow" data-id="hero-avatar" style="width:100%; height:100%;">
      <div class="proj-slides" style="width:100%; height:100%;">${avatarSlides || '<div class="proj-slide active proj-empty"></div>'}</div>
    </div>`;

    document.getElementById('hero-content-wrap').innerHTML = `
      <div class="hero-content">
        <div class="hero-badge"><span class="badge-dot"></span>${p.badge}</div>
        <h1 class="hero-name">${p.name.split(' ')[0]}<br/>
          <span class="gradient-text">${p.name.split(' ').slice(1).join(' ')}</span>
        </h1>
        <p class="hero-role"><span class="typed-text" id="typed"></span><span class="cursor">|</span></p>
        <p class="hero-sub">${p.tagline}<br/><strong>${p.taglineHighlight}</strong></p>
        <div class="hero-actions">
          <a href="#projects" class="btn btn-primary">View Projects</a>
          <a href="#contact"  class="btn btn-outline">Get In Touch</a>
        </div>

      </div>
      <div class="hero-visual">
        <div class="glow-ring"></div>
        <div class="avatar-placeholder" id="avatar-placeholder">
          ${avatarInner}
          <div class="avatar-ring"></div>
        </div>
        <div class="float-badge fb1"><span>🤖</span> AI Agents</div>
        <div class="float-badge fb2"><span>📄</span> RAG Systems</div>
        <div class="float-badge fb3"><span>⚡</span> LLM Workflows</div>
      </div>`;
  }

  // ── ABOUT ─────────────────────────────────────────────────────────────────
  function renderAbout() {
    const p = D.profile;
    const a = D.about;
    document.getElementById('about-render').innerHTML = `
      <div class="section-header">
        <span class="section-tag">About</span>
        <h2>Who I Am</h2>
      </div>
      <div class="about-grid">
        <div class="about-text">
          <p class="about-lead">${a.lead}</p>
          ${a.paragraphs.map(t => `<p>${t}</p>`).join('')}
          <div class="about-links">
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${p.email}" target="_blank" class="about-link" id="email-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,12 2,6"/>
              </svg>${p.email}
            </a>
            <a href="${p.githubUrl}" target="_blank" class="about-link" id="github-link">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </a>
            <a href="${p.linkedinUrl}" target="_blank" class="about-link" id="linkedin-link">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
            <span class="about-link location-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>${p.location}
            </span>
          </div>
        </div>
        <div class="about-card-wrap">
          <div class="about-info-card glass-card">
            <div class="info-row"><div class="info-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></div><div>
              <strong>B.Tech IT & Honors Specialization in AIML</strong><small>Christ University · Expected 2027</small>
            </div></div>
            <div class="info-row"><div class="info-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg></div><div>
              <strong>CGPA ${D.education.cgpa}</strong><small>Current Standing</small>
            </div></div>
            <div class="info-row"><div class="info-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg></div><div>
              <strong>${D.experience[0]?.title || 'Intern'}</strong>
              <small>${D.experience[0]?.company || ''} · ${D.experience[0]?.date?.split('–')[0]?.trim() || ''}</small>
            </div></div>
            <div class="info-row"><div class="info-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div><div>
              <strong>${p.location}</strong><small>${p.phone}</small>
            </div></div>
          </div>
        </div>
      </div>`;
  }

  // ── EXPERIENCE ────────────────────────────────────────────────────────────
  function renderExperience() {
    document.getElementById('exp-render').innerHTML = `
      <div class="section-header">
        <span class="section-tag">Experience</span>
        <h2>Where I've Worked</h2>
      </div>
      <div class="timeline">
        ${D.experience.map(ex => `
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-card glass-card">
              <div class="tl-header">
                <div>
                  <h3>${ex.title}</h3>
                  <span class="tl-company">${ex.company}</span>
                </div>
                <span class="tl-date">${ex.date}</span>
              </div>
              <ul class="tl-bullets">
                ${ex.bullets.map(b => `<li>${b}</li>`).join('')}
              </ul>
              <div class="tl-tags">
                ${ex.tags.map(t => `<span class="tag">${t}</span>`).join('')}
              </div>
            </div>
          </div>`).join('')}
      </div>`;
  }

  // ── SKILLS ────────────────────────────────────────────────────────────────
  function renderSkills() {
    document.getElementById('skills-render').innerHTML = `
      <div class="section-header">
        <span class="section-tag">Skills</span>
        <h2>Technical Arsenal</h2>
      </div>
      <div class="skills-grid">
        ${D.skills.map(s => {
      const isImg = s.icon.includes('.') || s.icon.startsWith('data:');
      const iconHtml = isImg ? `<img src="${s.icon}" alt="${s.category}" style="width:100%; height:100%; object-fit:contain;" />` : s.icon;
      return `
          <div class="skill-category glass-card">
            <div class="skill-icon" style="width: 48px; height: 48px; display: inline-flex; align-items: center; justify-content: center;">${iconHtml}</div>
            <h3>${s.category}</h3>
            <div class="skill-pills">
              ${s.pills.map(p => `<span class="pill">${p}</span>`).join('')}
            </div>
          </div>`;
    }).join('')}
      </div>`;
  }

  // ── PROJECTS ──────────────────────────────────────────────────────────────
  function renderProjects() {
    document.getElementById('projects-render').innerHTML = `
      <div class="section-header">
        <span class="section-tag">Projects</span>
        <h2>What I've Built</h2>
      </div>
      <div class="projects-grid">
        ${D.projects.map(pr => {
      const imgs = (pr.images && pr.images.length) ? pr.images : (pr.image ? [pr.image] : []);
      const slides = imgs.map((img, i) =>
        `<div class="proj-slide${i === 0 ? ' active' : ''}"><img src="${img}" alt="${pr.title}" style="width:100%; height:auto; display:block;" /></div>`
      ).join('');
      const dots = imgs.length > 1 ? `<div class="proj-dots">${imgs.map((_, i) =>
        `<span class="proj-dot${i === 0 ? ' active' : ''}" data-i="${i}"></span>`).join('')}</div>` : '';
      const arrows = imgs.length > 1
        ? `<button class="slide-arrow prev" aria-label="Prev">&#8249;</button><button class="slide-arrow next" aria-label="Next">&#8250;</button>` : '';
      return `
          <div class="project-card glass-card" id="${pr.id}" onclick="location.href='project.html?id=${pr.id}'" style="cursor:pointer">
            <div class="proj-slideshow" data-id="${pr.id}">
              <div class="proj-slides">${slides || '<div class="proj-slide active proj-empty"></div>'}</div>
              ${dots}${arrows}
            </div>
            <div class="project-body">
              <span class="overlay-tag">${pr.overlay}</span>
              <h3>${pr.title}</h3>
              <p class="proj-desc">${pr.description}</p>
              <span class="proj-view-btn">View Details &#8250;</span>
            </div>
          </div>`;
    }).join('')}
      </div>`;
    setupSlideshows();
  }

  function setupSlideshows() {
    document.querySelectorAll('.proj-slideshow').forEach(ss => {
      const slides = [...ss.querySelectorAll('.proj-slide')];
      const dots = [...ss.querySelectorAll('.proj-dot')];
      if (slides.length <= 1) return;
      let cur = 0, timer;
      function goTo(n) {
        slides[cur].classList.remove('active'); dots[cur]?.classList.remove('active');
        cur = (n + slides.length) % slides.length;
        slides[cur].classList.add('active'); dots[cur]?.classList.add('active');
      }
      function next() { goTo(cur + 1); }
      timer = setInterval(next, 3000);
      ss.querySelector('.next')?.addEventListener('click', e => { e.stopPropagation(); clearInterval(timer); next(); timer = setInterval(next, 3000); });
      ss.querySelector('.prev')?.addEventListener('click', e => { e.stopPropagation(); clearInterval(timer); goTo(cur - 1); timer = setInterval(next, 3000); });
      dots.forEach((d, i) => d.addEventListener('click', e => { e.stopPropagation(); clearInterval(timer); goTo(i); timer = setInterval(next, 3000); }));
    });
  }

  // ── EDUCATION ─────────────────────────────────────────────────────────────
  function renderEducation() {
    const e = D.education;
    document.getElementById('edu-render').innerHTML = `
      <div class="section-header">
        <span class="section-tag">Education</span>
        <h2>Academic Background</h2>
      </div>
      <div class="edu-card glass-card">
        <div class="edu-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></div>
        <div class="edu-content">
          <h3>${e.degree}</h3>
          <p class="edu-honors">${e.honors}</p>
          <p class="edu-school">${e.school}</p>
          <div class="edu-meta">
            <span class="edu-badge">${e.year}</span>
            <span class="edu-badge cgpa">CGPA: ${e.cgpa}</span>
          </div>
        </div>
      </div>`;
  }

  // ── CERTIFICATIONS ────────────────────────────────────────────────────────
  function renderCertifications() {
    document.getElementById('certs-render').innerHTML = `
      <div class="section-header">
        <span class="section-tag">Certifications</span>
        <h2>Training & Certificates</h2>
      </div>
      <div class="certs-grid">
        ${D.certifications.map((c, i) => `
          <div class="cert-card glass-card" id="cert-${i + 1}">
            <div class="cert-logo ${c.logoClass}">${c.logo}</div>
            <div class="cert-info">
              <h4>${c.title}</h4>
              <span>${c.issuer}</span>
            </div>
          </div>`).join('')}
      </div>`;
  }

  // ── CONTACT ───────────────────────────────────────────────────────────────
  function renderContact() {
    const p = D.profile;
    document.getElementById('contact-render').innerHTML = `
      <div class="section-header">
        <span class="section-tag">Contact</span>
        <h2>Let's Connect</h2>
      </div>
      <div class="contact-wrap">
        <div class="contact-intro">
          <p>I'm actively seeking internships and project collaborations in
            <strong>AI/ML, LLM engineering,</strong> and <strong>full-stack development</strong>.
            Let's build something great together.</p>
        </div>
        <div class="contact-cards">
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${p.email}" target="_blank" class="contact-card glass-card" id="contact-email">
            <div class="cc-icon cc-email"><img src="GMimages.png" alt="Gmail" style="width: 24px; height: 24px; object-fit: contain;" /></div>
            <div><strong>Email</strong><span>${p.email}</span></div>
          </a>
          <a href="tel:${p.phone}" class="contact-card glass-card" id="contact-phone">
            <div class="cc-icon cc-phone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.5 10.82 19.79 19.79 0 0 1 .43 2.18 2 2 0 0 1 2.41 0h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L6.91 8.4a16 16 0 0 0 6.72 6.72l1.76-.88a2 2 0 0 1 2.11.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 17.92z"/></svg></div>
            <div><strong>Phone</strong><span>${p.phone}</span></div>
          </a>
          <a href="${p.githubUrl}" target="_blank" class="contact-card glass-card" id="contact-github">
            <div class="cc-icon cc-github"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg></div>
            <div><strong>GitHub</strong><span>View my repositories</span></div>
          </a>
          <a href="${p.linkedinUrl}" target="_blank" class="contact-card glass-card" id="contact-linkedin">
            <div class="cc-icon cc-linkedin"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></div>
            <div><strong>LinkedIn</strong><span>Connect professionally</span></div>
          </a>
        </div>
      </div>`;
  }

  // ── RENDER ALL ────────────────────────────────────────────────────────────
  function renderAll() {
    renderHero();
    renderAbout();
    renderExperience();
    renderSkills();
    renderProjects();
    renderEducation();
    renderCertifications();
    renderContact();
  }

  renderAll();
  window.renderPortfolio = renderAll;
})();
