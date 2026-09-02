/* ============================================================
   JOB BOARD — 视觉设计师招聘看板
   Vanilla JS · localStorage 状态持久化 · Brutalist UI
   ============================================================ */

const COMPANIES = {
    xhs:      { name: '小红书',        en: 'RED' },
    tme:      { name: '腾讯音乐',      en: 'TME' },
    tencent:  { name: '腾讯',          en: 'TENCENT' },
    alibaba:  { name: '阿里巴巴',      en: 'ALIBABA' },
    ant:      { name: '蚂蚁集团',      en: 'ANT' }
};

const TAGS = {
    brand:        '品牌 BRAND',
    aigc:         'AIGC',
    product:      '产品 UI/UX',
    game:         '游戏 GAME',
    marketing:    '宣发 KV',
    illustration: '插画 ILLUS',
    motion:       '动效 MOTION'
};

const JOBS = [
    /* ---------- 小红书 ---------- */
    {
        id: 'xhs-brand', company: 'xhs',
        title: '视觉设计师（品牌）',
        location: '上海', team: 'REDesign 视觉设计部', exp: '', salary: '',
        date: '2026-08-28', tags: ['brand', 'aigc'], source: 'official',
        url: 'https://job.xiaohongshu.com/social/position/20446',
        desc: '隶属于小红书视觉设计部 REDesign，负责品牌、运营等相关视觉创意设计工作，涵盖品牌传播、项目及线上线下活动设计。\n1. 从业务与用户视角出发，产出贴合平台调性、用户喜爱的创意视觉；\n2. 与产品、运营、研发团队协作，推动设计从概念到落地的完整实现；\n3. 持续关注设计趋势与新技术（AIGC、Prompt 工作流、Agent 等），推动设计效率与创意上限的提升。'
    },
    {
        id: 'xhs-community', company: 'xhs',
        title: '视觉设计师（社区）',
        location: '上海', team: '社区', exp: '', salary: '',
        date: '2026-08-28', tags: ['brand'], source: 'official',
        url: 'https://job.xiaohongshu.com/social/position/15751',
        desc: '1. 负责小红书社区内容及公司品牌运营设计相关视觉需求，包括社区内容主视觉及页面设计、品牌合作线下空间及周边衍生品物料设计；\n2. 参与各类型项目创意提案，能够驾驭多种设计风格，审美好，对年轻和潮流的设计趋势有自己的思考和实践；\n3. 可独立作战和带领项目设计团队协同完成工作，有优秀的视觉表现能力和品牌思维。'
    },
    {
        id: 'xhs-fproject', company: 'xhs',
        title: '视觉设计师（F项目）',
        location: '上海', team: 'UED 体验设计团队', exp: '', salary: '',
        date: '2026-08-28', tags: ['product', 'motion', 'brand'], source: 'official',
        url: 'https://job.xiaohongshu.com/social/position/21863',
        desc: '小红书 UED 体验设计团队，与产品团队并肩，把想法落地为用户真正喜爱的产品。\n1. 负责项目核心视觉与体验内容的创意、设计及交付，支持产品日常版本、活动及游戏化场景体验落地；\n2. 负责项目所需动态视觉与动画内容的设计、制作及输出。'
    },
    {
        id: 'xhs-ai', company: 'xhs',
        title: 'AI视觉设计师（发布创意方向）',
        location: '北京 / 深圳', team: '发布工具', exp: '', salary: '',
        date: '2026-08-28', tags: ['aigc', 'product'], source: 'official',
        url: 'https://job.xiaohongshu.com/social/position/14545',
        desc: '1. 负责发布工具内的效果设计，包括 AI P 图玩法、图文模版、文字排版卡片等，产出贴合平台调性、用户喜爱的创意效果；\n2. 支持 AI 在各业务场景下的落地应用，包括 AI 模型图文方向的设计训练与调优、设计素材工作流搭建、Prompt 词调试、插画 Lora 训练等；\n3. 与产品、运营、研发团队协作，输出有效的设计分析与专业判断，支持功能效果持续迭代。'
    },
    {
        id: 'xhs-lifestyle', company: 'xhs',
        title: '视觉设计师（生活方式产品）',
        location: '上海', team: '生活方式产品', exp: '', salary: '',
        date: '2026-08-28', tags: ['brand', 'product'], source: 'official',
        url: 'https://job.xiaohongshu.com/social/position/16810',
        desc: '1. 整合当下流行趋势、市场信息，根据品牌风格和产品定位输出产品设计概念；\n2. 配合设计排期和上新节点，独立完成生活方式类产品设计、产品包装等工作；\n3. 配合开发同事与工厂沟通打样，把控样品准确度与开发进度；跟进商品销售反馈并持续改进。'
    },

    /* ---------- 腾讯音乐 ---------- */
    {
        id: 'tme-joox', company: 'tme',
        title: 'JOOX 平台视觉设计',
        location: '深圳', team: 'QQ音乐 / JOOX 海外', exp: '', salary: '',
        date: '2026-08-28', tags: ['product', 'brand'], source: 'official',
        url: 'https://join.tencentmusic.com/social/post-details?id=15010',
        desc: '1. 主视觉系统构建：负责国际音乐产品 JOOX App 端的视觉风格定义与界面设计，包括播放器、歌词页、音乐发现页等关键听歌场景，用视觉语言打动不同文化背景的用户；\n2. 本地化设计策略：结合东南亚各国（印尼、泰国、马来西亚等）的文化审美与用户习惯，输出符合当地市场的创意设计方案；\n3. 品牌体验统一：协同产品、运营、市场团队，确保从线上到线下的视觉输出保持一致。'
    },
    {
        id: 'tme-employer-brand', company: 'tme',
        title: 'HR交付运营 - 雇主品牌视觉设计（腾音）',
        location: '深圳', team: '子公司', exp: '', salary: '',
        date: '2026-08-28', tags: ['brand'], source: 'official',
        url: 'https://join.tencentmusic.com/social/post-details?id=12506',
        desc: '1. 负责腾讯音乐招聘品牌传播各渠道的视觉设计及表现，提升候选人入职体验；\n2. 参与团队各子品牌设计流程和设计规范的制定，保障规范的有效执行；\n3. 负责前期视觉用户研究、设计流行趋势分析；\n4. 跟进设计实现，推动创意落地。'
    },
    {
        id: 'tme-kugou-game', company: 'tme',
        title: '酷狗音乐游戏视觉设计师',
        location: '广州', team: '酷狗音乐', exp: '', salary: '',
        date: '2026-08-28', tags: ['game', 'aigc', 'product'], source: 'official',
        url: 'https://join.tencentmusic.com/social/post-details?id=14930',
        desc: '1. 能根据需求制定游戏风格，设计高品质 GUI 方案，制定主界面及通用组件与规范；\n2. 熟练运用手绘技能和各类 AI 工具，利用 AI 独立完成角色、道具、场景等素材绘制；\n3. 紧密对接策划、交互与开发，协同优化交互逻辑、操作流程与视觉体验；\n4. 对游戏界面的可用性和一致性负责，跟进游戏行业美术设计趋势。'
    },

    /* ---------- 腾讯 ---------- */
    {
        id: 'tc-ssv', company: 'tencent',
        title: 'SSV - 视觉设计师',
        location: '北京', team: 'CDG / SSV 可持续社会价值', exp: '三年以上', salary: '',
        date: '2026-08-17', tags: ['product', 'aigc', 'brand'], source: 'official',
        url: 'https://careers.tencent.com/jobdesc.html?postId=2062490422189670400',
        desc: '1. 负责 SSV 相关业务全链路交互设计和视觉设计；\n2. 围绕 AI 搭建高效的工作流，交付可复用可插拔的能力，提升整体工作效率和效果；\n3. 基于体验数据的整理，驱动设计创新，提升项目的用户参与度与社会影响力。'
    },
    {
        id: 'tc-video', company: 'tencent',
        title: '腾讯视频 - 高级视觉设计师',
        location: '北京', team: 'PCG / 腾讯视频', exp: '三年以上', salary: '',
        date: '2026-08-12', tags: ['brand', 'illustration'], source: 'official',
        url: 'https://careers.tencent.com/jobdesc.html?postId=2054096301968244736',
        desc: '1. 负责腾讯视频 IP 授权图库（Style Guide）设计开发，包括 IP 主题策划、插画图库开发、品类应用开发等；\n2. 负责 IP 授权设计监修工作，包括玩具文具、鞋服配、快销、3C 数码、生活周边、游戏网服等品类；\n3. 对接并管理合作供应商设计创意及品质把控，规划多项目并行与设计进度管控；\n4. 结合技术发展推动图库设计与监修工作流程、模式及方法创新。'
    },
    {
        id: 'tc-wechat-aigc', company: 'tencent',
        title: '微信 - 视觉设计师 AIGC / 模型美学方向',
        location: '广州', team: 'WXG / 微信基础AI探索', exp: '一年以上', salary: '',
        date: '2026-07-09', tags: ['aigc'], source: 'official',
        url: 'https://careers.tencent.com/jobdesc.html?postId=2062097664329302016',
        desc: '1. 负责图像/视频生成大模型的美学标准制定、数据采集、模型调优与效果验收等工作；\n2. 跟踪 AIGC 工具与视觉趋势，形成专业洞察与美学规范，推动模型美学能力持续优化；\n3. 探索 AIGC 技术在业务场景中的创新应用，包括但不限于视频特效模板、直播礼物、互动内容等方向。'
    },
    {
        id: 'tc-slg-sh', company: 'tencent',
        title: '游戏视觉设计师',
        location: '上海', team: 'IEG / 预研 SLG+X', exp: '两年以上', salary: '',
        date: '2026-06-22', tags: ['game', 'product', 'motion'], source: 'official',
        url: 'https://careers.tencent.com/jobdesc.html?postId=2065632494333636608',
        desc: '1. 负责孵化中 SLG+X 项目的视觉设计工作，包括 UI 界面、图标、特效、动画等设计；\n2. 与产品、策划、开发团队紧密协作，输出符合游戏风格和用户体验的高质量视觉方案；\n3. 参与游戏视觉风格的定义与把控，确保设计风格与游戏世界观、品牌调性一致；\n4. 跟进设计落地效果，持续优化游戏视觉表现。'
    },
    {
        id: 'tc-j3', company: 'tencent',
        title: 'J3 - 游戏视觉设计岗',
        location: '深圳', team: 'IEG / J3', exp: '两年以上', salary: '',
        date: '2026-07-21', tags: ['game', 'product'], source: 'official',
        url: 'https://careers.tencent.com/jobdesc.html?postId=2079450901097136128',
        desc: '1. 负责 J3 产品的界面视觉，进行概念推导，输出完整的概念 Demo 并验证方案可落地性；\n2. 基于 J3 各产品视觉调性完成不同类型图标的风格推导和设计；\n3. 结合市场、玩家、技术、IP 等维度预判行业现状，分析产品设计趋势；\n4. 制定并贯彻设计规范，确保项目 UI 风格与品牌一致性。'
    },
    {
        id: 'tc-slg-ui', company: 'tencent',
        title: 'SLG - 界面视觉设计师',
        location: '上海', team: 'IEG / 重返帝国', exp: '一年以上', salary: '',
        date: '2026-07-20', tags: ['game', 'product'], source: 'official',
        url: 'https://careers.tencent.com/jobdesc.html?postId=2078412528710496256',
        desc: '1. 参与面向海外市场手游视觉设计工作，包括 UI 界面、创意包装、图标等视觉元素的设计与执行；\n2. 参与游戏视觉风格的定位与细节品质优化，将设计理念转化为高质量的视觉呈现；\n3. 与交互、策划、动效紧密配合，基于项目需求与线上反馈优化设计方案；\n4. 熟悉界面设计及制作流程，确保设计方案的高还原度落地。'
    },
    {
        id: 'tc-honor', company: 'tencent',
        title: '《王者荣耀》- 视觉设计师',
        location: '深圳', team: 'IEG / 王者荣耀', exp: '五年以上', salary: '',
        date: '2026-07-24', tags: ['game', 'product'], source: 'official',
        url: 'https://careers.tencent.com/jobdesc.html?postId=2074080208780181504',
        desc: '1. 负责游戏内 UI 界面设计，重点负责商业化系统、运营活动等主题化界面设计；\n2. 设计执行与把控能力强，对基础设计规范和资源输出管理有丰富经验；\n3. 负责视觉规范的制定、应用落地、上下游协作和各环节品质确认验收；\n4. 有较强的设计归纳总结能力，沉淀方法论，推动团队设计力进步。'
    },
    {
        id: 'tc-codm', company: 'tencent',
        title: '《使命召唤手游》视觉设计师',
        location: '深圳', team: 'IEG / 使命召唤手游', exp: '一年以上', salary: '',
        date: '2026-08-04', tags: ['game', 'product'], source: 'official',
        url: 'https://careers.tencent.com/jobdesc.html?postId=2081629661825249280',
        desc: '1. 参与游戏产品的视觉流程设计，独立完成界面视觉设计，符合设计主题和项目 IP 调性；\n2. 参与视觉交互前期玩法对齐，保证视觉层级和玩法清晰度，并保证设计方案落地与适配效果；\n3. 体验现有游戏视觉交互体验，提出优化设计方案，协助维护设计一致性。'
    },
    {
        id: 'tc-nzfuture-ui', company: 'tencent',
        title: '《逆战：未来》游戏视觉设计师',
        location: '深圳', team: 'IEG / code-z', exp: '两年以上', salary: '',
        date: '2026-07-29', tags: ['game', 'product'], source: 'official',
        url: 'https://careers.tencent.com/jobdesc.html?postId=1980470351473303552',
        desc: '1. 负责射击游戏 UI 界面设计；\n2. 根据项目内容梳理视觉设计规范及制作流程，协同上下游和合作方确保品质；\n3. 负责设计结果导向及资源性能损耗把控，对最终呈现内容做优化。'
    },
    {
        id: 'tc-delta-ip', company: 'tencent',
        title: '《三角洲行动》- IP视觉设计负责人',
        location: '深圳', team: 'IEG / ProjectD', exp: '五年以上', salary: '',
        date: '2026-08-27', tags: ['game', 'brand', 'marketing'], source: 'official',
        url: 'https://careers.tencent.com/jobdesc.html?postId=2048958068422766592',
        desc: '1. 担任三角洲品牌 IP 的主视觉与创意设计接口人，与中台部门合作保证 IP 设计内容落地；\n2. 负责三角洲游戏世界观、赛季活动等顶层视觉的研发、维护与规范制定；\n3. 负责三角洲 IP 联动活动及衍生品的创意、设计与落地执行，承担与 IP 合作方及设计团队的对接支持；\n4. 为游戏本体内容（阵营、角色、武器、地图及宣发物料等）提供平面与包装设计支持。'
    },
    {
        id: 'tc-roco', company: 'tencent',
        title: '《洛克王国：世界》- 视觉设计师（资深）',
        location: '深圳', team: 'IEG / UC', exp: '一年以上', salary: '',
        date: '2026-08-14', tags: ['game', 'product', 'illustration'], source: 'official',
        url: 'https://careers.tencent.com/jobdesc.html?postId=1916406604069183488',
        desc: '1. 负责游戏 UI 系统创意视觉提案，依据游戏世界观与产品需求，确定系统整体视觉包装方向，涵盖二次元、主机、写实、影视化等多种风格；\n2. 全程跟进设计实现过程，与策划、动效、程序密切协作，确保最终版本实现品质与设计相符；\n3. 提出创意方案，并推动各环节岗位将最终资源依照方案品质落实。'
    },
    {
        id: 'tc-j3-kv', company: 'tencent',
        title: 'J3 UE5微恐射击 - 视觉设计师（美宣）',
        location: '深圳', team: 'IEG / CFH', exp: '两年以上', salary: '',
        date: '2026-08-10', tags: ['game', 'marketing', 'illustration'], source: 'official',
        url: 'https://careers.tencent.com/jobdesc.html?postId=2064519585079672832',
        desc: '1. 负责游戏 KV/KA 等美术内容从概念到落地的设计工作；\n2. 负责前期美学探索、风格定调及提案；\n3. 与内外部配合完成上述内容的落地工作。'
    },
    {
        id: 'tc-delta-mkt', company: 'tencent',
        title: '《三角洲行动》- 视觉设计师（宣发向）',
        location: '深圳', team: 'IEG / ProjectD', exp: '两年以上', salary: '',
        date: '2026-08-03', tags: ['game', 'marketing'], source: 'official',
        url: 'https://careers.tencent.com/jobdesc.html?postId=1980470334436036608',
        desc: '1. 负责 FPS 游戏产品宣发包装和运营相关的视觉设计工作；\n2. 对接游戏运营需求讨论，结合运营策略输出视觉创意与解决方案，并进行视觉设计执行落地与供应商监修推进；\n3. 结合游戏叙事与项目内容信息，为项目提供包装设计策略并输出主题化视觉设计方案。'
    },
    {
        id: 'tc-codm-mkt', company: 'tencent',
        title: '《使命召唤手游》视觉设计师（宣发向）',
        location: '深圳', team: 'IEG / 使命召唤手游', exp: '两年以上', salary: '',
        date: '2026-08-27', tags: ['game', 'marketing'], source: 'official',
        url: 'https://careers.tencent.com/jobdesc.html?postId=2015744482716311552',
        desc: '1. 参与游戏产品前期美术风格定调，主导产品的宣发视觉风格，并根据 Art Direction 梳理产出品牌视觉规范；\n2. 针对游戏产品宣发不同阶段给予相应的视觉创意解决方案，并制作创意 KV、KA 等视觉设计工作；\n3. 根据视觉创意方案，指导合作伙伴高质量产出宣发物料。'
    },
    {
        id: 'tc-cube-mkt', company: 'tencent',
        title: '魔方宣发视觉设计师 - 新星引力计划',
        location: '深圳', team: 'IEG / 洛克王国·北境魔方', exp: '一年以上', salary: '',
        date: '2026-08-24', tags: ['game', 'marketing'], source: 'official',
        url: 'https://careers.tencent.com/jobdesc.html?postId=2057714797075677184',
        desc: '1. 负责魔方游戏的品牌/赛事整体素材，制定游戏视觉宣发/赛事调性及系统设计方案；\n2. 参与项目前期宣发创意讨论，推动游戏的视觉调性与美宣落地；\n3. 负责把控产品宣发视觉的实现品质；\n4. 为产品宣发的视觉和品牌调性负责，推动宣发物料的设计细节落地。'
    },
    {
        id: 'tc-honor-intl', company: 'tencent',
        title: '《王者荣耀》国际版 - 资深游戏视觉设计师',
        location: '成都', team: 'IEG / 王者荣耀海外版', exp: '三年以上', salary: '',
        date: '2026-07-29', tags: ['game', 'product'], source: 'official',
        url: 'https://careers.tencent.com/jobdesc.html?postId=2081562085803868160',
        desc: '1. 负责王者荣耀国际版 UI 界面的运营模块视觉设计包装；\n2. 对 UI 设计概念的深挖和验证；\n3. 游戏内相关 ICON 和 LOGO 的设计产出；\n4. UI 资源的输出和管理；\n5. UI 界面版本的还原跑查及调整。'
    },
    {
        id: 'tc-qqspeed', company: 'tencent',
        title: 'QQ飞车手游 - UI视觉设计师 - 新星引力计划',
        location: '深圳', team: 'IEG / QQ飞车', exp: '一年以上', salary: '',
        date: '2026-08-24', tags: ['game', 'product'], source: 'official',
        url: 'https://careers.tencent.com/jobdesc.html?postId=2089275503402991616',
        desc: '1. 负责系统玩法包装设计任务，玩法原画相关背景图、互动效果演示、视觉呈现等设计，并跟进设计效果整体游戏实现；\n2. 能制作各种概念稿的创意输出，包括平面包装和背景；\n3. 快速验证各种新玩法或者视觉包装的前期概念呈现；\n4. 协助各模块快速创作视觉表达要素。'
    },
    {
        id: 'tc-nzfuture-brand', company: 'tencent',
        title: '《逆战：未来》品宣设计师',
        location: '深圳', team: 'IEG / code-z', exp: '三年以上', salary: '',
        date: '2026-08-28', tags: ['game', 'marketing', 'brand'], source: 'official',
        url: 'https://careers.tencent.com/jobdesc.html?postId=1991407393640173568',
        desc: '1. 参与游戏产品关键节点的宣发视觉创意方案，主导版本 KV、卖点图等视觉设计工作；\n2. 根据产品整体美术调性及不同版本内容玩法，输出品牌视觉规范手册；\n3. 根据 BD/IP 合作内容，产出核心平面素材创意及物料；\n4. 为游戏展会、前瞻直播等线下活动制作物料；\n5. 运用实践经验指导合作伙伴高质量产出宣发物料。'
    },
    {
        id: 'tc-ue-brand', company: 'tencent',
        title: 'UE微恐轻动作项目 - 品宣设计师',
        location: '深圳', team: 'IEG / 预研 QZ2', exp: '五年以上', salary: '',
        date: '2026-08-21', tags: ['game', 'marketing'], source: 'official',
        url: 'https://careers.tencent.com/jobdesc.html?postId=2044469286130581504',
        desc: '1. 参与游戏产品关键节点的宣发视觉创意方案，主导版本 KV、卖点图等平面视觉包装设计工作；\n2. 根据产品整体美术调性及不同版本内容玩法，输出品牌视觉规范手册；\n3. 根据 BD/IP 合作内容，产出核心平面素材创意及物料；\n4. 运用实践经验指导合作伙伴高质量产出宣发物料。'
    },
    {
        id: 'tc-cf-kv', company: 'tencent',
        title: '《穿越火线手游》- 美宣设计师',
        location: '深圳', team: 'IEG / CF', exp: '三年以上', salary: '',
        date: '2026-07-31', tags: ['game', 'marketing', 'illustration'], source: 'official',
        url: 'https://careers.tencent.com/jobdesc.html?postId=1879473689968291840',
        desc: '1. 参与游戏产品前期美术风格定调，主导产品的宣发视觉风格，并根据 Art Direction 梳理产出品牌视觉规范手册；\n2. 针对游戏产品宣发不同阶段给予相应的视觉创意解决方案，制作创意 KV、KA、卖点图等；\n3. 根据视觉创意方案，指导合作伙伴高质量产出宣发物料。'
    },
    {
        id: 'tc-vfx', company: 'tencent',
        title: '王者荣耀IP 3D项目 - 高级游戏特效设计师（战斗方向）',
        location: '成都', team: 'IEG / 王者荣耀', exp: '三年以上', salary: '',
        date: '2026-06-08', tags: ['game', 'motion'], source: 'official',
        url: 'https://careers.tencent.com/jobdesc.html?postId=2063821527366942720',
        desc: '1. 负责角色技能、战斗反馈、场景交互等相关特效设计与制作；\n2. 与策划、动画、角色及程序团队协作，共同打磨战斗体验与视觉表现；\n3. 参与战斗表现设计与迭代，从玩家体验角度提出优化方案；\n4. 配合完成特效资源在 UE5 中的落地、调试与性能优化。'
    },
    {
        id: 'tc-wechat-open', company: 'tencent',
        title: '微信开放平台 - 产品体验设计师',
        location: '广州', team: 'WXG / 公众号', exp: '一年以上', salary: '',
        date: '2026-08-26', tags: ['product'], source: 'official',
        url: 'https://careers.tencent.com/jobdesc.html?postId=2046593469711024128',
        desc: '1. 负责微信公众号及小程序相关功能的设计工作；\n2. 参与产品需求分析，明确用户需求及设计目标，高效输出有效的产品原型方案，验证方案质量并推动落地；\n3. 参与团队专业建设，制定设计规范与组件库，沉淀设计经验；\n4. 参与用户调研、可用性评估与测试，持续优化用户体验。'
    },
    {
        id: 'tc-farm-ui', company: 'tencent',
        title: 'QQ经典农场 - 游戏 UI 设计师',
        location: '深圳', team: 'IEG / NQF 手游小程序', exp: '三年以上', salary: '',
        date: '2026-07-14', tags: ['game', 'product'], source: 'official',
        url: 'https://careers.tencent.com/jobdesc.html?postId=2076884075783831552',
        desc: '负责 QQ 经典农场游戏 UI 设计工作，包括界面视觉、图标、运营活动包装等。'
    },
    {
        id: 'tc-delta-concept', company: 'tencent',
        title: '《三角洲行动》- 概念设计负责人',
        location: '深圳', team: 'IEG / ProjectD 国际版', exp: '五年以上', salary: '',
        date: '2026-08-25', tags: ['game', 'illustration'], source: 'official',
        url: 'https://careers.tencent.com/jobdesc.html?postId=1902602544971075584',
        desc: '负责《三角洲行动》游戏概念设计方向的把控与团队管理，涵盖世界观视觉、角色/场景概念设计等。'
    },
    {
        id: 'tc-nzfuture-kv', company: 'tencent',
        title: '《逆战：未来》美宣设计师',
        location: '深圳', team: 'IEG / code-z', exp: '三年以上', salary: '',
        date: '2026-07-31', tags: ['game', 'marketing'], source: 'official',
        url: 'https://careers.tencent.com/jobdesc.html?postId=1991407389953384448',
        desc: '1. 参与游戏产品关键节点的宣发视觉创意方案，主导版本 KV、卖点图等视觉设计；\n2. 根据产品整体美术调性输出品牌视觉规范手册；\n3. 根据 BD/IP 合作内容产出核心平面素材创意及物料。'
    },
    {
        id: 'tc-artdirector', company: 'tencent',
        title: '预研动作手游 - 主美',
        location: '深圳', team: 'IEG / 火影忍者', exp: '五年以上', salary: '',
        date: '2026-08-26', tags: ['game', 'illustration'], source: 'official',
        url: 'https://careers.tencent.com/jobdesc.html?postId=2089905174113075200',
        desc: '负责预研动作手游项目美术方向的整体把控与团队管理，制定美术风格与品质标准。'
    },
    {
        id: 'tc-royale-illus', company: 'tencent',
        title: 'Supercell《皇室战争》- 资深2D美宣原画',
        location: '深圳', team: 'IEG / 腾讯版皇室战争', exp: '三年以上', salary: '',
        date: '2026-08-10', tags: ['game', 'illustration'], source: 'official',
        url: 'https://careers.tencent.com/jobdesc.html?postId=2019612893523378176',
        desc: '负责《皇室战争》产品的 2D 美宣原画设计，包括 KV、角色宣传图、运营插画等高品质美术内容产出。'
    },

    /* ---------- 阿里巴巴系 ---------- */
    {
        id: 'ali-shanguo', company: 'alibaba',
        title: '淘宝闪购 - 零售导购高级视觉体验设计专家',
        location: '北京 / 杭州', team: '淘宝闪购（原饿了么）', exp: '', salary: '',
        date: '2026-08-10', tags: ['product', 'brand'], source: 'official',
        url: 'https://talent.ele.me/off-campus/position-list?lang=zh&search=%E8%A7%86%E8%A7%89',
        desc: '负责淘宝闪购零售导购方向的高级视觉与体验设计，覆盖即时零售场景的导购信息表达、营销活动视觉与体验链路设计。\n（官方招聘站搜索「视觉」即可查看完整 JD 并投递）'
    },
    {
        id: 'ali-taotian-fashion', company: 'alibaba',
        title: '淘宝服饰 - 服饰视觉企划',
        location: '广州', team: '淘天集团 / 淘宝服饰', exp: '', salary: '',
        date: '2026-07-29', tags: ['brand'], source: 'official',
        url: 'https://talent.taotian.com/off-campus/position-list?lang=zh&search=%E8%A7%86%E8%A7%89',
        desc: '负责淘宝服饰业务的视觉企划工作，结合服饰流行趋势与平台调性输出视觉创意方案。\n（官方招聘站搜索「视觉」即可查看完整 JD 并投递）'
    },
    {
        id: 'ali-happyhorse', company: 'alibaba',
        title: '未来生活实验室 - Happy Horse 品牌视觉设计师',
        location: '杭州 / 北京', team: '阿里 ATH 事业群（未来生活实验室）', exp: '3-5年', salary: '25-50K · 16薪',
        date: '2026-08-20', tags: ['brand'], source: 'third',
        url: 'https://m.zhipin.com/job_detail/8fb0e96fbfe18c3a0nB-3Nu6EVRQ.html',
        desc: '阿里巴巴未来生活实验室隶属于 ATH 事业群（2026 年初成立，吴泳铭亲自挂帅直管）。负责 Happy Horse 品牌的整体视觉创意与品牌设计工作。\n薪酬参考：25-50K · 16薪（第三方平台信息，以官方为准）。'
    },
    {
        id: 'ali-intl-creative', company: 'alibaba',
        title: '阿里国际 - 创意视觉设计师',
        location: '杭州', team: '阿里国际数字商业', exp: '3年以上', salary: '20-50K · 16薪',
        date: '2026-08-20', tags: ['brand', 'motion', 'product'], source: 'third',
        url: 'https://talent.alibaba.com/?lang=zh',
        desc: '1. 负责电商类 App 内整体视觉设计（品牌 IP 设计、活动创意、活动页面、动效设计），参与营销基础体验组件设计，能独立完成营销活动页 UI；\n2. 负责游戏化项目的玩法包装和视觉设计（场景、角色、道具、图标）；\n3. 主导设计创意，保障从构思、产出、落地到复盘的全流程输出；\n4. 针对不同国家用户特点进行国别化设计趋势研究并落地。\n要求：本科及以上，3 年以上移动端创意视觉设计经验，熟练使用 AIGC 工具与 Figma/PS/AI/AE。'
    },
    {
        id: 'ali-youku', company: 'alibaba',
        title: '阿里大文娱 - 视觉设计专家',
        location: '北京', team: '虎鲸文娱（优酷 / 大麦）', exp: '3-5年', salary: '25-40K',
        date: '2026-08-20', tags: ['product', 'brand'], source: 'third',
        url: 'https://m.bosszhipin.com/job_detail/563de31cae290e4d0HB40966GVc~.html',
        desc: '1. 负责 iOS、Android 等移动设备操作系统和 PC 产品的视觉设计；\n2. 主导设计规范与视觉体系建设，把控设计品质。\n薪酬参考：25-40K（第三方平台信息，以官方为准）。'
    },
    {
        id: 'ali-aigc-rotation', company: 'alibaba',
        title: 'AI视觉设计师 / AI体验设计师（轮岗：淘宝闪购·飞猪·阿里国际·钉钉·千问·虎鲸文娱）',
        location: '杭州 / 北京', team: '淘宝闪购校招项目（覆盖飞猪等业务）', exp: '在校 / 应届', salary: '面议',
        date: '2026-08-20', tags: ['aigc', 'brand', 'product'], source: 'third',
        url: 'https://m.zhipin.com/job_detail/188098c3d1812ff00nJ52NW8GFJW.html',
        desc: '有机会加入淘宝闪购、飞猪、阿里国际、钉钉、千问 C 端、虎鲸文娱等业务，参与结合 AI 的体验设计创新工作。\n1. 参与导购信息表达与决策引导、复杂业务逻辑视觉化、营销 IP 心智设计等项目；\n2. 负责产品的 AI 视觉内容创作，包含海报、视频、商品图等从创意到落地；\n3. 在业务场景中完成用户痛点及需求梳理、设计方案输出。\n（这是目前飞猪设计方向最明确的入口之一）'
    },
    {
        id: 'ali-tmall-campus', company: 'alibaba',
        title: 'AI创意设计师 - 27届春招（可转正）',
        location: '杭州', team: '淘天 / 天猫', exp: '在校 / 应届', salary: '20-30K · 16薪',
        date: '2026-08-20', tags: ['brand', 'aigc'], source: 'third',
        url: 'https://m.zhipin.com/job_detail/1946d2b9364793430nZ80925GVpS.html',
        desc: '1. 天猫核心业务和活动的品牌营销创意设计，交付全案设计，包括品牌、营销、页面、影像、空间；\n2. 互动产品的主题创意策划，互动产品的视觉风格设定。\n薪酬参考：20-30K · 16薪（第三方平台信息，以官方为准）。'
    },

    /* ---------- 蚂蚁集团 ---------- */
    {
        id: 'ant-ai-agent', company: 'ant',
        title: 'AI Agent 视觉设计师',
        location: '杭州', team: '蚂蚁数科', exp: '3-5年', salary: '25-50K · 15薪',
        date: '2026-08-27', tags: ['aigc', 'brand', 'product'], source: 'third',
        url: 'https://m.zhipin.com/job_detail/5a5ffed4ff8335d60nd43ti-E1RX.html',
        desc: '1. 负责蚂蚁数科官网及 AI 相关产品线的整体视觉策略制定与落地，负责视觉气质定义、体系搭建；\n2. 构建并迭代覆盖颜色、排版、图标、3D 资产、动效的完整设计系统；\n3. 熟悉 vibe coding 流程，深度配合研发将视觉方案精准转化为代码实现；\n4. 熟练运用 AI 设计工具及 AIGC、设计工程化工具提升效率，沉淀设计资产与 AI 工作方法。\n薪酬参考：25-50K · 15薪（第三方平台信息，以官方为准）。'
    },
    {
        id: 'ant-intl-brand', company: 'ant',
        title: '创意视觉设计高级专员 - 国际事业群',
        location: '上海', team: '蚂蚁国际（跨境支付）', exp: '3年以上', salary: '25-55K',
        date: '2026-08-26', tags: ['brand', 'marketing'], source: 'third',
        url: 'https://talent.antgroup.com/off-campus-home',
        desc: '1. 负责蚂蚁国际跨境支付的营销视觉设计，包括日常营销活动、年度大促活动的创意设计；\n2. 建立全链路创意设计规范标准，完善设计输出质量，基于活动数据分析沉淀设计方法；\n3. 负责设计规范制定，协同推动整体体验统一。\n要求：本科及以上，3 年以上营销设计经验，有海外产品 / B 类产品营销视觉设计经验优先；英语流利加分。\n薪酬参考：25-55K（第三方平台信息，以蚂蚁官方招聘站为准）。'
    },
    {
        id: 'ant-oceanbase', company: 'ant',
        title: '创意设计师（网站设计）',
        location: '杭州', team: 'OceanBase', exp: '5-10年', salary: '25-45K',
        date: '2026-08-20', tags: ['brand', 'illustration', 'motion'], source: 'third',
        url: 'https://talent.antgroup.com/off-campus-home',
        desc: '1. 基于对品牌与用户的深度洞察，主导 OceanBase 官网的整体视觉策略与创意构思；\n2. 独立完成从概念定调至落地执行的全流程设计，涵盖界面、插画、动效等。\n薪酬参考：25-45K（第三方平台信息，以蚂蚁官方招聘站为准）。'
    },
    {
        id: 'ant-pay-ux', company: 'ant',
        title: '高级体验设计师（支付宝支付场景）',
        location: '杭州', team: '支付宝', exp: '3-5年', salary: '20-40K · 16薪',
        date: '2026-08-20', tags: ['product', 'brand'], source: 'third',
        url: 'https://m.zhipin.com/job_detail/aeb25600000845ea0nR40tq1E1FU.html',
        desc: '负责支付宝「支付场景」相关业务（核心场景）：\n1. 负责用户侧支付场景权益及链路表达，或行业解决方案（餐饮/教育/会员等）体验链路优化；\n2. 负责支付宝团购业务的体验设计。\n薪酬参考：20-40K · 16薪（第三方平台信息，以官方为准）。'
    }
];

