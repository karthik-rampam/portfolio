/* admin.js – Portfolio Admin Panel Logic */
const ADMIN_PASSWORD = 'admin123';
let data = {}; // working copy

// ── UTILS ─────────────────────────────────────────────────────────────────
function $(id) { return document.getElementById(id); }
function showToast(msg, type = 'success') {
  const t = $('toast');
  if(!t) return;
  t.textContent = msg;
  t.className = `toast ${type}`;
  t.classList.remove('hidden');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.add('hidden'), 3000);
}

function compressImage(base64Str, maxWidth = 800, quality = 0.7) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxWidth) {
          width *= maxWidth / height;
          height = maxWidth;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
  });
}

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

// ── FIREBASE STORAGE ───────────────────────────────────────────────────────
async function uploadToStorage(base64Data, path) {
  if (typeof firebase === 'undefined') return base64Data;
  const storageRef = firebase.storage().ref();
  const fileRef = storageRef.child(path);
  
  try {
    // Convert base64 to Blob
    const response = await fetch(base64Data);
    const blob = await response.blob();
    
    // Upload
    const snapshot = await fileRef.put(blob);
    // Get URL
    const url = await snapshot.ref.getDownloadURL();
    console.log("✅ File uploaded to Cloud Storage:", url);
    return url;
  } catch (e) {
    console.error("❌ Cloud Upload failed:", e);
    return base64Data; // fallback to base64
  }
}

// ── LOGIN ──────────────────────────────────────────────────────────────────
function checkLogin() {
  return sessionStorage.getItem('adminAuth') === '1';
}
$('login-btn').addEventListener('click', doLogin);
$('login-password').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });

function doLogin() {
  if ($('login-password').value === ADMIN_PASSWORD) {
    sessionStorage.setItem('adminAuth', '1');
    $('login-overlay').classList.add('hidden');
    $('admin-app').classList.remove('hidden');
    initAdmin();
  } else {
    $('login-password').style.borderColor = '#ef4444';
    setTimeout(() => $('login-password').style.borderColor = '', 1000);
    showToast('Incorrect password', 'error');
  }
}
$('logout-btn').addEventListener('click', () => {
  sessionStorage.removeItem('adminAuth');
  location.reload();
});

// ── INIT ───────────────────────────────────────────────────────────────────
function initAdmin() {
  data = deepClone(window.portfolioData);
  populateAll();
  setupSidebar();
  setupSaveReset();
}

if (checkLogin()) {
  $('login-overlay').classList.add('hidden');
  $('admin-app').classList.remove('hidden');
  initAdmin();
}

// ── SIDEBAR ────────────────────────────────────────────────────────────────
function setupSidebar() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.section;
      $('section-' + target).classList.add('active');
    });
  });
}

function populateAll() {
  populateProfile();
  populateAbout();
  populateExperience();
  populateSkills();
  populateProjects();
  populateEducation();
  populateCertifications();
}

// ── PROFILE ───────────────────────────────────────────────────────────────
function populateProfile() {
  const p = data.profile;
  $('p-name').value             = p.name;
  $('p-email').value            = p.email;
  $('p-phone').value            = p.phone;
  $('p-location').value         = p.location;
  $('p-github').value           = p.githubUrl;
  $('p-linkedin').value         = p.linkedinUrl;
  $('p-badge').value            = p.badge;
  $('p-tagline').value          = p.tagline;
  $('p-tagline-highlight').value= p.taglineHighlight;
  $('p-roles').value            = p.roles.join('\n');

  const imgs = (p.avatars && p.avatars.length) ? p.avatars : (p.avatar ? [p.avatar] : []);
  $('section-profile').dataset.images = JSON.stringify(imgs);
  refreshAvatarGallery();

  $('p-avatar-add-file').onchange = function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async e => {
      showToast('Uploading photo...', 'info');
      const compressed = await compressImage(e.target.result, 600);
      const cloudUrl = await uploadToStorage(compressed, `avatars/${Date.now()}_${file.name}`);
      
      const arr = JSON.parse($('section-profile').dataset.images || '[]');
      arr.push(cloudUrl);
      $('section-profile').dataset.images = JSON.stringify(arr);
      refreshAvatarGallery();
      this.value = '';
      showToast('Photo uploaded!');
    };
    reader.readAsDataURL(file);
  };
}

