/* NIA Archive. Vanilla JS, no build step. */
let DATA = null, EPS = [], CHAPS = [], activeTags = new Set();

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const TAG_COLORS = {
  'AI': '#2962FF', 'Crypto': '#00E5FF', 'Big Tech': '#3DFFC0', 'Markets': '#7EB8FF',
  'Media': '#FF2E63', 'Sports': '#00E676', 'Culture': '#8899AA',
  'Business': '#D7FF1F', 'Politics': '#3A4654'
};

/* ------------------------------------------------------------------ content */
const HOSTS = [
  { name: 'Jack Butcher', role: 'The artist', bl: 1, chapters: 87, lane: 'Design',
    bio: 'Founder of Visualize Value. He spent a decade in Fortune 100 advertising, rebuilt himself as a one person design business, then became one of crypto art\'s most legible practitioners. While the other two analyse markets, Jack is usually inside one.',
    pts: ['Sold an NFT for $150,000 in Episode 0',
          'Lost his Visualize Value Twitter account in Episode 2, a wound the show returns to for years',
          'Checks reached number one on OpenSea (Ep 95); later auctions at Christie\'s and Sotheby\'s, a St Jude collaboration, a Paris exhibit, and a project acquired by X Museum',
          'Worked in a Honda factory, and closed his own podcast production agency on air (Ep 101)'],
    lens: 'Leverage, distribution and proof of work. Ideas stay worthless until distributed, and the internet lets one person own both the means of production and the means of distribution. He is the most sceptical of institutions and the most optimistic about individuals.' },
  { name: 'Trung Phan', role: 'The historian', bl: 4, chapters: 51, lane: 'History',
    bio: 'Writer, formerly of The Hustle, later founder of Bearly AI. Born to Vietnamese parents, raised in Canada, and spent his twenties in Vietnam. He is the show\'s research engine and its funniest person, a combination that turns out to be the format\'s core asset.',
    pts: ['Runs the business history deep dives: Google\'s ad auction, Costco, Disney\'s segments, the iPhone, Nvidia\'s path from Quake to AI',
          'One of his memes surfaced inside the leaked Elon Musk text messages filed in discovery, which he calls his personal apex',
          'Recurring CNBC appearances, and he quit pursuing screenwriting on air (Ep 101)'],
    lens: 'Everything is a case study, and the past rhymes. He reaches for precedent, whether Time\'s Person of the Year criteria or the 1992 sterling trade, to defuse present tense hysteria. He is openly the most pro Elon of the three and says so first.' },
  { name: 'Bilal Zaidi', role: 'The operator', bl: 6, chapters: 23, lane: 'Media',
    bio: 'Host of Creator Lab, formerly of Google, based in New York. He runs the show: sets the running order, moves segments along, and reliably asks the question the audience needs asked. He is the least visible host on the page and the reason the other two are legible.',
    pts: ['Left Google (Ep 70), and closed his Arsenal blog with an explanation (Ep 80 and 101)',
          'Owns the explain it to the listener beat; his interest rate and ad funnel breakdowns are among the clearest things in the corpus',
          'Went down the DeFi rabbit hole in 2021, and was vibe coding by 2025'],
    lens: 'Creator economics and durability. He asks who actually captures the value, who owns the intellectual property, and whether a thing survives contact with ordinary people. He is also the producer philosopher: good enough is his doctrine.' }
];

