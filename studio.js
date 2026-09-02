const STORAGE_KEY = 'figure-atelier-people';

const CAST_HERO = {
    C1: 'images/figma-home/hero_1.png',
    C3: 'images/figma-home/hero_2.png',
    C5: 'images/figma-home/hero_3.png',
    C4: 'images/figma-home/hero_4.png',
    C2: 'images/figma-home/hero_5.png',
    C6: 'images/library/lib_cast_1.png',
    C7: 'images/library/lib_cast_7.png',
    C8: 'images/library/lib_cast_8.png'
};

const CAST_CARD_IMG = {
    C1: 'images/figma-home/studio_cast_1.png',
    C3: 'images/figma-home/studio_cast_2.png',
    C5: 'images/figma-home/studio_cast_3.png',
    C4: 'images/figma-home/studio_cast_4.png',
    C2: 'images/figma-home/studio_cast_5.png',
    C6: 'images/library/lib_cast_1_card.png',
    C7: 'images/library/lib_cast_7_card.png',
    C8: 'images/library/lib_cast_8_card.png'
};

const LOOK_CARD_IMG = {
    L01: 'images/figma-home/studio_cast_6.png'
};

const $ = (id) => document.getElementById(id);

const state = {
    tab: 'person',
    mode: 'identity',
    identity: { kind: 'cast', id: 'C4' },
    sel: {
        topId: null,
        bottomId: null,
        shoesId: null,
        accessoryId: null,
        poseId: null
    },
    gen: null,
    history: [],
    uploads: [],
    generating: false,
    genToken: 0,
    serviceOk: null
};

function loadUploads() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) state.uploads = JSON.parse(saved);
    } catch (err) {
        state.uploads = [];
    }
}

function persistUploads() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.uploads));
        return true;
    } catch (err) {
        alert('本地存储空间不足，人物照片未能保存到浏览器。');
        return false;
    }
}

function identityLook() {
    return state.identity.kind === 'look' ? findLook(state.identity.id) : null;
}

function identityCast() {
    return state.identity.kind === 'cast' ? findCast(state.identity.id) : null;
}

function identityItem() {
    if (state.identity.kind === 'upload') {
        return state.uploads.find((u) => u.id === state.identity.id) || null;
    }
    return null;
}

function identityPromptText() {
    const cast = identityCast();
    if (cast && cast.identity) return cast.identity;
    const look = identityLook();
    if (look && IDENTITY_PROMPTS[look.id]) return IDENTITY_PROMPTS[look.id];
    const item = identityItem();
    if (item && item.desc && item.desc.trim()) return item.desc.trim();
    return IDENTITY_DESC;
}

function defaultWear() {
    const empty = { top: null, bottom: null, shoes: null, accessory: null };
    const cast = identityCast();
    if (cast && cast.wear) return cast.wear;
    const look = identityLook();
    if (look) {
        const o = OUTFITS.find((x) => x.name === look.outfit);
        const s = SHOES.find((x) => x.name === look.shoes);
        const a = ACCESSORIES.find((x) => x.name === look.accessory);
        return {
            top: o ? TOP_PHRASES[o.id] : null,
            bottom: LOOK_BOTTOM_PHRASES[look.id] || null,
            shoes: s ? SHOE_PHRASES[s.id] : null,
            accessory: a ? ACCESSORY_PHRASES[a.id] : null
        };
    }
    return empty;
}

function renderTabs() {
    document.querySelectorAll('.lib-tab').forEach((tab) => {
        tab.classList.toggle('active', tab.dataset.tab === state.tab);
    });
    $('libUploadBtn').textContent = '+上传参考图';
}

function isItemActive(tab, id, kind) {
    if (tab === 'person') {
        if (state.mode === 'gen') return false;
        return state.identity.kind === kind && state.identity.id === id;
    }
    if (tab === 'top') return id === 'none' ? !state.sel.topId : state.sel.topId === id;
    if (tab === 'bottom') return id === 'none' ? !state.sel.bottomId : state.sel.bottomId === id;
    if (tab === 'shoes') return id === 'none' ? !state.sel.shoesId : state.sel.shoesId === id;
    if (tab === 'accessory') return id === 'none' ? !state.sel.accessoryId : state.sel.accessoryId === id;
    if (tab === 'pose') return !!state.sel.poseId && state.sel.poseId === id;
    return false;
}

