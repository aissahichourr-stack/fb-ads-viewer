document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('adsContainer');
    const searchInput = document.getElementById('searchInput');
    const countryFilter = document.getElementById('countryFilter');
    const countDisplay = document.getElementById('countDisplay');

    let allAds = [];

    // 1. جلب ملف ads.json
    fetch('ads.json')
        .then(response => {
            if (!response.ok) throw new Error("لم يتم العثور على ملف ads.json");
            return response.json();
        })
        .then(data => {
            // معالجة اختلاف هيكلة Apify (أحيانا تكون array مباشرة وأحيانا داخل object)
            allAds = Array.isArray(data) ? data : (data.results || []); // تعديل حسب نوع السكرايبر
            
            // استخراج الدول للملء الفلتر
            populateCountries(allAds);
            
            // عرض الإعلانات
            renderAds(allAds);
        })
        .catch(err => {
            container.innerHTML = `<p class="text-red-500 text-center col-span-3">خطأ: تأكد من رفع ملف ads.json في نفس المجلد.<br>(${err.message})</p>`;
        });

    // دالة العرض
    function renderAds(ads) {
        container.innerHTML = '';
        countDisplay.textContent = `${ads.length} إعلان`;

        if (ads.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center col-span-3">لا توجد نتائج</p>';
            return;
        }

        ads.forEach(ad => {
            // محاولة استخراج البيانات من حقول مختلفة حسب السكرايبر
            const pageName = ad.pageName || ad.page_name || 'صفحة غير معروفة';
            const bodyText = ad.adBody || ad.ad_creative_body || ad.text || 'بدون نص';
            const link = ad.adSnapshotUrl || ad.ad_snapshot_url || '#';
            const startDate = ad.startDate || ad.ad_delivery_start_time || '';
            const platform = ad.publisherPlatforms ? ad.publisherPlatforms.join(', ') : 'Facebook';
            
            // إنشاء الكارت
            const card = document.createElement('div');
            card.className = 'ad-card bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 flex flex-col';
            
            card.innerHTML = `
                <div class="p-4 flex-1">
                    <div class="flex justify-between items-start mb-3">
                        <h3 class="font-bold text-lg text-white">${pageName}</h3>
                        <span class="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded">${platform}</span>
                    </div>
                    <p class="text-slate-300 text-sm mb-4 line-clamp-6">${bodyText.substring(0, 200)}...</p>
                    <div class="text-xs text-slate-500 mb-2">تاريخ البدء: ${startDate.split('T')[0]}</div>
                </div>
                <div class="p-4 bg-slate-900 border-t border-slate-700">
                    <a href="${link}" target="_blank" class="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition">
                        👁 مشاهدة الإعلان الأصلي
                    </a>
                </div>
            `;
            container.appendChild(card);
        });
    }

    function populateCountries(ads) {
        // هذه تعتمد على وجود حقل الدولة، سنتركها بسيطة الآن
    }

    // البحث المباشر
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allAds.filter(ad => {
            const text = (ad.adBody || ad.ad_creative_body || '').toLowerCase();
            const page = (ad.pageName || ad.page_name || '').toLowerCase();
            return text.includes(term) || page.includes(term);
        });
        renderAds(filtered);
    });
});