window.addAvatarUrl = function() {
  const input = $('p-avatar-add-url');
  const url = input.value.trim();
  if (!url) return;
  const arr = JSON.parse($('section-profile').dataset.images || '[]');
  arr.push(url);
  $('section-profile').dataset.images = JSON.stringify(arr);
  refreshAvatarGallery();
  input.value = '';
}

window.removeAvatarImg = function(idx) {
  const arr = JSON.parse($('section-profile').dataset.images || '[]');
  arr.splice(idx, 1);
  $('section-profile').dataset.images = JSON.stringify(arr);
  refreshAvatarGallery();
}

function refreshAvatarGallery() {
  const arr = JSON.parse($('section-profile').dataset.images || '[]');
  const gallery = $('avatar-gallery');
  if (arr.length === 0) {
    gallery.innerHTML = '<span class="hint">No photos added yet.</span>';
    return;
  }
  gallery.innerHTML = arr.map((img, idx) => `
    <div class="img-thumb" style="position:relative; width:100px; height:70px; border-radius:4px; overflow:hidden; border:1px solid var(--border);">
      <img src="${img}" style="width:100%; height:100%; object-fit:cover;" />
      <button type="button" class="btn-icon" style="position:absolute; top:2px; right:2px; background:rgba(0,0,0,0.7); padding:2px; font-size:10px; width:20px; height:20px; color:#fff;" onclick="removeAvatarImg(${idx})">✕</button>
    </div>
  `).join('');
}

function collectProfile() {
  const p = data.profile;
  p.name              = $('p-name').value.trim();
  p.email             = $('p-email').value.trim();
  p.phone             = $('p-phone').value.trim();
  p.location          = $('p-location').value.trim();
  p.githubUrl         = $('p-github').value.trim();
  p.linkedinUrl       = $('p-linkedin').value.trim();
  p.badge             = $('p-badge').value.trim();
  p.tagline           = $('p-tagline').value.trim();
  p.taglineHighlight  = $('p-tagline-highlight').value.trim();
  p.roles             = $('p-roles').value.split('\n').map(s=>s.trim()).filter(Boolean);

  const arr = JSON.parse($('section-profile').dataset.images || '[]');
  p.avatars = arr;
  p.avatar = arr[0] || '';
}

// ── ABOUT ─────────────────────────────────────────────────────────────────
function populateAbout() {
  $('a-lead').value = data.about.lead;
  const wrap = $('about-paragraphs');
  wrap.innerHTML = '';
  data.about.paragraphs.forEach((p, i) => addParaBox(p, i));
  $('add-para-btn').onclick = () => {
    data.about.paragraphs.push('');
    addParaBox('', data.about.paragraphs.length - 1);
  };
}
function addParaBox(text, i) {
  const wrap = $('about-paragraphs');
  const div = document.createElement('div');
  div.className = 'bullet-row';
  div.dataset.idx = i;
  div.innerHTML = `<textarea class="para-text" rows="3">${text}</textarea>
    <button class="btn-icon" onclick="this.parentElement.remove()">✕</button>`;
  wrap.appendChild(div);
}
function collectAbout() {
  data.about.lead = $('a-lead').value;
  data.about.paragraphs = [...document.querySelectorAll('.para-text')].map(t=>t.value.trim()).filter(Boolean);
}

