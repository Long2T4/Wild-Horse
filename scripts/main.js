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
    case 'lol':
      initLoLPage();
      break;
    case 'lol-member':
      initLoLMemberPage();
      break;
  }
  
  // Initialize modal system
  initModal();
});

// ============================================
// HOME PAGE
// ============================================
function initHomePage() {
  // Home page is now just the gallery - no dynamic content needed
}

// ============================================
// GAMES PAGE
// ============================================
function initGamesPage() {
  // Games are static for now
}

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
  
  renderLeaderboard();
  
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
  
  profileContainer.classList.remove('hidden');
  notFoundContainer.classList.add('hidden');
  
  document.getElementById('profile-name').textContent = member.name;
  document.getElementById('profile-rank').textContent = formatRank(member);
  document.getElementById('profile-rank').className = `profile-rank ${getTierClass(member.tier)}`;
  
  const avatar = document.getElementById('profile-avatar');
  avatar.textContent = getInitials(member.name);
  avatar.className = `profile-avatar ${getTierClass(member.tier)}`;
  
  const slug = getSlug(member.name);
  const statsImg = document.getElementById('stats-image');
  const statsNote = document.getElementById('stats-note');
  
  statsImg.src = `assets/stats/${slug}.png`;
  statsImg.alt = `${member.name} TFT Stats`;
  
  statsImg.onerror = () => {
    statsImg.src = 'assets/stats/default.png';
    statsNote.classList.remove('hidden');
  };
  
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
  
  document.querySelectorAll('.concept-section').forEach(section => {
    section.classList.add('expanded');
  });
}

// ============================================
// LOL LEADERBOARD PAGE
// ============================================
function initLoLPage() {
  const { LOL_MEMBERS, sortLoLByRank, getInitials, formatLoLRank, getTierClass, getTopLoLMembers, TIER_ORDER, DIVISION_ORDER, NO_DIVISION_TIERS } = window.WildHorses;
  
  // Current sort state
  let currentSort = 'solo';
  let sortDirection = 'desc'; // desc = highest first
  
  // Render Top 5
  const top5Container = document.getElementById('top5-lol-list');
  if (top5Container) {
    const top5 = getTopLoLMembers(5);
    top5Container.innerHTML = top5.map((member, index) => `
      <li class="top5-item">
        <span class="top5-rank">#${index + 1}</span>
        <span class="top5-name">${member.name}</span>
        <span class="top5-tier ${getTierClass(member.soloTier)}">${formatLoLRank(member.soloTier, member.soloDivision, member.soloLp)}</span>
      </li>
    `).join('');
  }
  
  // Render Members Grid
  const membersGrid = document.getElementById('lol-members-grid');
  if (membersGrid) {
    const sorted = sortLoLByRank(LOL_MEMBERS);
    membersGrid.innerHTML = sorted.map(member => `
      <a href="lol-member.html?name=${encodeURIComponent(member.name)}" class="member-card" tabindex="0">
        <div class="member-avatar ${getTierClass(member.soloTier)}">
          ${getInitials(member.name)}
        </div>
        <div class="member-info">
          <span class="member-name">${member.name}</span>
          <span class="member-rank ${getTierClass(member.soloTier)}">${formatLoLRank(member.soloTier, member.soloDivision, member.soloLp)}</span>
        </div>
      </a>
    `).join('');
  }
  
  // Sort function
  function sortMembers(members, sortBy, direction) {
    return [...members].sort((a, b) => {
      let tierA, tierB, divA, divB, lpA, lpB;
      
      if (sortBy === 'solo') {
        tierA = TIER_ORDER.indexOf(a.soloTier);
        tierB = TIER_ORDER.indexOf(b.soloTier);
        divA = a.soloDivision ? DIVISION_ORDER.indexOf(a.soloDivision) : 0;
        divB = b.soloDivision ? DIVISION_ORDER.indexOf(b.soloDivision) : 0;
        lpA = a.soloLp;
        lpB = b.soloLp;
      } else {
        tierA = TIER_ORDER.indexOf(a.flexTier);
        tierB = TIER_ORDER.indexOf(b.flexTier);
        divA = a.flexDivision ? DIVISION_ORDER.indexOf(a.flexDivision) : 0;
        divB = b.flexDivision ? DIVISION_ORDER.indexOf(b.flexDivision) : 0;
        lpA = a.flexLp;
        lpB = b.flexLp;
      }
      
      // Compare tier first
      if (tierA !== tierB) {
        return direction === 'desc' ? tierA - tierB : tierB - tierA;
      }
      
      // Then division (only for tiers that have divisions)
      const tierName = sortBy === 'solo' ? a.soloTier : a.flexTier;
      if (!NO_DIVISION_TIERS.includes(tierName)) {
        if (divA !== divB) {
          return direction === 'desc' ? divA - divB : divB - divA;
        }
      }
      
      // Then LP
      if (lpA !== lpB) {
        return direction === 'desc' ? lpB - lpA : lpA - lpB;
      }
      
      // Finally alphabetical
      return a.name.localeCompare(b.name);
    });
  }
  
  // Render Leaderboard Table
  const tableBody = document.getElementById('lol-leaderboard-body');
  const searchInput = document.getElementById('search-input');
  const sortSoloBtn = document.getElementById('sort-solo');
  const sortFlexBtn = document.getElementById('sort-flex');
  
  function updateSortButtons() {
    sortSoloBtn.classList.remove('active', 'asc', 'desc');
    sortFlexBtn.classList.remove('active', 'asc', 'desc');
    sortSoloBtn.querySelector('.sort-arrow').textContent = '';
    sortFlexBtn.querySelector('.sort-arrow').textContent = '';
    
    if (currentSort === 'solo') {
      sortSoloBtn.classList.add('active', sortDirection);
      sortSoloBtn.querySelector('.sort-arrow').textContent = sortDirection === 'desc' ? '▼' : '▲';
    } else {
      sortFlexBtn.classList.add('active', sortDirection);
      sortFlexBtn.querySelector('.sort-arrow').textContent = sortDirection === 'desc' ? '▼' : '▲';
    }
  }
  
  function renderLeaderboard(filter = '') {
    const sorted = sortMembers(LOL_MEMBERS, currentSort, sortDirection);
    const filtered = filter 
      ? sorted.filter(m => m.name.toLowerCase().includes(filter.toLowerCase()))
      : sorted;
    
    tableBody.innerHTML = filtered.map((member, index) => {
      return `
        <tr class="leaderboard-row" data-name="${member.name}" tabindex="0" role="link">
          <td class="col-rank">${index + 1}</td>
          <td class="col-name">${member.name}</td>
          <td class="col-tier">
            <span class="tier-badge ${getTierClass(member.soloTier)}">${formatLoLRank(member.soloTier, member.soloDivision, member.soloLp)}</span>
          </td>
          <td class="col-tier">
            <span class="tier-badge ${getTierClass(member.flexTier)}">${formatLoLRank(member.flexTier, member.flexDivision, member.flexLp)}</span>
          </td>
        </tr>
      `;
    }).join('');
    
    document.querySelectorAll('.leaderboard-row').forEach(row => {
      row.addEventListener('click', () => {
        window.location.href = `lol-member.html?name=${encodeURIComponent(row.dataset.name)}`;
      });
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.href = `lol-member.html?name=${encodeURIComponent(row.dataset.name)}`;
        }
      });
    });
  }
  
  // Sort click handlers
  sortSoloBtn.addEventListener('click', () => {
    if (currentSort === 'solo') {
      sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    } else {
      currentSort = 'solo';
      sortDirection = 'desc';
    }
    updateSortButtons();
    renderLeaderboard(searchInput.value);
  });
  
  sortFlexBtn.addEventListener('click', () => {
    if (currentSort === 'flex') {
      sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    } else {
      currentSort = 'flex';
      sortDirection = 'desc';
    }
    updateSortButtons();
    renderLeaderboard(searchInput.value);
  });
  
  // Initial render
  updateSortButtons();
  renderLeaderboard();
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderLeaderboard(e.target.value);
    });
  }
}

