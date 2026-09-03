/* =========================================================
   Integrity Fusion Products — LeadRyze AI Chatbot Demo
   script.js
   Sections:
   1. Icon templates        6. Chatbot core
   2. Product database      7. Chatbot intent + search
   3. Filter state/render   8. Quote flow
   4. Explorer + search     9. Lead scoring + CRM simulation
   5. Modals               10. Navigation / mobile / misc UI
   ========================================================= */

/* ---------------------------------------------------------
   1. ICON TEMPLATES (inline SVG, no external image assets)
   --------------------------------------------------------- */
const ICONS = {
  elbow: '<svg viewBox="0 0 64 64" width="56" height="56"><path d="M14 50 V26 a12 12 0 0 1 12 -12 H50" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round"/></svg>',
  tee: '<svg viewBox="0 0 64 64" width="56" height="56"><path d="M8 32 H56 M32 32 V54" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round"/></svg>',
  wye: '<svg viewBox="0 0 64 64" width="56" height="56"><path d="M10 14 L32 34 V54 M54 14 L32 34" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round"/></svg>',
  cross: '<svg viewBox="0 0 64 64" width="56" height="56"><path d="M8 32 H56 M32 8 V56" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round"/></svg>',
  reducer: '<svg viewBox="0 0 64 64" width="56" height="56"><path d="M6 24 H24 L40 32 L24 40 H6 M40 32 H58" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  cap: '<svg viewBox="0 0 64 64" width="56" height="56"><path d="M10 32 H40" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round"/><path d="M40 16 a16 16 0 0 1 0 32" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round"/></svg>',
  coupler: '<svg viewBox="0 0 64 64" width="56" height="56"><path d="M4 32 H60" stroke="currentColor" stroke-width="9" stroke-linecap="round"/><rect x="20" y="18" width="24" height="28" rx="4" fill="none" stroke="currentColor" stroke-width="5"/></svg>',
  saddle: '<svg viewBox="0 0 64 64" width="56" height="56"><path d="M4 40 H60" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><path d="M22 40 a10 12 0 0 1 20 0" fill="none" stroke="currentColor" stroke-width="6"/></svg>',
  restraint: '<svg viewBox="0 0 64 64" width="56" height="56"><path d="M6 32 H58" stroke="currentColor" stroke-width="9" stroke-linecap="round"/><path d="M20 20 V44 M32 18 V46 M44 20 V44" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>',
  valve: '<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="34" r="14" fill="none" stroke="currentColor" stroke-width="7"/><path d="M32 20 V8 M22 8 H42" stroke="currentColor" stroke-width="6" stroke-linecap="round"/></svg>',
  flange: '<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" stroke-width="7"/><circle cx="32" cy="14" r="3" fill="currentColor"/><circle cx="32" cy="50" r="3" fill="currentColor"/><circle cx="14" cy="32" r="3" fill="currentColor"/><circle cx="50" cy="32" r="3" fill="currentColor"/></svg>',
  ring: '<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" stroke-width="8"/></svg>',
  adapter: '<svg viewBox="0 0 64 64" width="56" height="56"><path d="M6 26 H26 L44 20 H58 V44 H44 L26 38 H6 Z" fill="none" stroke="currentColor" stroke-width="6" stroke-linejoin="round"/></svg>',
  processor: '<svg viewBox="0 0 64 64" width="56" height="56"><rect x="10" y="16" width="44" height="32" rx="4" fill="none" stroke="currentColor" stroke-width="6"/><path d="M20 16 V8 M44 16 V8" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><circle cx="24" cy="32" r="4" fill="currentColor"/><circle cx="40" cy="32" r="4" fill="currentColor"/></svg>',
  clamp: '<svg viewBox="0 0 64 64" width="56" height="56"><path d="M46 12 a20 20 0 1 0 0 40" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"/><path d="M46 12 V24 M46 52 V40" stroke="currentColor" stroke-width="7" stroke-linecap="round"/></svg>',
  scraper: '<svg viewBox="0 0 64 64" width="56" height="56"><path d="M10 50 L38 22" stroke="currentColor" stroke-width="7" stroke-linecap="round"/><rect x="34" y="10" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="6" transform="rotate(45 43 19)"/></svg>',
  generic: '<svg viewBox="0 0 64 64" width="56" height="56"><rect x="10" y="20" width="44" height="24" rx="6" fill="none" stroke="currentColor" stroke-width="6"/></svg>',
};
function iconMarkup(key) { return ICONS[key] || ICONS.generic; }

/* ---------------------------------------------------------
   2. PRODUCT DATABASE
   --------------------------------------------------------- */
const MATERIAL_HDPE = 'PE3408 / PE4710 / PE100';
const STANDARDS_WATER = ['ASTM D2513', 'ASTM D3261', 'AWWA C901/C906', 'NSF/ANSI 61'];
const STANDARDS_GAS = ['ASTM D2513', 'ASTM D3350'];

let idCounter = 1;
function P(p) {
  return {
    id: 'p' + idCounter++,
    material: MATERIAL_HDPE,
    standards: STANDARDS_WATER,
    madeInUSA: false,
    babaCompliant: false,
    quoteAvailable: true,
    documentation: true,
    notes: 'See product specification sheet for full engineering data.',
    sdr: [],
    sizes: [],
    ...p,
  };
}

const SIZE_STD = ['2"', '3"', '4"', '6"', '8"', '10"', '12"'];
const SDR_STD = ['7', '9', '11', '13.5', '17', '21'];

