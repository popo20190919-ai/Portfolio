const BRANDS = {
    jianying: {
        name: '剪映 / CC',
        shortName: '剪映',
        logo: 'images/logos/jianying.png',
        keywords: [
            '年轻', '活力', '明亮', '自然质感', '镜头感',
            '简洁克制', '界面UI', '系统感', '运动', '阳光',
            '户外', '高饱和', '动态', '人像', '街头'
        ]
    },
    xingtu: {
        name: '醒图 / Hypic',
        shortName: '醒图',
        logo: 'images/logos/xingtu.png',
        keywords: [
            '清透', '精致', '时尚', '轻盈', '氛围感',
            '人像质感', '丰富活泼', '插画', '审美表达',
            '图形演绎', '鲜活色彩', '潮流符号', '复古未来',
            '呼吸液态', '混合元素', '创意延展'
        ]
    },
    jimeng: {
        name: '即梦',
        shortName: '即梦',
        logo: 'images/logos/jimeng-icon.png',
        keywords: [
            '梦幻感', '电影质感', '创意质感', '科幻', '未来',
            '光影', '氛围感', '超现实', '艺术', '抽象',
            '叙事感', '深邃', '浪漫', '奇幻', '视觉冲击'
        ]
    }
};

const CATEGORIES = {
    jianying: ['人物形象', '品牌感', '功能感']
};

const STORAGE_KEY = 'brand_moodboard_data';

let state = {
    images: [],
    currentBrand: 'all',
    currentKeyword: 'all',
    currentCategory: 'all',
    pendingFiles: [],
    pendingUrls: [],
    pendingTags: [],
    activeTab: 'local'
};

function loadData() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) state.images = JSON.parse(saved);
    } catch (e) {
        console.error('加载数据失败：', e);
        state.images = [];
    }
}

function saveData() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.images));
    } catch (e) {
        console.error('保存数据失败：', e);
        alert('存储空间不足，请删除部分图片后重试。');
    }
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function formatDate(timestamp) {
    const d = new Date(timestamp);
    return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getFilteredImages() {
    return state.images.filter(img => {
        if (state.currentBrand !== 'all' && img.brand !== state.currentBrand) return false;
        if (state.currentKeyword !== 'all' && !img.tags.includes(state.currentKeyword)) return false;
        if (state.currentBrand === 'jianying' && state.currentCategory !== 'all' && img.category !== state.currentCategory) return false;
        return true;
    });
}

function getCategoryCount(category) {
    return state.images.filter(img => img.brand === 'jianying' && img.category === category).length;
}

function renderCategoryBar() {
    const bar = document.getElementById('categoryBar');
    const list = document.getElementById('categoryList');
    const categories = CATEGORIES[state.currentBrand];

    if (!categories) {
        bar.style.display = 'none';
        state.currentCategory = 'all';
        return;
    }

    bar.style.display = 'flex';

    let html = `<label class="keyword-item ${state.currentCategory === 'all' ? 'active' : ''}">
        <input type="radio" name="catFilter" value="all" ${state.currentCategory === 'all' ? 'checked' : ''}>
        <span class="kw-box"></span>全部
    </label>`;

    categories.forEach(cat => {
        const active = state.currentCategory === cat ? 'active' : '';
        html += `<label class="keyword-item ${active}">
            <input type="radio" name="catFilter" value="${escapeHtml(cat)}" ${state.currentCategory === cat ? 'checked' : ''}>
            <span class="kw-box"></span>${escapeHtml(cat)}
            <span class="cat-count">${getCategoryCount(cat)}</span>
        </label>`;
    });

    list.innerHTML = html;

    list.querySelectorAll('input[name="catFilter"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.currentCategory = e.target.value;
            state.currentKeyword = 'all';
            renderCategoryBar();
            renderKeywordBar();
            renderGallery();
        });
    });
}

function getCategoryNames(brand) {
    if (brand === 'all') {
        return Object.values(CATEGORIES).flat();
    }
    return CATEGORIES[brand] || [];
}