function noneItemHTML(tab) {
    const active = isItemActive(tab, 'none', 'none');
    return `
        <button type="button" class="lib-item lib-none ${active ? 'active' : ''}" data-tab="${tab}" data-kind="none" data-id="none">
            <span class="item-check"><svg width="13" height="9" viewBox="0 0 13 9"><path d="M1.5 4.5 L5 8 L11.5 1" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            <div class="lib-none-inner"><span class="lib-none-word">无</span></div>
            <span class="lib-item-foot"></span>
            <div class="lib-item-name">保持原样</div>
        </button>
    `;
}

function libItemHTML(item, tab, opts = {}) {
    const kind = opts.kind || tab;
    const active = isItemActive(tab, item.id, kind);
    let cls = '';
    if (tab === 'pose') cls = 'pose';
    else if (tab === 'person') cls = 'person';
    const no = opts.no;
    let noHtml = '';
    if (tab === 'person' && no) {
        const nn = String(no).padStart(2, '0');
        noHtml = no <= 6
            ? `<img class="lib-item-no" src="images/figma-home/snum_${nn}.svg" alt="">`
            : `<span class="lib-item-no lib-item-no-txt">${nn}</span>`;
    }
    return `
        <button type="button" class="lib-item ${cls} ${active ? 'active' : ''}" data-tab="${tab}" data-kind="${kind}" data-id="${item.id}">
            <span class="item-check"><svg width="13" height="9" viewBox="0 0 13 9"><path d="M1.5 4.5 L5 8 L11.5 1" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            <div class="lib-item-img"><img src="${item.img}" alt="${item.name}" loading="lazy"></div>
            ${noHtml}
            <span class="lib-item-foot"></span>
            <div class="lib-item-name">${item.name}</div>
        </button>
    `;
}

function renderLibrary() {
    const grid = $('libGrid');

    if (state.tab === 'person') {
        const CAST_ORDER = ['C1', 'C3', 'C5', 'C4', 'C2', 'C6', 'C7', 'C8'];
        let no = 0;
        const castItems = CAST_ORDER.map((id) => {
            const c = CAST.find((x) => x.id === id);
            no += 1;
            const img = CAST_CARD_IMG[c.id] || c.img;
            return libItemHTML({ id: c.id, name: `人物${no}`, img }, 'person', { kind: 'cast', no });
        }).join('');
        const looks = LOOKS.map((l) => {
            no += 1;
            const img = LOOK_CARD_IMG[l.id] || l.img;
            return libItemHTML({ id: l.id, name: `人物${no}`, img }, 'person', { kind: 'look', no });
        }).join('');
        const mine = state.uploads
            .map((u) => libItemHTML({ id: u.id, name: u.name, img: u.img }, 'person', { kind: 'upload' }))
            .join('');

        grid.innerHTML = castItems + looks + mine;
        return;
    }

    let items = [];
    const noneTabs = ['top', 'bottom', 'shoes', 'accessory'];
    if (state.tab === 'top') items = TOPS;
    else if (state.tab === 'bottom') items = BOTTOMS;
    else if (state.tab === 'shoes') items = SHOES;
    else if (state.tab === 'accessory') items = ACCESSORIES;
    else if (state.tab === 'pose') items = POSES;

    const noneCard = noneTabs.includes(state.tab) ? noneItemHTML(state.tab) : '';
    grid.innerHTML = noneCard + items.map((item) => libItemHTML(item, state.tab)).join('');
}

function selectedPoseName() {
    if (state.sel.poseId) {
        const p = POSES.find((x) => x.id === state.sel.poseId);
        if (p) return p.name;
    }
    return '默认站姿';
}