const PRODUCTS = [
  // ---- Molded Butt Fusion ----
  P({ name: '90° Molded Elbow', category: 'Fittings', family: 'Molded Butt Fusion', type: 'Elbow', icon: 'elbow', connection: 'Butt Fusion', sizes: SIZE_STD, sdr: SDR_STD, applications: ['Potable Water', 'Wastewater', 'Industrial', 'Mining'], description: 'Molded HDPE 90° elbow for directional changes in butt-fused pipeline systems.', madeInUSA: true, babaCompliant: true }),
  P({ name: '45° Molded Elbow', category: 'Fittings', family: 'Molded Butt Fusion', type: 'Elbow', icon: 'elbow', connection: 'Butt Fusion', sizes: SIZE_STD, sdr: SDR_STD, applications: ['Potable Water', 'Wastewater', 'Industrial'], description: 'Molded HDPE 45° elbow for gradual directional transitions.', madeInUSA: true, babaCompliant: true }),
  P({ name: 'Equal Tee', category: 'Fittings', family: 'Molded Butt Fusion', type: 'Tee', icon: 'tee', connection: 'Butt Fusion', sizes: SIZE_STD, sdr: SDR_STD, applications: ['Potable Water', 'Wastewater', 'Irrigation', 'Industrial'], description: 'Molded HDPE equal tee for branch connections of matching pipe diameters.', madeInUSA: true, babaCompliant: true }),
  P({ name: 'Reducing Tee', category: 'Fittings', family: 'Molded Butt Fusion', type: 'Tee', icon: 'tee', connection: 'Butt Fusion', sizes: SIZE_STD, sdr: SDR_STD, applications: ['Potable Water', 'Wastewater', 'Industrial'], description: 'Molded HDPE reducing tee for branch connections between differing pipe diameters.', madeInUSA: true, babaCompliant: true }),
  P({ name: 'Lateral Wye', category: 'Fittings', family: 'Molded Butt Fusion', type: 'Wye', icon: 'wye', connection: 'Butt Fusion', sizes: SIZE_STD, sdr: SDR_STD, applications: ['Wastewater', 'Stormwater', 'Drainage'], description: 'Molded HDPE wye fitting for low-turbulence branch connections, common in gravity flow lines.' }),
  P({ name: 'Cross', category: 'Fittings', family: 'Molded Butt Fusion', type: 'Cross', icon: 'cross', connection: 'Butt Fusion', sizes: SIZE_STD, sdr: SDR_STD, applications: ['Industrial', 'Mining', 'Potable Water'], description: 'Four-way molded HDPE cross fitting for multi-directional pipeline junctions.' }),
  P({ name: 'Molded Reducer', category: 'Fittings', family: 'Molded Butt Fusion', type: 'Reducer', icon: 'reducer', connection: 'Butt Fusion', sizes: SIZE_STD, sdr: SDR_STD, applications: ['Potable Water', 'Wastewater', 'Industrial', 'Mining', 'Landfill', 'Oil & Gas'], description: 'Molded HDPE reducer for transitioning between two pipe diameters within the same pressure class.', madeInUSA: true, babaCompliant: true }),
  P({ name: 'End Cap', category: 'Fittings', family: 'Molded Butt Fusion', type: 'Cap', icon: 'cap', connection: 'Butt Fusion', sizes: SIZE_STD, sdr: SDR_STD, applications: ['Potable Water', 'Wastewater', 'Industrial'], description: 'Molded HDPE end cap for terminating a butt-fused pipeline run.' }),

  // ---- Electrofusion ----
  P({ name: 'Electrofusion Coupler', category: 'Fittings', family: 'Electrofusion', type: 'Coupler', icon: 'coupler', connection: 'Electrofusion', sizes: SIZE_STD, sdr: SDR_STD, applications: ['Potable Water', 'Natural Gas', 'Industrial'], description: 'Electrofusion coupler for straight, in-line joining of two HDPE pipe ends using embedded resistance wire.' }),
  P({ name: '90° Electrofusion Elbow', category: 'Fittings', family: 'Electrofusion', type: 'Elbow', icon: 'elbow', connection: 'Electrofusion', sizes: SIZE_STD.slice(0, 5), sdr: SDR_STD, applications: ['Potable Water', 'Natural Gas'], description: 'Electrofusion 90° elbow for directional changes without butt-fusion equipment.' }),
  P({ name: '45° Electrofusion Elbow', category: 'Fittings', family: 'Electrofusion', type: 'Elbow', icon: 'elbow', connection: 'Electrofusion', sizes: SIZE_STD.slice(0, 5), sdr: SDR_STD, applications: ['Potable Water', 'Natural Gas'], description: 'Electrofusion 45° elbow for gradual directional transitions in confined excavations.' }),
  P({ name: 'Electrofusion Equal Tee', category: 'Fittings', family: 'Electrofusion', type: 'Tee', icon: 'tee', connection: 'Electrofusion', sizes: SIZE_STD.slice(0, 5), sdr: SDR_STD, applications: ['Potable Water', 'Natural Gas', 'Industrial'], description: 'Electrofusion equal tee for branch connections joined with a fusion processor.' }),
  P({ name: 'Electrofusion Reducer', category: 'Fittings', family: 'Electrofusion', type: 'Reducer', icon: 'reducer', connection: 'Electrofusion', sizes: SIZE_STD.slice(0, 5), sdr: SDR_STD, applications: ['Potable Water', 'Natural Gas', 'Industrial'], description: 'Electrofusion reducer for transitioning pipe diameters via electrofusion joining.' }),
  P({ name: 'Branch Saddle', category: 'Fittings', family: 'Electrofusion', type: 'Branch Saddle', icon: 'saddle', connection: 'Electrofusion', sizes: SIZE_STD, sdr: SDR_STD, applications: ['Potable Water', 'Natural Gas', 'Irrigation'], description: 'Electrofusion branch saddle for adding a live-tapped service connection to an existing main.' }),
  P({ name: 'Transition Saddle', category: 'Fittings', family: 'Electrofusion', type: 'Transition Saddle', icon: 'saddle', connection: 'Electrofusion', sizes: SIZE_STD, sdr: SDR_STD, applications: ['Potable Water', 'Natural Gas'], description: 'Electrofusion transition saddle for connecting a service line at a defined outlet fitting.' }),
  P({ name: 'Flex Restraint', category: 'Fittings', family: 'Electrofusion', type: 'Flex Restraint', icon: 'restraint', connection: 'Electrofusion', sizes: SIZE_STD.slice(0, 4), sdr: SDR_STD, applications: ['Natural Gas', 'Potable Water'], description: 'Electrofusion flex restraint that mechanically locks a fused joint against pull-out forces.' }),

  // ---- Poly Ball Valves ----
  P({ name: 'Potable Water Poly Ball Valve', category: 'Fittings', family: 'Poly Ball Valves', type: 'Valve', icon: 'valve', connection: 'Threaded', sizes: SIZE_STD.slice(0, 4), applications: ['Potable Water', 'Irrigation'], description: 'Full-port HDPE ball valve rated for potable water isolation and shut-off service.', standards: STANDARDS_WATER }),
  P({ name: 'Gas / Industrial Poly Ball Valve', category: 'Fittings', family: 'Poly Ball Valves', type: 'Valve', icon: 'valve', connection: 'Threaded', sizes: SIZE_STD.slice(0, 4), applications: ['Natural Gas', 'Industrial', 'Oil & Gas'], description: 'Full-port HDPE ball valve rated for gas and industrial isolation service.', standards: STANDARDS_GAS }),

  // ---- Transition Fittings ----
  P({ name: 'Standard Carbon Steel Male NPT', category: 'Fittings', family: 'Transition Fittings', type: 'Standard', icon: 'adapter', connection: 'Mechanical Joint', sizes: SIZE_STD.slice(0, 5), applications: ['Potable Water', 'Industrial'], description: 'Standard-duty HDPE-to-steel transition fitting with male NPT thread configuration.' }),
  P({ name: 'Standard Carbon Steel Machine Grooved', category: 'Fittings', family: 'Transition Fittings', type: 'Standard', icon: 'adapter', connection: 'Mechanical Joint', sizes: SIZE_STD.slice(0, 5), applications: ['Industrial', 'Wastewater'], description: 'Standard-duty HDPE-to-steel transition fitting with a machine-grooved end for coupling.' }),
  P({ name: 'Stainless Steel Male NPT', category: 'Fittings', family: 'Transition Fittings', type: 'Stainless Steel', icon: 'adapter', connection: 'Mechanical Joint', sizes: SIZE_STD.slice(0, 5), applications: ['Potable Water', 'Aquaculture', 'Industrial'], description: 'Corrosion-resistant stainless-steel transition fitting with male NPT thread configuration.' }),
  P({ name: 'Heavy Duty Weld End', category: 'Fittings', family: 'Transition Fittings', type: 'Heavy Duty', icon: 'adapter', connection: 'Mechanical Joint', sizes: SIZE_STD.slice(2), applications: ['Oil & Gas', 'Industrial', 'Mining'], description: 'Heavy-duty HDPE-to-steel transition fitting with a weld-end for field steel connections.' }),

  // ---- Flange Adapters ----
  P({ name: 'HDPE Flange Adapter', category: 'Fittings', family: 'Flange Adapters', type: 'Flange Adapter', icon: 'flange', connection: 'Flanged', sizes: SIZE_STD, sdr: SDR_STD, applications: ['Potable Water', 'Wastewater', 'Industrial', 'Mining'], description: 'Molded HDPE flange adapter for bolted connections to valves, pumps and steel flanges.', madeInUSA: true, babaCompliant: true }),
  P({ name: '60° Beveled Flange Adapter', category: 'Fittings', family: 'Flange Adapters', type: 'Flange Adapter', icon: 'flange', connection: 'Flanged', sizes: SIZE_STD, sdr: SDR_STD, applications: ['Potable Water', 'Industrial'], description: 'Beveled-face molded HDPE flange adapter for high-pressure bolted connections.', madeInUSA: true, babaCompliant: true }),

  // ---- Backup Rings ----
  P({ name: 'SDR 7 Backup Ring', category: 'Fittings', family: 'Backup Rings', type: 'SDR 7', icon: 'ring', connection: 'Flanged', sdr: ['7'], applications: ['Industrial', 'Oil & Gas'], description: 'Steel backup ring sized for SDR 7 flange-adapter assemblies.' }),
  P({ name: 'SDR 11 Backup Ring', category: 'Fittings', family: 'Backup Rings', type: 'SDR 11', icon: 'ring', connection: 'Flanged', sdr: ['11'], applications: ['Potable Water', 'Wastewater', 'Industrial'], description: 'Steel backup ring sized for SDR 11 flange-adapter assemblies.' }),
  P({ name: 'DIPS SDR 11 Backup Ring', category: 'Fittings', family: 'Backup Rings', type: 'DIPS SDR 11', icon: 'ring', connection: 'Flanged', sdr: ['11'], applications: ['Potable Water', 'Water Distribution'], description: 'Ductile-iron-pipe-size (DIPS) SDR 11 backup ring for DI-compatible flange assemblies.' }),
  P({ name: 'Stainless Steel Backup Ring', category: 'Fittings', family: 'Backup Rings', type: 'Stainless Steel', icon: 'ring', connection: 'Flanged', sdr: ['11', '17'], applications: ['Aquaculture', 'Potable Water', 'Industrial'], description: 'Corrosion-resistant stainless-steel backup ring for demanding or corrosive environments.' }),

  // ---- MJ Adapters ----
  P({ name: 'MJ Adapter', category: 'Fittings', family: 'MJ Adapters', type: 'MJ Adapter', icon: 'adapter', connection: 'Mechanical Joint', sizes: SIZE_STD, sdr: SDR_STD, applications: ['Potable Water', 'Water Distribution'], description: 'Molded HDPE mechanical-joint adapter for direct connection to MJ-compatible valves and fittings.', madeInUSA: true, babaCompliant: true }),
  P({ name: 'MJ Adapter with Stiffener', category: 'Fittings', family: 'MJ Adapters', type: 'MJ Adapter', icon: 'adapter', connection: 'Mechanical Joint', sizes: SIZE_STD, sdr: SDR_STD, applications: ['Potable Water', 'Water Distribution'], description: 'Molded HDPE mechanical-joint adapter with an integral stainless stiffener for added joint integrity.', madeInUSA: true, babaCompliant: true }),
  P({ name: 'MJ Adapter Gland Ring Kit', category: 'Fittings', family: 'MJ Adapter Gland Ring Kits', type: 'Gland Ring Kit', icon: 'ring', connection: 'Mechanical Joint', sizes: SIZE_STD, applications: ['Potable Water', 'Water Distribution'], description: 'Complete gland, ring and bolt kit for finishing an MJ adapter installation.' }),

  // ---- Equipment ----
  P({ name: 'I-60 Electrofusion Processor', category: 'Equipment', family: 'Electrofusion Processors', type: 'I-60', icon: 'processor', connection: 'Electrofusion', sizes: ['1/2" – 2"'], applications: ['Potable Water', 'Natural Gas'], description: 'Compact electrofusion control unit for small-diameter service and distribution fittings.', standards: [] }),
  P({ name: 'I-105 Electrofusion Processor', category: 'Equipment', family: 'Electrofusion Processors', type: 'I-105', icon: 'processor', connection: 'Electrofusion', sizes: ['1/2" – 12"'], applications: ['Potable Water', 'Natural Gas', 'Industrial'], description: 'Full-range electrofusion control unit supporting small- through large-diameter fittings.', standards: [] }),
  P({ name: 'Hydraulic Re-Rounding Clamp', category: 'Equipment', family: 'Re-Rounding Clamps', type: 'Re-Rounding Clamp', icon: 'clamp', connection: 'Butt Fusion', sizes: SIZE_STD, applications: ['Industrial', 'Mining', 'Oil & Gas'], description: 'Hydraulic clamp that restores pipe roundness prior to butt-fusion or electrofusion joining.', standards: [] }),
  P({ name: 'Orbital Scraper/Peeler', category: 'Equipment', family: 'Scraper/Peeler Tools', type: 'Orbital', icon: 'scraper', connection: 'Electrofusion', sizes: SIZE_STD.slice(0, 5), applications: ['Potable Water', 'Natural Gas'], description: 'Orbital-action tool for preparing pipe surface oxidation layer ahead of electrofusion joining.', standards: [] }),
  P({ name: 'Rotary Scraper/Peeler', category: 'Equipment', family: 'Scraper/Peeler Tools', type: 'Rotary', icon: 'scraper', connection: 'Electrofusion', sizes: SIZE_STD.slice(0, 5), applications: ['Potable Water', 'Natural Gas', 'Industrial'], description: 'Rotary hand tool for quick, even pipe-surface preparation before fusion joining.', standards: [] }),
  P({ name: 'Chain Scraper/Peeler', category: 'Equipment', family: 'Scraper/Peeler Tools', type: 'Chain', icon: 'scraper', connection: 'Electrofusion', sizes: SIZE_STD.slice(2), applications: ['Industrial', 'Mining', 'Oil & Gas'], description: 'Inter-locking chain-style scraper for large-diameter pipe surface preparation.', standards: [] }),
];

