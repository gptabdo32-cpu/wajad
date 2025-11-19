// scripts/map.js - منطق الخريطة التفاعلية

let map = null;
let markers = [];
let currentCategory = 'all';

// تهيئة الخريطة
function initMap() {
    map = L.map('leaflet-map').setView(
        [MAP_CONFIG.DEFAULT_LAT, MAP_CONFIG.DEFAULT_LNG],
        MAP_CONFIG.DEFAULT_ZOOM
    );

    L.tileLayer(MAP_CONFIG.TILE_LAYER, {
        attribution: MAP_CONFIG.TILE_ATTRIBUTION,
        maxZoom: 19
    }).addTo(map);

    // تحميل نقاط الاهتمام
    loadPOIs();

    // إضافة مستمعي الأحداث لأزرار التصفية
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', filterPOIs);
    });
}

// تحميل نقاط الاهتمام من API
async function loadPOIs() {
    const result = await getAllPOIs();

    if (result.success) {
        displayPOIs(result.data);
    } else {
        console.error('Failed to load POIs:', result.error);
    }
}

// عرض نقاط الاهتمام على الخريطة
function displayPOIs(pois) {
    // حذف العلامات القديمة
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // إضافة علامات جديدة
    pois.forEach(poi => {
        if (poi.location && poi.location.coordinates) {
            const [lng, lat] = poi.location.coordinates;

            const marker = L.marker([lat, lng]).addTo(map);

            // إضافة popup عند النقر على العلامة
            marker.bindPopup(`
                <div class="leaflet-popup-content">
                    <h3>${poi.name}</h3>
                    <p><strong>الفئة:</strong> ${poi.category.join(', ')}</p>
                    <p><strong>الوصف:</strong> ${poi.description}</p>
                    <p><strong>العنوان:</strong> ${poi.address}</p>
                    ${poi.rating ? `<p class="poi-card-rating">⭐ ${poi.rating}/5</p>` : ''}
                </div>
            `);

            markers.push(marker);
        }
    });

    // تحديث قائمة نقاط الاهتمام
    displayPOIsList(pois);
}

// عرض قائمة نقاط الاهتمام
function displayPOIsList(pois) {
    const container = document.getElementById('pois-container');
    container.innerHTML = '';

    pois.forEach(poi => {
        const card = document.createElement('div');
        card.className = 'poi-card';
        card.innerHTML = `
            <h4>${poi.name}</h4>
            <p>${poi.description}</p>
            <div>
                ${poi.category.map(cat => `<span class="poi-card-category">${cat}</span>`).join('')}
            </div>
            <p><strong>العنوان:</strong> ${poi.address}</p>
            ${poi.rating ? `<div class="poi-card-rating">⭐ ${poi.rating}/5</div>` : ''}
        `;

        // عند النقر على البطاقة، انتقل إلى الموقع على الخريطة
        card.addEventListener('click', () => {
            if (poi.location && poi.location.coordinates) {
                const [lng, lat] = poi.location.coordinates;
                map.setView([lat, lng], 15);
            }
        });

        container.appendChild(card);
    });
}

// تصفية نقاط الاهتمام حسب الفئة
async function filterPOIs(event) {
    const btn = event.target;
    const category = btn.dataset.category;

    // تحديث الزر النشط
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    currentCategory = category;

    // جلب نقاط الاهتمام المصفاة
    if (category === 'all') {
        await loadPOIs();
    } else {
        const result = await searchPOIs('', category);
        if (result.success) {
            displayPOIs(result.data);
        }
    }
}

// البحث عن نقاط الاهتمام بناءً على الموقع الحالي
async function searchNearby() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const result = await getPOIsByRadius(5, latitude, longitude); // 5 كم

            if (result.success) {
                displayPOIs(result.data);
                map.setView([latitude, longitude], 14);
            }
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}
