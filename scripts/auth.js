// scripts/auth.js - منطق المصادقة

let authModal = null;

// تهيئة عناصر المصادقة
function initAuth() {
    authModal = document.getElementById('auth-modal');
    const authToggleBtn = document.getElementById('auth-toggle-btn');
    const closeBtn = document.querySelector('.close-btn');
    const toggleFormLinks = document.querySelectorAll('.toggle-form');

    // فتح/إغلاق الـ Modal
    authToggleBtn.addEventListener('click', openAuthModal);
    closeBtn.addEventListener('click', closeAuthModal);

    // التبديل بين نماذج التسجيل والدخول
    toggleFormLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const formType = link.dataset.form;
            switchAuthForm(formType);
        });
    });

    // معالجات النماذج
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);

    // تحديث واجهة المستخدم بناءً على حالة تسجيل الدخول
    updateAuthUI();
}

// فتح الـ Modal
function openAuthModal() {
    authModal.classList.remove('hidden');
    authModal.classList.add('show');
}

// إغلاق الـ Modal
function closeAuthModal() {
    authModal.classList.add('hidden');
    authModal.classList.remove('show');
}

// التبديل بين نماذج التسجيل والدخول
function switchAuthForm(formType) {
    const loginContainer = document.getElementById('login-form-container');
    const registerContainer = document.getElementById('register-form-container');

    if (formType === 'login') {
        loginContainer.classList.add('active');
        loginContainer.classList.remove('hidden');
        registerContainer.classList.remove('active');
        registerContainer.classList.add('hidden');
    } else if (formType === 'register') {
        registerContainer.classList.add('active');
        registerContainer.classList.remove('hidden');
        loginContainer.classList.remove('active');
        loginContainer.classList.add('hidden');
    }
}

// معالج تسجيل الدخول
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const result = await loginUser(email, password);

    if (result.success) {
        showMessage('تم تسجيل الدخول بنجاح!', 'success');
        closeAuthModal();
        updateAuthUI();
        // إعادة تحميل الصفحة بعد ثانية واحدة
        setTimeout(() => location.reload(), 1000);
    } else {
        showMessage(result.error || 'فشل تسجيل الدخول', 'error');
    }
}

// معالج التسجيل
async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;

    // التحقق من تطابق كلمات المرور
    if (password !== passwordConfirm) {
        showMessage('كلمات المرور غير متطابقة', 'error');
        return;
    }

    const result = await registerUser(username, email, password);

    if (result.success) {
        showMessage('تم إنشاء الحساب بنجاح!', 'success');
        closeAuthModal();
        updateAuthUI();
        // إعادة تحميل الصفحة بعد ثانية واحدة
        setTimeout(() => location.reload(), 1000);
    } else {
        showMessage(result.error || 'فشل إنشاء الحساب', 'error');
    }
}

// تحديث واجهة المستخدم بناءً على حالة تسجيل الدخول
function updateAuthUI() {
    const authNavItem = document.getElementById('auth-nav-item');
    const isLoggedIn = isUserLoggedIn();

    if (isLoggedIn) {
        const user = getUser();
        authNavItem.innerHTML = `
            <div class="user-info">
                <span>مرحباً، ${user.username}</span>
                <button class="logout-btn" id="logout-btn">تسجيل الخروج</button>
            </div>
        `;

        document.getElementById('logout-btn').addEventListener('click', handleLogout);
    } else {
        authNavItem.innerHTML = `
            <button id="auth-toggle-btn" class="btn-auth">تسجيل الدخول</button>
        `;

        document.getElementById('auth-toggle-btn').addEventListener('click', openAuthModal);
    }
}

// معالج تسجيل الخروج
async function handleLogout() {
    await logoutUser();
    showMessage('تم تسجيل الخروج بنجاح', 'success');
    updateAuthUI();
    // إعادة تحميل الصفحة بعد ثانية واحدة
    setTimeout(() => location.reload(), 1000);
}

// عرض رسائل النجاح والخطأ
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    document.body.insertBefore(messageDiv, document.body.firstChild);

    // إزالة الرسالة بعد 3 ثوان
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}
