const IMG = (prompt, size = 'portrait_4_3') =>
    `https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${size}`;

const STUDIO_BG = 'plain white studio background, brutalist streetwear aesthetic, high contrast, full body head to toe fashion photograph';

const LOOKS = [
    {
        id: 'L01',
        name: '格纹自由',
        en: 'PLAID FREEDOM',
        desc: '宽松剪裁保证活动自由，双层格纹衬衫搭配毛边短裙，街头感与舒适并存。',
        outfit: '黑白格纹衬衫',
        shoes: '厚底皮靴',
        accessory: '黑色腋下包',
        pose: '侧身站立',
        tags: '街头 / 层次 / 宽松',
        img: IMG(`fashion editorial full body photograph of a young woman standing in side profile, wearing oversized black and white plaid flannel shirt with layered long grey plaid sleeves, matching plaid mini skirt with frayed raw hem, black chunky leather boots, long straight black hair, ${STUDIO_BG}`)
    },
    {
        id: 'L02',
        name: '透视夜纱',
        en: 'SHEER NIGHT',
        desc: '黑色透视网纱上衣搭配破洞宽牛仔裤，蕾丝系带细节，暗夜里的柔与锐。',
        outfit: '透视网纱上衣',
        shoes: '厚底皮靴',
        accessory: '银色项链',
        pose: '正面站立',
        tags: '暗黑 / 透视 / 丹宁',
        img: IMG(`fashion editorial full body photograph of a blonde woman standing facing front, wearing sheer black mesh ruffled long sleeve top with lace tie details, loose ripped blue denim wide jeans, black fingerless gloves, ${STUDIO_BG}`)
    },
    {
        id: 'L03',
        name: '铆钉机车',
        en: 'STUD RIDER',
        desc: '满钉皮夹克与拉链皮裙，朋克机车基因，硬挺轮廓自带攻击性。',
        outfit: '铆钉皮夹克',
        shoes: '厚底皮靴',
        accessory: '黑色棒球帽',
        pose: '正面站立',
        tags: '朋克 / 皮革 / 机车',
        img: IMG(`fashion editorial full body photograph of a blonde woman standing facing front, wearing black leather biker jacket covered with silver studs and spikes, black leather mini skirt with zipper details, black boots, ${STUDIO_BG}`)
    },
    {
        id: 'L04',
        name: '军绿吊索',
        en: 'OLIVE LACE',
        desc: '军绿色系带吊带与垂坠短裙，抽绳贯穿全身，轻盈但充满战术感。',
        outfit: '军绿吊带',
        shoes: '黑色乐福鞋',
        accessory: '银色项链',
        pose: '正面站立',
        tags: '军绿 / 系带 / 垂坠',
        img: IMG(`fashion editorial full body photograph of a blonde woman standing facing front, wearing olive dark green lace-up camisole top with thin straps and hanging drawstrings, draped olive green mini skirt, layered delicate silver necklaces, ${STUDIO_BG}`)
    },
    {
        id: 'L05',
        name: '镂空蛇纹',
        en: 'CUTOUT SNAKE',
        desc: '胸前镂空的渔网针织上衣搭配黑色工装裤，网格肌理与硬直线条对撞。',
        outfit: '镂空针织上衣',
        shoes: '黑色运动鞋',
        accessory: '黑色墨镜',
        pose: '正面站立',
        tags: '针织 / 镂空 / 工装',
        img: IMG(`fashion editorial full body photograph of a blonde woman standing facing front, wearing black fishnet knit long sleeve top with chest cutout detail and high neck, black baggy cargo trousers with leather belt, ${STUDIO_BG}`)
    },
    {
        id: 'L06',
        name: '皮裙夜行',
        en: 'LEATHER NIGHT',
        desc: '亮面皮革背心与及踝皮裙，极简全黑轮廓，侧影如刀。',
        outfit: '皮革背心',
        shoes: '厚底皮靴',
        accessory: '银色项链',
        pose: '侧身站立',
        tags: '皮革 / 极简 / 全黑',
        img: IMG(`fashion editorial full body photograph of a woman with short blonde hair standing in side profile, wearing black glossy leather tank top, long black leather maxi skirt with elastic waist, black chunky leather boots, minimal brutalist fashion, plain white studio background, high contrast, full body head to toe`)
    },
    {
        id: 'L07',
        name: '机能派克',
        en: 'TECH PARKA',
        desc: '超大型机能派克大衣罩住全身，兜帽戴上即是街头隐身模式。',
        outfit: '机能派克大衣',
        shoes: '黑色运动鞋',
        accessory: '黑色墨镜',
        pose: '正面站立',
        tags: '机能 / 廓形 / 叠穿',
        img: IMG(`fashion editorial full body photograph of a woman standing facing front wearing oversized black technical nylon parka coat with hood up and drawstrings, black wide leg trousers underneath, black sunglasses, black sneakers, ${STUDIO_BG}`)
    },
    {
        id: 'L08',
        name: '丝绸高领',
        en: 'SILK TURTLENECK',
        desc: '黑色丝绸高领衫配阔腿裤，柔光面料与宽松剪裁，安静的高级感。',
        outfit: '丝绸高领衫',
        shoes: '黑色乐福鞋',
        accessory: '银色项链',
        pose: '正面站立',
        tags: '丝绸 / 极简 / 通勤',
        img: IMG(`fashion editorial full body photograph of a woman with short blonde hair standing facing front, wearing black silk turtleneck long sleeve top, black wide leg trousers, black leather loafers, minimal brutalist fashion, plain white studio background, high contrast, full body head to toe`)
    }
];