function updateChips() {
    let idName = '人物';
    if (state.mode === 'gen' && state.gen) idName = 'AI 生成人物';
    else if (state.identity.kind === 'cast') idName = identityCast() ? identityCast().name : '素材人物';
    else if (state.identity.kind === 'upload') idName = identityItem() ? identityItem().name : '我的人物';
    else if (identityLook()) idName = identityLook().name;
    const top = TOPS.find((o) => o.id === state.sel.topId);
    const bottom = BOTTOMS.find((o) => o.id === state.sel.bottomId);
    const shoes = SHOES.find((s) => s.id === state.sel.shoesId);
    const accessory = ACCESSORIES.find((a) => a.id === state.sel.accessoryId);
    const chips = [
        { k: '人物', v: idName, cat: 'person' },
        { k: '上装', v: top ? top.name : '无', cat: 'top' },
        { k: '下装', v: bottom ? bottom.name : '无', cat: 'bottom' },
        { k: '鞋子', v: shoes ? shoes.name : '无', cat: 'shoes' },
        { k: '饰品', v: accessory ? accessory.name : '无', cat: 'accessory' },
        { k: '动作', v: selectedPoseName(), cat: 'pose' }
    ];
    $('chipRow').innerHTML = chips
        .map((c) => `<span class="chip chip-${c.cat}"><span class="k">${c.k}</span><span class="v">${c.v}</span></span>`)
        .join('');
}

function updateInfo() {
    const descWrap = $('uploadDescWrap');
    descWrap.hidden = true;
    $('lookDesc').hidden = false;
    if (state.mode === 'gen' && state.gen) {
        $('lookNo').textContent = 'AI';
        $('lookName').textContent = 'AI 生成造型';
        $('lookEn').textContent = 'AI GENERATED';
        $('lookDesc').textContent = '以所选人物为身份母图、按当前搭配与动作实时生成。可继续更换服装/动作后再次生成。';
        return;
    }
    const look = identityLook();
    const cast = identityCast();
    const item = identityItem();
    if (cast) {
        $('lookNo').textContent = cast.id;
        $('lookName').textContent = cast.name;
        $('lookEn').textContent = cast.en;
        $('lookDesc').textContent = `素材人物(${cast.gender === 'male' ? '男' : '女'})正面参考。生成时保持该人物面部、发型与发色一致,替换为你选的服装与动作。`;
        return;
    }
    if (item) {
        $('lookNo').textContent = '我的';
        $('lookName').textContent = item.name;
        $('lookEn').textContent = 'MY IDENTITY';
        $('lookDesc').hidden = true;
        descWrap.hidden = false;
        $('uploadDesc').value = item.desc || '';
        return;
    }
    if (look) {
        $('lookNo').textContent = look.id;
        $('lookName').textContent = look.name;
        $('lookEn').textContent = look.en;
        $('lookDesc').textContent = `身份母图 — ${look.desc} 生成时保持该人物面部、发型与发色一致。`;
    }
}

function updateStage() {
    let src = '';

    if (state.mode === 'gen' && state.gen) {
        src = state.gen.img;
    } else {
        const cast = identityCast();
        const item = identityItem();
        if (cast) { src = CAST_HERO[cast.id] || cast.img; }
        else if (item) { src = item.img; }
        else { src = identityLook() ? identityLook().img : ''; }
    }

    $('stageImg').src = src;
    document.querySelector('.stage-img-wrap').classList.toggle('is-gen', state.mode === 'gen' && !!state.gen);

    updateInfo();
    updateChips();
    renderLibrary();
    renderHistory();
}

function selectIdentity(id, kind) {
    state.identity = { kind: kind || 'look', id };
    state.mode = 'identity';
    state.gen = null;
    updateStage();
}

function showGenRecord(record) {
    state.gen = record;
    state.mode = 'gen';
    updateStage();
}

function renderHistory() {
    const bar = $('historyBar');
    if (!bar) return;
    if (state.history.length === 0) {
        bar.classList.remove('has-list');
        bar.innerHTML = '';
        return;
    }
    bar.classList.add('has-list');
    bar.innerHTML = state.history
        .map((h, i) => `
            <button type="button" class="history-thumb ${i === state.history.length - 1 ? 'active' : ''}" data-idx="${i}" title="${h.tag}">
                <img src="${h.img}" alt="${h.tag}" loading="lazy">
                <span class="thumb-tag">${h.tag}</span>
            </button>
        `)
        .join('');
}