/* ============================================================
   State
   ============================================================ */

const STORAGE_KEY = 'jobboard_status_v1';

let state = {
    company: 'all',
    tags: new Set(),
    status: 'all',       // all | saved | applied
    query: ''
};

let statusMap = {};
try {
    statusMap = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
} catch (e) {
    statusMap = {};
}

function saveStatus() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statusMap));
}

/* ============================================================
   Render: filters
   ============================================================ */

function renderCompanyFilters() {
    const wrap = document.getElementById('companyFilters');
    const options = [['all', '全部', 'ALL'], ...Object.entries(COMPANIES).map(([k, v]) => [k, v.name, v.en])];
    wrap.innerHTML = options.map(([key, zh, en]) => `
        <label class="filter-checkbox">
            <input type="radio" name="companyFilter" value="${key}" ${state.company === key ? 'checked' : ''}>
            <span class="checkbox-square"></span>
            ${zh} ${en}
        </label>
    `).join('');
    wrap.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', () => {
            state.company = input.value;
            renderJobs();
        });
    });
}

function renderTagFilters() {
    const wrap = document.getElementById('tagFilters');
    wrap.innerHTML = Object.entries(TAGS).map(([key, label]) => `
        <span class="keyword-item ${state.tags.has(key) ? 'active' : ''}" data-tag="${key}">
            <span class="kw-box"></span>
            ${label}
        </span>
    `).join('');
    wrap.querySelectorAll('.keyword-item').forEach(item => {
        item.addEventListener('click', () => {
            const tag = item.dataset.tag;
            if (state.tags.has(tag)) state.tags.delete(tag);
            else state.tags.add(tag);
            renderTagFilters();
            renderJobs();
        });
    });
}

