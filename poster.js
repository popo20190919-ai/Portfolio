(function () {
    'use strict';

    var LAYOUT = window.POSTER_LAYOUT;
    var W = LAYOUT.w, H = LAYOUT.h;

    function $(id) { return document.getElementById(id); }
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

    function hexA(hex, a) {
        var h = hex.replace('#', '');
        if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
        var n = parseInt(h, 16);
        return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
    }

    function esc(s) {
        return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    var FONTS = [
        { name: '思源黑体（粗黑）', stack: '"Noto Sans SC","PingFang SC",sans-serif', w: 900, sw: 700 },
        { name: '思源宋体（衬线）', stack: '"Noto Serif SC","Songti SC",serif', w: 900, sw: 600 },
        { name: '站酷快乐体', stack: '"ZCOOL KuaiLe","Noto Sans SC",sans-serif', w: 400, sw: 400 },
        { name: '站酷庆科黄油体', stack: '"ZCOOL QingKe HuangYou","Noto Sans SC",sans-serif', w: 400, sw: 400 },
        { name: '马善政毛笔体', stack: '"Ma Shan Zheng","Noto Serif SC",serif', w: 400, sw: 400 },
        { name: '系统黑体（苹方）', stack: '"PingFang SC","Microsoft YaHei",sans-serif', w: 900, sw: 400 }
    ];

    var TPLS = LAYOUT.templates.map(function (t) {
        return {
            id: t.id, name: t.name, title: t.title, sub: t.sub,
            board: t.board, titleBox: t.titleBox, subBox: t.subBox,
            titleFs: t.titleFs || 116, subFs: t.subFs || 62,
            nodes: t.nodes, slots: t.slots || [],
            cat: t.cat || 'mobile', w: t.w || W, h: t.h || H
        };
    });
    var STICKERS = LAYOUT.stickers;

    var CUSTOM_KEY = 'poster_studio_custom_stickers';
    var customStickers = [];
    var cidSeq = 1;
    try {
        customStickers = JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]');
        customStickers.forEach(function (s) {
            var n = Number(String(s.id).replace(/\D/g, ''));
            if (n >= cidSeq) cidSeq = n + 1;
        });
    } catch (e) { customStickers = []; }

    function saveCustom() {
        try {
            localStorage.setItem(CUSTOM_KEY, JSON.stringify(customStickers));
            return true;
        } catch (e) {
            console.warn('自定义素材本地存储失败：', e);
            return false;
        }
    }

    // 非阻塞提示（与导入功能共用 #importToast 浮层，禁止使用 alert 防事件循环卡死）
    function studioToast(msg, isErr) {
        var t = $('importToast');
        if (!t) {
            t = document.createElement('div');
            t.id = 'importToast';
            t.style.cssText = 'position:fixed;left:50%;bottom:88px;transform:translateX(-50%) translateY(16px);'
                + 'max-width:82vw;padding:14px 22px;border-radius:12px;font-size:15px;line-height:1.6;'
                + 'white-space:pre-line;text-align:left;z-index:99999;opacity:0;pointer-events:none;'
                + 'transition:opacity .25s ease,transform .25s ease;color:#fff;'
                + 'background:rgba(28,32,44,.97);border:1px solid rgba(255,255,255,.14);'
                + 'box-shadow:0 12px 40px rgba(0,0,0,.55);';
            document.body.appendChild(t);
        }
        t.textContent = msg;
        t.style.background = isErr ? 'rgba(74,24,32,.98)' : 'rgba(28,32,44,.97)';
        t.style.borderColor = isErr ? 'rgba(255,96,120,.5)' : 'rgba(255,255,255,.14)';
        requestAnimationFrame(function () {
            t.style.opacity = '1';
            t.style.transform = 'translateX(-50%) translateY(0)';
        });
        clearTimeout(t._tm);
        t._tm = setTimeout(function () {
            t.style.opacity = '0';
            t.style.transform = 'translateX(-50%) translateY(16px)';
        }, 3600);
    }

    var state = { tpl: 't1', sel: null, viewScale: 0.2, cat: 'mobile' };
    var edits = {};
    var lidSeq = 1;

    function getTpl(id) {
        for (var i = 0; i < TPLS.length; i++) if (TPLS[i].id === id) return TPLS[i];
        return TPLS[0];
    }

    function defaultEdit(t) {
        return {
            title: t.title, sub: t.sub, font: 0,
            titleSize: t.titleFs, subSize: t.subFs, color: '#ffffff',
            useBoard: true,
            posterBg: null, posterBgName: '', posterColor: '#000000',
            bg: null, bgName: '', ui: true,
            persons: [], stickers: [], slotImgs: {}, slotTexts: {}
        };
    }

    function posterBgCss(ed) {
        return ed.posterBg
            ? "url('" + ed.posterBg + "') center center / cover no-repeat"
            : ed.posterColor;
    }

    function cur() {
        if (!edits[state.tpl]) edits[state.tpl] = defaultEdit(getTpl(state.tpl));
        return edits[state.tpl];
    }

    function selLayer(ed, sel) {
        if (!sel) return null;
        var arr = sel.kind === 'person' ? ed.persons : ed.stickers;
        for (var i = 0; i < arr.length; i++) if (arr[i].id === sel.id) return arr[i];
        return null;
    }

    function selLayerDom() {
        if (!state.sel) return null;
        return wrap.querySelector('.p-layer[data-kind="' + state.sel.kind + '"][data-lid="' + state.sel.id + '"]');
    }

    function layerTransform(item) {
        var sx = item.fliph ? -1 : 1;
        var sy = item.flipv ? -1 : 1;
        return 'rotate(' + (item.rot || 0) + 'deg) scaleX(' + sx + ') scaleY(' + sy + ')';
    }

    function layerImg(item, kind, sel) {
        var on = sel && sel.kind === kind && sel.id === item.id;
        return '<img class="p-layer' + (on ? ' sel' : '') + '" data-kind="' + kind + '" data-lid="' + item.id + '" '
            + 'src="' + item.src + '" alt="" '
            + 'style="left:' + item.x + 'px;top:' + item.y + 'px;width:' + item.w + 'px;transform:' + layerTransform(item) + '">';
    }

    function slotHtml(sl, src, uiOff, preview) {
        var base = 'left:' + sl.x + 'px;top:' + sl.y + 'px;width:' + sl.w + 'px;height:' + sl.h + 'px;';
        var ds = preview ? '' : ' data-slot="' + sl.id + '"';
        var edc = preview ? '' : ' p-editable';
        var emc = src ? '' : ' p-slot-empty';
        if (sl.shape === 'thumb') {
            var ow = sl.clipW || sl.w;
            var rad = sl.rc || ((sl.r || 0) + 'px');
            var timg = src
                ? (sl.clipW
                    ? '<img class="slot-thumb-img" src="' + src + '" alt="" style="left:0;top:0;width:' + sl.w + 'px;height:' + sl.h + 'px">'
                    : '<img class="slot-thumb-img" src="' + src + '" alt="">')
                : '';
            return '<div class="p-slot p-slot-thumb p-chrome' + edc + emc + (uiOff ? ' off' : '') + '"' + ds + ' style="left:' + sl.x + 'px;top:' + sl.y + 'px;width:' + ow + 'px;height:' + sl.h + 'px;border-radius:' + rad + '">' + timg + '</div>';
        }
        if (sl.shape === 'circle') {
            return '<div class="p-slot p-slot-circle' + edc + emc + '"' + ds + ' style="' + base + '">'
                + (src
                    ? '<img class="slot-img" src="' + src + '" alt="">'
                        + (sl.check ? '<div class="slot-check">✓</div>' : '')
                    : '')
                + '</div>';
        }
        return '<div class="p-slot p-slot-card' + edc + emc + '"' + ds + ' style="' + base + '">'
            + (src
                ? '<div class="slot-card-body"><img class="slot-img" src="' + src + '" alt=""></div>'
                    + '<div class="slot-arrow"><i>→</i></div>'
                : '')
            + '</div>';
    }

    function promptInner(sl, val, ed, preview) {
        var byLabel = {};
        (sl.chips || []).forEach(function (c) { byLabel[c.label] = c; });
        var parts = String(val == null ? '' : val).split(/(【[^】]*】)/g);
        var html = '';
        parts.forEach(function (seg) {
            var m = seg.match(/^【([^】]*)】$/);
            if (m && byLabel[m[1]]) {
                var c = byLabel[m[1]];
                var src = (ed && ed.slotImgs && ed.slotImgs[c.id]) || c.img;
                var avCls = preview ? 'p-chip-av' : 'p-chip-av p-editable';
                var avDs = preview ? '' : ' data-chip="' + c.id + '"';
                html += '<span class="p-chip">'
                    + '<span class="' + avCls + '"' + avDs + '><img src="' + src + '" alt=""></span>'
                    + '<span class="p-chip-lb" style="font-size:' + c.lsize + 'px;padding:0 ' + (c.lpad || 10) + 'px">' + esc(c.label) + '</span>'
                    + '</span>';
            } else {
                html += esc(seg).replace(/\n/g, '<br>');
            }
        });
        return html;
    }

    function textSlotHtml(sl, val, uiOff, ed, preview) {
        var off = uiOff ? ' off' : '';
        var edc = preview ? '' : ' p-editable';
        var ds = preview ? '' : ' data-slot="' + sl.id + '"';
        var color = sl.op ? hexA(sl.color || '#ffffff', sl.op) : (sl.color || '#ffffff');
        var st = 'left:' + sl.x + 'px;top:' + sl.y + 'px;width:' + sl.w + 'px;'
            + 'font-size:' + sl.sz + 'px;line-height:' + sl.lh + 'px;'
            + 'white-space:' + (sl.nowrap ? 'pre' : 'pre-wrap') + ';'
            + (sl.ls ? 'letter-spacing:' + sl.ls + 'px;' : '')
            + 'text-align:' + (sl.align || 'left') + ';color:' + color + ';'
            + 'font-weight:' + (sl.weight || 400) + ';';
        var inner = sl.shape === 'prompt' ? promptInner(sl, val, ed, preview) : esc(val == null ? '' : val).replace(/\n/g, '<br>');
        return '<div class="p-textslot p-chrome' + edc + off + '"' + ds + ' style="' + st + '">'
            + inner + '</div>';
    }

    function buildPoster(tpl, ed, sel, preview) {
        var f = FONTS[ed.font];
        var p = document.createElement('div');
        p.className = 'poster';
        p.style.width = (tpl.w || W) + 'px';
        p.style.height = (tpl.h || H) + 'px';
        if (!preview) p.dataset.edit = 'board';
        p.style.setProperty('--pfont', f.stack);
        p.style.setProperty('--pweight', f.w);
        p.style.setProperty('--psweight', f.sw);
        p.style.setProperty('--psize', ed.titleSize + 'px');
        p.style.setProperty('--pssize', ed.subSize + 'px');
        p.style.setProperty('--pcolor', ed.color);
        p.style.setProperty('--pscolor', hexA(ed.color, 0.62));

        var html = '';
        if (ed.useBoard) {
            html += '<img class="p-board" src="' + tpl.board + '" alt="">';
        } else {
            p.style.background = posterBgCss(ed);
        }

        var tEdit = preview ? '' : ' p-editable';
        html += '<div class="p-title' + tEdit + '"' + (preview ? '' : ' data-edit="title"') + ' style="top:' + tpl.titleBox.y + 'px"></div>';
        html += '<div class="p-sub' + tEdit + '"' + (preview ? '' : ' data-edit="sub"') + ' style="top:' + tpl.subBox.y + 'px"></div>';

        var slotNodes = {};
        (tpl.slots || []).forEach(function (sl) {
            if (sl.node && ed.slotImgs[sl.id]) slotNodes[sl.node] = true;
        });

        tpl.nodes.forEach(function (n) {
            if (slotNodes[n.id]) return;
            var pos = 'left:' + (n.x - (n.ox || 0)) + 'px;top:' + (n.y - (n.oy || 0)) + 'px;width:' + (n.nw || n.w) + 'px;';
            if (n.role === 'media') {
                var mCls = preview ? '' : ' p-editable';
                var mDs = preview ? '' : ' data-edit="media"';
                if (ed.bg) {
                    html += '<div class="p-media' + mCls + '"' + mDs + ' style="left:' + n.x + 'px;top:' + n.y + 'px;width:' + n.w + 'px;height:' + n.h + 'px;border-radius:' + (n.radius || 0) + 'px">'
                        + '<img src="' + ed.bg + '" alt=""></div>';
                } else {
                    html += '<img class="p-node' + mCls + '"' + mDs + ' src="' + n.file + '" alt="" style="' + pos + '">';
                }
            } else {
                html += '<img class="p-node p-chrome' + (ed.ui ? '' : ' off') + '" src="' + n.file + '" alt="" style="' + pos + '">';
            }
        });

        (tpl.slots || []).forEach(function (sl) {
            if (sl.shape === 'text' || sl.shape === 'prompt') {
                var tv = ed.slotTexts && ed.slotTexts[sl.id] != null ? ed.slotTexts[sl.id] : sl.def;
                html += textSlotHtml(sl, tv, !ed.ui, ed, preview);
            } else {
                var src = ed.slotImgs[sl.id] || sl.src;
                if (src || !preview) html += slotHtml(sl, src || '', !ed.ui, preview);
            }
        });

        ed.persons.forEach(function (pr) { html += layerImg(pr, 'person', sel); });
        ed.stickers.forEach(function (st) { html += layerImg(st, 'sticker', sel); });

        p.innerHTML = html;
        p.querySelector('.p-title').textContent = ed.title;
        p.querySelector('.p-sub').textContent = ed.sub;
        return p;
    }

    var stage = $('stage');
    var wrap = $('posterWrap');

    function fit() {
        var t = getTpl(state.tpl);
        var tw = t.w || W, th = t.h || H;
        var r = stage.getBoundingClientRect();
        var s = Math.min((r.width - 70) / tw, (r.height - 90) / th);
        wrap.style.transform = 'translate(-50%,-50%) scale(' + s + ')';
        state.viewScale = s;
    }

    function renderPoster() {
        wrap.innerHTML = '';
        wrap.appendChild(buildPoster(getTpl(state.tpl), cur(), state.sel));
        fit();
    }

    function syncPosterVars() {
        var ed = cur();
        var f = FONTS[ed.font];
        var p = wrap.querySelector('.poster');
        if (!p) return;
        p.style.setProperty('--pfont', f.stack);
        p.style.setProperty('--pweight', f.w);
        p.style.setProperty('--psweight', f.sw);
        p.style.setProperty('--psize', ed.titleSize + 'px');
        p.style.setProperty('--pssize', ed.subSize + 'px');
        p.style.setProperty('--pcolor', ed.color);
        p.style.setProperty('--pscolor', hexA(ed.color, 0.62));
    }

    function buildThumbs() {
        var grid = $('tplGrid');
        if (!grid) return;
        grid.innerHTML = '';
        var list = TPLS.filter(function (t) { return (t.cat || 'mobile') === state.cat; });
        list.forEach(function (t) {
            var card = document.createElement('div');
            card.className = 'pe-tpl-card' + (t.id === state.tpl ? ' active' : '');
            card.dataset.tpl = t.id;
            var holder = document.createElement('div');
            holder.className = 'pe-thumb-scale';
            holder.style.width = (t.w || W) + 'px';
            holder.style.height = (t.h || H) + 'px';
            holder.appendChild(buildPoster(t, defaultEdit(t), null, true));
            var thumb = document.createElement('div');
            thumb.className = 'pe-thumb';
            thumb.style.aspectRatio = (t.w || W) + ' / ' + (t.h || H);
            thumb.appendChild(holder);
            card.appendChild(thumb);
            var name = document.createElement('div');
            name.className = 'pe-tpl-name';
            name.textContent = t.name;
            card.appendChild(name);
            card.addEventListener('click', function () { selectTpl(t.id); });
            grid.appendChild(card);
        });
        if (!list.length) {
            var empty = document.createElement('div');
            empty.className = 'pe-tpl-empty';
            empty.innerHTML = state.cat === 'pc'
                ? '电脑端模板即将上线<br>敬请期待'
                : '暂无模板';
            grid.appendChild(empty);
        }
        fitThumbs();
    }

    function setCat(cat) {
        if (state.cat === cat) return;
        state.cat = cat;
        $('catMobile').classList.toggle('on', cat === 'mobile');
        $('catPc').classList.toggle('on', cat === 'pc');
        buildThumbs();
    }

    function fitThumbs() {
        var thumbs = document.querySelectorAll('#tplGrid .pe-thumb');
        for (var i = 0; i < thumbs.length; i++) {
            var holder = thumbs[i].firstElementChild;
            var w = thumbs[i].clientWidth;
            var card = thumbs[i].closest('.pe-tpl-card');
            var tw = (card && getTpl(card.dataset.tpl).w) || W;
            if (holder && w) holder.style.transform = 'scale(' + (w / tw) + ')';
        }
    }

    function stkCard(s, isCustom) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'pe-stk' + (isCustom ? ' custom' : '');
        b.title = '点击添加「' + s.name + '」';
        b.innerHTML = '<img src="' + (isCustom ? s.src : s.file) + '" alt="' + esc(s.name) + '">'
            + '<div class="pe-stk-name">' + esc(s.name) + '</div>'
            + (isCustom ? '<span class="pe-stk-del" title="删除该素材">×</span>' : '');
        b.addEventListener('click', function () { addSticker(s, isCustom); });
        if (isCustom) {
            b.querySelector('.pe-stk-del').addEventListener('click', function (e) {
                e.stopPropagation();
                customStickers = customStickers.filter(function (c) { return c.id !== s.id; });
                saveCustom();
                buildStickers();
            });
        }
        return b;
    }

    function buildStickers() {
        var grid = $('stkGrid');
        grid.innerHTML = '';
        STICKERS.forEach(function (s) { grid.appendChild(stkCard(s, false)); });
        customStickers.forEach(function (s) { grid.appendChild(stkCard(s, true)); });
    }

    function selectTpl(id) {
        state.tpl = id;
        state.sel = null;
        document.querySelectorAll('.pe-tpl-card').forEach(function (c) {
            c.classList.toggle('active', c.dataset.tpl === id);
        });
        syncPanel();
        renderPoster();
    }

    function selectLayerEl(sel) {
        state.sel = sel;
        wrap.querySelectorAll('.p-layer').forEach(function (img) {
            var on = sel && img.dataset.kind === sel.kind && Number(img.dataset.lid) === sel.id;
            img.classList.toggle('sel', !!on);
        });
        syncPanel();
    }

    function syncPanel() {
        var ed = cur();
        $('inTitle').value = ed.title;
        $('inSub').value = ed.sub;
        $('selFont').value = String(ed.font);
        $('rngTitle').value = ed.titleSize;
        $('rngSub').value = ed.subSize;
        $('valTitleSize').textContent = Math.round(ed.titleSize) + 'px';
        $('valSubSize').textContent = Math.round(ed.subSize) + 'px';
        $('pickColor').value = /^#[0-9a-fA-F]{6}$/.test(ed.color) ? ed.color : '#ffffff';
        $('textSwatches').querySelectorAll('.pe-swatch').forEach(function (b) {
            b.classList.toggle('on', b.dataset.color.toLowerCase() === ed.color.toLowerCase());
        });
        if (ed.useBoard) {
            $('posterBgName').textContent = '使用模板自带背景';
        } else if (ed.posterBg) {
            $('posterBgName').textContent = '已使用整图：' + ed.posterBgName;
        } else {
            $('posterBgName').textContent = '自定义底色：' + ed.posterColor;
        }
        $('pickPosterColor').value = /^#[0-9a-fA-F]{6}$/.test(ed.posterColor) ? ed.posterColor : '#000000';
        $('posterSwatches').querySelectorAll('.pe-swatch').forEach(function (b) {
            b.classList.toggle('on', !ed.useBoard && !ed.posterBg && b.dataset.pcolor.toLowerCase() === ed.posterColor.toLowerCase());
        });
        $('chkUi').checked = ed.ui;
        $('bgName').textContent = ed.bg ? ('已使用画面：' + ed.bgName) : '未上传 · 使用 Figma 模板画面';
        var item = selLayer(ed, state.sel);
        $('elCtl').hidden = !item || !state.sel;
        if (item && state.sel) {
            $('elName').innerHTML = (state.sel.kind === 'person' ? '人物图片大小 ' : esc(item.name || '素材') + ' 大小 ')
                + '<span id="valElSize" class="pe-val">' + Math.round(item.w) + 'px</span>';
            $('rngEl').value = Math.round(item.w);
            var rot = Math.round(item.rot || 0);
            $('rngRot').value = rot;
            $('valRot').textContent = rot + '°';
            $('btnFlipH').classList.toggle('on', !!item.fliph);
            $('btnFlipV').classList.toggle('on', !!item.flipv);
        }
        buildSlotList();
    }

    function buildSlotList() {
        var tpl = getTpl(state.tpl);
        var ed = cur();
        var slots = tpl.slots || [];
        $('slotSec').hidden = slots.length === 0;
        var list = $('slotList');
        list.innerHTML = '';
        slots.forEach(function (sl) {
            if (sl.shape === 'text' || sl.shape === 'prompt') {
                var curVal = ed.slotTexts && ed.slotTexts[sl.id] != null ? ed.slotTexts[sl.id] : sl.def;
                var changed = ed.slotTexts && ed.slotTexts[sl.id] != null && ed.slotTexts[sl.id] !== sl.def;
                var trow = document.createElement('div');
                trow.className = 'pe-slot-row pe-slot-text';
                trow.dataset.slotrow = sl.id;
                var tname = document.createElement('span');
                tname.className = 'pe-slot-name';
                tname.textContent = sl.name + (changed ? ' · 已修改' : '');
                var twrap = document.createElement('div');
                twrap.className = 'pe-text-wrap';
                var ta = document.createElement('textarea');
                ta.className = 'pe-text-in';
                ta.rows = sl.shape === 'prompt' ? 5 : 2;
                ta.value = curVal;
                ta.placeholder = sl.def;
                var rst = document.createElement('button');
                rst.type = 'button';
                rst.className = 'pe-btn pe-btn-sm pe-btn-ghost pe-text-reset';
                rst.textContent = '还原默认';
                rst.style.display = changed ? '' : 'none';
                ta.addEventListener('input', function () {
                    ed.slotTexts[sl.id] = this.value;
                    var diff = this.value !== sl.def;
                    tname.textContent = sl.name + (diff ? ' · 已修改' : '');
                    rst.style.display = diff ? '' : 'none';
                    renderPoster();
                });
                rst.addEventListener('click', function () {
                    delete ed.slotTexts[sl.id];
                    renderPoster();
                    buildSlotList();
                });
                twrap.appendChild(ta);
                twrap.appendChild(rst);
                trow.appendChild(tname);
                trow.appendChild(twrap);
                list.appendChild(trow);
                if (sl.shape === 'prompt' && sl.chips) {
                    var chipBox = document.createElement('div');
                    chipBox.className = 'pe-chip-uploads';
                    sl.chips.forEach(function (c) {
                        var hasImg = !!(ed.slotImgs && ed.slotImgs[c.id]);
                        var crow = document.createElement('div');
                        crow.className = 'pe-slot-row';
                        crow.dataset.chiprow = c.id;
                        var cn = document.createElement('span');
                        cn.className = 'pe-slot-name';
                        cn.textContent = c.label + ' 头像' + (hasImg ? ' · 已替换' : '');
                        var cup = document.createElement('button');
                        cup.type = 'button';
                        cup.className = 'pe-btn pe-btn-sm';
                        cup.textContent = hasImg ? '替换' : '上传图片';
                        cup.addEventListener('click', function () {
                            $('fileSlot').dataset.slot = c.id;
                            $('fileSlot').click();
                        });
                        crow.appendChild(cn);
                        crow.appendChild(cup);
                        if (hasImg) {
                            var ccl = document.createElement('button');
                            ccl.type = 'button';
                            ccl.className = 'pe-btn pe-btn-sm pe-btn-ghost';
                            ccl.textContent = '移除';
                            ccl.addEventListener('click', function () {
                                delete ed.slotImgs[c.id];
                                renderPoster();
                                buildSlotList();
                            });
                            crow.appendChild(ccl);
                        }
                        chipBox.appendChild(crow);
                    });
                    list.appendChild(chipBox);
                }
                return;
            }
            var has = !!ed.slotImgs[sl.id];
            var row = document.createElement('div');
            row.className = 'pe-slot-row';
            row.dataset.slotrow = sl.id;
            var name = document.createElement('span');
            name.className = 'pe-slot-name';
            name.textContent = sl.name + (has ? ' · 已替换' : '');
            var up = document.createElement('button');
            up.type = 'button';
            up.className = 'pe-btn pe-btn-sm';
            up.textContent = has ? '替换' : '上传图片';
            up.addEventListener('click', function () {
                $('fileSlot').dataset.slot = sl.id;
                $('fileSlot').click();
            });
            row.appendChild(name);
            row.appendChild(up);
            if (has) {
                var clr = document.createElement('button');
                clr.type = 'button';
                clr.className = 'pe-btn pe-btn-sm pe-btn-ghost';
                clr.textContent = '移除';
                clr.addEventListener('click', function () {
                    delete ed.slotImgs[sl.id];
                    renderPoster();
                    buildSlotList();
                });
                row.appendChild(clr);
            }
            list.appendChild(row);
        });
    }

    function readImageFile(file, cb) {
        if (!file || !file.type.startsWith('image/')) return;
        var reader = new FileReader();
        reader.onload = function (e) { cb(e.target.result, file.name); };
        reader.readAsDataURL(file);
    }

    function addSticker(s, isCustom) {
        var ed = cur();
        var src = isCustom ? s.src : s.file;
        var w = isCustom ? 380 : clamp(s.w * 1.7, 200, 460);
        var jitter = (Math.random() - 0.5) * 80;
        var item = {
            id: lidSeq++, src: src, name: s.name,
            x: 642 - w / 2 + jitter,
            y: 1250 + jitter,
            w: w, rot: 0, fliph: false, flipv: false
        };
        ed.stickers.push(item);
        selectLayerEl({ kind: 'sticker', id: item.id });
        renderPoster();
    }

    function flashRow(el) {
        if (!el) return;
        var scope = el.closest('.pe-panel') || document;
        scope.querySelectorAll('.pe-flash').forEach(function (e) {
            if (e !== el) { e.classList.remove('pe-flash'); clearTimeout(e._flashTm); }
        });
        el.classList.remove('pe-flash');
        void el.offsetWidth;
        el.classList.add('pe-flash');
        clearTimeout(el._flashTm);
        el._flashTm = setTimeout(function () { el.classList.remove('pe-flash'); }, 1800);
    }

    // 右栏分页切换：main=主画面（背景/手机画面/文案/人物），ui=界面元素（小图/文字槽）
    function showPanelPage(pg) {
        document.querySelectorAll('.pe-panel .pe-ppage').forEach(function (d) {
            d.hidden = d.dataset.ppage !== pg;
        });
        $('ptabMain').classList.toggle('on', pg === 'main');
        $('ptabUi').classList.toggle('on', pg === 'ui');
        var body = document.querySelector('.pe-panel-body');
        if (body) body.scrollTop = 0;
    }

    // 点击海报上的可编辑元素 → 右侧面板自动滚动定位 + 高亮 + 聚焦
    function focusPanel(kind, id) {
        showPanelPage(kind === 'slot' || kind === 'chip' ? 'ui' : 'main');
        var row = null, focusEl = null;
        if (kind === 'title') { row = $('inTitle'); focusEl = $('inTitle'); }
        else if (kind === 'sub') { row = $('inSub'); focusEl = $('inSub'); }
        else if (kind === 'media') { row = $('btnBg').closest('.pe-sec'); focusEl = $('btnBg'); }
        else if (kind === 'board') { row = $('btnPosterBg').closest('.pe-sec'); focusEl = $('btnPosterBg'); }
        else if (kind === 'chip') {
            row = document.querySelector('#slotList [data-chiprow="' + id + '"]');
            if (row) focusEl = row.querySelector('button');
        } else if (kind === 'slot') {
            row = document.querySelector('#slotList [data-slotrow="' + id + '"]');
            if (row) focusEl = row.querySelector('textarea') || row.querySelector('button');
        }
        if (!row) return;
        var sec = row.closest('.pe-sec');
        if (sec && sec.hidden) sec.hidden = false;
        try { row.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        catch (e) { row.scrollIntoView(); }
        flashRow(kind === 'title' || kind === 'sub' ? row : (row.closest('.pe-slot-row') || row));
        if (focusEl) setTimeout(function () { try { focusEl.focus({ preventScroll: true }); } catch (e) { focusEl.focus(); } }, 380);
    }

    function bindStage() {
        wrap.addEventListener('pointerdown', function (e) {
            var img = e.target.closest('.p-layer');
            if (!img) { selectLayerEl(null); return; }
            e.preventDefault();
            var kind = img.dataset.kind;
            var id = Number(img.dataset.lid);
            selectLayerEl({ kind: kind, id: id });
            var ed = cur();
            var item = selLayer(ed, state.sel);
            if (!item) return;
            var sx = e.clientX, sy = e.clientY, ox = item.x, oy = item.y;
            var moved = false;
            function move(ev) {
                if (Math.abs(ev.clientX - sx) > 6 || Math.abs(ev.clientY - sy) > 6) moved = true;
                item.x = ox + (ev.clientX - sx) / state.viewScale;
                item.y = oy + (ev.clientY - sy) / state.viewScale;
                img.style.left = item.x + 'px';
                img.style.top = item.y + 'px';
            }
            function up() {
                window.removeEventListener('pointermove', move);
                if (!moved) {
                    var ctl = $('elCtl');
                    if (ctl && !ctl.hidden) {
                        showPanelPage('main');
                        try { ctl.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e2) { ctl.scrollIntoView(); }
                        flashRow(ctl);
                    }
                }
            }
            window.addEventListener('pointermove', move);
            window.addEventListener('pointerup', up, { once: true });
        });

        stage.addEventListener('wheel', function (e) {
            if (!state.sel) return;
            e.preventDefault();
            var ed = cur();
            var item = selLayer(ed, state.sel);
            if (!item) return;
            item.w = clamp(item.w * (e.deltaY < 0 ? 1.06 : 0.94), 80, 1200);
            var el = wrap.querySelector('.p-layer[data-kind="' + state.sel.kind + '"][data-lid="' + state.sel.id + '"]');
            if (el) el.style.width = item.w + 'px';
            $('rngEl').value = Math.round(item.w);
            var v = $('valElSize');
            if (v) v.textContent = Math.round(item.w) + 'px';
        }, { passive: false });

        wrap.addEventListener('click', function (e) {
            if (e.target.closest('.p-layer')) return;
            var chip = e.target.closest('[data-chip]');
            if (chip) { focusPanel('chip', chip.dataset.chip); return; }
            var slEl = e.target.closest('[data-slot]');
            if (slEl) { focusPanel('slot', slEl.dataset.slot); return; }
            var edEl = e.target.closest('[data-edit]');
            if (edEl) { focusPanel(edEl.dataset.edit); }
        });
    }

    function bindPanel() {
        $('inTitle').addEventListener('input', function () {
            cur().title = this.value;
            var el = wrap.querySelector('.p-title');
            if (el) el.textContent = this.value;
        });
        $('inSub').addEventListener('input', function () {
            cur().sub = this.value;
            var el = wrap.querySelector('.p-sub');
            if (el) el.textContent = this.value;
        });
        $('selFont').addEventListener('change', function () {
            cur().font = Number(this.value);
            syncPosterVars();
        });
        $('rngTitle').addEventListener('input', function () {
            cur().titleSize = Number(this.value);
            $('valTitleSize').textContent = this.value + 'px';
            syncPosterVars();
        });
        $('rngSub').addEventListener('input', function () {
            cur().subSize = Number(this.value);
            $('valSubSize').textContent = this.value + 'px';
            syncPosterVars();
        });
        $('pickColor').addEventListener('input', function () {
            cur().color = this.value;
            $('textSwatches').querySelectorAll('.pe-swatch').forEach(function (b) { b.classList.remove('on'); });
            syncPosterVars();
        });
        $('textSwatches').querySelectorAll('.pe-swatch').forEach(function (b) {
            b.addEventListener('click', function () {
                cur().color = b.dataset.color;
                syncPanel();
                syncPosterVars();
            });
        });

        $('btnPosterBg').addEventListener('click', function () { $('filePosterBg').click(); });
        $('filePosterBg').addEventListener('change', function (e) {
            var file = e.target.files[0];
            readImageFile(file, function (url, name) {
                var ed = cur();
                ed.useBoard = false;
                ed.posterBg = url;
                ed.posterBgName = name;
                renderPoster();
                syncPanel();
            });
            e.target.value = '';
        });
        $('btnBoardReset').addEventListener('click', function () {
            var ed = cur();
            ed.useBoard = true;
            renderPoster();
            syncPanel();
        });
        $('pickPosterColor').addEventListener('input', function () {
            var ed = cur();
            ed.useBoard = false;
            ed.posterColor = this.value;
            ed.posterBg = null; ed.posterBgName = '';
            renderPoster();
            syncPanel();
        });
        $('posterSwatches').querySelectorAll('.pe-swatch').forEach(function (b) {
            b.addEventListener('click', function () {
                var ed = cur();
                ed.useBoard = false;
                ed.posterColor = b.dataset.pcolor;
                ed.posterBg = null; ed.posterBgName = '';
                renderPoster();
                syncPanel();
            });
        });
        $('chkUi').addEventListener('change', function () {
            var on = this.checked;
            cur().ui = on;
            wrap.querySelectorAll('.p-chrome').forEach(function (n) {
                n.classList.toggle('off', !on);
            });
        });

        $('btnBg').addEventListener('click', function () { $('fileBg').click(); });
        $('fileBg').addEventListener('change', function (e) {
            var file = e.target.files[0];
            readImageFile(file, function (url, name) {
                var ed = cur();
                ed.bg = url;
                ed.bgName = name;
                renderPoster();
                syncPanel();
            });
            e.target.value = '';
        });
        $('btnBgClear').addEventListener('click', function () {
            var ed = cur();
            ed.bg = null; ed.bgName = '';
            renderPoster();
            syncPanel();
        });

        $('fileSlot').addEventListener('change', function (e) {
            var file = e.target.files[0];
            var sid = e.target.dataset.slot;
            readImageFile(file, function (url) {
                cur().slotImgs[sid] = url;
                renderPoster();
                buildSlotList();
            });
            e.target.value = '';
        });

        $('btnPerson').addEventListener('click', function () { $('filePerson').click(); });
        $('filePerson').addEventListener('change', function (e) {
            var file = e.target.files[0];
            readImageFile(file, function (url) {
                var ed = cur();
                var w = 560;
                var item = { id: lidSeq++, src: url, name: '人物图片', x: 642 - w / 2, y: 900, w: w, rot: 0, fliph: false, flipv: false };
                ed.persons.push(item);
                selectLayerEl({ kind: 'person', id: item.id });
                renderPoster();
            });
            e.target.value = '';
        });

        $('btnStkUpload').addEventListener('click', function () { $('fileSticker').click(); });
        $('fileSticker').addEventListener('change', function (e) {
            var files = Array.prototype.slice.call(e.target.files || []).filter(function (f) {
                return f.type.startsWith('image/');
            });
            e.target.value = '';
            if (!files.length) return;
            var done = 0, okAll = true, failAll = 0;
            files.forEach(function (file) {
                readImageFile(file, function (url) {
                    var img = new Image();
                    img.onload = function () {
                        var item = {
                            id: 'c' + (cidSeq++),
                            name: file.name.replace(/\.[^.]+$/, '').slice(0, 12) || '我的素材',
                            src: url,
                            w: img.naturalWidth || 300,
                            h: img.naturalHeight || 300,
                            custom: true
                        };
                        customStickers.push(item);
                        if (!saveCustom()) okAll = false;
                        buildStickers();
                        finish();
                    };
                    img.onerror = function () { failAll++; finish(); };
                    img.src = url;
                });
            });
            function finish() {
                done++;
                if (done < files.length) return;
                if (failAll === files.length) {
                    studioToast('图片读取失败，请换用 PNG / JPG 图片后重试', true);
                } else if (!okAll) {
                    studioToast('浏览器本地存储空间已满，素材本次可用，刷新后需重新上传', true);
                } else {
                    studioToast('已上传 ' + (files.length - failAll) + ' 个素材，点击素材即可添加到海报');
                }
            }
        });

        $('rngEl').addEventListener('input', function () {
            var ed = cur();
            var item = selLayer(ed, state.sel);
            if (!item) return;
            item.w = Number(this.value);
            var v = $('valElSize');
            if (v) v.textContent = this.value + 'px';
            var el = selLayerDom();
            if (el) el.style.width = item.w + 'px';
        });

        function normRot(r) { return ((Math.round(r) + 540) % 360) - 180; }
        function applyTf(item) {
            var el = selLayerDom();
            if (el) el.style.transform = layerTransform(item);
        }
        function syncTfPanel(item) {
            var rot = Math.round(item.rot || 0);
            $('rngRot').value = rot;
            $('valRot').textContent = rot + '°';
            $('btnFlipH').classList.toggle('on', !!item.fliph);
            $('btnFlipV').classList.toggle('on', !!item.flipv);
        }
        $('rngRot').addEventListener('input', function () {
            var item = selLayer(cur(), state.sel);
            if (!item) return;
            item.rot = Number(this.value);
            $('valRot').textContent = this.value + '°';
            applyTf(item);
        });
        $('btnRotL').addEventListener('click', function () {
            var item = selLayer(cur(), state.sel);
            if (!item) return;
            item.rot = normRot((item.rot || 0) - 90);
            applyTf(item); syncTfPanel(item);
        });
        $('btnRotR').addEventListener('click', function () {
            var item = selLayer(cur(), state.sel);
            if (!item) return;
            item.rot = normRot((item.rot || 0) + 90);
            applyTf(item); syncTfPanel(item);
        });
        $('btnFlipH').addEventListener('click', function () {
            var item = selLayer(cur(), state.sel);
            if (!item) return;
            item.fliph = !item.fliph;
            applyTf(item); syncTfPanel(item);
        });
        $('btnFlipV').addEventListener('click', function () {
            var item = selLayer(cur(), state.sel);
            if (!item) return;
            item.flipv = !item.flipv;
            applyTf(item); syncTfPanel(item);
        });
        $('btnElResetTf').addEventListener('click', function () {
            var item = selLayer(cur(), state.sel);
            if (!item) return;
            item.rot = 0; item.fliph = false; item.flipv = false;
            applyTf(item); syncTfPanel(item);
        });
        $('btnElDel').addEventListener('click', function () {
            var ed = cur();
            if (!state.sel) return;
            if (state.sel.kind === 'person') {
                ed.persons = ed.persons.filter(function (p) { return p.id !== state.sel.id; });
            } else {
                ed.stickers = ed.stickers.filter(function (p) { return p.id !== state.sel.id; });
            }
            state.sel = null;
            renderPoster();
            syncPanel();
        });

        $('tabTpl').addEventListener('click', function () {
            this.classList.add('on');
            $('tabStk').classList.remove('on');
            $('tplRail').hidden = false;
            $('stkRail').hidden = true;
            requestAnimationFrame(fitThumbs);
        });
        $('tabStk').addEventListener('click', function () {
            this.classList.add('on');
            $('tabTpl').classList.remove('on');
            $('stkRail').hidden = false;
            $('tplRail').hidden = true;
        });

        $('ptabMain').addEventListener('click', function () { showPanelPage('main'); });
        $('ptabUi').addEventListener('click', function () { showPanelPage('ui'); });

        $('catMobile').addEventListener('click', function () { setCat('mobile'); });
        $('catPc').addEventListener('click', function () { setCat('pc'); });

        $('btnReset').addEventListener('click', function () {
            edits[state.tpl] = defaultEdit(getTpl(state.tpl));
            state.sel = null;
            syncPanel();
            renderPoster();
        });

        $('btnExport').addEventListener('click', exportPNG);
    }

    function waitImages(node) {
        var imgs = Array.prototype.slice.call(node.querySelectorAll('img'));
        return Promise.all(imgs.map(function (img) {
            if (img.complete && img.naturalWidth > 0) return Promise.resolve();
            return new Promise(function (resolve) {
                img.onload = resolve;
                img.onerror = resolve;
            });
        }));
    }

    function exportPNG() {
        if (typeof html2canvas === 'undefined') {
            alert('导出组件未加载成功，请检查网络后刷新页面。');
            return;
        }
        var btn = $('btnExport');
        var tpl = getTpl(state.tpl);
        var tw = tpl.w || W, th = tpl.h || H;
        btn.textContent = '导出中…';
        var host = $('exportHost');
        document.fonts.ready.then(function () {
            var node = wrap.querySelector('.poster').cloneNode(true);
            host.innerHTML = '';
            host.appendChild(node);
            return waitImages(node).then(function () {
                return html2canvas(node, {
                    scale: 1,
                    backgroundColor: '#000000',
                    useCORS: true,
                    logging: false,
                    width: tw,
                    height: th
                });
            });
        }).then(function (canvas) {
            var a = document.createElement('a');
            a.download = 'appstore-' + tpl.name + '-' + tw + 'x' + th + '.png';
            a.href = canvas.toDataURL('image/png');
            document.body.appendChild(a);
            a.click();
            a.remove();
            host.innerHTML = '';
            btn.textContent = '导出 PNG · ' + tw + '×' + th;
        }).catch(function (err) {
            host.innerHTML = '';
            btn.textContent = '导出 PNG · ' + tw + '×' + th;
            alert('导出失败：' + (err && err.message ? err.message : err));
        });
    }

    function init() {
        var tp = new URLSearchParams(location.search).get('tpl');
        if (tp && TPLS.some(function (t) { return t.id === tp; })) state.tpl = tp;
        var sel = $('selFont');
        FONTS.forEach(function (f, i) {
            var o = document.createElement('option');
            o.value = String(i);
            o.textContent = f.name;
            o.style.fontFamily = f.stack;
            sel.appendChild(o);
        });
        buildThumbs();
        buildStickers();
        bindStage();
        bindPanel();
        syncPanel();
        renderPoster();
        window.addEventListener('resize', fit);
        window.addEventListener('resize', fitThumbs);
        requestAnimationFrame(fitThumbs);
    }

    window.PosterStudio = {
        W: W, H: H,
        addTemplate: function (tpl) {
            tpl.titleFs = tpl.titleFs || 116;
            tpl.subFs = tpl.subFs || 62;
            tpl.nodes = tpl.nodes || [];
            tpl.slots = tpl.slots || [];
            tpl.w = tpl.w || W;
            tpl.h = tpl.h || H;
            tpl.cat = tpl.cat || (tpl.h >= tpl.w ? 'mobile' : 'pc');
            TPLS.push(tpl);
            edits[tpl.id] = defaultEdit(tpl);
            setCat(tpl.cat);
            buildThumbs();
            selectTpl(tpl.id);
        }
    };

    init();
})();