function getKeywordsForBrand(brand) {
    const keywordSet = new Set();
    if (brand === 'all') {
        Object.values(BRANDS).forEach(b => b.keywords.forEach(k => keywordSet.add(k)));
        state.images.forEach(img => img.tags.forEach(t => keywordSet.add(t)));
    } else {
        const brandData = BRANDS[brand];
        if (brandData) brandData.keywords.forEach(k => keywordSet.add(k));
        state.images
            .filter(img => img.brand === brand)
            .forEach(img => img.tags.forEach(t => keywordSet.add(t)));
    }
    getCategoryNames(brand).forEach(c => keywordSet.delete(c));
    return Array.from(keywordSet);
}

function renderKeywordBar() {
    const container = document.getElementById('keywordList');
    const keywords = getKeywordsForBrand(state.currentBrand);

    let html = `<label class="keyword-item ${state.currentKeyword === 'all' ? 'active' : ''}">
        <input type="radio" name="kwFilter" value="all" ${state.currentKeyword === 'all' ? 'checked' : ''}>
        <span class="kw-box"></span>全部
    </label>`;

    keywords.forEach(kw => {
        const active = state.currentKeyword === kw ? 'active' : '';
        html += `<label class="keyword-item ${active}">
            <input type="radio" name="kwFilter" value="${escapeHtml(kw)}" ${state.currentKeyword === kw ? 'checked' : ''}>
            <span class="kw-box"></span>${escapeHtml(kw)}
        </label>`;
    });

    container.innerHTML = html;

    container.querySelectorAll('input[name="kwFilter"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.currentKeyword = e.target.value;
            renderKeywordBar();
            renderGallery();
        });
    });
}

function renderGallery() {
    const grid = document.getElementById('editorialGrid');
    const emptyState = document.getElementById('emptyState');
    const countEl = document.getElementById('imageCount');

    const filtered = getFilteredImages();
    countEl.textContent = filtered.length;

    if (filtered.length === 0) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    grid.innerHTML = filtered.map(img => {
        const brand = BRANDS[img.brand] || { shortName: img.brand, name: img.brand };
        const tagsHtml = img.tags.map(t =>
            `<span class="card-tag">${escapeHtml(t)}</span>`
        ).join('');
        const logoHtml = brand.logo
            ? `<img class="card-brand-logo" src="${brand.logo}" alt="" loading="lazy">`
            : '';
        const categoryHtml = img.category
            ? `<div class="card-category">${escapeHtml(img.category)}</div>`
            : '';

        return `
            <article class="editorial-card" data-id="${img.id}">
                <div class="card-image">
                    <img src="${img.dataUrl}" alt="${escapeHtml(img.note || brand.name)}" loading="lazy">
                </div>
                <div class="card-body">
                    <div class="card-brand-row">
                        ${logoHtml}
                        <h2 class="card-headline">${escapeHtml(brand.shortName)}</h2>
                    </div>
                    ${categoryHtml}
                    <div class="card-tags">${tagsHtml}</div>
                    <div class="card-date">${formatDate(img.createdAt)}</div>
                </div>
            </article>
        `;
    }).join('');

    grid.querySelectorAll('.editorial-card').forEach(card => {
        card.addEventListener('click', () => openImageModal(card.dataset.id));
    });
}