const POSES = [
    {
        id: 'P1',
        name: '行走',
        en: 'WALK',
        img: IMG(`fashion editorial full body photograph of a female model walking mid-stride, wearing black tank top and black wide leg trousers, black boots, dynamic movement, ${STUDIO_BG}`)
    },
    {
        id: 'P2',
        name: '叉腰站立',
        en: 'HANDS ON HIPS',
        img: IMG(`fashion editorial full body photograph of a female model standing with hands on hips in confident pose, wearing black tank top and black wide leg trousers, ${STUDIO_BG}`)
    },
    {
        id: 'P3',
        name: '坐姿',
        en: 'SEATED',
        img: IMG(`fashion editorial full body photograph of a female model sitting on a black stool, legs apart, relaxed pose, wearing black tank top and black wide leg trousers, ${STUDIO_BG}`)
    },
    {
        id: 'P4',
        name: '回头侧身',
        en: 'LOOK BACK',
        img: IMG(`fashion editorial full body photograph of a female model looking back over her shoulder, three-quarter back view, wearing black tank top and black wide leg trousers, ${STUDIO_BG}`)
    }
];

const OUTFITS = [
    { id: 'O1', name: '黑白格纹衬衫', en: 'PLAID SHIRT', look: 'L01', img: 'images/library/lib_top_10.png' },
    { id: 'O2', name: '铆钉皮夹克', en: 'STUD JACKET', look: 'L03', img: 'images/library/lib_top_11.png' },
    { id: 'O3', name: '透视网纱上衣', en: 'SHEER MESH TOP', look: 'L02', img: 'images/library/lib_top_12.png' },
    { id: 'O4', name: '军绿吊带', en: 'OLIVE CAMISOLE', look: 'L04', img: 'images/library/lib_top_13.png' },
    { id: 'O5', name: '镂空针织上衣', en: 'CUTOUT KNIT', look: 'L05', img: 'images/library/lib_top_14.png' },
    { id: 'O6', name: '皮革背心', en: 'LEATHER TANK', look: 'L06', img: 'images/library/lib_top_15.png' },
    { id: 'O7', name: '机能派克大衣', en: 'TECH PARKA', look: 'L07', img: 'images/library/lib_top_16.png' },
    { id: 'O8', name: '丝绸高领衫', en: 'SILK TURTLENECK', look: 'L08', img: 'images/library/lib_top_17.png' },
    { id: 'O9', name: '巴西扎染球衣', en: 'BRAZIL TIE-DYE JERSEY', img: 'images/library/lib_top_1.png' },
    { id: 'O10', name: '棕麂皮夹克', en: 'BROWN SUEDE JACKET', img: 'images/library/lib_top_2.png' },
    { id: 'O11', name: '蓝纹无袖上衣', en: 'BLUE WAVE TANK', img: 'images/library/lib_top_3.png' },
    { id: 'O12', name: '黑色镂空上衣', en: 'BLACK CUTOUT TOP', img: 'images/library/lib_top_4.png' },
    { id: 'O13', name: '蓝黑条纹球衣', en: 'STRIPED FOOTBALL JERSEY', img: 'images/library/lib_top_5.png' },
    { id: 'O14', name: '灰色西装外套', en: 'GREY TAILORED BLAZER', img: 'images/library/lib_top_6.png' },
    { id: 'O15', name: '牛仔拼布上衣', en: 'DENIM PATCHWORK TOP', img: 'images/library/lib_top_7.png' },
    { id: 'O16', name: '拼色V领球衣', en: 'COLORBLOCK V-NECK JERSEY', img: 'images/library/lib_top_8.png' },
    { id: 'O17', name: '军绿蕾丝吊带', en: 'OLIVE LACE CAMI', img: 'images/library/lib_top_9.png' },
    { id: 'O18', name: '绿色灯芯绒短裤', en: 'GREEN CORDUROY SHORTS', img: 'images/library/lib_pants_1.png' },
    { id: 'O19', name: '卡其七分裤', en: 'KHAKI CROPPED PANTS', img: 'images/library/lib_pants_2.png' },
    { id: 'O20', name: '棕色喇叭裤', en: 'BROWN FLARE TROUSERS', img: 'images/library/lib_pants_3.png' },
    { id: 'O21', name: '粉色绣花半裙', en: 'PINK EMBROIDERED SKIRT', img: 'images/library/lib_pants_4.png' },
    { id: 'O22', name: '条纹系带围裙裙', en: 'STRIPED TIE APRON SKIRT', img: 'images/library/lib_pants_5.png' },
    { id: 'O23', name: '灰色百褶短裙', en: 'GREY PLEATED MINI SKIRT', img: 'images/library/lib_pants_6.png' },
    { id: 'O24', name: '军绿抽褶长裙', en: 'OLIVE RUCHED MAXI SKIRT', img: 'images/library/lib_pants_7.png' }
];

