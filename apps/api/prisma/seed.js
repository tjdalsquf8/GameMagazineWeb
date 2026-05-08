"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function seedNewsSources() {
    const sources = [
        { name: '게임메카', url: 'https://www.gamemeca.com/rss.php', language: 'ko' },
        {
            name: 'Push Square',
            url: 'https://www.pushsquare.com/feeds/latest',
            language: 'en',
            platform: 'PlayStation',
        },
        {
            name: 'Pure Xbox',
            url: 'https://www.purexbox.com/feeds/latest',
            language: 'en',
            platform: 'Xbox',
        },
        {
            name: 'Nintendo Life',
            url: 'https://www.nintendolife.com/feeds/latest',
            language: 'en',
            platform: 'Nintendo',
        },
        {
            name: 'lolesports',
            url: 'https://esports-api.lolesports.com/persisted/gw',
            language: 'en',
            platform: 'Esports',
        },
    ];
    for (const source of sources) {
        await prisma.newsSource.upsert({
            where: { url: source.url },
            update: {},
            create: source,
        });
    }
    console.log(`[Seed] NewsSource ${sources.length}개 완료`);
}
async function seedNewsCategories() {
    const categories = [
        {
            mainCategory: 'PC',
            name: '리그오브레전드',
            keywords: ['리그오브레전드', '롤', 'lol', '롤드컵', '라이엇', 'league of legends', '2xko'],
            excludes: [],
            order: 1,
        },
        {
            mainCategory: 'PC',
            name: '발로란트',
            keywords: ['발로란트', 'valorant'],
            excludes: [],
            order: 2,
        },
        {
            mainCategory: 'PC',
            name: '오버워치',
            keywords: ['오버워치', 'overwatch'],
            excludes: ['오버워치 리그', 'overwatch league'],
            order: 3,
        },
        {
            mainCategory: 'PC',
            name: '배틀그라운드',
            keywords: ['배틀그라운드', 'pubg', 'battlegrounds'],
            excludes: ['모바일', 'mobile'],
            order: 4,
        },
        {
            mainCategory: 'PC',
            name: '로스트아크',
            keywords: ['로스트아크', 'lost ark'],
            excludes: [],
            order: 5,
        },
        {
            mainCategory: 'PC',
            name: '메이플스토리',
            keywords: ['메이플스토리'],
            excludes: ['메이플스토리m', '메이플스토리M'],
            order: 6,
        },
        {
            mainCategory: 'PC',
            name: '던전앤파이터',
            keywords: ['던전앤파이터', '던파', 'dnf', 'dungeon fighter'],
            excludes: [],
            order: 7,
        },
        {
            mainCategory: 'PC',
            name: '디아블로',
            keywords: ['디아블로', 'diablo'],
            excludes: [],
            order: 8,
        },
        {
            mainCategory: 'PC',
            name: '붉은사막',
            keywords: ['붉은사막'],
            excludes: [],
            order: 9,
        },
        {
            mainCategory: 'Mobile',
            name: '원신',
            keywords: ['원신', 'genshin'],
            excludes: [],
            order: 1,
        },
        {
            mainCategory: 'Mobile',
            name: '붕괴: 스타레일',
            keywords: ['붕괴: 스타레일', '스타레일', 'honkai star rail', 'star rail'],
            excludes: [],
            order: 2,
        },
        {
            mainCategory: 'Mobile',
            name: '워스텔링',
            keywords: ['워스텔링', 'wuthering waves'],
            excludes: [],
            order: 3,
        },
        {
            mainCategory: 'Mobile',
            name: '배틀그라운드 모바일',
            keywords: ['배틀그라운드 모바일', 'pubg mobile', '배그 모바일'],
            excludes: [],
            order: 4,
        },
        {
            mainCategory: 'Mobile',
            name: '리니지M',
            keywords: ['리니지m', '리니지M', 'lineage m'],
            excludes: [],
            order: 5,
        },
        {
            mainCategory: 'Mobile',
            name: '나혼자만레벨업',
            keywords: ['나혼자만레벨업', '나혼렙', 'solo leveling arise'],
            excludes: [],
            order: 6,
        },
        {
            mainCategory: 'Mobile',
            name: '메이플스토리M',
            keywords: ['메이플스토리m', '메이플스토리M'],
            excludes: [],
            order: 7,
        },
        {
            mainCategory: 'Mobile',
            name: '승리의 여신: 니케',
            keywords: ['니케', 'nikke', '승리의 여신: 니케'],
            excludes: [],
            order: 8,
        },
        {
            mainCategory: 'Console',
            name: 'PlayStation',
            keywords: ['플레이스테이션', 'playstation', 'ps5', 'ps4', '소니', 'sony'],
            excludes: [],
            order: 1,
        },
        {
            mainCategory: 'Console',
            name: 'Xbox',
            keywords: ['엑스박스', 'xbox', '마이크로소프트', 'microsoft', '게임패스', 'game pass'],
            excludes: [],
            order: 2,
        },
        {
            mainCategory: 'Console',
            name: 'Nintendo',
            keywords: ['닌텐도', 'nintendo', '스위치', 'switch', 'ns2'],
            excludes: [],
            order: 3,
        },
        {
            mainCategory: 'Esports',
            name: 'LCK',
            keywords: ['lck', 't1', '젠지', 'gen.g', 'kt롤스터', '디플러스기아', '한화생명', '농심레드포스'],
            excludes: [],
            order: 1,
        },
        {
            mainCategory: 'Esports',
            name: 'VCT',
            keywords: ['vct', 'valorant champions'],
            excludes: [],
            order: 2,
        },
    ];
    for (const cat of categories) {
        await prisma.newsCategory.upsert({
            where: { mainCategory_name: { mainCategory: cat.mainCategory, name: cat.name } },
            update: { keywords: cat.keywords, excludes: cat.excludes, order: cat.order },
            create: cat,
        });
    }
    console.log(`[Seed] NewsCategory ${categories.length}개 완료`);
}
async function main() {
    console.log('[Seed] 시작');
    await seedNewsSources();
    await seedNewsCategories();
    console.log('[Seed] 완료');
}
main()
    .catch((e) => {
    console.error('[Seed] 오류:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map