const APPLICATIONS = [...new Set(PRODUCTS.flatMap((p) => p.applications))].sort();
const FAMILIES = [...new Set(PRODUCTS.map((p) => p.family))];
const CONNECTIONS = [...new Set(PRODUCTS.map((p) => p.connection).filter(Boolean))];
const ALL_SIZES = [...new Set(PRODUCTS.flatMap((p) => p.sizes))];
const ALL_SDR = [...new Set(PRODUCTS.flatMap((p) => p.sdr))].sort((a, b) => parseFloat(a) - parseFloat(b));

const INDUSTRY_ICONS = [
  { key: 'water', label: 'Water', app: 'Potable Water', icon: 'valve' },
  { key: 'oilgas', label: 'Oil & Gas', app: 'Oil & Gas', icon: 'flange' },
  { key: 'industrial', label: 'Industrial', app: 'Industrial', icon: 'processor' },
  { key: 'mining', label: 'Mining', app: 'Mining', icon: 'clamp' },
  { key: 'wastewater', label: 'Wastewater', app: 'Wastewater', icon: 'wye' },
  { key: 'landfill', label: 'Landfill', app: 'Landfill', icon: 'reducer' },
];

/* ---------------------------------------------------------
   3 & 4. FILTER STATE + EXPLORER RENDERING
   --------------------------------------------------------- */
const filters = { type: '', family: '', application: '', connection: '', size: '', sdr: '', search: '' };

function populateSelect(el, values, placeholder) {
  el.innerHTML = `<option value="">${placeholder}</option>` + values.map((v) => `<option value="${v}">${v}</option>`).join('');
}