const SHOES = [
    { id: 'S1', name: '厚底皮靴', en: 'CHUNKY BOOTS', look: 'L01', img: 'images/library/lib_shoes_4.png' },
    { id: 'S2', name: '黑色运动鞋', en: 'BLACK SNEAKERS', look: 'L07', img: 'images/library/lib_shoes_5.png' },
    { id: 'S3', name: '黑色乐福鞋', en: 'BLACK LOAFERS', look: 'L08', img: 'images/library/lib_shoes_6.png' },
    { id: 'S4', name: '黑色尖头高跟鞋', en: 'BLACK STILETTO PUMPS', img: 'images/library/lib_shoes_1.png' },
    { id: 'S5', name: '厚底乐福鞋', en: 'CHUNKY LOAFERS', img: 'images/library/lib_shoes_2.png' },
    { id: 'S6', name: '军绿短靴', en: 'OLIVE ANKLE BOOTS', img: 'images/library/lib_shoes_3.png' }
];

const ACCESSORIES = [
    { id: 'A1', name: '黑色棒球帽', en: 'BASEBALL CAP', look: 'L03', img: 'images/library/lib_acc_1.png' },
    { id: 'A2', name: '银色项链', en: 'SILVER NECKLACE', look: 'L04', img: 'images/library/lib_acc_2.png' },
    { id: 'A3', name: '黑色腋下包', en: 'SHOULDER BAG', look: 'L01', img: 'images/library/lib_acc_3.png' },
    { id: 'A4', name: '黑色墨镜', en: 'BLACK SUNGLASSES', look: 'L07', img: 'images/library/lib_acc_4.png' }
];