const ERAS = [
  { n: 1, t: 'The NFT summer', r: '2021, Ep 0 to 37. Crypto 24% of chapters, AI 0%.',
    p: ['The show launched inside the mania and carries its shape permanently. Bored Ape Yacht Club, CryptoPunks, ENS airdrops, ConstitutionDAO, Axie Infinity and play to earn, citycoins, Jack Dorsey\'s bitcoin maximalism, and the infrastructure bill that nearly kneecapped US crypto. Jack was minting, Bilal was buying .btc domains, and Trung was explaining the mechanics.',
        'Even at peak mania the show already ran business history that had nothing to do with crypto: Google\'s ad auction, Costco, Vail Resorts, the genius of Virgil Abloh. That habit is exactly what let it survive what came next.'] },
  { n: 2, t: 'Elon, and then the fraud', r: '2022, Ep 38 to 92. Twitter peaks at 990 mentions, FTX at 255.',
    p: ['The most Twitter saturated year in the corpus. The $44 billion acquisition consumed roughly three quarters of it, and the show treated it less as a deal than as the year\'s central media event. Then FTX collapsed in November and the show pivoted hard, including an episode that revisited their own 2021 crypto predictions against the wreckage.',
        'The tone shifted permanently here. Crypto stopped being a frontier to explore and became a case study in incentives, and the show grew more sceptical without becoming cynical.'] },
  { n: 3, t: 'The AI pivot', r: '2023, Ep 93 to 144. AI mentions jump 137 to 740, crypto chapters fall to 3%.',
    p: ['The fastest reorientation in the show\'s history, and they called it early. In the December 2022 year end episode Bilal named OpenAI company of the year, weeks after ChatGPT launched, and Trung immediately framed it as possibly the first mobile scale structural change since mobile.',
        'Jack\'s argument that episode remains the sharpest thing the show has produced about diffusion. Crypto faced organised incumbent opposition at every layer. With AI, nobody could even identify who the opposition was supposed to be.'] },
  { n: 4, t: 'Memes, elections and the Nvidia trade', r: '2024, Ep 145 to 196. Culture peaks at 10% of chapters.',
    p: ['The most culturally weighted year: MrBeast\'s leaked virality guide, the economics of OnlyFans, Kendrick\'s Super Bowl slot, Apple Intelligence, and The Power Broker at fifty. Trump mentions tripled and Nvidia arrived properly. The show was at its most anthropological here, reading businesses through the culture they sit inside rather than the reverse.'] },
  { n: 5, t: 'Tariffs, agents and everything expensive', r: '2025, Ep 197 to 248. AI 14% of chapters, tariffs 150 mentions.',
    p: ['Macro returned as a live subject for the first time since 2022: tariffs, bond yields, the dollar. Alongside it came AI agents, vibe coding, prediction markets as a real category, and Strategy\'s bitcoin balance sheet engineering as a recurring set piece. Underneath it all ran a persistent unease that everything had been overpriced for years and kept going anyway.'] },
  { n: 6, t: 'AI as the whole board', r: '2026, Ep 249 to 281. AI 23% of chapters. Anthropic takes 291 of its 359 lifetime mentions.',
    p: ['AI stopped being a subject and became the substrate under every subject: inference economics, TPUs against Nvidia\'s margins, agent frameworks, the labour question, and machine generated misinformation. Prediction markets went mainstream and mostly turned into sports betting. Gold and silver crashed, and the show reckoned openly with the digital gold thesis. As they put it, gold turned out to be the new gold.',
        'The other 2026 thread is what they call the anti AI bet: in an AI productivity boom, the scarce and therefore valuable things are physical and social. Live sport, gaming, real rooms.'] }
];

