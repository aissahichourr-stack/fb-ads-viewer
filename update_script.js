const { ApifyClient } = require('apify-client');
const fs = require('fs');

// 1. إعداد العميل باستخدام التوكن من الـ Secrets
const client = new ApifyClient({
    token: process.env.APIFY_TOKEN,
});

async function main() {
    console.log("Starting Apify Actor...");

    // 2. تشغيل الـ Actor (استبدل هذا بـ Actor ID الخاص بك)
    // مثلاً: 'curious_coder/facebook-ads-library-scraper'
    // أو 'apify/facebook-ads-scraper'
    // لازم تتأكد من الإسم الصحيح اللي راك تستخدمو
    const actorId = 'curious_coder/facebook-ads-library-scraper'; 

    // 3. إعداد المدخلات (Input) - نفس اللي درتها في Apify Console
    const input = {
        "startUrls": [
            { "url": "https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=DZ&q=serum&sort_data[direction]=desc&sort_data[mode]=relevancy_monthly_grouped&search_type=keyword_unordered&media_type=all" }
        ],
        "resultsLimit": 200, // عدد الإعلانات
        "countryCode": "DZ", // كود الدولة (اختياري حسب السكرايبر)
    };

    // 4. تشغيل المهمة وانتظار النهاية
    console.log("Running actor...");
    const run = await client.actor(actorId).call(input);
    console.log(`Actor finished! Run ID: ${run.id}`);

    // 5. جلب النتائج من Dataset
    console.log("Fetching results...");
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    // 6. حفظ النتائج في ملف ads.json
    fs.writeFileSync('ads.json', JSON.stringify(items, null, 2));
    console.log(`Saved ${items.length} ads to ads.json`);
}

main().catch(err => {
    console.error("Error:", err);
    process.exit(1);
});