const findLook = (id) => LOOKS.find((l) => l.id === id) || LOOKS[0];

const IDENTITY_DESC = 'a young woman with long straight black hair';

const IDENTITY_PROMPTS = {
    L01: 'a young East Asian woman in her early twenties with long straight black hair, oval face, fair skin, slender tall figure',
    L02: 'a young woman in her early twenties with long wavy blonde hair, fair skin, defined cheekbones, slender figure',
    L03: 'a young woman in her early twenties with long straight blonde hair, fair skin, high cheekbones, slender figure',
    L04: 'a young woman in her early twenties with long wavy blonde hair, fair skin, defined cheekbones, slender figure',
    L05: 'a young woman in her early twenties with long straight blonde hair, fair skin, high cheekbones, slender figure',
    L06: 'a woman in her late twenties with a short blonde bob haircut, pale skin, sharp jawline, tall slender figure',
    L07: 'a young East Asian woman in her early twenties with long straight black hair, fair skin, tall slender figure',
    L08: 'a woman in her late twenties with a short blonde bob haircut, pale skin, sharp jawline, tall slender figure'
};

const IDENTITY_LOCK = 'this must be the exact same woman, keep her facial features, face shape, hairstyle, hair color and skin tone perfectly identical to the identity described above, do not change her identity';

const FRONTVIEW = 'fashion editorial full body photograph of a model standing facing front in a neutral pose, plain white studio background, high contrast, photorealistic';