function renderStatusFilters() {
    const wrap = document.getElementById('statusFilters');
    const options = [['all', '全部 ALL'], ['saved', '已收藏 SAVED'], ['applied', '已投递 APPLIED']];
    wrap.innerHTML = options.map(([key, label]) => `
        <button class="status-chip ${state.status === key ? 'active' : ''}" data-status="${key}">${label}</button>
    `).join('');
    wrap.querySelectorAll('.status-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            state.status = btn.dataset.status;
            renderStatusFilters();
            renderJobs();
        });
    });
}

/* ============================================================
   Filter + render: jobs
   ============================================================ */

function getFilteredJobs() {
    return JOBS.filter(job => {
        if (state.company !== 'all' && job.company !== state.company) return false;
        if (state.tags.size > 0 && ![...state.tags].every(t => job.tags.includes(t))) return false;
        const st = statusMap[job.id];
        if (state.status === 'saved' && st !== 'saved' && st !== 'applied') return false;
        if (state.status === 'applied' && st !== 'applied') return false;
        if (state.query) {
            const q = state.query.toLowerCase();
            const haystack = [
                job.title, job.location, job.team, job.desc, job.salary,
                COMPANIES[job.company].name,
                ...job.tags.map(t => TAGS[t])
            ].join(' ').toLowerCase();
            if (!haystack.includes(q)) return false;
        }
        return true;
    }).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
}