function initFilters() {
  populateSelect(document.getElementById('filterFamily'), FAMILIES, 'All Categories');
  populateSelect(document.getElementById('filterApplication'), APPLICATIONS, 'All Applications');
  populateSelect(document.getElementById('filterConnection'), CONNECTIONS, 'All Connections');
  populateSelect(document.getElementById('filterSize'), ALL_SIZES, 'Any Size');
  populateSelect(document.getElementById('filterSdr'), ALL_SDR, 'Any SDR');

  document.getElementById('filterType').addEventListener('click', (e) => {
    const btn = e.target.closest('.pill');
    if (!btn) return;
    filters.type = btn.dataset.value;
    document.querySelectorAll('#filterType .pill').forEach((p) => p.classList.toggle('active', p === btn));
    applyFilters();
  });
  ['filterFamily', 'filterApplication', 'filterConnection', 'filterSize', 'filterSdr'].forEach((id) => {
    document.getElementById(id).addEventListener('change', (e) => {
      const key = id.replace('filter', '').replace(/^./, (c) => c.toLowerCase());
      filters[key] = e.target.value;
      applyFilters();
    });
  });
  document.getElementById('explorerSearch').addEventListener('input', (e) => {
    filters.search = e.target.value.trim().toLowerCase();
    applyFilters();
  });
  document.getElementById('clearFiltersBtn').addEventListener('click', resetFilters);
  document.getElementById('emptyResetBtn').addEventListener('click', resetFilters);
}

function resetFilters() {
  filters.type = filters.family = filters.application = filters.connection = filters.size = filters.sdr = filters.search = '';
  document.getElementById('filterFamily').value = '';
  document.getElementById('filterApplication').value = '';
  document.getElementById('filterConnection').value = '';
  document.getElementById('filterSize').value = '';
  document.getElementById('filterSdr').value = '';
  document.getElementById('explorerSearch').value = '';
  document.querySelectorAll('#filterType .pill').forEach((p) => p.classList.toggle('active', p.dataset.value === ''));
  applyFilters();
}

function matchesFilters(p) {
  if (filters.type && p.category !== filters.type) return false;
  if (filters.family && p.family !== filters.family) return false;
  if (filters.application && !p.applications.includes(filters.application)) return false;
  if (filters.connection && p.connection !== filters.connection) return false;
  if (filters.size && !p.sizes.includes(filters.size)) return false;
  if (filters.sdr && !p.sdr.includes(filters.sdr)) return false;
  if (filters.search) {
    const hay = [p.name, p.family, p.type, p.category, p.connection, ...p.applications].join(' ').toLowerCase();
    if (!hay.includes(filters.search)) return false;
  }
  return true;
}

function applyFilters() {
  const results = PRODUCTS.filter(matchesFilters);
  renderProductGrid(results);
}

function productCardHTML(p) {
  const badges = [];
  if (p.madeInUSA) badges.push('<span class="b-usa">USA</span>');
  if (p.babaCompliant) badges.push('<span class="b-baba">BABA</span>');
  return `
    <div class="product-card" data-id="${p.id}">
      <div class="product-card-media">
        <span class="product-card-badge">${p.category}</span>
        ${iconMarkup(p.icon)}
      </div>
      <div class="product-card-body">
        <h4>${p.name}</h4>
        <p class="desc">${p.description}</p>
        <div class="tag-row">
          ${p.applications.slice(0, 3).map((a) => `<span class="tag">${a}</span>`).join('')}
        </div>
        <div class="spec-mini">
          <strong>${p.connection || '—'}</strong>${p.sizes.length ? ' · ' + p.sizes[0] + '–' + p.sizes[p.sizes.length - 1] : ''}${p.sdr.length ? ' · SDR ' + p.sdr.join('/') : ''}
        </div>
        ${badges.length ? `<div class="badge-row">${badges.join('')}</div>` : ''}
        <div class="product-card-actions">
          <button type="button" class="btn btn-outline" data-view="${p.id}">View Details</button>
          <button type="button" class="btn btn-outline" data-ask="${p.id}">Ask AI</button>
          <button type="button" class="btn btn-primary" data-quote="${p.id}">Quote</button>
        </div>
      </div>
    </div>`;
}

function renderProductGrid(list) {
  const grid = document.getElementById('productGrid');
  const empty = document.getElementById('emptyState');
  const count = document.getElementById('resultsCount');
  count.textContent = list.length === PRODUCTS.length ? `Showing all ${list.length} products` : `Showing ${list.length} of ${PRODUCTS.length} products`;
  if (!list.length) {
    grid.innerHTML = '';
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  grid.innerHTML = list.map(productCardHTML).join('');
}

document.getElementById('productGrid').addEventListener('click', (e) => {
  const viewId = e.target.closest('[data-view]')?.dataset.view;
  const askId = e.target.closest('[data-ask]')?.dataset.ask;
  const quoteId = e.target.closest('[data-quote]')?.dataset.quote;
  if (viewId) openProductModal(findProductById(viewId));
  if (askId) { openChatbotWithProduct(findProductById(askId)); }
  if (quoteId) openQuoteModal(findProductById(quoteId));
});

function findProductById(id) { return PRODUCTS.find((p) => p.id === id); }

/* Nav / mega-menu / footer links that pre-filter the explorer */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href="#explorer"]');
  if (!link) return;
  e.preventDefault();
  resetFilters();
  const type = link.dataset.type;
  const family = link.dataset.family;
  if (type) {
    filters.type = type === 'fittings' ? 'Fittings' : 'Equipment';
    document.querySelectorAll('#filterType .pill').forEach((p) => p.classList.toggle('active', p.dataset.value === filters.type));
  }
  if (family) {
    filters.family = family;
    document.getElementById('filterFamily').value = family;
  }
  const typeItem = link.dataset.typeItem;
  if (typeItem) {
    filters.search = typeItem.toLowerCase();
    document.getElementById('explorerSearch').value = typeItem;
  }
  applyFilters();
  document.getElementById('explorer').scrollIntoView({ behavior: 'smooth' });
  closeMobileNav();
});

/* ---------------------------------------------------------
   5. MODALS
   --------------------------------------------------------- */
function openModal(id) { document.getElementById(id).classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById(id).classList.remove('open'); document.body.style.overflow = ''; }
function closeAllModals() {
  document.querySelectorAll('.modal-overlay.open').forEach((m) => m.classList.remove('open'));
  document.body.style.overflow = '';
}
document.addEventListener('click', (e) => {
  if (e.target.matches('[data-close-modal]')) closeAllModals();
  if (e.target.classList.contains('modal-overlay')) closeAllModals();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeAllModals(); closeChatbot(); } });

function openProductModal(p) {
  if (!p) return;
  const badges = [];
  if (p.madeInUSA) badges.push('<span class="tag">Made in USA</span>');
  if (p.babaCompliant) badges.push('<span class="tag">BABA Compliant</span>');
  document.getElementById('productModalBody').innerHTML = `
    <span class="eyebrow">${p.category} · ${p.family}</span>
    <h3 id="productModalTitle">${p.name}</h3>
    <div class="product-card-media" style="height:150px;border-radius:12px;margin-bottom:18px;">${iconMarkup(p.icon)}</div>
    <p>${p.description}</p>
    <div class="tag-row" style="margin-bottom:14px;">${p.applications.map((a) => `<span class="tag">${a}</span>`).join('')}${badges.join('')}</div>
    <div class="form-grid" style="margin-bottom:6px;">
      <div class="form-field"><label>Material</label><span>${p.material}</span></div>
      <div class="form-field"><label>Connection</label><span>${p.connection || '—'}</span></div>
      <div class="form-field"><label>Size Range</label><span>${p.sizes.join(', ') || '—'}</span></div>
      <div class="form-field"><label>SDR</label><span>${p.sdr.length ? p.sdr.join(', ') : '—'}</span></div>
      <div class="form-field"><label>Standards</label><span>${p.standards.length ? p.standards.join(', ') : 'See specification sheet'}</span></div>
      <div class="form-field"><label>Documentation</label><span>${p.documentation ? 'Spec sheet available' : '—'}</span></div>
    </div>
    <p style="font-size:0.8rem;color:var(--gray-500);">${p.notes}</p>
    <div class="product-card-actions" style="margin-top:10px;">
      <button type="button" class="btn btn-outline" id="modalAskAiBtn">Ask AI About This Product</button>
      <button type="button" class="btn btn-primary" id="modalQuoteBtn">Request a Quote</button>
    </div>
  `;
  document.getElementById('modalAskAiBtn').onclick = () => { closeAllModals(); openChatbotWithProduct(p); };
  document.getElementById('modalQuoteBtn').onclick = () => { closeAllModals(); openQuoteModal(p); };
  openModal('productModalOverlay');
}