// ── EXPERIENCE ────────────────────────────────────────────────────────────
function populateExperience() {
  $('exp-list').innerHTML = '';
  data.experience.forEach((ex, i) => addExpItem(ex, i));
  $('add-exp-btn').onclick = () => {
    const blank = { title:'New Role', company:'', date:'', bullets:[''], tags:[] };
    data.experience.push(blank);
    addExpItem(blank, data.experience.length - 1);
  };
}
function addExpItem(ex, i) {
  const el = document.createElement('div');
  el.className = 'repeat-item';
  el.dataset.idx = i;
  el.innerHTML = `
    <div class="repeat-item-header" onclick="toggleCollapse(this.parentElement)">
      <h4>${ex.title} @ ${ex.company || '...'}</h4>
      <div class="item-actions">
        <span class="collapse-icon">▼</span>
        <button class="btn-icon" onclick="event.stopPropagation();this.closest('.repeat-item').remove()">✕ Remove</button>
      </div>
    </div>
    <div class="repeat-item-body">
      <div class="form-grid">
        <div class="form-group"><label>Job Title</label>
          <input type="text" class="ex-title" value="${ex.title}" /></div>
        <div class="form-group"><label>Company</label>
          <input type="text" class="ex-company" value="${ex.company}" /></div>
        <div class="form-group full"><label>Date Range</label>
          <input type="text" class="ex-date" value="${ex.date}" placeholder="Apr 2025 – May 2025" /></div>
      </div>
      <div class="card-block">
        <h3>Bullet Points</h3>
        <div class="bullets-list ex-bullets">
          ${ex.bullets.map(b=>`
            <div class="bullet-row">
              <textarea rows="2">${b}</textarea>
              <button class="btn-icon" onclick="this.parentElement.remove()">✕</button>
            </div>`).join('')}
        </div>
        <button class="btn-add" onclick="addBullet(this.previousElementSibling)">+ Add Bullet</button>
      </div>
      <div class="card-block">
        <h3>Tags</h3>
        <div class="pills-wrap ex-tags">
          ${ex.tags.map(t=>`<span class="admin-pill" onclick="this.remove()">${t} ✕</span>`).join('')}
        </div>
        <div class="add-pill-row">
          <input type="text" placeholder="Add tag & press Enter" onkeydown="addPillOnEnter(event,this.previousElementSibling||this.parentElement.previousElementSibling)" />
        </div>
      </div>
    </div>`;
  el.querySelector('.ex-title').addEventListener('input', function(){
    el.querySelector('h4').textContent = this.value + ' @ ' + (el.querySelector('.ex-company').value||'...');
  });
  el.querySelector('.ex-company').addEventListener('input', function(){
    el.querySelector('h4').textContent = (el.querySelector('.ex-title').value||'Role') + ' @ ' + this.value;
  });
  $('exp-list').appendChild(el);
}
function collectExperience() {
  data.experience = [...document.querySelectorAll('#exp-list .repeat-item')].map(el => ({
    title:   el.querySelector('.ex-title').value.trim(),
    company: el.querySelector('.ex-company').value.trim(),
    date:    el.querySelector('.ex-date').value.trim(),
    bullets: [...el.querySelectorAll('.ex-bullets textarea')].map(t=>t.value.trim()).filter(Boolean),
    tags:    [...el.querySelectorAll('.ex-tags .admin-pill')].map(p=>p.textContent.replace(' ✕','').trim())
  }));
}

// ── SKILLS ────────────────────────────────────────────────────────────────
function populateSkills() {
  $('skills-editor').innerHTML = '';
  data.skills.forEach((s, i) => addSkillCat(s, i));
  $('add-skill-cat-btn').onclick = () => {
    const blank = { icon:'⭐', category:'New Category', pills:[] };
    data.skills.push(blank);
    addSkillCat(blank, data.skills.length - 1);
  };
}
function addSkillCat(s, i) {
  const el = document.createElement('div');
  el.className = 'repeat-item';
  el.innerHTML = `
    <div class="repeat-item-header" onclick="toggleCollapse(this.parentElement)">
      <h4>${s.icon.includes('.') || s.icon.startsWith('data:') ? '🖼️' : s.icon} ${s.category}</h4>
      <div class="item-actions">
        <span class="collapse-icon">▼</span>
        <button class="btn-icon" onclick="event.stopPropagation();this.closest('.repeat-item').remove()">✕ Remove</button>
      </div>
    </div>
    <div class="repeat-item-body">
      <div class="form-grid">
        <div class="form-group"><label>Icon (emoji or URL)</label>
          <input type="text" class="sk-icon" value="${s.icon}" placeholder="💻 or icon.png" /></div>
        <div class="form-group"><label>Or Upload Icon File</label>
          <input type="file" class="sk-icon-file" accept="image/*" /></div>
        <div class="form-group full"><label>Category Name</label>
          <input type="text" class="sk-cat" value="${s.category}" /></div>
      </div>
      <div class="card-block">
        <h3>Skills <span class="hint">(click to remove)</span></h3>
        <div class="pills-wrap sk-pills">
          ${s.pills.map(p=>`<span class="admin-pill" onclick="this.remove()">${p} ✕</span>`).join('')}
        </div>
        <div class="add-pill-row">
          <input type="text" placeholder="Type skill & press Enter" onkeydown="addPillOnEnter(event,this.parentElement.previousElementSibling)" />
        </div>
      </div>
    </div>`;
    
  el.dataset.base64 = s.icon.startsWith('data:') ? s.icon : '';

  el.querySelector('.sk-icon-file').addEventListener('change', function(){
    const file = this.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = async e => {
      showToast('Uploading icon...', 'info');
      const compressed = await compressImage(e.target.result, 100);
      const cloudUrl = await uploadToStorage(compressed, `icons/${Date.now()}_${file.name}`);
      
      el.querySelector('.sk-icon').value = cloudUrl;
      el.dataset.base64 = ''; // No longer using base64
      el.querySelector('h4').textContent = '🖼️ ' + el.querySelector('.sk-cat').value;
      showToast('Icon uploaded!');
    };
    reader.readAsDataURL(file);
  });

  el.querySelector('.sk-icon').addEventListener('input', function(){
    el.dataset.base64 = ''; 
    const preview = (this.value.includes('.') || this.value.startsWith('data:')) ? '🖼️' : this.value;
    el.querySelector('h4').textContent = preview + ' ' + el.querySelector('.sk-cat').value;
  });

  el.querySelector('.sk-cat').addEventListener('input', function(){
    const icon = el.querySelector('.sk-icon').value;
    const preview = (icon.includes('.') || el.dataset.base64) ? '🖼️' : icon;
    el.querySelector('h4').textContent = (preview || '⭐') + ' ' + this.value;
  });
  $('skills-editor').appendChild(el);
}
function collectSkills() {
  data.skills = [...document.querySelectorAll('#skills-editor .repeat-item')].map(el => {
    const textIcon = el.querySelector('.sk-icon').value.trim();
    const base64Icon = el.dataset.base64 || '';
    return {
      icon:     base64Icon || textIcon,
      category: el.querySelector('.sk-cat').value.trim(),
      pills:    [...el.querySelectorAll('.sk-pills .admin-pill')].map(p=>p.textContent.replace(' ✕','').trim())
    };
  });
}