function openImageModal(id) {
    const img = state.images.find(i => i.id === id);
    if (!img) return;

    const brand = BRANDS[img.brand] || { name: img.brand };
    const modal = document.getElementById('imageModal');

    document.getElementById('modalImage').src = img.dataUrl;

    const brandLogoHtml = brand.logo
        ? `<img class="modal-brand-logo" src="${brand.logo}" alt="">`
        : '';
    document.getElementById('modalBrand').innerHTML =
        `${brandLogoHtml}<span>${escapeHtml(brand.name)}</span>`;

    const categoryEl = document.getElementById('modalCategory');
    if (img.category) {
        categoryEl.textContent = '大类 · ' + img.category;
        categoryEl.style.display = 'block';
    } else {
        categoryEl.textContent = '';
        categoryEl.style.display = 'none';
    }

    document.getElementById('modalTags').innerHTML = img.tags.map(t =>
        `<span class="tag-item">${escapeHtml(t)}</span>`
    ).join('');

    const noteEl = document.getElementById('modalNote');
    noteEl.textContent = img.note || '';

    document.getElementById('modalDate').textContent = '收藏于 ' + formatDate(img.createdAt);

    const deleteBtn = document.getElementById('deleteImageBtn');
    deleteBtn.onclick = () => {
        if (confirm('确定要删除这张参考图吗？')) {
            state.images = state.images.filter(i => i.id !== id);
            saveData();
            closeImageModal();
            renderCategoryBar();
            renderKeywordBar();
            renderGallery();
        }
    };

    modal.classList.add('active');
}

function closeImageModal() {
    document.getElementById('imageModal').classList.remove('active');
}

function openUploadModal() {
    document.getElementById('uploadModal').classList.add('active');
    resetUploadForm();
}

function closeUploadModal() {
    document.getElementById('uploadModal').classList.remove('active');
}

function resetUploadForm() {
    state.pendingFiles = [];
    state.pendingUrls = [];
    state.pendingTags = [];
    state.activeTab = 'local';

    document.getElementById('previewArea').style.display = 'none';
    document.getElementById('previewGrid').innerHTML = '';
    document.getElementById('urlPreviewArea').style.display = 'none';
    document.getElementById('urlPreviewGrid').innerHTML = '';
    document.getElementById('urlInput').value = '';
    document.getElementById('tagList').innerHTML = '';
    document.getElementById('tagInput').value = '';
    document.getElementById('noteInput').value = '';
    document.querySelector('input[name="brand"][value="jianying"]').checked = true;

    document.querySelectorAll('.upload-tab').forEach(t =>
        t.classList.toggle('active', t.dataset.tab === 'local'));
    document.getElementById('localTab').style.display = 'block';
    document.getElementById('urlTab').style.display = 'none';

    renderPresetTags('jianying');
}

function renderPresetTags(brand) {
    const container = document.getElementById('presetTags');
    const keywords = (BRANDS[brand] && BRANDS[brand].keywords) || [];

    let html = `<span class="preset-label">快速添加：</span>`;
    html += keywords.slice(0, 10).map(kw =>
        `<button type="button" class="preset-tag" data-tag="${escapeHtml(kw)}">${escapeHtml(kw)}</button>`
    ).join('');

    container.innerHTML = html;

    container.querySelectorAll('.preset-tag').forEach(tag => {
        tag.addEventListener('click', () => addTag(tag.dataset.tag));
    });
}

function addTag(tag) {
    tag = tag.trim();
    if (!tag || state.pendingTags.includes(tag)) return;
    state.pendingTags.push(tag);
    renderPendingTags();
}

function removeTag(tag) {
    state.pendingTags = state.pendingTags.filter(t => t !== tag);
    renderPendingTags();
}

function renderPendingTags() {
    const tagList = document.getElementById('tagList');
    tagList.innerHTML = state.pendingTags.map(t =>
        `<span class="tag-item">${escapeHtml(t)}<span class="tag-remove" data-tag="${escapeHtml(t)}">&times;</span></span>`
    ).join('');

    tagList.querySelectorAll('.tag-remove').forEach(btn => {
        btn.addEventListener('click', () => removeTag(btn.dataset.tag));
    });
}

function handleFiles(files) {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    imageFiles.forEach(file => {
        if (state.pendingFiles.some(f => f.name === file.name && f.size === file.size)) return;
        state.pendingFiles.push(file);
    });

    renderPreview();
}