/* Quote modal */
function initQuoteModal() {
  populateSelect(document.getElementById('quoteIndustry'), APPLICATIONS, 'Select…');
  populateSelect(document.getElementById('quoteFamily'), FAMILIES, 'Select…');
  document.getElementById('quoteFamily').addEventListener('change', (e) => {
    const opts = PRODUCTS.filter((p) => p.family === e.target.value);
    populateSelect(document.getElementById('quoteProduct'), opts.map((p) => p.name), 'Select…');
  });
  document.getElementById('quoteForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = {
      product: fd.get('product') || fd.get('family') || null,
      quantity: fd.get('quantity') || null,
      company: fd.get('company') || null,
      contactName: `${fd.get('firstName') || ''} ${fd.get('lastName') || ''}`.trim() || null,
      email: fd.get('email') || null,
      phone: fd.get('phone') || null,
      application: fd.get('industry') || null,
      location: fd.get('location') || null,
    };
    e.target.hidden = true;
    const successEl = document.getElementById('quoteSuccess');
    successEl.hidden = false;
    successEl.innerHTML = '<p><strong>Thank you — your quote request has been captured.</strong></p><p style="font-size:0.85rem;">LeadRyze CRM Demo</p>';
    runCrmSimulation(data, successEl);
    showToast('Quote request submitted');
  });
}
function openQuoteModal(product) {
  document.getElementById('quoteForm').hidden = false;
  document.getElementById('quoteForm').reset();
  document.getElementById('quoteSuccess').hidden = true;
  document.getElementById('quoteSuccess').innerHTML = '';
  if (product) {
    document.getElementById('quoteFamily').value = product.family;
    document.getElementById('quoteFamily').dispatchEvent(new Event('change'));
    document.getElementById('quoteProduct').value = product.name;
  }
  openModal('quoteModalOverlay');
}

/* Info modal (training / careers / resources) */
function openInfoModal(title, html) {
  document.getElementById('infoModalBody').innerHTML = `<h3>${title}</h3>${html}`;
  openModal('infoModalOverlay');
}

/* 3-D Library modal */
const LIB3D_ITEMS = PRODUCTS.filter((p) => ['Elbow', 'Tee', 'Reducer', 'Coupler', 'Valve', 'Flange Adapter'].includes(p.type)).slice(0, 8);
let lib3dRotation = 0;
function initLib3d() {
  document.getElementById('lib3dList').innerHTML = LIB3D_ITEMS.map((p, i) => `<button type="button" data-idx="${i}" class="${i === 0 ? 'active' : ''}">${p.name}</button>`).join('');
  document.getElementById('lib3dList').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    document.querySelectorAll('#lib3dList button').forEach((b) => b.classList.toggle('active', b === btn));
    renderLib3dStage(LIB3D_ITEMS[+btn.dataset.idx]);
  });
  document.getElementById('lib3dRotateBtn').addEventListener('click', () => {
    lib3dRotation += 60;
    document.getElementById('lib3dStage').style.transform = `rotateY(${lib3dRotation}deg) rotateX(12deg)`;
  });
  document.getElementById('lib3dResetBtn').addEventListener('click', () => {
    lib3dRotation = 0;
    document.getElementById('lib3dStage').style.transform = 'rotateY(0deg) rotateX(12deg)';
  });
}
function renderLib3dStage(p) {
  const stage = document.getElementById('lib3dStage');
  stage.style.color = 'var(--forest)';
  stage.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;transform:translateZ(20px);">${iconMarkup(p.icon).replace('width="56" height="56"', 'width="140" height="140"')}</div>`;
  stage.style.transform = 'rotateY(0deg) rotateX(12deg)';
  lib3dRotation = 0;
}
function open3dLibrary() {
  openModal('library3dOverlay');
  if (!document.getElementById('lib3dStage').innerHTML) renderLib3dStage(LIB3D_ITEMS[0]);
}

/* ---------------------------------------------------------
   6. CHATBOT CORE
   --------------------------------------------------------- */
const chat = { open: false, mode: 'idle', quoteStepIndex: 0, context: emptyQuoteContext() };
function emptyQuoteContext() { return { product: null, quantity: null, application: null, company: null, contactName: null, email: null, phone: null, location: null }; }

const chatbotPanel = document.getElementById('chatbotPanel');
const chatbotBackdrop = document.getElementById('chatbotBackdrop');
const chatbotThread = document.getElementById('chatbotThread');
const chatbotWelcome = document.getElementById('chatbotWelcome');

const QUICK_ACTIONS = [
  { icon: '🔎', label: 'Find a Product', value: 'find' },
  { icon: '✨', label: 'Recommend a Product', value: 'recommend' },
  { icon: '📋', label: 'Product Details', value: 'details' },
  { icon: '⚙', label: 'Technical Information', value: 'technical' },
  { icon: '💰', label: 'Request a Quote', value: 'quote' },
  { icon: '📦', label: 'Check Product Availability', value: 'availability' },
  { icon: '🎓', label: 'Training Information', value: 'training' },
  { icon: '👤', label: 'Talk to Sales', value: 'sales' },
];

function initChatbot() {
  document.getElementById('chatbotQuickActions').innerHTML = QUICK_ACTIONS.map((a) => `<button type="button" data-quick="${a.value}">${a.icon} ${a.label}</button>`).join('');
  document.getElementById('chatbotQuickActions').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-quick]');
    if (btn) handleQuickAction(btn.dataset.quick);
  });
  document.getElementById('chatbotFab').addEventListener('click', openChatbot);
  document.getElementById('chatbotCloseBtn').addEventListener('click', closeChatbot);
  chatbotBackdrop.addEventListener('click', closeChatbot);
  document.getElementById('chatbotForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('chatbotInput');
    const text = input.value;
    input.value = '';
    if (text.trim()) handleSend(text);
  });
}

function openChatbot() {
  chat.open = true;
  chatbotPanel.classList.add('open');
  chatbotBackdrop.classList.add('open');
  document.getElementById('chatbotFabBadge').style.display = 'none';
}
function closeChatbot() {
  chat.open = false;
  chatbotPanel.classList.remove('open');
  chatbotBackdrop.classList.remove('open');
}
function openChatbotWithProduct(p) {
  openChatbot();
  if (!p) return;
  chatbotWelcome.style.display = 'none';
  userSay(`Tell me about the ${p.name}`);
  showTyping(() => {
    botSay(`Great choice. The <strong>${p.name}</strong> is part of our ${p.family} line — ${p.description}`);
    renderProductInChat(p);
    botSay('Would you like to request a quote, or do you have a technical question?');
    botButtons([{ label: 'Request a Quote', value: 'quote:' + p.id }, { label: 'Technical Info', value: 'technical' }]);
  });
}