// ============================================
// LOL MEMBER PAGE
// ============================================
function initLoLMemberPage() {
  const { findLoLMember, formatLoLRank, getTierClass, getSlug, getInitials } = window.WildHorses;
  
  const params = new URLSearchParams(window.location.search);
  const memberName = params.get('name');
  
  const profileContainer = document.getElementById('lol-profile');
  const notFoundContainer = document.getElementById('lol-not-found');
  
  if (!memberName) {
    profileContainer.classList.add('hidden');
    notFoundContainer.classList.remove('hidden');
    return;
  }
  
  const member = findLoLMember(memberName);
  
  if (!member) {
    profileContainer.classList.add('hidden');
    notFoundContainer.classList.remove('hidden');
    return;
  }
  
  document.getElementById('profile-name').textContent = member.name;
  document.getElementById('profile-solo-rank').textContent = 'Solo/Duo: ' + formatLoLRank(member.soloTier, member.soloDivision, member.soloLp);
  document.getElementById('profile-solo-rank').className = `profile-rank ${getTierClass(member.soloTier)}`;
  document.getElementById('profile-flex-rank').textContent = 'Flex: ' + formatLoLRank(member.flexTier, member.flexDivision, member.flexLp);
  document.getElementById('profile-flex-rank').className = `profile-rank ${getTierClass(member.flexTier)}`;
  
  const avatar = document.getElementById('profile-avatar');
  avatar.textContent = getInitials(member.name);
  avatar.className = `profile-avatar ${getTierClass(member.soloTier)}`;
  
  const slug = getSlug(member.name);
  const statsImg1 = document.getElementById('stats-image-1');
  const statsImg2 = document.getElementById('stats-image-2');
  const statsImg3 = document.getElementById('stats-image-3');
  const statsNote = document.getElementById('stats-note');
  
  statsImg1.src = `assets/lol/${slug}-1.png`;
  statsImg2.src = `assets/lol/${slug}-2.png`;
  statsImg3.src = `assets/lol/${slug}-3.png`;
  
  let missingCount = 0;
  [statsImg1, statsImg2, statsImg3].forEach(img => {
    img.onerror = () => {
      img.src = 'assets/lol/default.png';
      missingCount++;
      if (missingCount > 0) statsNote.classList.remove('hidden');
    };
  });
  
  document.querySelectorAll('.stats-screenshot').forEach(container => {
    const img = container.querySelector('img');
    container.addEventListener('click', () => {
      openModal(img.src, img.alt);
    });
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(img.src, img.alt);
      }
    });
  });
}

// ============================================
// MODAL SYSTEM
// ============================================
let modalOpen = false;

function initModal() {
  const modal = document.getElementById('image-modal');
  if (!modal) return;
  
  const closeBtn = document.getElementById('modal-close');
  const overlay = document.querySelector('.modal-overlay');
  
  closeBtn.addEventListener('click', closeModal);
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });
  
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

window.openModal = openModal;
window.closeModal = closeModal;