const IDEAS = [
  ['Distribution is the only durable asset', 'The show\'s load bearing idea, present in 150 episodes. When content is abundant and supply is infinite, the scarce thing is trusted distribution. Everything else, including production, capital and even the idea, gets commoditised downstream of it.', 'Recurring, stated most clearly in Ep 9'],
  ['Unlocking frozen assets', 'Their cleanest lens on any new platform. Airbnb unlocked spare rooms, Uber unlocked spare time in cars. Ask what dormant asset a technology makes liquid and you understand it better than any valuation model will tell you.', 'Ep 25, reused for years'],
  ['Interest rates are the price tag on money', 'Bilal\'s explainer, and the show\'s best piece of plain English macro. A banana costs 99 cents; rates are what money itself costs. When the price of money jumps from one percent to five, everything priced against it reprices, and asset holders and banana buyers experience that very differently.', 'Ep 6'],
  ['AI met no opposition, crypto met nothing else', 'Jack\'s account of why the two diffused at such different speeds. Crypto faced entrenched incumbents at every layer, all with a clear interest in stopping it. With AI, nobody could name the middleman being displaced. The genie was out before an opposition could organise.', 'Ep 92, December 2022'],
  ['The businesses hiding inside the businesses', 'A recurring delight. Apple\'s warranty operation would rank among the world\'s largest insurers. Amazon\'s advertising revenue exceeds Pinterest, Twitter and Roku combined, twice over. The headline business is rarely the whole company.', 'Ep 6 and throughout'],
  ['Relevance beats budget in an ad auction', 'Trung\'s breakdown of Google\'s quality score. The most relevant advertiser wins the top slot and pays less for it, so Nike can pay cents for a click where a rival bidding the same term pays dollars. Auctions reward fit, not spend, and that is the entire economic engine of search.', 'Ep 16'],
  ['Narrative is a price input', 'Stated bluntly during the 2026 gold and silver crash. Markets run on narrative, and when a story breaks the price follows regardless of fundamentals. They apply it equally to bitcoin\'s digital gold thesis, to AI stocks, and, they concede, to housing.', 'Ep 254'],
  ['Fiscal dominance', 'Their sharpest late macro point. Past a high enough debt level a central bank can no longer raise rates without destroying the government\'s ability to function. At that point the Treasury effectively holds a veto over the Fed, and the Fed stops being independent in any meaningful sense.', 'Ep 242'],
  ['The anti AI bet', 'If AI drives a productivity boom, the things that appreciate are the ones it cannot make: live sport, gaming, physical presence, and time that needs filling. They advance this as the actual thesis behind the Saudi fund taking EA private.', 'Ep 244'],
  ['The media barbell', 'Citizen journalists have speed and proximity. Institutions have the legal and research capacity to survive being wrong. Neither suffices alone, and the failure mode is that a false story reaches tens of millions before any correction lands.', 'Ep 249'],
  ['Founder authority as a speed advantage', 'Why they gave Google the 2025 award. With Sergey Brin back day to day, any strategic argument can be escalated and ended at once by someone holding founder standing and voting control, instead of dying in weeks of process. At Google\'s scale that is structural, not atmospheric.', 'Ep 248'],
  ['Iterate in public, and treat Twitter as a stress test', 'Present from Episode 0. People who publish their thinking get it tested and corrected, and that exposure is itself a signal. Their inverse heuristic treats someone highly public through filtered channels, yet absent from unfiltered ones, as a mild red flag.', 'Ep 0, 4 and 30'],
  ['Lindy', 'Invoked constantly and finally cashed in 2026. Gold has served as money for ten thousand years, survived every replacement thesis, and outperformed the asset built to replace it. Conceding that gold is the new gold is the show being honest about a call it got wrong.', 'Recurring, settled in Ep 254'],
  ['Consistency compounds, and catalogues compound harder', 'Trung\'s regret about abandoning a movie podcast in 2015 is the show\'s clearest personal lesson. The value never sat in any single episode; it sat in the back catalogue he never built. Evergreen formats accrue discoverability that news cycle formats never will.', 'Ep 100']
];