function renderPreview() {
    const previewArea = document.getElementById('previewArea');
    const previewGrid = document.getElementById('previewGrid');

    if (state.pendingFiles.length === 0) {
        previewArea.style.display = 'none';
        return;
    }

    previewArea.style.display = 'block';
    previewGrid.innerHTML = '';

    state.pendingFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const item = document.createElement('div');
            item.className = 'preview-item';
            item.innerHTML = `
                <img src="${e.target.result}" alt="${escapeHtml(file.name)}">
                <button class="preview-remove" data-index="${index}">&times;</button>
            `;
            previewGrid.appendChild(item);

            item.querySelector('.preview-remove').addEventListener('click', () => {
                state.pendingFiles.splice(index, 1);
                renderPreview();
            });
        };
        reader.readAsDataURL(file);
    });
}

function parseUrls(text) {
    return text.split(/[\n\r]+/)
        .map(u => u.trim())
        .filter(u => u && /^https?:\/\//i.test(u));
}

function previewUrls() {
    const urlText = document.getElementById('urlInput').value;
    const urls = parseUrls(urlText);

    if (urls.length === 0) {
        alert('请输入至少一个有效的图片链接（以 http:// 或 https:// 开头）。');
        return;
    }

    state.pendingUrls = [];
    const previewArea = document.getElementById('urlPreviewArea');
    const previewGrid = document.getElementById('urlPreviewGrid');
    previewArea.style.display = 'block';
    previewGrid.innerHTML = '';

    urls.forEach((url) => {
        const item = document.createElement('div');
        item.className = 'preview-item';
        item.innerHTML = `
            <img src="${escapeHtml(url)}" alt="链接预览" onerror="this.parentElement.classList.add('load-error');this.parentElement.innerHTML='<div class=\\'preview-error\\'>加载失败</div>';">
            <button class="preview-remove">&times;</button>
        `;
        previewGrid.appendChild(item);

        const img = item.querySelector('img');
        img.onload = () => {
            if (!state.pendingUrls.includes(url)) state.pendingUrls.push(url);
        };

        item.querySelector('.preview-remove').addEventListener('click', () => {
            state.pendingUrls = state.pendingUrls.filter(u => u !== url);
            item.remove();
            if (previewGrid.children.length === 0) previewArea.style.display = 'none';
        });
    });
}

function switchTab(tab) {
    state.activeTab = tab;
    document.querySelectorAll('.upload-tab').forEach(t =>
        t.classList.toggle('active', t.dataset.tab === tab));
    document.getElementById('localTab').style.display = tab === 'local' ? 'block' : 'none';
    document.getElementById('urlTab').style.display = tab === 'url' ? 'block' : 'none';
}

function confirmUpload() {
    const brand = document.querySelector('input[name="brand"]:checked').value;
    const note = document.getElementById('noteInput').value.trim();
    const isLocal = state.activeTab === 'local';

    if (isLocal && state.pendingFiles.length === 0) {
        alert('请先选择至少一张图片。');
        return;
    }
    if (!isLocal && state.pendingUrls.length === 0) {
        alert('请先输入并预览至少一个有效的图片链接。');
        return;
    }

    if (isLocal) {
        let loadedCount = 0;
        const totalFiles = state.pendingFiles.length;

        state.pendingFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                state.images.unshift({
                    id: generateId(),
                    dataUrl: e.target.result,
                    brand: brand,
                    tags: [...state.pendingTags],
                    note: note,
                    fileName: file.name,
                    source: 'local',
                    createdAt: Date.now()
                });
                loadedCount++;
                if (loadedCount === totalFiles) finalizeUpload(brand);
            };
            reader.readAsDataURL(file);
        });
    } else {
        state.pendingUrls.forEach(url => {
            state.images.unshift({
                id: generateId(),
                dataUrl: url,
                brand: brand,
                tags: [...state.pendingTags],
                note: note,
                fileName: url.split('/').pop()?.split('?')[0] || 'url-image',
                source: 'url',
                createdAt: Date.now()
            });
        });
        finalizeUpload(brand);
    }
}

function finalizeUpload(brand) {
    saveData();
    closeUploadModal();
    if (state.currentBrand !== 'all' && state.currentBrand !== brand) {
        state.currentBrand = 'all';
        updateBrandFilter();
    }
    state.currentKeyword = 'all';
    state.currentCategory = 'all';
    renderCategoryBar();
    renderKeywordBar();
    renderGallery();
}