function renderJobs() {
    const grid = document.getElementById('jobGrid');
    const jobs = getFilteredJobs();

    document.getElementById('jobCount').textContent = JOBS.length;
    document.getElementById('emptyState').style.display = jobs.length === 0 ? 'block' : 'none';

    grid.innerHTML = jobs.map(job => {
        const st = statusMap[job.id];
        const company = COMPANIES[job.company];
        const metaParts = [
            job.location,
            job.team,
            job.exp,
            job.salary
        ].filter(Boolean);
        return `
        <article class="job-card ${st === 'saved' ? 'is-saved' : ''} ${st === 'applied' ? 'is-applied' : ''}" data-id="${job.id}">
            <div class="job-card-head">
                <span class="job-company">${company.name} · ${company.en}</span>
                <span class="source-badge">${job.source === 'official' ? '官方' : '第三方'}</span>
            </div>
            <h2 class="job-title" data-action="detail">${escapeHtml(job.title)}</h2>
            <div class="job-meta">${metaParts.map(escapeHtml).join('<span class="meta-sep">/</span>')}</div>
            <p class="job-desc">${escapeHtml(job.desc.split('\n')[0])}</p>
            <div class="job-tags">
                ${job.tags.map(t => `<span class="job-tag">${TAGS[t]}</span>`).join('')}
            </div>
            <div class="job-date">
                <span>${job.date ? '更新 ' + job.date : ''}</span>
                <span class="job-actions">
                    <button class="icon-btn ${st === 'saved' ? 'active' : ''}" data-action="save">${st === 'saved' || st === 'applied' ? '★ 已收藏' : '☆ 收藏'}</button>
                    <button class="icon-btn ${st === 'applied' ? 'active' : ''}" data-action="apply">${st === 'applied' ? '✓ 已投递' : '标记投递'}</button>
                </span>
            </div>
        </article>`;
    }).join('');

    renderStats();
}

