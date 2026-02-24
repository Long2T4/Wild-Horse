// Wild Horses - Main JavaScript
// Handles page-specific logic, navigation, and interactivity

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  
  // Initialize based on current page
  switch (page) {
    case 'home':
      initHomePage();
      break;
    case 'games':
      initGamesPage();
      break;
    case 'tft':
      initTFTPage();
      break;
    case 'member':
      initMemberPage();
      break;
    case 'networking':
      initNetworkingPage();
      break;
  }
  
  // Initialize modal system
  initModal();
});

// ============================================
// HOME PAGE
// ============================================
function initHomePage() {
  const { MEMBERS, sortByRank, getInitials, formatRank, getTierClass, getTopMembers } = window.WildHorses;
  
  // Render Top 5 Snapshot
  const top5Container = document.getElementById('top5-list');
  if (top5Container) {
    const top5 = getTopMembers(5);
    top5Container.innerHTML = top5.map((member, index) => `
      <li class="top5-item">
        <span class="top5-rank">#${index + 1}</span>
        <span class="top5-name">${member.name}</span>
        <span class="top5-tier ${getTierClass(member.tier)}">${formatRank(member)}</span>
      </li>
    `).join('');
  }
  
  // Render Members Grid
  const membersGrid = document.getElementById('members-grid');
  if (membersGrid) {
    const sorted = sortByRank(MEMBERS);
    membersGrid.innerHTML = sorted.map(member => `
      <a href="member.html?name=${encodeURIComponent(member.name)}" class="member-card" tabindex="0">
        <div class="member-avatar ${getTierClass(member.tier)}">
          ${getInitials(member.name)}
        </div>
        <div class="member-info">
          <span class="member-name">${member.name}</span>
          <span class="member-rank ${getTierClass(member.tier)}">${formatRank(member)}</span>
        </div>
      </a>
    `).join('');
  }
}

// ============================================
// GAMES PAGE
// ============================================
function initGamesPage() {
  // Games are static for now, just TFT
  // Could be expanded later
}

// ============================================
// TFT LEADERBOARD PAGE
// ============================================
// ============================================
// TFT LEADERBOARD PAGE
// ============================================
function initTFTPage() {
  const { MEMBERS, sortByRank, getInitials, formatRank, getTierClass, getTopMembers, NO_DIVISION_TIERS } = window.WildHorses;
  
  // Render Top 5 Snapshot
  const top5Container = document.getElementById('top5-list');
  if (top5Container) {
    const top5 = getTopMembers(5);
    top5Container.innerHTML = top5.map((member, index) => `
      <li class="top5-item">
        <span class="top5-rank">#${index + 1}</span>
        <span class="top5-name">${member.name}</span>
        <span class="top5-tier ${getTierClass(member.tier)}">${formatRank(member)}</span>
      </li>
    `).join('');
  }
  
  // Render Members Grid
  const membersGrid = document.getElementById('members-grid');
  if (membersGrid) {
    const sorted = sortByRank(MEMBERS);
    membersGrid.innerHTML = sorted.map(member => `
      <a href="member.html?name=${encodeURIComponent(member.name)}" class="member-card" tabindex="0">
        <div class="member-avatar ${getTierClass(member.tier)}">
          ${getInitials(member.name)}
        </div>
        <div class="member-info">
          <span class="member-name">${member.name}</span>
          <span class="member-rank ${getTierClass(member.tier)}">${formatRank(member)}</span>
        </div>
      </a>
    `).join('');
  }
  
  // Render Leaderboard Table
  const tableBody = document.getElementById('leaderboard-body');
  const searchInput = document.getElementById('search-input');
  
  function renderLeaderboard(filter = '') {
    const sorted = sortByRank(MEMBERS);
    const filtered = filter 
      ? sorted.filter(m => m.name.toLowerCase().includes(filter.toLowerCase()))
      : sorted;
    
    tableBody.innerHTML = filtered.map((member, index) => {
      const originalRank = sorted.findIndex(m => m.name === member.name) + 1;
      const division = NO_DIVISION_TIERS.includes(member.tier) ? '—' : (member.division || '—');
      const lp = member.tier === 'Unranked' ? '—' : member.lp;
      
      return `
        <tr class="leaderboard-row" data-name="${member.name}" tabindex="0" role="link">
          <td class="col-rank">${originalRank}</td>
          <td class="col-name">${member.name}</td>
          <td class="col-tier">
            <span class="tier-badge ${getTierClass(member.tier)}">${member.tier}</span>
          </td>
          <td class="col-division">${division}</td>
          <td class="col-lp">${lp}</td>
        </tr>
      `;
    }).join('');
    
    // Add click handlers to rows
    document.querySelectorAll('.leaderboard-row').forEach(row => {
      row.addEventListener('click', () => {
        const name = row.dataset.name;
        window.location.href = `member.html?name=${encodeURIComponent(name)}`;
      });
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const name = row.dataset.name;
          window.location.href = `member.html?name=${encodeURIComponent(name)}`;
        }
      });
    });
  }
  
  // Initial render
  renderLeaderboard();
  
  // Search filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderLeaderboard(e.target.value);
    });
  }
}