const CAST = [
    {
        id: 'C1',
        name: '马尾马甲',
        en: 'PONYTAIL WAISTCOAT',
        gender: 'female',
        img: IMG(`${FRONTVIEW}, young East Asian female model with black hair tied in a high ponytail, wearing a dark grey sleeveless mandarin-collar waistcoat with light blue side panels and metal side buckles over a light blue ruffled-collar shirt, black asymmetric draped mini skirt, grey slouchy mid-calf socks, black pointed-toe mary-jane heels`, 'portrait_4_3'),
        identity: 'a young East Asian woman in her early twenties with black hair tied in a high ponytail, fair skin, oval face, slender tall figure',
        wear: {
            top: 'dark grey sleeveless mandarin-collar waistcoat with light blue side panels and metal side buckles over a light blue ruffled-collar shirt',
            bottom: 'black asymmetric draped mini skirt, grey slouchy mid-calf socks',
            shoes: 'black pointed-toe mary-jane heels',
            accessory: null
        }
    },
    {
        id: 'C2',
        name: '蓝衬衫少年',
        en: 'BLUE SHIRT BOY',
        gender: 'male',
        img: IMG(`${FRONTVIEW}, young East Asian male model with black wavy medium-length hair under a black baseball cap, wearing black eyeglasses, oversized light blue long-sleeve shirt, black skinny tie, black high-waisted pleated knee-length shorts, two black leather belts with a black belt pouch, black mid socks, black monk-strap leather shoes`, 'portrait_4_3'),
        identity: 'a young East Asian man in his early twenties with black wavy medium-length hair, fair skin, wearing black eyeglasses, slim tall figure',
        wear: {
            top: 'oversized light blue long-sleeve shirt, black skinny tie, two black leather belts with a black belt pouch',
            bottom: 'black high-waisted pleated knee-length shorts, black mid-calf socks',
            shoes: 'black monk-strap leather shoes',
            accessory: null
        }
    },
    {
        id: 'C3',
        name: '橄榄绿短发',
        en: 'OLIVE BOB',
        gender: 'female',
        img: IMG(`${FRONTVIEW}, young East Asian female model with a short black bob haircut and blunt bangs, wearing an olive green hourglass blazer with exaggerated structured wide shoulders over a light blue shirt and tie, burgundy shorts, long light blue gloves, light blue knee-high socks, black pointed-toe stiletto heels`, 'portrait_4_3'),
        identity: 'a young East Asian woman in her early twenties with a short black bob haircut and blunt bangs, fair skin, small face, slender figure',
        wear: {
            top: 'olive green hourglass blazer with exaggerated structured wide shoulders over a light blue shirt and tie, long light blue gloves',
            bottom: 'burgundy shorts, light blue knee-high socks',
            shoes: 'black pointed-toe stiletto high heels',
            accessory: null
        }
    },
    {
        id: 'C4',
        name: '球衣墨镜',
        en: 'JERSEY SHADES',
        gender: 'female',
        img: 'images/people/people-04-front.jpg',
        identity: 'a young woman in her early twenties with long straight center-parted black hair, warm tan skin, sharp facial features, wearing narrow black sunglasses, slender tall figure',
        wear: {
            top: 'navy and burgundy color-block V-neck cropped football jersey with grey shoulder panels',
            bottom: 'grey asymmetric pleated mini skirt with a black leather belt, white ribbed crew socks',
            shoes: 'black chunky leather loafers with thick platform soles',
            accessory: null
        }
    },
    {
        id: 'C5',
        name: '灰西装蕾丝',
        en: 'GREY SUIT LACE',
        gender: 'female',
        img: 'images/people/people-05-front.jpg',
        identity: 'a young East Asian woman in her early twenties with long straight center-parted dark reddish-brown hair, fair skin, oval face, red lips, slender tall figure',
        wear: {
            top: 'oversized grey tailored blazer worn open over a cream sheer lace camisole with long black lace ribbon ties hanging down the front',
            bottom: 'matching grey wide-leg tailored trousers',
            shoes: 'black pointed-toe leather heels',
            accessory: 'wearing a black choker necklace'
        }
    },
    {
        id: 'C6',
        name: '黑裙长靴',
        en: 'BLACK DRESS BOOTS',
        gender: 'female',
        img: 'images/library/lib_cast_1.png',
        identity: 'a young woman in her early twenties with long straight center-parted black hair, fair skin, oval face, gold hoop earrings, slender tall figure',
        wear: {
            top: 'fitted black spaghetti-strap bodycon mini slip dress',
            bottom: null,
            shoes: 'slouchy black leather knee-high pointed-toe boots',
            accessory: 'wearing gold hoop earrings'
        }
    },
    {
        id: 'C7',
        name: '金发镂空',
        en: 'BLONDE CUTOUT',
        gender: 'female',
        img: 'images/library/lib_cast_7.png',
        identity: 'a young woman in her early twenties with long straight platinum blonde hair, pale skin, sharp facial features, tall slender figure',
        wear: {
            top: 'black ribbed turtleneck long-sleeve bodysuit with a diamond fishnet cutout at the chest and side waist cutouts',
            bottom: 'black baggy wide-leg cargo trousers with a black leather belt',
            shoes: 'black chunky platform leather shoes',
            accessory: null
        }
    },
    {
        id: 'C8',
        name: '军绿蕾丝',
        en: 'OLIVE LACE SET',
        gender: 'female',
        img: 'images/library/lib_cast_8.png',
        identity: 'a young woman in her early twenties with shoulder-length platinum blonde hair, pale skin, delicate facial features, layered silver necklaces, slender figure',
        wear: {
            top: 'olive green lace camisole crop top with crisscross lace-up front and hanging tie strings',
            bottom: 'matching olive green ruched draped midi skirt with side ruching',
            shoes: 'olive green leather ankle boots',
            accessory: 'wearing layered silver chain necklaces'
        }
    }
];