function scrollChatToBottom() { document.getElementById('chatbotBody').scrollTop = 999999; }

function botSay(html) {
  const el = document.createElement('div');
  el.className = 'msg msg-bot';
  el.innerHTML = html;
  chatbotThread.appendChild(el);
  scrollChatToBottom();
}
function userSay(text) {
  chatbotWelcome.style.display = 'none';
  const el = document.createElement('div');
  el.className = 'msg msg-user';
  el.textContent = text;
  chatbotThread.appendChild(el);
  scrollChatToBottom();
}
function botButtons(options) {
  const wrap = document.createElement('div');
  wrap.className = 'msg-buttons';
  wrap.innerHTML = options.map((o) => `<button type="button" data-val="${o.value}">${o.label}</button>`).join('');
  wrap.querySelectorAll('button').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      userSay(options[i].label);
      wrap.remove();
      showTyping(() => handleQuickReply(options[i].value, options[i].label));
    });
  });
  chatbotThread.appendChild(wrap);
  scrollChatToBottom();
}
function renderProductInChat(p) {
  const el = document.createElement('div');
  el.className = 'msg-product-card';
  el.innerHTML = `
    <h5>${p.name}</h5>
    <p>${p.sizes.slice(0, 3).join(', ') || ''} ${p.sdr.length ? '· SDR ' + p.sdr.join('/') : ''} · ${p.connection || ''}<br>${p.applications.slice(0, 3).join(' / ')}</p>
    <div class="msg-product-actions">
      <button type="button" data-view="${p.id}">View Product</button>
      <button type="button" data-quote="${p.id}">Request Quote</button>
    </div>`;
  el.querySelector('[data-view]').addEventListener('click', () => openProductModal(p));
  el.querySelector('[data-quote]').addEventListener('click', () => { userSay('Request a quote for ' + p.name); showTyping(() => startQuoteFlow(p)); });
  chatbotThread.appendChild(el);
  scrollChatToBottom();
}
function showTyping(cb) {
  const el = document.createElement('div');
  el.className = 'typing-dots';
  el.innerHTML = '<span></span><span></span><span></span>';
  chatbotThread.appendChild(el);
  scrollChatToBottom();
  setTimeout(() => { el.remove(); cb(); }, 500 + Math.random() * 500);
}

function handleSend(text) {
  userSay(text);
  showTyping(() => routeMessage(text.trim()));
}

function handleQuickAction(value) {
  chatbotWelcome.style.display = 'none';
  userSay(QUICK_ACTIONS.find((a) => a.value === value)?.label || value);
  showTyping(() => {
    switch (value) {
      case 'find': botSay('Sure — what are you looking for? You can describe the product, or tell me the application (e.g. "wastewater") and pipe size.'); break;
      case 'recommend': botSay('Tell me your application and pipe size and I\'ll recommend a matching product. For example: "6 inch reducer for wastewater".'); break;
      case 'details': botSay('Which product would you like details on?'); break;
      case 'technical': showTechnicalInfo(); break;
      case 'quote': startQuoteFlow(null); break;
      case 'availability': botSay('Our full catalog is available to quote — tell me the product and quantity and I\'ll start a request.'); break;
      case 'training': botSay('Integrity Fusion Academy offers self-paced electrofusion fundamentals and installation-practice courses. Would you like to explore training?'); botButtons([{ label: 'Explore Training', value: 'open-training' }]); break;
      case 'sales': botSay('I can connect you with our sales team — let\'s start with a quick quote request so they have context.'); startQuoteFlow(null); break;
      default: botSay('How can I help?');
    }
  });
}