const GUESTS = [
  [4, '2021-05-21', 'Alex Cohen', 'Carbon Health. The first outside voice, on shitposting as strategy.'],
  [8, '2021-06-17', 'Packy McCormick', 'Not Boring. The Ethereum deep dive, and the show\'s first marquee guest.'],
  [12, '2021-07-13', 'A lumber trader', 'Bonus episode explaining the lumber spike from inside the trade.'],
  [20, '2021-09-02', 'Tom Osman', 'Behind a $1.3 million Ether Rock flip in nineteen days.'],
  [24, '2021-09-30', 'Patrick Stanley', 'CityCoins and MiamiCoin. Tokenised cities.'],
  [26, '2021-10-14', 'Eugene Robinson', 'Ozy Media\'s first employee, during the Ozy collapse.'],
  [43, '2022-02-10', 'Ric Burton', 'Early Stripe employee, on ENS and early stage building.'],
  [49, '2022-03-23', 'Brett Harrison', 'Then President of FTX US, on working with SBF, eight months before the collapse.'],
  [50, '2022-03-30', 'Alex Cohen', 'Second appearance, on angel investing.'],
  [53, '2022-04-20', 'STEPN', 'Move to earn at its absolute peak.'],
  [59, '2022-06-01', 'Coach Nick and Collin', 'The genius of Steph Curry: gravity and spacing.'],
  [62, '2022-06-15', 'Rainbolt', 'The GeoGuessr savant, on skill as content.'],
  [68, '2022-07-23', 'Ted Gioia', 'Music history and innovation, Silicon Valley against Hollywood.'],
  [73, '2022-08-16', 'Tetranode', 'Nine figure DeFi whale on the ETH merge. Their biggest episode on Spotify.'],
  [82, '2022-10-19', 'David Senra', 'Founders Podcast. Lessons from Steve Jobs, and the business of podcasting.'],
  [84, '2022-11-02', 'Jack Raines', 'A LinkedIn deep dive, and how to fix Twitter.'],
  [87, '2022-11-23', 'Joe Pompliano', 'Qatar World Cup, LIV Golf, and $10 billion sports franchises.'],
  [88, '2022-11-30', 'Jordan Schneider', 'ChinaTalk, on the China protests.'],
  [89, '2022-12-07', 'Douglas Boneparth', 'A financial advisor on ChatGPT, days after launch.'],
  [95, '2023-01-18', 'Whole Mars Catalog', 'Tesla, the same week Jack\'s Checks hit number one on OpenSea.'],
  [120, '2023-07-12', 'Turner Novak', 'Banana Capital. Twitter against Threads at the moment of launch.'],
  [123, '2023-08-02', 'Romeen Sheth', 'Investing in India, venture against bootstrapping, immigrant hustle.'],
  [139, '2023-11-22', 'Red Bull collaboration', 'The same episode as the OpenAI board coup, with Altman fired and rehired.'],
  [164, '2024-05-14', 'Zaid Admani', 'Roaring Kitty\'s return, Jim Simons and Renaissance.'],
  [172, '2024-07-10', 'George Mack', 'Part two. The UK against the US, The Office, and lessons from Oasis.'],
  [281, '2026-08-19', 'Zaid Admani', 'Guest host for the most recent episode.']
];

/* ------------------------------------------------------------------- boot */
async function boot() {
  DATA = await (await fetch('data/nia.json')).json();
  EPS = DATA.episodes;
  CHAPS = [];
  EPS.forEach(e => e.chapters.forEach(c =>
    CHAPS.push({ ep: e.ep, date: e.date, year: e.year, t: c.t, s: c.s, title: c.title, vid: e.vid, etitle: e.title })));

  renderStats(); renderLinks(); buildFilters();
  renderGrid(); renderChapters(); renderTrends(); renderHosts();
  renderEras(); renderIdeas(); renderGuests(); renderAbout();
  wire();
  showView(location.hash.slice(1) || 'browse', false);
  $('#builtAt').textContent = 'Indexed ' + (DATA.meta.built || new Date().toISOString().slice(0, 10));
}

function renderStats() {
  const m = DATA.meta;
  $('#stats').innerHTML = [
    [m.episodes, 'Episodes'], [m.hours, 'Hours'], ['4.29M', 'Words'],
    [m.chapters.toLocaleString(), 'Chapters'], [m.guest_eps, 'Guest shows'], ['6', 'Eras']
  ].map(([b, s]) => `<div><b>${b}</b><span>${s}</span></div>`).join('');
}
function renderLinks() {
  const m = DATA.meta;
  $('#links').innerHTML = [
    ['Apple Podcasts', m.apple], ['Spotify', m.spotify],
    ['YouTube', m.channel], ['RSS feed', m.feed]
  ].map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">${t}</a>`).join('');
}

