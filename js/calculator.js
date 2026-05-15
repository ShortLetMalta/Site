/* ELEVA MALTA — REVENUE CALCULATOR
   Fee structure: 30% management fee net of OTA fees (~15%)
   Owner earnings = Gross × 0.85 × 0.70
*/
'use strict';

const CONFIG = {
  otaFee: 0.15,
  mgmtFee: 0.30,
  // Base ADR (€) by bedrooms (2026/2027 Projections)
  adr: { studio: 105, '1br': 155, '2br': 210, '3br': 285, '4br': 395 },
  // Location multipliers (High demand adjustments)
  locationMult: {
    valletta: 1.25, stjulians: 1.20, sliema: 1.15, gzira: 1.08,
    mellieha: 1.05, bugibba: 0.98, msida: 1.05, gozo: 1.10
  },
  // Default occupancy by location
  occupancy: {
    valletta: 0.80, stjulians: 0.82, sliema: 0.79, gzira: 0.74,
    mellieha: 0.72, bugibba: 0.70, msida: 0.72, gozo: 0.73
  }
};

function calcRevenue(bedrooms, location, occupancyPct) {
  const adr = CONFIG.adr[bedrooms] || 135;
  const mult = CONFIG.locationMult[location] || 1.0;
  const occ = occupancyPct / 100;
  const daysPerMonth = 30.4;
  const grossMonthly = adr * mult * occ * daysPerMonth;
  const netAfterOTA = grossMonthly * (1 - CONFIG.otaFee);
  const mgmtFeeAmt = netAfterOTA * CONFIG.mgmtFee;
  const ownerMonthly = netAfterOTA - mgmtFeeAmt;
  const ownerYearly = ownerMonthly * 12;
  const longLetMonthly = estimateLongLet(bedrooms, location);
  const uplift = ((ownerYearly - longLetMonthly * 12) / (longLetMonthly * 12) * 100);
  return {
    grossMonthly: Math.round(grossMonthly),
    netAfterOTA: Math.round(netAfterOTA),
    mgmtFeeAmt: Math.round(mgmtFeeAmt),
    ownerMonthly: Math.round(ownerMonthly),
    ownerYearly: Math.round(ownerYearly),
    longLetMonthly: Math.round(longLetMonthly),
    uplift: Math.round(Math.max(uplift, 0)),
    adr: Math.round(adr * mult),
    occupancyPct: Math.round(occ * 100)
  };
}

function estimateLongLet(bedrooms, location) {
  const base = { studio: 700, '1br': 950, '2br': 1300, '3br': 1700, '4br': 2200 };
  const mult = CONFIG.locationMult[location] || 1.0;
  return (base[bedrooms] || 950) * mult;
}

function formatEuro(n) {
  return '€' + n.toLocaleString('en-IE');
}

function animateValue(el, from, to, duration = 800, prefix = '', suffix = '') {
  const start = performance.now();
  const update = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.round(from + (to - from) * ease).toLocaleString('en-IE') + suffix;
    if (p < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

let prevResult = null;

function updateCalc() {
  const bedroomsEl = document.getElementById('calcBedrooms');
  const locationEl = document.getElementById('calcLocation');
  const occupancyEl = document.getElementById('calcOccupancy');
  const occupancyValEl = document.getElementById('calcOccupancyVal');

  if (!bedroomsEl || !locationEl || !occupancyEl) return;

  const bedrooms = bedroomsEl.value;
  const location = locationEl.value;
  const occupancy = parseInt(occupancyEl.value);

  if (occupancyValEl) occupancyValEl.textContent = occupancy + '%';

  const r = calcRevenue(bedrooms, location, occupancy);

  const fields = [
    { id: 'outMonthly', val: r.ownerMonthly, prefix: '€' },
    { id: 'outYearly',  val: r.ownerYearly,  prefix: '€' },
    { id: 'outADR',     val: r.adr,          prefix: '€' },
    { id: 'outUplift',  val: r.uplift,       prefix: '',  suffix: '%' },
    { id: 'outLongLet', val: r.longLetMonthly, prefix: '€' },
    { id: 'outGross',   val: r.grossMonthly, prefix: '€' },
  ];

  fields.forEach(f => {
    const el = document.getElementById(f.id);
    if (!el) return;
    const prev = prevResult ? (prevResult[f.id] || 0) : 0;
    animateValue(el, prev, f.val, 700, f.prefix || '', f.suffix || '');
    el.dataset.current = f.val;
  });

  prevResult = {};
  fields.forEach(f => { prevResult[f.id] = f.val; });

  // Update occupancy bar
  const occBar = document.getElementById('calcOccBar');
  if (occBar) occBar.style.width = r.occupancyPct + '%';

  // Update comparison bar
  const upliftBar = document.getElementById('calcUpliftBar');
  if (upliftBar) upliftBar.style.width = Math.min(r.uplift, 100) + '%';
}

// Set default occupancy from location averages
function setDefaultOccupancy() {
  const locationEl = document.getElementById('calcLocation');
  const occupancyEl = document.getElementById('calcOccupancy');
  if (!locationEl || !occupancyEl) return;
  const def = Math.round((CONFIG.occupancy[locationEl.value] || 0.75) * 100);
  occupancyEl.value = def;
  updateCalc();
}

document.addEventListener('DOMContentLoaded', () => {
  const inputs = ['calcBedrooms', 'calcLocation', 'calcOccupancy'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateCalc);
    if (el) el.addEventListener('change', updateCalc);
  });
  const locationEl = document.getElementById('calcLocation');
  if (locationEl) locationEl.addEventListener('change', setDefaultOccupancy);
  updateCalc();
});