function buildPrompt() {
    const top = TOPS.find((o) => o.id === state.sel.topId);
    const bottom = BOTTOMS.find((o) => o.id === state.sel.bottomId);
    const shoes = SHOES.find((s) => s.id === state.sel.shoesId);
    const accessory = ACCESSORIES.find((a) => a.id === state.sel.accessoryId);

    let posePhrase = 'standing facing front in a relaxed natural pose';
    if (state.sel.poseId) {
        posePhrase = POSE_PHRASES[state.sel.poseId] || posePhrase;
    }

    const parts = [
        `fashion editorial full body photograph of ${identityPromptText()}`,
        posePhrase
    ];

    const dw = defaultWear();
    const upItem = identityItem();
    const hasUploadDesc = !!(upItem && upItem.desc && upItem.desc.trim());
    if (top) {
        parts.push(`wearing ${TOP_PHRASES[top.id]}`);
    } else if (dw.top) {
        parts.push(`wearing ${dw.top}`);
    } else if (!hasUploadDesc) {
        parts.push('keep the exact same original top and outfit as worn in the identity reference, do not change or restyle the clothes');
    }
    if (bottom) {
        parts.push(`paired with ${BOTTOM_PHRASES[bottom.id]}`);
    } else if (dw.bottom) {
        parts.push(`paired with ${dw.bottom}`);
    } else if (!hasUploadDesc) {
        parts.push('keep the same original bottoms as in the identity reference');
    }
    if (shoes) {
        parts.push(SHOE_PHRASES[shoes.id]);
    } else if (dw.shoes) {
        parts.push(dw.shoes);
    } else if (!hasUploadDesc) {
        parts.push('keep the same original footwear as in the identity reference');
    }
    if (accessory) parts.push(ACCESSORY_PHRASES[accessory.id]);
    else if (dw.accessory) parts.push(dw.accessory);

    const userText = $('promptInput').value.trim();
    if (userText) parts.push(userText);

    const cast = identityCast();
    const lockText = cast && cast.gender === 'male'
        ? 'this must be the exact same man, keep his facial features, face shape, hairstyle, hair color and skin tone perfectly identical to the identity described above, do not change his identity'
        : IDENTITY_LOCK;
    parts.push(lockText);
    parts.push('full body head to toe, plain seamless solid studio background in very light warm gray color hex #FAFAFA, brutalist streetwear aesthetic, high contrast, photorealistic');
    return parts.join(', ');
}

function finishGenerate(token, url, prompt) {
    if (token !== state.genToken) return;
    const record = {
        id: 'G' + token,
        img: url,
        tag: 'AI 生成',
        prompt
    };
    state.history.push(record);
    if (state.history.length > 12) state.history.shift();
    showGenRecord(record);

    $('overlay').classList.remove('visible');
    $('genBtn').disabled = false;
    state.generating = false;
}

function setSvcWarn(show) {
    const el = $('svcWarn');
    if (el) el.hidden = !show;
}

function setGenAvailable(ok) {
    state.serviceOk = ok;
    const btn = $('genBtn');
    if (ok) {
        btn.disabled = false;
        btn.classList.remove('is-offline');
        btn.textContent = '生成造型';
        setSvcWarn(false);
        return;
    }
    btn.disabled = true;
    btn.classList.add('is-offline');
    btn.textContent = 'AI 生成 · 不可用';
    setSvcWarn(true);
    const body = $('svcWarnBody');
    if (body) {
        const local = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
        body.innerHTML = local
            ? '当前普通浏览器未获得 AI 图片服务的访问授权。<br>请在 <b>TRAE 内置浏览器 / 预览</b> 中打开 <b>localhost:8923/studio.html</b> 使用生成功能。'
            : '线上版本仅供浏览素材与搭配预览；AI 生图依赖公司内网服务，公网环境无法访问。<br>如需生成造型，请在 TRAE 内置浏览器 / 预览中打开本地 <b>localhost:8923/studio.html</b>。';
    }
}