function buildFilters() {
  const ys = ['<option value="">All years</option>']
    .concat(DATA.meta.years.map(y => `<option value="${y}">${y}</option>`)).join('');
  $('#fYear').innerHTML = ys; $('#cYear').innerHTML = ys;
  $('#tagChips').innerHTML = Object.keys(TAG_COLORS)
    .map(t => `<button class="chip" data-tag="${t}" aria-pressed="false">${t}</button>`).join('');
}

/* ------------------------------------------------------------------ browse */
function filtered() {
  const q = $('#q').value.trim().toLowerCase();
  const y = $('#fYear').value, sort = $('#fSort').value;
  let out = EPS.filter(e => {
    if (y && e.year !== y) return false;
    if (activeTags.size && ![...activeTags].every(t => e.tags.includes(t))) return false;
    if (!q) return true;
    return (e.title + ' ' + e.ep + ' ' + e.guests.join(' ') + ' ' +
      e.chapters.map(c => c.title).join(' ')).toLowerCase().includes(q);
  });
  const dur = e => { const p = (e.duration || '0:0').split(':').map(Number); return p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p[0] * 60 + p[1]; };
  if (sort === 'new') out.sort((a, b) => b.seq - a.seq);
  if (sort === 'old') out.sort((a, b) => a.seq - b.seq);
  if (sort === 'long') out.sort((a, b) => dur(b) - dur(a));
  return out;
}
function renderGrid() {
  const list = filtered();
  $('#browseCount').textContent = `${list.length} of ${EPS.length} episodes`;
  if (!list.length) { $('#grid').innerHTML = '<div class="empty">No episodes match those filters.</div>'; return; }
  $('#grid').innerHTML = list.map(e => `
    <article class="card">
      <div class="thumbwrap">
        <img src="${e.thumb}" alt="" loading="lazy" width="320" height="180">
        <span class="epno">EP ${e.ep ?? '0'}</span>
        <span class="dur">${esc(e.duration)}</span>
      </div>
      <div class="body">
        <div class="meta">${e.date}${e.guests.length ? ' &middot; guest' : ''}</div>
        <h3>${esc(e.title)}</h3>
        <div class="tags">
          ${e.tags.map(t => `<span class="tag">${t}</span>`).join('')}
          ${e.guests.map(g => `<span class="tag guest">${esc(g)}</span>`).join('')}
        </div>
        <div class="acts">
          <button data-open="${e.seq}">${e.chapters.length} chapters</button>
          <a href="${e.url}" target="_blank" rel="noopener">Watch</a>
        </div>
      </div>
    </article>`).join('');
}

