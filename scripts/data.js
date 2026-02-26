// Wild Horses - Data Module
// All member data and ranking utilities

const TIER_ORDER = [
  'Challenger',
  'Grandmaster', 
  'Master',
  'Diamond',
  'Emerald',
  'Platinum',
  'Gold',
  'Silver',
  'Bronze',
  'Iron',
  'Unranked'
];

const DIVISION_ORDER = ['I', 'II', 'III', 'IV'];

// Tiers that don't use divisions (only LP matters)
const NO_DIVISION_TIERS = ['Challenger', 'Grandmaster', 'Master', 'Unranked'];

// Slug mapping for image filenames (ASCII only, no accents)
const SLUG_MAP = {
  'Su': 'su',
  'Yun': 'yun',
  'Xệ': 'xe',
  'a Tứn': 'a-tun',
  'Đại Tá': 'dai-ta',
  'Zibi': 'zibi',
  'Kua': 'kua',
  'Đồng Nai': 'dong-nai',
  'Hycan': 'hycan',
  'Bun': 'bun',
  'Cupid': 'cupid',
  'bánh mỳ': 'banh-my',
  'Gà': 'ga'
};

// Member data with exact display names (keep accents)
const MEMBERS = [
  { name: 'Yun', tier: 'Master', division: null, lp: 94 },
  { name: 'Su', tier: 'Master', division: null, lp: 124 },
  { name: 'Xệ', tier: 'Challenger', division: null, lp: 2190 },
  { name: 'Hycan', tier: 'Master', division: null, lp: 0 },
  { name: 'a Tứn', tier: 'Master', division: null, lp: 219 },
  { name: 'Kua', tier: 'Master', division: null, lp: 0 },
  { name: 'Cupid', tier: 'Diamond', division: 'III', lp: 16 },
  { name: 'bánh mỳ', tier: 'Diamond', division: 'IV', lp: 10 },
  { name: 'Zibi', tier: 'Emerald', division: 'I', lp: 20 },
  { name: 'Đồng Nai', tier: 'Platinum', division: 'IV', lp: 0 },
  { name: 'Bun', tier: 'Gold', division: 'III', lp: 37 },
  { name: 'Đại Tá', tier: 'Unranked', division: null, lp: 0 },
  { name: 'Gà', tier: 'Unranked', division: null, lp: 0 }
];

// LoL Season 25 Data
const LOL_MEMBERS = [
  { name: 'Su', soloTier: 'Emerald', soloDivision: 'IV', soloLp: 36, flexTier: 'Emerald', flexDivision: 'III', flexLp: 82 },
  { name: 'Yun', soloTier: 'Diamond', soloDivision: 'III', soloLp: 3, flexTier: 'Diamond', flexDivision: 'I', flexLp: 51 },
  { name: 'a Tứn', soloTier: 'Platinum', soloDivision: 'III', soloLp: 24, flexTier: 'Gold', flexDivision: 'I', flexLp: 99 },
  { name: 'Hycan', soloTier: 'Emerald', soloDivision: 'IV', soloLp: 74, flexTier: 'Diamond', flexDivision: 'IV', flexLp: 34 },
  { name: 'Kua', soloTier: 'Master', soloDivision: null, soloLp: 97, flexTier: 'Master', flexDivision: null, flexLp: 8 },
  { name: 'Xệ', soloTier: 'Challenger', soloDivision: null, soloLp: 2153, flexTier: 'Challenger', flexDivision: 'null', flexLp: 2132 },
  { name: 'Cupid', soloTier: 'Emerald', soloDivision: 'I', soloLp: 40, flexTier: 'Diamond', flexDivision: 'I', flexLp: 33 },
  { name: 'bánh mỳ', soloTier: 'Master', soloDivision: null, soloLp: 423, flexTier: 'Master', flexDivision: null, flexLp: 114 },
  { name: 'Zibi', soloTier: 'Gold', soloDivision: 'III', soloLp: 84, flexTier: 'Gold', flexDivision: 'II', flexLp: 69 },
  { name: 'Đồng Nai', soloTier: 'Emerald', soloDivision: 'II', soloLp: 95, flexTier: 'Master', flexDivision: null, flexLp: 56 },
  { name: 'Bun', soloTier: 'Gold', soloDivision: 'II', soloLp: 36, flexTier: 'Gold', flexDivision: 'IV', flexLp: 26 },
  { name: 'Đại Tá', soloTier: 'Silver', soloDivision: 'I', soloLp: 69, flexTier: 'Gold', flexDivision: 'II', flexLp: 61 },
  { name: 'Gà', soloTier: 'Platinum', soloDivision: 'IV', soloLp: 35, flexTier: 'Silver', flexDivision: 'II', flexLp: 17 }
];