function handleQuickReply(value, label) {
  if (value.startsWith('quote:')) { startQuoteFlow(findProductById(value.split(':')[1])); return; }
  if (value === 'open-training') { openInfoModal('Integrity Fusion Academy', trainingModalHTML()); return; }
  if (value === 'restart-quote') { chat.context = emptyQuoteContext(); startQuoteFlow(null); return; }
  if (value === 'submit-quote') { finishQuoteInChat(); return; }
  if (value === 'technical') { showTechnicalInfo(); return; }
  if (/^\d+"$/.test(value) || value === 'Other') { chat.context.__pendingSize = value; routeMessage(value); return; }
  routeMessage(label);
}

/* ---------------------------------------------------------
   7. INTENT DETECTION + PRODUCT SEARCH
   --------------------------------------------------------- */
function findProducts(query) {
  const q = (query || '').toLowerCase();
  const words = q.split(/[^a-z0-9"]+/).filter((w) => w.length > 2);
  if (!words.length) return [];
  const scored = PRODUCTS.map((p) => {
    const hay = [p.name, p.family, p.type, p.category, p.connection, ...p.applications].join(' ').toLowerCase();
    let score = 0;
    if (hay.includes(q)) score += 5;
    words.forEach((w) => { if (hay.includes(w)) score += 1; });
    return { p, score };
  }).filter((r) => r.score > 0);
  scored.sort((a, b) => b.score - a.score);
  return scored.map((r) => r.p);
}

function detectIntent(text) {
  const t = text.toLowerCase();
  if (/\b(hi|hello|hey|good morning|good afternoon|greetings)\b/.test(t)) return 'GREETING';
  if (/\b(quote|quotation|price|pricing|cost|how much|buy|purchase|order|i need \d+|send me a quote)\b/.test(t)) return 'QUOTE_REQUEST';
  if (/\b(sales|representative|talk to (a )?(person|human)|contact sales)\b/.test(t)) return 'SALES';
  if (/\b(standard|astm|awwa|nsf|material|pe100|pe4710|pe3408|sdr|pressure rating|spec|certif)\b/.test(t)) return 'TECHNICAL';
  if (/\b(train|training|academy|course|certif)\b/.test(t)) return 'TRAINING';
  const app = APPLICATIONS.find((a) => t.includes(a.toLowerCase()) || t.includes(a.toLowerCase().split(' ')[0]));
  if (app) return 'APPLICATION';
  if (findProducts(text).length) return 'PRODUCT_SEARCH';
  return 'UNKNOWN';
}

function showTechnicalInfo() {
  botSay(`Our HDPE fittings are typically manufactured from <strong>${MATERIAL_HDPE}</strong> resin and reference standards such as ${STANDARDS_WATER.join(', ')} for potable-water product lines (gas lines reference ${STANDARDS_GAS.join(', ')}). Exact pressure ratings and dimensions vary by product — I can pull up the specification summary for a specific item if you tell me which one.`);
}

function trainingModalHTML() {
  return `<p class="modal-sub">Your online electrofusion training resource.</p>
    <div class="resources-grid" style="grid-template-columns:1fr 1fr;">
      <div class="resource-card"><div class="r-icon">${iconMarkup('coupler')}</div><h4>Level 1 — Electrofusion Fundamentals</h4><p>Core theory and equipment operation for new installers.</p></div>
      <div class="resource-card"><div class="r-icon">${iconMarkup('scraper')}</div><h4>Installation Practices</h4><p>Hands-on best practices for surface prep, alignment and fusion cycles.</p></div>
    </div>`;
}

function routeMessage(text) {
  if (chat.mode === 'quote') { handleQuoteAnswer(text); return; }
  const intent = detectIntent(text);
  switch (intent) {
    case 'GREETING':
      botSay('Hello! I can help you find HDPE fittings and equipment, answer technical questions, or start a quote request. What are you working on?');
      break;
    case 'QUOTE_REQUEST': {
      const matches = findProducts(text);
      botSay('I can help you request a quote.');
      startQuoteFlow(matches[0] || null);
      break;
    }
    case 'SALES':
      botSay('Happy to connect you with sales — let\'s capture a few details first so they can follow up prepared.');
      startQuoteFlow(null);
      break;
    case 'TECHNICAL':
      showTechnicalInfo();
      break;
    case 'TRAINING':
      botSay('Integrity Fusion Academy offers self-paced electrofusion training.');
      botButtons([{ label: 'Explore Training', value: 'open-training' }]);
      break;
    case 'APPLICATION': {
      const app = APPLICATIONS.find((a) => text.toLowerCase().includes(a.toLowerCase()) || text.toLowerCase().includes(a.toLowerCase().split(' ')[0]));
      const matches = PRODUCTS.filter((p) => p.applications.includes(app)).slice(0, 3);
      botSay(`We offer several HDPE fitting and equipment options suitable for <strong>${app}</strong> applications. What type of connection are you looking for?`);
      botButtons([{ label: 'Butt Fusion', value: 'Butt Fusion' }, { label: 'Electrofusion', value: 'Electrofusion' }, { label: 'Flanged', value: 'Flanged' }, { label: 'Mechanical Joint', value: 'Mechanical Joint' }, { label: 'Not Sure', value: 'notsure' }]);
      if (matches.length) { botSay('A few products in that space:'); matches.forEach(renderProductInChat); }
      break;
    }
    case 'PRODUCT_SEARCH': {
      const matches = findProducts(text);
      if (matches.length) {
        botSay(`Yes — we offer ${matches.length > 1 ? 'several matching options' : 'that product'} in our catalog:`);
        matches.slice(0, 3).forEach(renderProductInChat);
        botSay('Want a quote for one of these, or do you have another question?');
      } else {
        botSay('I couldn\'t find an exact match. Could you tell me the product type (elbow, tee, reducer, coupler, valve…) or the application (water, wastewater, mining…)?');
      }
      break;
    }
    default:
      if (['butt fusion', 'electrofusion', 'flanged', 'mechanical joint', 'notsure'].includes(text.toLowerCase())) {
        botSay('Got it. What pipe size are you working with?');
        botButtons(['2"', '4"', '6"', '8"', '10"', '12"', 'Other'].map((s) => ({ label: s, value: s })));
      } else {
        botSay('I can help you find fittings and equipment, answer technical questions, or start a quote. Try asking something like "Do you have HDPE reducers?" or use the quick actions below.');
        botButtons(QUICK_ACTIONS.slice(0, 4).map((a) => ({ label: a.label, value: a.value })));
      }
  }
}

/* ---------------------------------------------------------
   8. QUOTE FLOW (chatbot slot-filling)
   --------------------------------------------------------- */
const QUOTE_STEPS = [
  { key: 'product', question: 'Which product would you like a quote for? (You can type a product name, or "skip" if unsure and I\'ll note it as general inquiry.)', optional: true },
  { key: 'quantity', question: 'How many units do you need?' },
  { key: 'application', question: 'What application is this for? (e.g. water, wastewater, mining)' },
  { key: 'company', question: 'What\'s your company name?' },
  { key: 'contactName', question: 'And your name?' },
  { key: 'email', question: 'Best email to reach you?' },
  { key: 'phone', question: 'Phone number? (optional — type "skip" to continue)', optional: true },
  { key: 'location', question: 'Project location? (optional — type "skip" to continue)', optional: true },
];

function startQuoteFlow(product) {
  chat.mode = 'quote';
  chat.quoteStepIndex = 0;
  if (product) chat.context.product = product.name;
  botSay('I can start a quote request. I\'ll need a few details.');
  askNextQuoteQuestion();
}

function askNextQuoteQuestion() {
  while (chat.quoteStepIndex < QUOTE_STEPS.length && chat.context[QUOTE_STEPS[chat.quoteStepIndex].key]) chat.quoteStepIndex++;
  if (chat.quoteStepIndex >= QUOTE_STEPS.length) { showQuoteSummary(); return; }
  botSay(QUOTE_STEPS[chat.quoteStepIndex].question);
}

function handleQuoteAnswer(text) {
  const step = QUOTE_STEPS[chat.quoteStepIndex];
  const val = text.trim();
  if (!(/^skip$/i.test(val) && step.optional)) {
    if (step.key === 'product') {
      const match = findProducts(val)[0];
      chat.context.product = match ? match.name : val;
    } else {
      chat.context[step.key] = val;
    }
  }
  chat.quoteStepIndex++;
  showTyping(askNextQuoteQuestion);
}

function showQuoteSummary() {
  chat.mode = 'quote-confirm';
  const c = chat.context;
  botSay(`<strong>Quote Request Ready</strong><br>
    Product: ${c.product || 'General inquiry'}<br>
    Quantity: ${c.quantity || '—'}<br>
    Application: ${c.application || '—'}<br>
    Company: ${c.company || '—'}<br>
    Contact: ${c.contactName || '—'}<br>
    Email: ${c.email || '—'}
    ${c.phone ? '<br>Phone: ' + c.phone : ''}${c.location ? '<br>Location: ' + c.location : ''}`);
  botButtons([{ label: 'Submit Quote Request', value: 'submit-quote' }, { label: 'Start Over', value: 'restart-quote' }]);
}

function finishQuoteInChat() {
  chat.mode = 'idle';
  const container = document.createElement('div');
  chatbotThread.appendChild(container);
  runCrmSimulation({ ...chat.context }, container);
  scrollChatToBottom();
  chat.context = emptyQuoteContext();
  chat.quoteStepIndex = 0;
}

/* ---------------------------------------------------------
   9. LEAD SCORING + CRM SIMULATION (shared: chat + quote modal)
   --------------------------------------------------------- */
function calculateLeadScore(data) {
  let score = 15; // quote intent
  if (data.product) score += 15;
  if (data.quantity) score += 15;
  if (data.company) score += 20;
  if (data.email) score += 15;
  if (data.phone) score += 10;
  if (data.location || data.application) score += 10;
  return Math.min(score, 100);
}

function runCrmSimulation(data, container) {
  const steps = ['Product requirement captured', 'Customer information captured', 'Quote request created', 'Lead created in LeadRyze', 'Sales follow-up task created'];
  const ul = document.createElement('ul');
  ul.className = 'crm-check-list';
  container.appendChild(ul);
  if (container === chatbotThread) scrollChatToBottom();
  steps.forEach((s, i) => {
    setTimeout(() => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="check">✓</span> ${s}`;
      ul.appendChild(li);
      if (container === chatbotThread) scrollChatToBottom();
      if (i === steps.length - 1) setTimeout(() => renderLeadCard(data, container), 420);
    }, i * 420);
  });
}

function renderLeadCard(data, container) {
  const score = calculateLeadScore(data);
  const bucket = score >= 70 ? 'hot' : score >= 40 ? 'warm' : 'low';
  const leadId = `LR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000)}`;
  const card = document.createElement('div');
  card.className = 'lead-card';
  card.innerHTML = `
    <h4>✅ Lead Created in LeadRyze</h4>
    <dl class="lead-card-grid">
      <div><dt>Lead ID</dt><dd>${leadId}</dd></div>
      <div><dt>Status</dt><dd>New</dd></div>
      <div><dt>Source</dt><dd>Website AI Chatbot</dd></div>
      <div><dt>Score</dt><dd><span class="lead-score lead-score-${bucket}">${bucket.toUpperCase()} · ${score}</span></dd></div>
      <div><dt>Interest</dt><dd>${data.product || '—'}</dd></div>
      <div><dt>Quantity</dt><dd>${data.quantity || '—'}</dd></div>
      <div><dt>Next Action</dt><dd>Sales follow-up</dd></div>
      <div><dt>Company</dt><dd>${data.company || '—'}</dd></div>
    </dl>`;
  container.appendChild(card);
  if (container === chatbotThread) scrollChatToBottom();
  showToast('✓ Lead created in LeadRyze CRM (demo simulation)');
}

/* ---------------------------------------------------------
   10. NAVIGATION / MOBILE / SEARCH / MISC UI
   --------------------------------------------------------- */
function closeMobileNav() {
  document.getElementById('mobileNav').classList.remove('open');
  document.getElementById('mobileNavBackdrop').classList.remove('open');
  document.getElementById('hamburgerBtn').setAttribute('aria-expanded', 'false');
}
function initMobileNav() {
  const nav = document.getElementById('mobileNav');
  const backdrop = document.getElementById('mobileNavBackdrop');
  const btn = document.getElementById('hamburgerBtn');
  btn.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    backdrop.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  });
  backdrop.addEventListener('click', closeMobileNav);
  document.querySelectorAll('.mobile-accordion-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const panel = toggle.nextElementSibling;
      panel.classList.toggle('open');
      toggle.querySelector('span').textContent = panel.classList.contains('open') ? '−' : '+';
    });
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => { if (!a.dataset.family && !a.dataset.type) closeMobileNav(); }));
}

function initSearch() {
  const toggle = document.getElementById('searchToggle');
  const flyout = document.getElementById('searchFlyout');
  const input = document.getElementById('searchInput');
  toggle.addEventListener('click', () => {
    flyout.classList.toggle('open');
    if (flyout.classList.contains('open')) setTimeout(() => input.focus(), 150);
  });
  input.addEventListener('input', () => {
    const q = input.value.trim();
    const box = document.getElementById('searchSuggestions');
    if (!q) { box.innerHTML = ''; return; }
    const matches = findProducts(q).slice(0, 6);
    box.innerHTML = matches.length
      ? matches.map((p) => `<button type="button" data-id="${p.id}">${p.name}</button>`).join('')
      : '<span style="font-size:0.8rem;color:var(--gray-500);">No matches — try "reducer", "valve", "electrofusion"…</span>';
  });
  document.getElementById('searchSuggestions').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-id]');
    if (!btn) return;
    openProductModal(findProductById(btn.dataset.id));
    flyout.classList.remove('open');
    input.value = '';
  });
}

function initIndustryStrip() {
  const grid = document.getElementById('industryGrid');
  grid.innerHTML = INDUSTRY_ICONS.map((i) => `<button type="button" class="industry-item" data-app="${i.app}">
      <span class="industry-icon">${iconMarkup(i.icon)}</span><span>${i.label}</span>
    </button>`).join('');
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.industry-item');
    if (!btn) return;
    grid.querySelectorAll('.industry-item').forEach((b) => b.classList.toggle('active', b === btn));
    resetFilters();
    filters.application = btn.dataset.app;
    document.getElementById('filterApplication').value = btn.dataset.app;
    applyFilters();
    document.getElementById('explorer').scrollIntoView({ behavior: 'smooth' });
  });
}

const RESOURCES = [
  { icon: 'processor', title: 'Product Catalog', text: 'Full fittings and equipment catalog with specifications.' },
  { icon: 'flange', title: 'Material & Testing Specifications', text: 'Resin grades, standards and testing methodology.' },
  { icon: 'coupler', title: 'Submittal Packages', text: 'Ready-to-submit documentation for project approval.' },
  { icon: 'scraper', title: 'Installation Instructions', text: 'Step-by-step butt-fusion and electrofusion procedures.' },
  { icon: 'ring', title: 'Certifications', text: 'NSF, ISO and industry certification summaries.' },
  { icon: 'adapter', title: 'Product Dimension Sheets', text: 'Detailed dimensional drawings by product family.' },
];
function initResources() {
  const grid = document.getElementById('resourcesGrid');
  grid.innerHTML = RESOURCES.map((r) => `<button type="button" class="resource-card"><div class="r-icon">${iconMarkup(r.icon)}</div><h4>${r.title}</h4><p>${r.text}</p></button>`).join('');
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.resource-card');
    if (!card) return;
    const idx = [...grid.children].indexOf(card);
    openInfoModal(RESOURCES[idx].title, `<p>${RESOURCES[idx].text}</p><p style="font-size:0.82rem;color:var(--gray-500);">This is a demo environment — in production this would open or download the real document.</p>`);
  });
}

const ABOUT_CARDS = [
  { icon: 'processor', title: 'Engineering Focus', text: 'Products engineered for critical infrastructure performance.' },
  { icon: 'flange', title: 'Quality Manufacturing', text: 'Consistent, repeatable manufacturing processes.' },
  { icon: 'valve', title: 'HDPE Expertise', text: 'Deep material science and application expertise.' },
  { icon: 'clamp', title: 'Technical Support', text: 'Hands-on technical guidance from selection through installation.' },
  { icon: 'ring', title: 'Product Documentation', text: 'Complete specification and submittal documentation.' },
  { icon: 'reducer', title: 'Infrastructure Applications', text: 'Proven across water, energy, mining and industrial markets.' },
];
function initAbout() {
  document.getElementById('aboutGrid').innerHTML = ABOUT_CARDS.map((c) => `<div class="about-card"><div class="a-icon">${iconMarkup(c.icon)}</div><h4>${c.title}</h4><p>${c.text}</p></div>`).join('');
}

const CERTS = ['ISO 9001', 'AWWA Member', 'NSF Listed', 'PE-CDR', 'AVIWA'];
function initCerts() {
  document.getElementById('certsRow').innerHTML = CERTS.map((c) => `<div class="cert-chip"><div class="c-icon">${c.split(' ').map((w) => w[0]).join('').slice(0, 3)}</div><span>${c}</span></div>`).join('');
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  container.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 3200);
}

/* ---------------------------------------------------------
   BOOTSTRAP
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  applyFilters();
  initIndustryStrip();
  initResources();
  initAbout();
  initCerts();
  initQuoteModal();
  initLib3d();
  initChatbot();
  initMobileNav();
  initSearch();

  document.getElementById('openQuoteBtn').addEventListener('click', () => openQuoteModal(null));
  document.getElementById('heroQuoteBtn').addEventListener('click', () => openQuoteModal(null));
  document.getElementById('aiStoryTryBtn').addEventListener('click', openChatbot);
  document.getElementById('exploreTrainingBtn').addEventListener('click', () => openInfoModal('Integrity Fusion Academy', trainingModalHTML()));
  document.getElementById('exploreCareersBtn').addEventListener('click', () => openInfoModal('Careers', '<p>We are seeking highly motivated individuals to join our mission of providing top-quality HDPE products to our customers.</p><p style="font-size:0.82rem;color:var(--gray-500);">This is a demo environment — no real positions are listed here.</p>'));

  document.querySelectorAll('[data-action="open3d"]').forEach((el) => el.addEventListener('click', (e) => { e.preventDefault(); open3dLibrary(); closeMobileNav(); }));

  document.querySelectorAll('.lang-btn').forEach((btn) => btn.addEventListener('click', () => {
    document.querySelectorAll('.lang-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    showToast('Language switching is illustrative in this demo.');
  }));

  setTimeout(() => showToast('👋 Try the AI Product Assistant in the bottom-right corner'), 1600);
});
