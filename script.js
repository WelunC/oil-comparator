fetch('oil_data.json').then(r => r.json()).then(data => {
  const results = document.getElementById('results');
  const search = document.getElementById('search');
  const filter1 = document.getElementById('filter1');
  const filter2 = document.getElementById('filter2');
  const sortOrder = document.getElementById('sortOrder');

  const percentStats = [
    "Ammo Consume Chance", "Consume Extra Ammo Chance", "Crit Chance",
    "Damage Percent", "Jump Power", "Loot Chance Multiplier",
    "Max Durability", "Move Speed", "Projectile Amount", "Recoil",
    "Reload Speed", "RPM", "Spread", "Bullet Speed"
  ];

  const allStats = Array.from(new Set(data.flatMap(d => d.stats.map(s => s.split(':')[0].trim()))));
  allStats.forEach(stat => {
    const o1 = document.createElement('option');
    o1.value = stat;
    o1.textContent = stat;
    filter1.appendChild(o1);

    const o2 = document.createElement('option');
    o2.value = stat;
    o2.textContent = stat;
    filter2.appendChild(o2);
  });

  const normalize = s => s.toLowerCase().replace('%', '').replace(/\s+/g, '');
  const extractValue = s => {
    const match = s.match(/[-+]?[0-9]*\.?[0-9]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  const formatStat = s => {
    const [name, val] = s.split(':').map(x => x.trim());
    if (!percentStats.includes(name) || isNaN(val)) return s;
    return `${name}: ${(parseFloat(val) * 100).toFixed(0)}%`;
  };

  function render() {
    const term = search.value.toLowerCase();
    const stat1 = filter1.value;
    const stat2 = filter2.value;
    const sort = sortOrder.value;

    let filtered = data.filter(oil =>
      oil.name.toLowerCase().includes(term) &&
      (!stat1 || oil.stats.some(s => normalize(s).includes(normalize(stat1)))) &&
      (!stat2 || oil.stats.some(s => normalize(s).includes(normalize(stat2))))
    );

    if (stat1 && sort !== 'none') {
      filtered.sort((a, b) => {
        const sa = a.stats.find(s => normalize(s).includes(normalize(stat1)));
        const sb = b.stats.find(s => normalize(s).includes(normalize(stat1)));
        const va = sa ? extractValue(sa) : 0;
        const vb = sb ? extractValue(sb) : 0;
        return sort === 'asc' ? va - vb : vb - va;
      });
    }
results.innerHTML = '';
for (const oil of filtered) {
  const div = document.createElement('div');
  div.className = 'oil-card';
  div.innerHTML = `
    <a href="${oil.wiki_link}" target="_blank"><strong>${oil.name}</strong></a>
    <p>Price: ${oil.price}</p>
    <ul>
      ${oil.stats.map(s => {
        const match = [stat1, stat2].filter(Boolean).some(f => normalize(s).includes(normalize(f)));
        return `<li class="${match ? 'highlight' : ''}">${formatStat(s)}</li>`;
      }).join('')}
    </ul>
  `;
  results.appendChild(div);
}
  }

  search.oninput = filter1.onchange = filter2.onchange = sortOrder.onchange = render;
  render();
});