// ── PROJECTS ──────────────────────────────────────────────────────────────
function populateProjects() {
  $('projects-editor').innerHTML = '';
  data.projects.forEach((pr, i) => addProjectItem(pr, i));
  $('add-project-btn').onclick = () => {
    const blank = { id:`proj-${Date.now()}`, title:'New Project', overlay:'', image:'', images:[], description:'', highlights:[], tags:[] };
    data.projects.push(blank);
    addProjectItem(blank, data.projects.length - 1);
  };
}
function addProjectItem(pr, i) {
  const el = document.createElement('div');
  el.className = 'repeat-item';
  el.dataset.pid = pr.id;
  const imgs = (pr.images && pr.images.length) ? pr.images : (pr.image ? [pr.image] : []);
  el.dataset.images = JSON.stringify(imgs);
  el.innerHTML = `
    <div class="repeat-item-header" onclick="toggleCollapse(this.parentElement)">
      <h4>${pr.title}</h4>
      <div class="item-actions">
        <span class="collapse-icon">▼</span>
        <button class="btn-icon" onclick="event.stopPropagation();this.closest('.repeat-item').remove()">✕ Remove</button>
      </div>
    </div>
    <div class="repeat-item-body">
      <div class="form-grid">
        <div class="form-group full"><label>Title</label>
          <input type="text" class="pr-title" value="${pr.title}" /></div>
        <div class="form-group"><label>Overlay Tag <span class="hint">(top-left badge)</span></label>
          <input type="text" class="pr-overlay" value="${pr.overlay}" placeholder="Featured" /></div>
      </div>
      <div class="card-block" style="background:var(--bg2); padding:16px; border-radius:8px;">
        <h3>Project Images <span class="hint">(First image is the cover)</span></h3>
        <div class="proj-img-gallery" style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:12px;"></div>
        <div class="form-grid">
          <div class="form-group">
            <label>Add by URL</label>
            <div style="display:flex; gap:8px;">
              <input type="text" class="pr-add-img-url" placeholder="https://..." style="flex:1" />
              <button type="button" class="btn-primary-admin" onclick="addProjImgUrl(this)" style="padding:0 12px;">Add</button>
            </div>
          </div>
          <div class="form-group">
            <label>Or Upload File</label>
            <input type="file" class="pr-add-img-file" accept="image/*" />
          </div>
        </div>
      </div>
      <div class="form-grid">
        <div class="form-group full"><label>Description</label>
          <textarea class="pr-desc" rows="3">${pr.description}</textarea></div>
      </div>
      <div class="card-block">
        <h3>Highlights</h3>
        <div class="bullets-list pr-highlights">
          ${pr.highlights.map(h=>`
            <div class="bullet-row">
              <textarea rows="2">${h}</textarea>
              <button class="btn-icon" onclick="this.parentElement.remove()">✕</button>
            </div>`).join('')}
        </div>
        <button class="btn-add" onclick="addBullet(this.previousElementSibling)">+ Add Highlight</button>
      </div>
      <div class="card-block">
        <h3>Tags</h3>
        <div class="pills-wrap pr-tags">
          ${pr.tags.map(t=>`<span class="admin-pill" onclick="this.remove()">${t} ✕</span>`).join('')}
        </div>
        <div class="add-pill-row">
          <input type="text" placeholder="Add tag & press Enter" onkeydown="addPillOnEnter(event,this.previousElementSibling||this.parentElement.previousElementSibling)" />
        </div>
      </div>
    </div>`;

  refreshProjGallery(el);

  el.querySelector('.pr-add-img-file').addEventListener('change', function(){
    const file = this.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = async e => {
      showToast('Uploading project image...', 'info');
      const compressed = await compressImage(e.target.result, 1000);
      const cloudUrl = await uploadToStorage(compressed, `projects/${Date.now()}_${file.name}`);
      
      const arr = JSON.parse(el.dataset.images || '[]');
      arr.push(cloudUrl);
      el.dataset.images = JSON.stringify(arr);
      refreshProjGallery(el);
      this.value = '';
      showToast('Project image uploaded!');
    };
    reader.readAsDataURL(file);
  });

  el.querySelector('.pr-title').addEventListener('input', function(){
    el.querySelector('h4').textContent = this.value;
  });

  $('projects-editor').appendChild(el);
}