// Format LoL rank display
function formatLoLRank(tier, division, lp) {
  if (tier === 'Unranked') return 'Unranked';
  let rank = tier;
  if (division && !NO_DIVISION_TIERS.includes(tier)) {
    rank += ' ' + division;
  }
  rank += ' ' + lp + ' LP';
  return rank;
}

// Sort LoL members by Solo/Duo rank
function sortLoLByRank(members) {
  return [...members].sort((a, b) => {
    const tierA = TIER_ORDER.indexOf(a.soloTier);
    const tierB = TIER_ORDER.indexOf(b.soloTier);
    if (tierA !== tierB) return tierA - tierB;
    
    if (!NO_DIVISION_TIERS.includes(a.soloTier)) {
      const divA = a.soloDivision ? DIVISION_ORDER.indexOf(a.soloDivision) : 999;
      const divB = b.soloDivision ? DIVISION_ORDER.indexOf(b.soloDivision) : 999;
      if (divA !== divB) return divA - divB;
    }
    
    if (a.soloLp !== b.soloLp) return b.soloLp - a.soloLp;
    return a.name.localeCompare(b.name);
  });
}

// Find LoL member
function findLoLMember(name) {
  return LOL_MEMBERS.find(m => m.name === name);
}

// Get top N LoL members
function getTopLoLMembers(n) {
  return sortLoLByRank(LOL_MEMBERS).slice(0, n);
}

// Get slug for a member name
function getSlug(name) {
  return SLUG_MAP[name] || name.toLowerCase().replace(/\s+/g, '-');
}

// Get initials from display name
function getInitials(name) {
  const parts = name.split(' ').filter(p => p.length > 0);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return parts.map(p => p[0]).join('').toUpperCase().substring(0, 2);
}

// Format rank display string
function formatRank(member) {
  if (member.tier === 'Unranked') {
    return 'Unranked';
  }
  
  let rank = member.tier;
  if (member.division && !NO_DIVISION_TIERS.includes(member.tier)) {
    rank += ' ' + member.division;
  }
  rank += ' ' + member.lp + ' LP';
  return rank;
}

// Sort members by TFT ranking rules
function sortByRank(members) {
  return [...members].sort((a, b) => {
    // 1. Tier priority
    const tierA = TIER_ORDER.indexOf(a.tier);
    const tierB = TIER_ORDER.indexOf(b.tier);
    if (tierA !== tierB) return tierA - tierB;
    
    // 2. Division (for tiers that use divisions)
    if (!NO_DIVISION_TIERS.includes(a.tier)) {
      const divA = a.division ? DIVISION_ORDER.indexOf(a.division) : 999;
      const divB = b.division ? DIVISION_ORDER.indexOf(b.division) : 999;
      if (divA !== divB) return divA - divB;
    }
    
    // 3. LP (higher first)
    if (a.lp !== b.lp) return b.lp - a.lp;
    
    // 4. Alphabetical by name
    return a.name.localeCompare(b.name);
  });
}

// Get tier color class
function getTierClass(tier) {
  const tierClasses = {
    'Challenger': 'tier-challenger',
    'Grandmaster': 'tier-grandmaster',
    'Master': 'tier-master',
    'Diamond': 'tier-diamond',
    'Emerald': 'tier-emerald',
    'Platinum': 'tier-platinum',
    'Gold': 'tier-gold',
    'Silver': 'tier-silver',
    'Bronze': 'tier-bronze',
    'Iron': 'tier-iron',
    'Unranked': 'tier-unranked'
  };
  return tierClasses[tier] || 'tier-unranked';
}

// Find member by name
function findMember(name) {
  return MEMBERS.find(m => m.name === name);
}

// Get top N members
function getTopMembers(n) {
  return sortByRank(MEMBERS).slice(0, n);
}

// Export for use in other scripts
window.WildHorses = {
  MEMBERS,
  LOL_MEMBERS,
  TIER_ORDER,
  DIVISION_ORDER,
  NO_DIVISION_TIERS,
  SLUG_MAP,
  getSlug,
  getInitials,
  formatRank,
  formatLoLRank,
  sortByRank,
  sortLoLByRank,
  getTierClass,
  findMember,
  findLoLMember,
  getTopMembers,
  getTopLoLMembers
};
