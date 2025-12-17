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
      allAds = Array.isArray(data) ? data : (data.results || []);
      populateCountries(allAds);
      renderAds(allAds);
    })
    .catch(err => {
      console.error('Error:', err);
      container.innerHTML = `<p class="text-red-500 text-center col-span-3">خطأ: ${err.message}</p>`;
    });

  function renderAds(ads) {
    container.innerHTML = '';
    countDisplay.textContent = `${ads.length} إعلان`;
    
    if (ads.length === 0) {
      container.innerHTML = '<p class="text-gray-500 text-center col-span-3">لا توجد نتائج</p>';
      return;
    }
    
    ads.forEach(ad => {
      // استخراج بيانات من Apify
      const snapshot = ad.snapshot || {};
      const pageName = String(snapshot.page_name || ad.pageName || 'صفحة غير معروفة');
      const adBody = String(snapshot.body || ad.adBody || "بدون نص");
      const pageProfilePicture = snapshot.page_profile_picture_url || ad.image || '';
      const pageProfileUri = snapshot.page_profile_uri || ad.link || '#';
      const adLibraryUrl = ad.ad_library_url || '#';
      
      // استخراج التاريخ
      let displayDate = 'غير معروف';
      if (ad.creation_date) {
        displayDate = new Date(ad.creation_date).toLocaleDateString('ar-DZ');
      } else if (snapshot.creation_date) {
        displayDate = new Date(snapshot.creation_date).toLocaleDateString('ar-DZ');
      }
      
      const card = document.createElement('div');
      card.className = 'ad-card bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 flex flex-col';
      
      const displayText = adBody.length > 150 ? adBody.substring(0, 150) + '...' : adBody;
      
      // بناء الكارت
      card.innerHTML = `
        <div class="p-4 flex-1">
          ${pageProfilePicture ? `<img src="${escapeHtml(pageProfilePicture)}" alt="${escapeHtml(pageName)}" class="w-full h-40 object-cover rounded-lg mb-3" onerror="this.style.display='none'">` : ''}
          <div class="flex justify-between items-start mb-3">
            <h3 class="font-bold text-lg text-white flex-1">${escapeHtml(pageName)}</h3>
            <span class="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded">Facebook</span>
          </div>
          <p class="text-slate-300 text-sm mb-3 line-clamp-5">${escapeHtml(displayText)}</p>
          <div class="text-xs text-slate-400 mb-2">📅 ${displayDate}</div>
          <div class="text-xs text-slate-500">ID: ${escapeHtml(String(ad.ad_archive_id || ad.id || 'N/A').substring(0, 12))}...</div>
        </div>
        <div class="p-4 bg-slate-900 border-t border-slate-700 flex gap-2">
          <a href="${escapeHtml(String(adLibraryUrl))}" target="_blank" class="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded transition text-sm">
            👁 مشاهدة أصلي
          </a>
          <a href="${escapeHtml(String(pageProfileUri))}" target="_blank" class="flex-1 text-center bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-3 rounded transition text-sm">
            📋 الصفحة
          </a>
        </div>
      `;
      container.appendChild(card);
    });
  }

  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
  }

  function populateCountries(ads) {
    // متروك للمستقبل
  }

  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allAds.filter(ad => {
      const snapshot = ad.snapshot || {};
      const body = String(snapshot.body || ad.adBody || '').toLowerCase();
      const page = String(snapshot.page_name || ad.pageName || '').toLowerCase();
      return body.includes(term) || page.includes(term);
    });
    renderAds(filtered);
  });
});
