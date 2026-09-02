(function () {
    var PS = window.PosterStudio;
    if (!PS) { console.error('PosterStudio 未就绪'); return; }
    var W = PS.W, H = PS.H;

    function $(id) { return document.getElementById(id); }

    function withTimeout(p, ms, label) {
        return Promise.race([
            Promise.resolve(p).catch(function (e) { throw e; }),
            new Promise(function (_, rej) { setTimeout(function () { rej(new Error(label || '处理超时')); }, ms); })
        ]);
    }
    function loadImg(src, ms) {
        return new Promise(function (res, rej) {
            var im = new Image();
            var to = setTimeout(function () { rej(new Error('图片加载超时')); }, ms || 10000);
            im.onload = function () { clearTimeout(to); res(im); };
            im.onerror = function () { clearTimeout(to); rej(new Error('图片加载失败')); };
            im.src = src;
        });
    }
    function fitBox(sw, sh) {
        var k = Math.min(W / sw, H / sh);
        var cw = sw * k, ch = sh * k;
        return { k: k, ox: Math.round((W - cw) / 2), oy: Math.round((H - ch) / 2), cw: Math.round(cw), ch: Math.round(ch) };
    }
    function rgb(c) {
        if (!c) return null;
        if (typeof c === 'string' && c.indexOf('rgb') === 0) return c;
        if (typeof c === 'object' && 'r' in c) return 'rgb(' + Math.round(c.r) + ',' + Math.round(c.g) + ',' + Math.round(c.b) + ')';
        return null;
    }
    function canvasToURL(cv) {
        try { return cv.toDataURL('image/png'); } catch (e) { return null; }
    }
    function hrefOf(el) {
        return el.getAttribute('href') || el.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || '';
    }

    /* ================= SVG ================= */
    function parseSVG(text, fileName) {
        var doc = new DOMParser().parseFromString(text, 'image/svg+xml');
        if (doc.querySelector('parsererror')) throw new Error('SVG 解析失败，文件可能已损坏');
        var svg = doc.querySelector('svg');
        if (!svg) throw new Error('文件里没找到 <svg> 根节点');

        var vb = (svg.getAttribute('viewBox') || '').split(/[\s,]+/).map(Number);
        var sw = (vb.length === 4 && vb[2] > 0) ? vb[2] : (parseFloat(svg.getAttribute('width')) || W);
        var sh = (vb.length === 4 && vb[3] > 0) ? vb[3] : (parseFloat(svg.getAttribute('height')) || H);
        var box = fitBox(sw, sh);

        var probe = svg.cloneNode(true);
        probe.setAttribute('width', sw + 'px');
        probe.setAttribute('height', sh + 'px');
        probe.style.cssText = 'position:fixed;left:-99999px;top:0;visibility:hidden;';
        probe.removeAttribute('viewBox');
        document.body.appendChild(probe);

        var slots = [];
        var tN = 0, iN = 0, extImg = 0;
        try {
            var sr = probe.getBoundingClientRect();

            Array.prototype.slice.call(probe.querySelectorAll('text')).forEach(function (t) {
                var content = textOf(t);
                if (!content) return;
                var r = t.getBoundingClientRect();
                var cs = getComputedStyle(t);
                var x = r.left - sr.left, y = r.top - sr.top;
                var w = r.width, h = r.height;
                if (w < 2 || h < 2) return;
                var sz = parseFloat(cs.fontSize) || 24;
                var lines = content.split('\n').length;
                var anchor = (t.getAttribute('text-anchor') || cs.textAnchor || 'start');
                var align = anchor === 'middle' ? 'center' : (anchor === 'end' ? 'right' : 'left');
                var ls = 0;
                var lsv = cs.letterSpacing;
                if (lsv && lsv !== 'normal') ls = parseFloat(lsv) || 0;
                tN++;
                slots.push({
                    id: 'itxt' + tN, name: '文字 ' + tN, shape: 'text',
                    x: Math.round(box.ox + x * box.k),
                    y: Math.round(box.oy + y * box.k),
                    w: Math.round(w * box.k) + 4,
                    h: Math.round(Math.max(h, sz * 1.25 * lines) * box.k),
                    sz: Math.round(sz * box.k * 10) / 10,
                    lh: Math.round(sz * 1.3 * box.k * 10) / 10,
                    ls: ls ? Math.round(ls * box.k * 100) / 100 : 0,
                    align: align,
                    color: rgb(cs.fill) || '#ffffff',
                    weight: parseInt(cs.fontWeight, 10) || 400,
                    def: content,
                    nowrap: lines === 1
                });
            });

            Array.prototype.slice.call(probe.querySelectorAll('image')).forEach(function (im) {
                var href = hrefOf(im);
                if (!href) return;
                var r = im.getBoundingClientRect();
                var w = r.width, h = r.height;
                if (w < 2 || h < 2) return;
                var isData = href.indexOf('data:') === 0;
                if (!isData) extImg++;
                iN++;
                slots.push({
                    id: 'iimg' + iN, name: '图片 ' + iN, shape: 'thumb',
                    x: Math.round(box.ox + (r.left - sr.left) * box.k),
                    y: Math.round(box.oy + (r.top - sr.top) * box.k),
                    w: Math.round(w * box.k),
                    h: Math.round(h * box.k),
                    r: 0,
                    src: isData ? href : null
                });
            });
        } finally {
            document.body.removeChild(probe);
        }

        var bg = svg.cloneNode(true);
        sanitizeBg(bg);
        bg.querySelectorAll('text').forEach(function (t) { t.parentNode && t.parentNode.removeChild(t); });

        return withTimeout(rasterize(bg, box, sw, sh), 20000, '背景渲染超时').then(function (boardURL) {
            var warns = [];
            if (tN === 0) warns.push('未检测到可编辑文字（SVG 文字可能已转曲成路径）');
            if (extImg > 0) warns.push(extImg + ' 张外链图片无法自动带出，已留空槽位可点「上传图片」替换');
            return { slots: slots, board: boardURL, warns: warns, noText: tN === 0 };
        });
    }

    function textOf(t) {
        var tspans = Array.prototype.slice.call(t.querySelectorAll('tspan'));
        if (!tspans.length) return (t.textContent || '').trim();
        var multi = tspans.length > 1 && tspans.some(function (ts) { return ts.hasAttribute('x') || /\d+(\.\d+)?em/.test(ts.getAttribute('dy') || ''); });
        if (multi) {
            return tspans.map(function (ts) { return (ts.textContent || '').replace(/\s+$/g, ''); })
                .filter(function (s) { return s.length; }).join('\n').trim();
        }
        return (t.textContent || '').trim();
    }

    // 栅格化前剔除一切会让画布污染或加载挂起的外部/不安全元素
    function sanitizeBg(root) {
        root.querySelectorAll('script,foreignObject,link').forEach(function (el) { el.parentNode && el.parentNode.removeChild(el); });
        root.querySelectorAll('use').forEach(function (u) {
            var h = hrefOf(u);
            if (h && !/^data:/.test(h) && h.charAt(0) !== '#') u.parentNode && u.parentNode.removeChild(u);
        });
        root.querySelectorAll('image').forEach(function (im) {
            var h = hrefOf(im);
            if (!h || h.indexOf('data:') !== 0) im.parentNode && im.parentNode.removeChild(im);
        });
        root.querySelectorAll('style').forEach(function (st) {
            var t = st.textContent || '';
            t = t.replace(/@import[^;]+;/gi, '').replace(/url\(\s*['"]?https?:[^)]+\)/gi, 'none');
            st.textContent = t;
        });
    }

    function sampleBgColor(svgEl) {
        var rects = svgEl.querySelectorAll('rect');
        for (var i = 0; i < rects.length; i++) {
            var f = rects[i].getAttribute('fill');
            if (f && /^(#|rgb)/.test(f)) return f;
        }
        return '#0e0e10';
    }
    function fallbackBoard(svgEl) {
        var col = svgEl ? sampleBgColor(svgEl) : '#0e0e10';
        var cv = document.createElement('canvas');
        cv.width = W; cv.height = H;
        var c = cv.getContext('2d');
        c.fillStyle = col; c.fillRect(0, 0, W, H);
        return canvasToURL(cv);
    }

    function rasterize(svgEl, box, sw, sh) {
        svgEl.setAttribute('width', sw + 'px');
        svgEl.setAttribute('height', sh + 'px');
        var str = new XMLSerializer().serializeToString(svgEl);
        if (!/xmlns=/.test(str)) str = str.replace(/<svg/i, '<svg xmlns="http://www.w3.org/2000/svg"');
        var url = null;
        try {
            var blob = new Blob([str], { type: 'image/svg+xml;charset=utf-8' });
            url = URL.createObjectURL(blob);
        } catch (e) { return Promise.resolve(fallbackBoard(svgEl)); }

        return loadImg(url, 10000).then(function (im) {
            var cv = document.createElement('canvas');
            cv.width = W; cv.height = H;
            cv.getContext('2d').drawImage(im, box.ox, box.oy, box.cw, box.ch);
            URL.revokeObjectURL(url);
            return canvasToURL(cv) || fallbackBoard(svgEl);
        }).catch(function () {
            try { URL.revokeObjectURL(url); } catch (e) {}
            return fallbackBoard(svgEl);
        });
    }

    /* ================= PSD ================= */
    var agPsdPromise = null;
    function loadAgPsd() {
        if (window.agPsd) return Promise.resolve(window.agPsd);
        if (agPsdPromise) return agPsdPromise;
        agPsdPromise = new Promise(function (res, rej) {
            var s = document.createElement('script');
            s.src = 'vendor/ag-psd.bundle.js';
            s.onload = function () {
                var ap = window.agPsd;
                if (!ap) return rej(new Error('PSD 解析库加载异常'));
                try {
                    if (ap.initializeCanvas) ap.initializeCanvas(function (w, h) {
                        var c = document.createElement('canvas');
                        c.width = w; c.height = h;
                        return c;
                    });
                } catch (e) {}
                res(ap);
            };
            s.onerror = function () { rej(new Error('PSD 解析库加载失败')); };
            document.head.appendChild(s);
        });
        return agPsdPromise;
    }

    function parsePSD(buffer, fileName) {
        return withTimeout(loadAgPsd(), 15000, 'PSD 解析库加载超时').then(function (agPsd) {
            var psd;
            try {
                psd = agPsd.readPsd(buffer, { throwForMissingFeatures: false });
            } catch (e) {
                throw new Error('PSD 读取失败：' + (e.message || e));
            }
            var pw = psd.width || (psd.canvas && psd.canvas.width) || W;
            var ph = psd.height || (psd.canvas && psd.canvas.height) || H;
            var box = fitBox(pw, ph);

            var native = document.createElement('canvas');
            native.width = pw; native.height = ph;
            var nctx = native.getContext('2d');
            var slots = [];
            var tN = 0, iN = 0;
            var hasLayerCanvases = false;

            function walk(layers) {
                (layers || []).forEach(function (L) {
                    if (L.hidden) return;
                    if (L.text && L.text.text != null) {
                        var raw = String(L.text.text).replace(/\r/g, '\n').replace(/\n+$/, '');
                        var content = raw.trim();
                        if (content) {
                            var st = L.text.style || {};
                            var tr = L.text.transform || {};
                            var sz = Math.abs(tr.xx) || st.fontSize || ((L.bottom - L.top) / Math.max(1, content.split('\n').length));
                            var col = rgb(st.fillColor) || '#ffffff';
                            var just = (L.text.paragraphStyle && L.text.paragraphStyle.justification) || 0;
                            var align = just === 2 ? 'center' : (just === 1 ? 'right' : 'left');
                            tN++;
                            slots.push({
                                id: 'ptxt' + tN, name: '文字 ' + tN, shape: 'text',
                                x: Math.round(box.ox + L.left * box.k),
                                y: Math.round(box.oy + L.top * box.k),
                                w: Math.round((L.right - L.left) * box.k) + 4,
                                h: Math.round((L.bottom - L.top) * box.k),
                                sz: Math.round(sz * box.k * 10) / 10,
                                lh: Math.round(sz * 1.3 * box.k * 10) / 10,
                                ls: 0, align: align, color: col,
                                weight: 400,
                                def: content,
                                nowrap: content.indexOf('\n') < 0
                            });
                        }
                        return;
                    }
                    if (L.canvas && L.canvas.width > 2 && L.canvas.height > 2) {
                        hasLayerCanvases = true;
                        nctx.drawImage(L.canvas, L.left, L.top);
                        iN++;
                        slots.push({
                            id: 'pimg' + iN, name: '图片 ' + iN, shape: 'thumb',
                            x: Math.round(box.ox + L.left * box.k),
                            y: Math.round(box.oy + L.top * box.k),
                            w: Math.round((L.right - L.left) * box.k),
                            h: Math.round((L.bottom - L.top) * box.k),
                            r: 0,
                            src: canvasToURL(L.canvas)
                        });
                    }
                    if (L.children) walk(L.children);
                });
            }
            walk(psd.children);

            var boardCV = document.createElement('canvas');
            boardCV.width = W; boardCV.height = H;
            var bctx = boardCV.getContext('2d');
            var boardURL = null;
            if (hasLayerCanvases) {
                bctx.drawImage(native, box.ox, box.oy, box.cw, box.ch);
                boardURL = canvasToURL(boardCV);
            } else if (psd.canvas) {
                bctx.drawImage(psd.canvas, box.ox, box.oy, box.cw, box.ch);
                boardURL = canvasToURL(boardCV);
            }
            if (!boardURL) {
                bctx.fillStyle = '#0e0e10'; bctx.fillRect(0, 0, W, H);
                boardURL = canvasToURL(boardCV);
            }
            return {
                slots: slots, board: boardURL,
                flattened: !hasLayerCanvases && tN === 0,
                noText: tN === 0,
                warns: tN === 0 ? ['未检测到可编辑文字（PSD 文字图层可能已栅格化/合层）'] : []
            };
        });
    }

    /* ================= 入口 ================= */
    function baseName(f) { return (f.name || '自定义').replace(/\.[^.]+$/, '').slice(0, 12) || '自定义'; }
    function setBtn(txt, disabled) {
        var b = $('btnImport');
        if (b) { b.textContent = txt; b.disabled = !!disabled; }
    }
    function toast(msg, isErr) {
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
        }, 5200);
    }

    function register(result, file) {
        if (!result.board) throw new Error('背景生成失败');
        PS.addTemplate({
            id: 'custom-' + Date.now(),
            name: baseName(file),
            title: '', sub: '',
            board: result.board,
            titleBox: { x: 0, y: -9999, w: 1, h: 1 },
            subBox: { x: 0, y: -9999, w: 1, h: 1 },
            nodes: [],
            slots: result.slots
        });
        var nTxt = result.slots.filter(function (s) { return s.shape === 'text'; }).length;
        var nImg = result.slots.filter(function (s) { return s.shape !== 'text'; }).length;
        var msg = '已生成可编辑模板「' + baseName(file) + '」：\n'
            + nTxt + ' 处文字可编辑、' + nImg + ' 张图片可替换。';
        if (result.warns && result.warns.length) msg += '\n\n提示：\n· ' + result.warns.join('\n· ');
        setTimeout(function () { toast(msg, false); }, 250);
    }

    function handle(file) {
        if (!file) return;
        var name = file.name.toLowerCase();
        var isPSD = /\.psd$/.test(name);
        setBtn('解析中…', true);
        var done = function () { setBtn('＋ 导入 SVG / PSD', false); };

        var work;
        if (isPSD) {
            work = file.arrayBuffer()
                .then(function (buf) { return withTimeout(parsePSD(buf, file), 60000, 'PSD 解析超时（文件可能过大）'); });
        } else {
            work = new Promise(function (res, rej) {
                var rd = new FileReader();
                rd.onload = function () {
                    try { withTimeout(parseSVG(String(rd.result), file), 30000, 'SVG 解析超时').then(res, rej); }
                    catch (e) { rej(e); }
                };
                rd.onerror = function () { rej(new Error('文件读取失败')); };
                rd.readAsText(file);
            });
        }
        work.then(function (r) { register(r, file); })
            .catch(function (e) {
                console.error('[poster-import]', e);
                toast('导入失败：' + (e && e.message ? e.message : e)
                    + '\n若为 SVG，请确认文字未转曲；若为 PSD，请确认未在其他软件里合层。', true);
            })
            .then(done, done);
    }

    document.addEventListener('DOMContentLoaded', function () {
        var btn = $('btnImport'), inp = $('fileImport');
        if (!btn || !inp) return;
        btn.addEventListener('click', function () { inp.click(); });
        inp.addEventListener('change', function () {
            handle(inp.files && inp.files[0]);
            inp.value = '';
        });
    });
})();