window.removeProjImg = function(btn, idx) {
  const el = btn.closest('.repeat-item');
  const arr = JSON.parse(el.dataset.images || '[]');
  arr.splice(idx, 1);
  el.dataset.images = JSON.stringify(arr);
  refreshProjGallery(el);
}

window.addProjImgUrl = function(btn) {
  const el = btn.closest('.repeat-item');
  const input = el.querySelector('.pr-add-img-url');
  const url = input.value.trim();
  if (!url) return;
  const arr = JSON.parse(el.dataset.images || '[]');
  arr.push(url);
  el.dataset.images = JSON.stringify(arr);
  refreshProjGallery(el);
  input.value = '';
}

function refreshProjGallery(el) {
  const arr = JSON.parse(el.dataset.images || '[]');
  const gallery = el.querySelector('.proj-img-gallery');
  if (arr.length === 0) {
    gallery.innerHTML = '<span class="hint">No images added yet.</span>';
    return;
  }
  gallery.innerHTML = arr.map((img, idx) => `
    <div class="img-thumb" style="position:relative; width:100px; height:70px; border-radius:4px; overflow:hidden; border:1px solid var(--border);">
      <img src="${img}" style="width:100%; height:100%; object-fit:cover;" />
      <button type="button" class="btn-icon" style="position:absolute; top:2px; right:2px; background:rgba(0,0,0,0.7); padding:2px; font-size:10px; width:20px; height:20px; color:#fff;" onclick="removeProjImg(this, ${idx})">✕</button>
    </div>
  `).join('');
}

function collectProjects() {
  data.projects = [...document.querySelectorAll('#projects-editor .repeat-item')].map((el, i) => {
    const arr = JSON.parse(el.dataset.images || '[]');
    return {
      id:         el.dataset.pid || `proj-${i+1}`,
      title:      el.querySelector('.pr-title').value.trim(),
      overlay:    el.querySelector('.pr-overlay').value.trim(),
      image:      arr[0] || '',
      images:     arr,
      description:el.querySelector('.pr-desc').value.trim(),
      highlights: [...el.querySelectorAll('.pr-highlights textarea')].map(t=>t.value.trim()).filter(Boolean),
      tags:       [...el.querySelectorAll('.pr-tags .admin-pill')].map(p=>p.textContent.replace(' ✕','').trim())
    };
  });
}

