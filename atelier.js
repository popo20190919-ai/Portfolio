const figureGrid = document.getElementById('figureGrid');
const accessoryGrid = document.getElementById('accessoryGrid');
const wardrobeGrid = document.getElementById('wardrobeGrid');

const ROSTER = [
    ...CAST.map((c) => ({ id: c.id, name: c.name, en: c.en, img: c.img, tags: '素材人物' })),
    ...LOOKS.map((l, i) => ({ id: l.id, name: `模特 ${String(i + 1).padStart(2, '0')}`, en: l.en, img: l.img, tags: l.tags }))
];

const heroCount = document.getElementById('heroCount');
if (heroCount) heroCount.textContent = `${ROSTER.length} 位人物 · 点击进入换装`;

/* ===== 首页网格 ===== */
function personCard(m, index) {
    const no = String(index + 1).padStart(2, '0');
    return `
        <a class="cell-card" href="studio.html?look=${m.id}">
            <div class="cell-card-img">
                <img src="${m.img}" alt="${m.name} / ${m.en}" loading="lazy">
            </div>
            <div class="cell-card-body">
                <div class="cell-card-name">
                    ${m.name}
                    <span class="en">${m.en}</span>
                </div>
                <span class="cell-card-no">NO.${no}</span>
            </div>
            <div class="cell-card-tag">${m.tags}</div>
        </a>
    `;
}

function accessoryCard(item, index) {
    const no = String(index + 1).padStart(2, '0');
    return `
        <a class="cell-card" href="studio.html?lib=accessory">
            <div class="cell-card-img">
                <img src="${item.img}" alt="${item.name} / ${item.en}" loading="lazy">
            </div>
            <div class="cell-card-body">
                <div class="cell-card-name">
                    ${item.name}
                    <span class="en">${item.en}</span>
                </div>
                <span class="cell-card-no">NO.${no}</span>
            </div>
        </a>
    `;
}

function outfitCard(item, index) {
    const no = String(index + 1).padStart(2, '0');
    return `
        <a class="cell-card" href="studio.html?lib=outfit">
            <div class="cell-card-img">
                <img src="${item.img}" alt="${item.name} / ${item.en}" loading="lazy">
            </div>
            <div class="cell-card-body">
                <div class="cell-card-name">
                    ${item.name}
                    <span class="en">${item.en}</span>
                </div>
                <span class="cell-card-no">NO.${no}</span>
            </div>
        </a>
    `;
}

figureGrid.innerHTML = ROSTER.map(personCard).join('');
wardrobeGrid.innerHTML = OUTFITS.map(outfitCard).join('');
accessoryGrid.innerHTML = ACCESSORIES.map(accessoryCard).join('');
