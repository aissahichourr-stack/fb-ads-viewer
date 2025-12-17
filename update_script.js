const { ApifyClient } = require('apify-client');
const fs = require('fs');

// إعداد العميل باستخدام التوكن من الـ Secrets
const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

async function main() {
  try {
    console.log('Starting Apify Actor...');
    
    // التحقق من التوكن
    if (!process.env.APIFY_TOKEN) {
      throw new Error('APIFY_TOKEN environment variable is not set');
    }
    
    // Actor ID - تأكد من استخدام Actor ID الصحيح
    // الخيارات الشهيرة:
    // - 'curious_coder/facebook-ads-library-scraper'
    // - 'apify/facebook-ads-scraper'
    const actorId = 'curious_coder/facebook-ads-library-scraper';
    
    // إعداد المدخلات - نفس اللي درتها في Apify Console
    const input = {
      "startUrls": [
        {
          "url": "https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=DZ&q=serum&sort_data[direction]=desc&sort_data[mode]=relevancy_monthly_grouped&search_type=keyword_unordered&media_type=all"
        }
      ],
      "resultsLimit": 200,
      "countryCode": "DZ",
    };
    
    console.log(`Running actor: ${actorId}`);
    
    // تشغيل المهمة وانتظار النهاية
    let run;
    try {
      run = await client.actor(actorId).call(input);
    } catch (actorError) {
      console.error('Error running actor:', actorError.message);
      if (actorError.message.includes('not found')) {
        throw new Error(`Actor "${actorId}" not found. Please check the Actor ID.`);
      }
      throw actorError;
    }
    
    console.log(`Actor finished! Run ID: ${run.id}`);
    
    // جلب النتائج من Dataset
    console.log('Fetching results...');
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    
    if (!items || items.length === 0) {
      console.warn('Warning: No items returned from the actor');
    }
    
    // حفظ النتائج في ملف ads.json
    fs.writeFileSync('ads.json', JSON.stringify(items || [], null, 2));
    console.log(`Successfully saved ${items.length} ads to ads.json`);
    
  } catch (err) {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    process.exit(1);
  }
}

main();
