// scripts/config.js - إعدادات التطبيق

const API_BASE_URL = 'http://localhost:3000/api/v1';

const API_ENDPOINTS = {
    // المصادقة
    AUTH: {
        REGISTER: `${API_BASE_URL}/auth/register`,
        LOGIN: `${API_BASE_URL}/auth/login`,
        LOGOUT: `${API_BASE_URL}/auth/logout`,
        ME: `${API_BASE_URL}/auth/me`
    },
    // نقاط الاهتمام
    POI: {
        GET_ALL: `${API_BASE_URL}/poi`,
        GET_BY_RADIUS: (distance, lat, lng) => `${API_BASE_URL}/poi/radius/${distance}/${lat}/${lng}`,
        SEARCH: `${API_BASE_URL}/poi/search`,
        CREATE: `${API_BASE_URL}/poi`
    }
};

// إعدادات الخريطة
const MAP_CONFIG = {
    DEFAULT_LAT: 32.8872,
    DEFAULT_LNG: 14.2655,
    DEFAULT_ZOOM: 13,
    TILE_LAYER: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    TILE_ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};

// تخزين بيانات المستخدم
let currentUser = null;

// دالة لحفظ التوكن في localStorage
function saveToken(token) {
    localStorage.setItem('authToken', token);
}

// دالة لجلب التوكن من localStorage
function getToken() {
    return localStorage.getItem('authToken');
}

// دالة لحذف التوكن من localStorage
function clearToken() {
    localStorage.removeItem('authToken');
}

// دالة لحفظ بيانات المستخدم
function saveUser(user) {
    currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
}

// دالة لجلب بيانات المستخدم
function getUser() {
    if (!currentUser) {
        const user = localStorage.getItem('user');
        currentUser = user ? JSON.parse(user) : null;
    }
    return currentUser;
}

// دالة لحذف بيانات المستخدم
function clearUser() {
    currentUser = null;
    localStorage.removeItem('user');
}

// دالة للتحقق من تسجيل المستخدم
function isUserLoggedIn() {
    return !!getToken() && !!getUser();
}