function updateBrandFilter() {
    document.querySelectorAll('input[name="brandFilter"]').forEach(radio => {
        radio.checked = radio.value === state.currentBrand;
    });
}

function initEvents() {
    document.getElementById('uploadBtn').addEventListener('click', openUploadModal);
    document.getElementById('feedBtn').addEventListener('click', () => {
        state.currentBrand = 'all';
        state.currentKeyword = 'all';
        state.currentCategory = 'all';
        updateBrandFilter();
        renderCategoryBar();
        renderKeywordBar();
        renderGallery();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.getElementById('closeUploadModal').addEventListener('click', closeUploadModal);
    document.getElementById('cancelUpload').addEventListener('click', closeUploadModal);
    document.getElementById('confirmUpload').addEventListener('click', confirmUpload);
    document.getElementById('closeImageModal').addEventListener('click', closeImageModal);

    document.querySelectorAll('input[name="brandFilter"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.currentBrand = e.target.value;
            state.currentKeyword = 'all';
            state.currentCategory = 'all';
            renderCategoryBar();
            renderKeywordBar();
            renderGallery();
        });
    });

    document.querySelectorAll('.upload-tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    document.getElementById('previewUrlBtn').addEventListener('click', previewUrls);

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('active');
        });
    });

    document.querySelectorAll('input[name="brand"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            renderPresetTags(e.target.value);
            renderPendingTags();
        });
    });

    const tagInput = document.getElementById('tagInput');
    tagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(tagInput.value);
            tagInput.value = '';
        } else if (e.key === 'Backspace' && !tagInput.value && state.pendingTags.length > 0) {
            state.pendingTags.pop();
            renderPendingTags();
        }
    });

    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');

    uploadZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
        fileInput.value = '';
    });

    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
        }
    });
}

async function mergeFigmaSeed() {
    try {
        const res = await fetch('figma-manifest.json', { cache: 'no-store' });
        if (!res.ok) return;
        const seed = await res.json();
        if (!Array.isArray(seed)) return;

        let changed = false;
        const indexById = new Map(state.images.map((img, idx) => [img.id, idx]));
        const fresh = [];

        seed.forEach(s => {
            const idx = indexById.get(s.id);
            if (idx === undefined) {
                fresh.push(s);
                changed = true;
            } else {
                const current = state.images[idx];
                const next = {
                    ...current,
                    brand: s.brand,
                    dataUrl: s.dataUrl,
                    tags: s.tags,
                    note: s.note,
                    fileName: s.fileName,
                    source: s.source,
                    category: s.category
                };
                if (JSON.stringify(next) !== JSON.stringify(current)) {
                    state.images[idx] = next;
                    changed = true;
                }
            }
        });

        if (fresh.length > 0) {
            state.images = [...fresh, ...state.images];
        }
        if (changed) saveData();
    } catch (e) {
        // 离线或 file:// 打开时无清单，忽略
    }
}

function getBrandFromQuery() {
    try {
        const brand = new URLSearchParams(window.location.search).get('brand');
        return BRANDS[brand] ? brand : null;
    } catch (e) {
        return null;
    }
}

window.addEventListener('pageshow', () => {
    const target = getBrandFromQuery() || 'all';
    if (state.currentBrand !== target) {
        state.currentBrand = target;
        state.currentKeyword = 'all';
        state.currentCategory = 'all';
        updateBrandFilter();
        renderCategoryBar();
        renderKeywordBar();
        renderGallery();
    }
});

async function init() {
    loadData();
    initEvents();
    const queryBrand = getBrandFromQuery();
    if (queryBrand) {
        state.currentBrand = queryBrand;
        updateBrandFilter();
    }
    renderPresetTags(queryBrand || 'jianying');
    await mergeFigmaSeed();
    renderCategoryBar();
    renderKeywordBar();
    renderGallery();
}

init();