function failGenerate(token, reason) {
    if (token !== state.genToken) return;
    $('overlay').classList.remove('visible');
    $('genBtn').disabled = false;
    state.generating = false;
    if (reason === 'auth') {
        setGenAvailable(false);
        alert('生成失败：当前浏览器无法访问 AI 图片服务（缺少 TRAE 内置浏览器的访问授权）。\n\n请在 TRAE 内置浏览器 / 预览中打开 localhost:8923/studio.html 使用生成功能。');
    } else {
        alert('生成失败：图像服务繁忙或暂时不可用，请稍后重试。');
    }
}

function loadGeneratedImage(url, prompt, token, attempt, fastFails) {
    const img = new Image();
    const t0 = Date.now();
    img.onload = () => {
        if (token !== state.genToken) return;
        const isPlaceholder = img.naturalWidth >= 1800 || img.naturalHeight >= 1800;
        if (isPlaceholder && attempt < 10) {
            $('genCn').textContent = `排队中，正在重试 ${attempt + 1}/10…`;
            setTimeout(() => loadGeneratedImage(`${url.split('&_r=')[0]}&_r=${attempt + 1}`, prompt, token, attempt + 1, 0), 3500);
            return;
        }
        if (isPlaceholder) {
            failGenerate(token, 'busy');
            return;
        }
        state.serviceOk = true;
        setSvcWarn(false);
        finishGenerate(token, url, prompt);
    };
    img.onerror = () => {
        if (token !== state.genToken) return;
        const fast = Date.now() - t0 < 3000;
        const nextFast = fastFails + (fast ? 1 : 0);
        if (fast && nextFast >= 2) {
            failGenerate(token, 'auth');
            return;
        }
        if (attempt < 10) {
            $('genCn').textContent = `网络波动，正在重试 ${attempt + 1}/10…`;
            setTimeout(() => loadGeneratedImage(`${url.split('&_r=')[0]}&_r=${attempt + 1}`, prompt, token, attempt + 1, nextFast), fast ? 1200 : 3500);
        } else {
            failGenerate(token, fast ? 'auth' : 'busy');
        }
    };
    img.src = url;
}

function probeService() {
    const img = new Image();
    img.onload = () => setGenAvailable(true);
    img.onerror = () => setGenAvailable(false);
    img.src = `${IMG('a plain light gray solid color test image', 'square')}&_probe=${Date.now()}`;
}

function generate() {
    if (state.generating) return;
    if (state.serviceOk === false) {
        setSvcWarn(true);
        const warn = $('svcWarn');
        if (warn) warn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
    }
    state.generating = true;
    state.genToken += 1;
    const token = state.genToken;
    $('genBtn').disabled = true;
    $('genCn').textContent = '人物换装生成中…';
    $('overlay').classList.add('visible');

    const prompt = buildPrompt();
    const url = `${IMG(prompt, 'portrait_4_3')}&_t=${Date.now()}`;
    loadGeneratedImage(url, prompt, token, 0, 0);
}

function stepIdentity(dir) {
    const roster = [
        ...CAST.map((c) => ({ id: c.id, kind: 'cast' })),
        ...LOOKS.map((l) => ({ id: l.id, kind: 'look' }))
    ];
    const idx = roster.findIndex((r) => r.id === state.identity.id && r.kind === state.identity.kind);
    const base = idx === -1 ? 0 : idx;
    const next = roster[(base + dir + roster.length) % roster.length];
    selectIdentity(next.id, next.kind);
}

function resetStudio() {
    state.identity = { kind: 'cast', id: 'C4' };
    state.mode = 'identity';
    state.gen = null;
    state.history = [];
    state.sel = { topId: null, bottomId: null, shoesId: null, accessoryId: null, poseId: null };
    $('promptInput').value = '';
    updateStage();
}

function readImageFile(file, callback) {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => callback(e.target.result);
    reader.readAsDataURL(file);
}

function addUpload(dataUrl, name) {
    const item = {
        id: 'U' + Date.now() + Math.random().toString(16).slice(2, 6),
        name: name || '我的人物',
        img: dataUrl,
        desc: ''
    };
    state.uploads.unshift(item);
    persistUploads();
    return item;
}