function renderStats() {
    const saved = JOBS.filter(j => statusMap[j.id] === 'saved' || statusMap[j.id] === 'applied').length;
    const applied = JOBS.filter(j => statusMap[j.id] === 'applied').length;
    const visible = getFilteredJobs().length;
    document.getElementById('statsStrip').innerHTML = `
        <span class="stat">当前显示 <b>${visible}</b> / ${JOBS.length} 个岗位</span>
        <span class="stat">已收藏 <b>${saved}</b></span>
        <span class="stat">已投递 <b>${applied}</b></span>
    `;
}

/* ============================================================
   Detail modal
   ============================================================ */

function openJobModal(id) {
    const job = JOBS.find(j => j.id === id);
    if (!job) return;
    const company = COMPANIES[job.company];
    const st = statusMap[job.id];
    const metaParts = [job.location, job.team, job.exp, job.salary].filter(Boolean);

    document.getElementById('jobModalBody').innerHTML = `
        <div class="modal-company">${company.name} · ${company.en} <span class="source-badge" style="margin-left:8px;">${job.source === 'official' ? '官方来源' : '第三方平台'}</span></div>
        <h3 class="modal-title">${escapeHtml(job.title)}</h3>
        <div class="modal-meta">
            ${metaParts.map(escapeHtml).join(' / ')}<br>
            更新时间：${job.date || '—'}
        </div>
        <div class="modal-tags">
            ${job.tags.map(t => `<span class="job-tag">${TAGS[t]}</span>`).join('')}
        </div>
        <div class="modal-section-label">岗位描述</div>
        <p class="modal-desc">${escapeHtml(job.desc)}</p>
        <div class="modal-footer">
            <a class="btn btn-primary" href="${job.url}" target="_blank" rel="noopener noreferrer">前往投递 →</a>
            <button class="btn" data-modal-action="save">${st === 'saved' || st === 'applied' ? '★ 已收藏' : '☆ 收藏岗位'}</button>
            <button class="btn" data-modal-action="apply">${st === 'applied' ? '✓ 已投递' : '标记已投递'}</button>
        </div>
    `;
    document.getElementById('jobModal').style.display = 'flex';

    document.querySelector('[data-modal-action="save"]').addEventListener('click', () => {
        toggleStatus(id, 'save');
        openJobModal(id);
    });
    document.querySelector('[data-modal-action="apply"]').addEventListener('click', () => {
        toggleStatus(id, 'apply');
        openJobModal(id);
    });
}