/* ---------------------------------------------------------------- chapters */
function renderChapters() {
  const q = $('#cq').value.trim().toLowerCase(), y = $('#cYear').value;
  let list = CHAPS.filter(c => (!y || c.year === y) && (!q || c.title.toLowerCase().includes(q)));
  $('#chapCount').textContent = `${list.length.toLocaleString()} of ${CHAPS.length.toLocaleString()} chapters`;
  const show = list.slice(0, 400);
  if (!show.length) { $('#chapList').innerHTML = '<div class="empty">Nothing matches that search.</div>'; return; }
  const hl = s => q ? esc(s).replace(new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>') : esc(s);
  $('#chapList').innerHTML = show.map(c => `
    <div class="chaprow">
      <span class="ep">EP ${c.ep} &middot; ${c.date.slice(0, 4)}</span>
      <a class="ts" href="https://youtu.be/${c.vid}?t=${c.s}" target="_blank" rel="noopener">${c.t}</a>
      <span class="ti">${hl(c.title)}</span>
      <span class="src">${esc(c.etitle)}</span>
    </div>`).join('') +
    (list.length > 400 ? `<div class="chaprow"><span class="ep"></span><span></span><span class="ti" style="color:var(--fg-dim)">Showing the first 400. Narrow the search to see more.</span><span></span></div>` : '');
}

/* ------------------------------------------------------------------ trends */
function renderTrends() {
  const cv = $('#chart'), years = DATA.meta.years;
  const keys = Object.keys(DATA.tagyear).sort((a, b) =>
    Object.values(DATA.tagyear[b]).reduce((x, y) => x + y, 0) - Object.values(DATA.tagyear[a]).reduce((x, y) => x + y, 0));
  const dpr = window.devicePixelRatio || 1;
  const W = cv.parentElement.clientWidth - 44, H = 340;
  cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
  const g = cv.getContext('2d'); g.scale(dpr, dpr);
  const css = getComputedStyle(document.documentElement);
  const fg = css.getPropertyValue('--fg').trim(), dim = css.getPropertyValue('--fg-dim').trim(),
    bd = css.getPropertyValue('--border').trim();
  const pad = { l: 44, r: 12, t: 16, b: 34 };
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
  const pct = (k, y) => 100 * (DATA.tagyear[k]?.[y] || 0) / (DATA.epsyear[y] || 1);
  const max = 100;
  g.clearRect(0, 0, W, H);
  g.strokeStyle = bd; g.lineWidth = 1; g.font = '10px JetBrains Mono, monospace'; g.fillStyle = dim;
  for (let v = 0; v <= max; v += 25) {
    const y = pad.t + ih - (v / max) * ih;
    g.beginPath(); g.moveTo(pad.l, y); g.lineTo(pad.l + iw, y); g.stroke();
    g.fillText(v + '%', 6, y + 3);
  }
  years.forEach((yr, i) => {
    const x = pad.l + (i / (years.length - 1)) * iw;
    g.fillStyle = dim; g.fillText(yr, x - 14, H - 12);
  });
  keys.forEach(k => {
    g.beginPath(); g.strokeStyle = TAG_COLORS[k] || dim; g.lineWidth = 2.5;
    years.forEach((yr, i) => {
      const x = pad.l + (i / (years.length - 1)) * iw;
      const y = pad.t + ih - (pct(k, yr) / max) * ih;
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    });
    g.stroke();
    years.forEach((yr, i) => {
      const x = pad.l + (i / (years.length - 1)) * iw;
      const y = pad.t + ih - (pct(k, yr) / max) * ih;
      g.beginPath(); g.arc(x, y, 3, 0, 7); g.fillStyle = TAG_COLORS[k] || dim; g.fill();
    });
  });
  $('#legend').innerHTML = keys.map(k =>
    `<span><i style="background:${TAG_COLORS[k]}"></i>${k}</span>`).join('');

  const ent = DATA.entities, ks = Object.keys(ent).sort((a, b) => ent[b].ALL - ent[a].ALL).slice(0, 40);
  $('#entTable').innerHTML =
    `<thead><tr><th>Term</th><th class="n">Total</th>${DATA.meta.years.map(y => `<th class="n">${y.slice(2)}</th>`).join('')}</tr></thead>
     <tbody>${ks.map(k => `<tr><td>${esc(k)}</td><td class="n">${(ent[k].ALL || 0).toLocaleString()}</td>
       ${DATA.meta.years.map(y => `<td class="n">${ent[k][y] || 0}</td>`).join('')}</tr>`).join('')}</tbody>`;
}

/* ------------------------------------------------------------- static views */
const dark = () => document.documentElement.dataset.theme === 'vault';
function blossomSrc(n) { return `brand/blossom/blossom_0${n}_${dark() ? 'white' : 'black'}.png`; }

function renderHosts() {
  $('#hosts').innerHTML = HOSTS.map(h => `
    <article class="hostcard">
      <div class="top">
        <img class="bl" data-bl="${h.bl}" src="${blossomSrc(h.bl)}" alt="">
        <div><h3>${h.name}</h3><div class="role">${h.role}</div></div>
      </div>
      <p>${h.bio}</p>
      <ul>${h.pts.map(p => `<li>${p}</li>`).join('')}</ul>
      <p><strong>His lens.</strong> ${h.lens}</p>
      <div class="foot">
        <div><b>${h.chapters}</b><span>Named chapters</span></div>
        <div><b>${h.lane}</b><span>Primary lane</span></div>
      </div>
    </article>`).join('');
}
function renderEras() {
  $('#eras').innerHTML = ERAS.map(e => `
    <div class="era"><div class="n">${e.n}</div>
      <div><h3>${e.t}</h3><div class="rng">${e.r}</div>
        ${e.p.map(p => `<p>${p}</p>`).join('')}</div></div>`).join('');
}
function renderIdeas() {
  $('#ideas').innerHTML = IDEAS.map(([t, b, s]) =>
    `<article class="ideacard"><h4>${t}</h4><p>${b}</p><span class="src">${s}</span></article>`).join('');
}
function renderGuests() {
  $('#guestTable').innerHTML =
    `<thead><tr><th>Ep</th><th>Date</th><th>Guest</th><th>Why it mattered</th></tr></thead>
     <tbody>${GUESTS.map(([e, d, g, w]) =>
      `<tr><td>${e}</td><td>${d}</td><td>${esc(g)}</td><td class="w">${esc(w)}</td></tr>`).join('')}</tbody>`;
}
function renderAbout() {
  $('#method').innerHTML = `
    <h3>How it was built</h3>
    <p>The Acast RSS feed supplied 281 episodes with full descriptions. The YouTube channel supplied 281 matching videos, a clean one to one, matched by episode number with a fuzzy title fallback for the eleven episodes that use an older naming convention. English auto captions were pulled for all 281 and converted into timestamped transcripts totalling 4.29 million words.</p>
    <h3>Three caveats that matter</h3>
    <p><strong>The captions are machine generated.</strong> The median common word ratio is 0.57 and no episode fell below 0.30, so quality holds up, but automatic speech recognition mangles names, numbers and crosstalk. Treat nothing here as verbatim. Quotes in this archive are close paraphrases, and any figure worth acting on deserves a check against the audio.</p>
    <p><strong>There are no speaker labels.</strong> YouTube captions carry no diarisation. Host attribution comes from three reliable sources: chapter titles that name a host, passages where a host is addressed by name, and consistent domain ownership. Where confident attribution was impossible, none was made.</p>
    <p><strong>Episode 1 is partially corrupt.</strong> Its caption track contains a long stretch decoded against the wrong language. It sits outside the passage mining. Every other episode is intact.</p>`;
  $('#howto').innerHTML = `
    <h3>Keeping it current</h3>
    <p>The archive refreshes with one command. From the project folder run <code>./update.sh</code>. It re-reads the Acast feed, finds episodes the archive has not seen, pulls their transcripts and thumbnails, rebuilds the data file, and regenerates the site, the Word document and the PDF.</p>
    <p>The updater is incremental. It skips everything already on disk, so a weekly run costs about a minute and touches only the new episode.</p>
    <h3>Searching the transcripts</h3>
    <p>Three helpers sit in <code>scripts/</code>. Use <code>tsearch.py</code> to grep all 281 transcripts with context, <code>readep.py</code> to read any episode as clean paragraphs, and <code>readts.py</code> to read a specific time range.</p>
    <h3>A note on rate limits</h3>
    <p>Downloading transcripts in parallel triggers a YouTube rate limit, and the failure is deceptive: throttled requests return a caption list with no English track, which looks identical to an episode that has no captions at all. The updater stays serial and backs off on purpose. Leave it that way.</p>`;
}

/* -------------------------------------------------------------- interaction */
function openDrawer(seq) {
  const e = EPS.find(x => x.seq === +seq); if (!e) return;
  $('#drawer').innerHTML = `
    <button class="x" id="closeD" aria-label="Close">&times;</button>
    <img class="dth" src="${e.thumb}" alt="" width="480" height="270">
    <h3>${esc(e.title)}</h3>
    <div class="dmeta">Episode ${e.ep ?? 0} &middot; ${e.date} &middot; ${esc(e.duration)}${e.guests.length ? ' &middot; ' + esc(e.guests.join(', ')) : ''}</div>
    ${e.blurb ? `<p class="dblurb">${esc(e.blurb)}</p>` : ''}
    <div class="links" style="margin:0 0 18px"><a href="${e.url}" target="_blank" rel="noopener">Watch on YouTube</a></div>
    ${e.chapters.map(c => `<div class="chap">
      <a href="https://youtu.be/${e.vid}?t=${c.s}" target="_blank" rel="noopener">${c.t}</a>
      <span>${esc(c.title)}</span></div>`).join('')}`;
  $('#drawer').classList.add('on'); $('#scrim').classList.add('on');
  $('#closeD').onclick = closeDrawer;
}
function closeDrawer() { $('#drawer').classList.remove('on'); $('#scrim').classList.remove('on'); }

function setTheme(t) {
  document.documentElement.dataset.theme = t;
  localStorage.setItem('nia-theme', t);
  $('#modeBtn').textContent = t === 'vault' ? 'Daylight' : 'Vault';
  const d = t === 'vault';
  $('#mlowLogo').src = $('#footLogo').src = `brand/logo_${d ? 'white' : 'black'}.png`;
  $('#blossMark').src = `brand/blossom/blossom_03_${d ? 'white' : 'black'}.png`;
  $('#footBloss').src = `brand/blossom/blossom_05_${d ? 'white' : 'black'}.png`;
  $$('[data-bl]').forEach(i => i.src = blossomSrc(i.dataset.bl));
  if (DATA) renderTrends();
}

function showView(name, push) {
  const btn = $$('nav.tabs button').find(b => b.dataset.view === name) || $$('nav.tabs button')[0];
  name = btn.dataset.view;
  $$('nav.tabs button').forEach(x => x.setAttribute('aria-selected', x === btn));
  $$('.view').forEach(v => v.classList.toggle('on', v.id === 'v-' + name));
  if (name === 'trends') renderTrends();
  if (push && location.hash !== '#' + name) history.replaceState(null, '', '#' + name);
}

function wire() {
  $$('nav.tabs button').forEach(b => b.onclick = () => {
    showView(b.dataset.view, true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  window.addEventListener('hashchange', () => showView(location.hash.slice(1), false));
  $('#q').oninput = renderGrid;
  $('#fYear').onchange = renderGrid;
  $('#fSort').onchange = renderGrid;
  $('#cq').oninput = renderChapters;
  $('#cYear').onchange = renderChapters;
  $('#tagChips').onclick = ev => {
    const b = ev.target.closest('.chip'); if (!b) return;
    const t = b.dataset.tag;
    activeTags.has(t) ? activeTags.delete(t) : activeTags.add(t);
    b.setAttribute('aria-pressed', activeTags.has(t));
    renderGrid();
  };
  document.body.addEventListener('click', ev => {
    const b = ev.target.closest('[data-open]'); if (b) openDrawer(b.dataset.open);
  });
  $('#scrim').onclick = closeDrawer;
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
  $('#modeBtn').onclick = () => setTheme(dark() ? 'daylight' : 'vault');
  window.addEventListener('resize', () => { if ($('#v-trends').classList.contains('on')) renderTrends(); });
}

const urlMode = new URLSearchParams(location.search).get('mode');
setTheme(urlMode === 'vault' || urlMode === 'daylight'
  ? urlMode : (localStorage.getItem('nia-theme') || 'daylight'));
boot();