// ============================================
// MEMBER PROFILE PAGE
// ============================================
function initMemberPage() {
  const { findMember, formatRank, getTierClass, getSlug, getInitials } = window.WildHorses;
  
  const params = new URLSearchParams(window.location.search);
  const memberName = params.get('name');
  
  const profileContainer = document.getElementById('member-profile');
  const notFoundContainer = document.getElementById('member-not-found');
  
  if (!memberName) {
    showNotFound();
    return;
  }
  
  const member = findMember(memberName);
  
  if (!member) {
    showNotFound();
    return;
  }
  
  // Show profile
  profileContainer.classList.remove('hidden');
  notFoundContainer.classList.add('hidden');
  
  // Populate data
  document.getElementById('profile-name').textContent = member.name;
  document.getElementById('profile-rank').textContent = formatRank(member);
  document.getElementById('profile-rank').className = `profile-rank ${getTierClass(member.tier)}`;
  
  // Avatar
  const avatar = document.getElementById('profile-avatar');
  avatar.textContent = getInitials(member.name);
  avatar.className = `profile-avatar ${getTierClass(member.tier)}`;
  
  // Stats image
  const slug = getSlug(member.name);
  const statsImg = document.getElementById('stats-image');
  const statsNote = document.getElementById('stats-note');
  
  statsImg.src = `assets/stats/${slug}.png`;
  statsImg.alt = `${member.name} TFT Stats`;
  
  // Handle image load error (fallback to default)
  statsImg.onerror = () => {
    statsImg.src = 'assets/stats/default.png';
    statsNote.classList.remove('hidden');
  };
  
  // Image click to expand
  const statsContainer = document.querySelector('.stats-screenshot');
  statsContainer.addEventListener('click', () => {
    openModal(statsImg.src, statsImg.alt);
  });
  statsContainer.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(statsImg.src, statsImg.alt);
    }
  });
  
  function showNotFound() {
    profileContainer.classList.add('hidden');
    notFoundContainer.classList.remove('hidden');
  }
}

// ============================================
// NETWORKING PAGE
// ============================================
function initNetworkingPage() {
  // Toggle sections
  document.querySelectorAll('.concept-header').forEach(header => {
    header.addEventListener('click', () => {
      const section = header.parentElement;
      section.classList.toggle('expanded');
    });
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const section = header.parentElement;
        section.classList.toggle('expanded');
      }
    });
  });
  
  // Expand all by default
  document.querySelectorAll('.concept-section').forEach(section => {
    section.classList.add('expanded');
  });
}

// ============================================
// MODAL SYSTEM
// ============================================
let modalOpen = false;

function initModal() {
  const modal = document.getElementById('image-modal');
  if (!modal) return;
  
  const modalImg = document.getElementById('modal-image');
  const closeBtn = document.getElementById('modal-close');
  const overlay = document.querySelector('.modal-overlay');
  
  // Close on button click
  closeBtn.addEventListener('click', closeModal);
  
  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });
  
  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOpen) {
      closeModal();
    }
  });
}

function openModal(src, alt) {
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-image');
  
  if (!modal || !modalImg) return;
  
  modalImg.src = src;
  modalImg.alt = alt;
  modal.classList.add('active');
  modalOpen = true;
  
  // Focus trap
  document.getElementById('modal-close').focus();
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('image-modal');
  if (!modal) return;
  
  modal.classList.remove('active');
  modalOpen = false;
  document.body.style.overflow = '';
}

// Make modal functions globally available
window.openModal = openModal;
window.closeModal = closeModal;
