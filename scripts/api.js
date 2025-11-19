// scripts/api.js - دوال التعامل مع API

// دالة عامة لإرسال طلبات HTTP
async function fetchAPI(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    // إضافة التوكن إلى رأس الطلب إذا كان موجوداً
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// ===== دوال المصادقة =====

async function registerUser(username, email, password) {
    try {
        const data = await fetchAPI(API_ENDPOINTS.AUTH.REGISTER, {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });

        if (data.success) {
            saveToken(data.token);
            saveUser(data.user);
        }

        return data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function loginUser(email, password) {
    try {
        const data = await fetchAPI(API_ENDPOINTS.AUTH.LOGIN, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (data.success) {
            saveToken(data.token);
            saveUser(data.user);
        }

        return data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function logoutUser() {
    try {
        await fetchAPI(API_ENDPOINTS.AUTH.LOGOUT, {
            method: 'GET'
        });

        clearToken();
        clearUser();

        return { success: true };
    } catch (error) {
        console.error('Logout Error:', error);
        // حتى لو فشل الطلب، نحذف البيانات محلياً
        clearToken();
        clearUser();
        return { success: true };
    }
}

async function getCurrentUser() {
    try {
        const data = await fetchAPI(API_ENDPOINTS.AUTH.ME, {
            method: 'GET'
        });

        if (data.success) {
            saveUser(data.data);
        }

        return data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ===== دوال نقاط الاهتمام (POI) =====

async function getAllPOIs() {
    try {
        const data = await fetchAPI(API_ENDPOINTS.POI.GET_ALL, {
            method: 'GET'
        });

        return data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getPOIsByRadius(distance, lat, lng) {
    try {
        const url = API_ENDPOINTS.POI.GET_BY_RADIUS(distance, lat, lng);
        const data = await fetchAPI(url, {
            method: 'GET'
        });

        return data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function searchPOIs(query, category) {
    try {
        const params = new URLSearchParams();
        if (query) params.append('query', query);
        if (category) params.append('category', category);

        const url = `${API_ENDPOINTS.POI.SEARCH}?${params.toString()}`;
        const data = await fetchAPI(url, {
            method: 'GET'
        });

        return data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function createPOI(poiData) {
    try {
        const data = await fetchAPI(API_ENDPOINTS.POI.CREATE, {
            method: 'POST',
            body: JSON.stringify(poiData)
        });

        return data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}