function handleFiles(files) {
    Array.from(files).forEach((file, i) => {
        readImageFile(file, (dataUrl) => {
            const item = addUpload(dataUrl, file.name.replace(/\.[^.]+$/, '') || '我的人物');
            if (i === 0) {
                selectIdentity(item.id, 'upload');
                setTimeout(() => { const ta = $('uploadDesc'); if (ta && !ta.hidden) ta.focus(); }, 60);
            } else updateStage();
        });
    });
}

function handleItemClick(tab, id, kind) {
    if (tab === 'person') {
        if (kind === 'cast') {
            if (CAST.some((c) => c.id === id)) selectIdentity(id, 'cast');
        } else if (kind === 'upload') {
            if (state.uploads.some((u) => u.id === id)) selectIdentity(id, 'upload');
        } else if (LOOKS.some((l) => l.id === id)) {
            selectIdentity(id, 'look');
        }
        return;
    }
    state.gen = null;
    if (state.mode === 'gen') state.mode = 'identity';
    if (tab === 'top') state.sel.topId = id === 'none' ? null : id;
    else if (tab === 'bottom') state.sel.bottomId = id === 'none' ? null : id;
    else if (tab === 'shoes') state.sel.shoesId = id === 'none' ? null : id;
    else if (tab === 'accessory') state.sel.accessoryId = id === 'none' ? null : id;
    else if (tab === 'pose') state.sel.poseId = id;
    updateStage();
}

function init() {
    loadUploads();
    $('genBtn').disabled = true;
    probeService();

    const params = new URLSearchParams(location.search);
    const lookId = params.get('look');
    if (lookId && CAST.some((c) => c.id === lookId)) {
        state.identity = { kind: 'cast', id: lookId };
    } else if (lookId && LOOKS.some((l) => l.id === lookId)) {
        state.identity = { kind: 'look', id: lookId };
    }
    const libTab = params.get('lib');
    if (['person', 'top', 'bottom', 'shoes', 'accessory', 'pose'].includes(libTab)) state.tab = libTab;

    $('libTabs').addEventListener('click', (e) => {
        const tab = e.target.closest('.lib-tab');
        if (!tab) return;
        state.tab = tab.dataset.tab;
        renderTabs();
        renderLibrary();
    });

    $('libGrid').addEventListener('click', (e) => {
        const item = e.target.closest('.lib-item');
        if (!item) return;
        handleItemClick(item.dataset.tab, item.dataset.id, item.dataset.kind);
    });

    $('historyBar').addEventListener('click', (e) => {
        const thumb = e.target.closest('.history-thumb');
        if (!thumb) return;
        const record = state.history[Number(thumb.dataset.idx)];
        if (record) showGenRecord(record);
    });

    $('genBtn').addEventListener('click', generate);
    $('resetBtn').addEventListener('click', resetStudio);

    const navMine = $('navMine');
    if (navMine) {
        navMine.addEventListener('click', (e) => {
            e.preventDefault();
            if (state.history.length === 0) {
                alert('还没有生成记录。选好人物与搭配后点击「生成造型」，结果会保存在这里。');
            } else {
                $('historyBar').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    $('uploadDesc').addEventListener('input', (e) => {
        const item = identityItem();
        if (item) {
            item.desc = e.target.value;
            persistUploads();
        }
    });

    $('aiDescBtn').addEventListener('click', async () => {
        const item = identityItem();
        const btn = $('aiDescBtn');
        if (!item || !item.img) return;
        const oldText = btn.textContent;
        const flash = (t) => { btn.textContent = t; setTimeout(() => { btn.textContent = oldText; }, 4000); };
        try {
            const blob = await (await fetch(item.img)).blob();
            const type = blob.type || 'image/png';
            await navigator.clipboard.write([new ClipboardItem({ [type]: blob })]);
            flash('✓ 已复制照片，去 TRAE 对话框粘贴');
        } catch (e) {
            flash('复制失败，请直接把照片发到对话框');
        }
    });

    $('libUploadBtn').addEventListener('click', () => $('libFileInput').click());
    $('libFileInput').addEventListener('change', (e) => {
        handleFiles(e.target.files);
        e.target.value = '';
    });

    renderTabs();
    updateStage();
}

init();