function closeJobModal() {
    document.getElementById('jobModal').style.display = 'none';
}

/* ============================================================
   Status actions
   ============================================================ */

function toggleStatus(id, action) {
    const current = statusMap[id];
    if (action === 'apply') {
        statusMap[id] = current === 'applied' ? 'saved' : 'applied';
    } else {
        if (current === 'applied') {
            // keep applied state, ignore un-save
        } else {
            statusMap[id] = current === 'saved' ? undefined : 'saved';
        }
    }
    if (!statusMap[id]) delete statusMap[id];
    saveStatus();
    renderJobs();
}

/* ============================================================
   Events
   ============================================================ */

document.addEventListener('click', (e) => {
    const actionEl = e.target.closest('[data-action]');
    if (actionEl) {
        const card = e.target.closest('.job-card');
        if (!card) return;
        const id = card.dataset.id;
        const action = actionEl.dataset.action;
        if (action === 'detail') {
            openJobModal(id);
        } else if (action === 'save') {
            toggleStatus(id, 'save');
        } else if (action === 'apply') {
            toggleStatus(id, 'apply');
        }
        return;
    }
});

document.getElementById('closeJobModal').addEventListener('click', closeJobModal);
document.getElementById('jobModal').addEventListener('click', (e) => {
    if (e.target.id === 'jobModal') closeJobModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeJobModal();
});

let searchTimer = null;
document.getElementById('searchInput').addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        state.query = e.target.value.trim();
        renderJobs();
    }, 200);
});

document.getElementById('clearSearch').addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    state.query = '';
    renderJobs();
});

document.getElementById('resetFilters').addEventListener('click', () => {
    state.company = 'all';
    state.tags.clear();
    state.status = 'all';
    state.query = '';
    document.getElementById('searchInput').value = '';
    renderCompanyFilters();
    renderTagFilters();
    renderStatusFilters();
    renderJobs();
});

/* ============================================================
   Init
   ============================================================ */

renderCompanyFilters();
renderTagFilters();
renderStatusFilters();
renderJobs();