const findCast = (id) => CAST.find((c) => c.id === id) || null;

const TOP_PHRASES = {
    O1: 'oversized black and white plaid flannel shirt with frayed raw hem layered over a long grey plaid shirt',
    O2: 'black leather biker jacket covered with silver studs and spikes',
    O3: 'sheer black mesh ruffled long sleeve top with lace tie details, black fingerless gloves',
    O4: 'olive dark green lace-up camisole top with thin straps and hanging drawstrings',
    O5: 'black fishnet knit long sleeve top with chest cutout and high neck',
    O6: 'black glossy leather tank top',
    O7: 'oversized black technical nylon parka coat with hood and drawstrings',
    O8: 'black silk turtleneck long sleeve top',
    O9: 'retro Brazil tie-dye football jersey in green yellow and blue with number 26 print',
    O10: 'cropped brown suede double-breasted jacket with shoulder epaulets',
    O11: 'sleeveless blue water-ripple print tank top with white trim',
    O12: 'black long-sleeve square-neck spiderweb cutout top with asymmetric hem',
    O13: 'blue and black vertical striped football jersey with crest patches',
    O14: 'oversized grey tailored blazer worn open over a lace-trim inner top',
    O15: 'sleeveless blue denim patchwork top with frayed seams and a navy silk neckerchief scarf tied at the neck',
    O16: 'navy and burgundy color-block V-neck cropped football jersey with grey shoulder panels',
    O17: 'olive green lace camisole top with crisscross lace-up front, thin straps and drawstring ties'
};

const BOTTOM_PHRASES = {
    O18: 'loose green corduroy pull-on shorts with elastic waistband',
    O19: 'khaki grey cropped seven-point trousers with a red braided rope belt',
    O20: 'brown flared trousers with blue triangle inserts at the hems and a large blue western belt buckle',
    O21: 'light pink satin midi slip skirt with small scattered floral embroidery',
    O22: 'grey-green apron-style wrap skirt with brown striped knit sleeves tied around the waist',
    O23: 'grey asymmetric pleated mini kilt skirt with a black leather belt',
    O24: 'olive green ruched draped maxi skirt with side drawstring ruching'
};

const LOOK_BOTTOM_PHRASES = {
    L01: 'matching black and white plaid mini skirt with frayed raw hem',
    L02: 'loose ripped blue denim wide leg jeans',
    L03: 'black leather mini skirt with zipper details',
    L04: 'draped olive green mini skirt',
    L05: 'black baggy cargo trousers with leather belt',
    L06: 'long black leather maxi skirt with elastic waist',
    L07: 'black wide leg trousers',
    L08: 'black wide leg trousers'
};

const TOPS = OUTFITS.filter((o) => Number(o.id.slice(1)) <= 17);
const BOTTOMS = OUTFITS.filter((o) => Number(o.id.slice(1)) >= 18);

const SHOE_PHRASES = {
    S1: 'black chunky leather platform boots with thick soles',
    S2: 'black technical lace-up sneakers',
    S3: 'black leather loafers',
    S4: 'black pointed-toe stiletto high heels',
    S5: 'black chunky leather loafers with thick platform soles worn with white ribbed crew socks',
    S6: 'olive green leather ankle boots with side zip'
};

const ACCESSORY_PHRASES = {
    A1: 'wearing a black baseball cap',
    A2: 'wearing layered delicate silver chain necklaces',
    A3: 'carrying a small black leather underarm shoulder bag',
    A4: 'wearing black thick-frame sunglasses'
};

const POSE_PHRASES = {
    P1: 'walking mid-stride in a dynamic movement pose',
    P2: 'standing with hands on hips in a confident pose',
    P3: 'sitting on a black stool in a relaxed pose',
    P4: 'looking back over her shoulder in a three-quarter back view pose'
};

const LOOK_POSE_PHRASES = {
    '侧身站立': 'standing in side profile',
    '正面站立': 'standing facing front'
};