// ── EDUCATION ─────────────────────────────────────────────────────────────
function populateEducation() {
  const e = data.education;
  $('edu-degree').value = e.degree;
  $('edu-honors').value = e.honors;
  $('edu-school').value = e.school;
  $('edu-year').value   = e.year;
  $('edu-cgpa').value   = e.cgpa;
}
function collectEducation() {
  data.education = {
    degree: $('edu-degree').value.trim(),
    honors: $('edu-honors').value.trim(),
    school: $('edu-school').value.trim(),
    year:   $('edu-year').value.trim(),
    cgpa:   $('edu-cgpa').value.trim()
  };
}

// ── CERTIFICATIONS ────────────────────────────────────────────────────────
function populateCertifications() {
  $('certs-editor').innerHTML = '';
  data.certifications.forEach((c, i) => addCertItem(c, i));
  $('add-cert-btn').onclick = () => {
    const blank = { logo:'', logoClass:'aws', title:'Certificate', issuer:'' };
    data.certifications.push(blank);
    addCertItem(blank, data.certifications.length - 1);
  };
}
function addCertItem(c, i) {
  const logoOptions = ['aws','guvi','bi','nptel'].map(v =>
    `<option value="${v}" ${c.logoClass===v?'selected':''}>${v.toUpperCase()}</option>`).join('');
  const el = document.createElement('div');
  el.className = 'repeat-item';
  el.innerHTML = `
    <div class="repeat-item-header" onclick="toggleCollapse(this.parentElement)">
      <h4>${c.title}</h4>
      <div class="item-actions">
        <span class="collapse-icon">▼</span>
        <button class="btn-icon" onclick="event.stopPropagation();this.closest('.repeat-item').remove()">✕</button>
      </div>
    </div>
    <div class="repeat-item-body">
      <div class="form-grid">
        <div class="form-group"><label>Logo Text <span class="hint">(2-3 chars)</span></label>
          <input type="text" class="ct-logo" value="${c.logo}" maxlength="4" /></div>
        <div class="form-group"><label>Logo Color Style</label>
          <select class="ct-logoclass logo-class">${logoOptions}</select></div>
        <div class="form-group full"><label>Certificate Title</label>
          <input type="text" class="ct-title" value="${c.title}" /></div>
        <div class="form-group full"><label>Issuer / Platform</label>
          <input type="text" class="ct-issuer" value="${c.issuer}" /></div>
      </div>
    </div>`;
  el.querySelector('.ct-title').addEventListener('input', function(){
    el.querySelector('h4').textContent = this.value;
  });
  $('certs-editor').appendChild(el);
}
function collectCertifications() {
  data.certifications = [...document.querySelectorAll('#certs-editor .repeat-item')].map(el => ({
    logo:      el.querySelector('.ct-logo').value.trim(),
    logoClass: el.querySelector('.ct-logoclass').value,
    title:     el.querySelector('.ct-title').value.trim(),
    issuer:    el.querySelector('.ct-issuer').value.trim()
  }));
}

// ── SAVE / RESET ───────────────────────────────────────────────────────────
function setupSaveReset() {
  $('save-btn').addEventListener('click', () => {
    collectAll();
    window.savePortfolioData(data);
    showToast('✅ Saved! Refresh portfolio to see changes.');
  });
  $('reset-btn').addEventListener('click', () => {
    if (!confirm('Reset ALL content to defaults? This cannot be undone.')) return;
    data = deepClone(window.defaultData);
    window.savePortfolioData(data);
    populateAll();
    showToast('↺ Reset to defaults');
  });
}

function collectAll() {
  collectProfile();
  collectAbout();
  collectExperience();
  collectSkills();
  collectProjects();
  collectEducation();
  collectCertifications();
}

// Helpers
window.toggleCollapse = function(el) { el.classList.toggle('collapsed'); };
window.addBullet = function(list) {
  const d = document.createElement('div');
  d.className = 'bullet-row';
  d.innerHTML = `<textarea rows="2"></textarea><button class="btn-icon" onclick="this.parentElement.remove()">✕</button>`;
  list.appendChild(d);
};
window.addPillOnEnter = function(e, wrap) {
  if (e.key === 'Enter') {
    const val = e.target.value.trim();
    if(val) {
      const p = document.createElement('span');
      p.className = 'admin-pill';
      p.innerHTML = `${val} ✕`;
      p.onclick = () => p.remove();
      wrap.appendChild(p);
      e.target.value = '';
    }
  }
};
