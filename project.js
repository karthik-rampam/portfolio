/* project.js - Renders the project details page */
(function() {
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('id');
  const D = window.portfolioData;
  const project = D.projects.find(p => p.id === projectId);

  const renderContainer = document.getElementById('project-render');

  if (!project) {
    renderContainer.innerHTML = `
      <a href="index.html#projects" class="back-link">&#8592; Back to Portfolio</a>
      <div style="text-align:center; padding: 100px 0;">
        <h2>Project Not Found</h2>
        <p style="color: var(--text-muted); margin-top: 10px;">The requested project could not be found.</p>
      </div>`;
    return;
  }

  const imgs = (project.images && project.images.length) ? project.images : (project.image ? [project.image] : []);
  
  let galleryHtml = '';
  if (imgs.length > 0) {
    const slides = imgs.map((img, i) => `<div class="gallery-slide${i===0?' active':''}" style="background-image:url('${img}')"></div>`).join('');
    const dots = imgs.length > 1 ? `<div class="gallery-nav">${imgs.map((_, i) => `<span class="gallery-dot${i===0?' active':''}" data-i="${i}"></span>`).join('')}</div>` : '';
    const arrows = imgs.length > 1 ? `<button class="gallery-arrow prev">&#8249;</button><button class="gallery-arrow next">&#8250;</button>` : '';
    
    galleryHtml = `
      <div class="proj-gallery">
        <div class="gallery-slides">${slides}</div>
        ${dots}${arrows}
      </div>`;
  }

  renderContainer.innerHTML = `
    <a href="index.html#projects" class="back-link">&#8592; Back to Portfolio</a>
    
    <div class="proj-detail-header">
      <div class="proj-detail-tags">
        <span class="overlay-tag">${project.overlay}</span>
        ${project.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
      <h1 class="proj-detail-title">${project.title}</h1>
      <p class="proj-detail-desc">${project.description}</p>
    </div>

    ${galleryHtml}

    <div class="proj-detail-highlights">
      <h3>Key Highlights</h3>
      <ul>
        ${project.highlights.map(h => `<li>${h}</li>`).join('')}
      </ul>
    </div>
  `;

  // Setup Gallery Slideshow
  if (imgs.length > 1) {
    const gallery = document.querySelector('.proj-gallery');
    const slides = [...gallery.querySelectorAll('.gallery-slide')];
    const dots = [...gallery.querySelectorAll('.gallery-dot')];
    let cur = 0, timer;
    
    function goTo(n) {
      slides[cur].classList.remove('active'); dots[cur]?.classList.remove('active');
      cur = (n + slides.length) % slides.length;
      slides[cur].classList.add('active'); dots[cur]?.classList.add('active');
    }
    function next() { goTo(cur + 1); }
    
    timer = setInterval(next, 4000);
    
    gallery.querySelector('.next')?.addEventListener('click', () => { clearInterval(timer); next(); timer = setInterval(next, 4000); });
    gallery.querySelector('.prev')?.addEventListener('click', () => { clearInterval(timer); goTo(cur - 1); timer = setInterval(next, 4000); });
    dots.forEach((d, i) => d.addEventListener('click', () => { clearInterval(timer); goTo(i); timer = setInterval(next, 4000); }));
  }

})();
