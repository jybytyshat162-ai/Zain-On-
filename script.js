import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, get, set, push, update, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// إعدادات ومفاتيح الربط الخاصة بقاعدتك المفتوحة لـ "زين أون لاين"
const firebaseConfig = {
    apiKey: "AIzaSyAUmiSv1NdOWCZhJCGab6in028MPhNjFgE",
    authDomain: "zain-online-938c5.firebaseapp.com",
    databaseURL: "https://zain-online-938c5-default-rtdb.firebaseio.com",
    projectId: "zain-online-938c5",
    storageBucket: "zain-online-938c5.firebasestorage.app",
    messagingSenderId: "76098093405",
    appId: "1:76098093405:web:672fec6028e89e434b68b4",
    measurementId: "G-EEK45Z2HC8"
};

// تهيئة قاعدة البيانات
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let allProducts = []; // مخزن المنتجات محلياً للبحث والتصفية
let currentCart = []; // مصفوفة السلة
let globalTotalSum = 0; // إجمالي السلة الفعلي الحالي

// ===== استعادة السلة من localStorage =====
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('zain_cart');
    if (savedCart) {
        try {
            currentCart = JSON.parse(savedCart);
            cleanExpiredCartItems();
            updateCartUI();
        } catch (e) {
            currentCart = [];
        }
    }
}

// ===== تنظيف المنتجات المنتهية (أكثر من 30 يوم) =====
function cleanExpiredCartItems() {
    const now = Date.now();
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    let removedCount = 0;
    
    currentCart = currentCart.filter(item => {
        const addedAt = item.addedAt || 0;
        const age = now - addedAt;
        if (age > thirtyDaysInMs) {
            removedCount++;
            return false;
        }
        return true;
    });
    
    if (removedCount > 0) {
        localStorage.setItem('zain_cart', JSON.stringify(currentCart));
        console.log(`🗑️ تم إزالة ${removedCount} منتج منتهي الصلاحية من السلة`);
    }
}

// ===== حفظ السلة في localStorage و Firebase =====
function saveCartToStorage() {
    localStorage.setItem('zain_cart', JSON.stringify(currentCart));
    // ✅ حفظ في Firebase أيضاً
    saveCartToFirebase();
}

// ===== حفظ السلة في Firebase =====
async function saveCartToFirebase() {
    const userId = localStorage.getItem('zain_user_id');
    if (!userId) return;
    
    const cartRef = ref(db, `carts/${userId}`);
    try {
        await set(cartRef, {
            items: currentCart,
            updatedAt: Date.now()
        });
    } catch (error) {
        console.error('خطأ في حفظ السلة في Firebase:', error);
    }
}

// ===== تحميل السلة من Firebase =====
async function loadCartFromFirebase() {
    const userId = localStorage.getItem('zain_user_id');
    if (!userId) return;
    
    const cartRef = ref(db, `carts/${userId}`);
    try {
        const snapshot = await get(cartRef);
        if (snapshot.exists()) {
            const data = snapshot.val();
            currentCart = data.items || [];
            localStorage.setItem('zain_cart', JSON.stringify(currentCart));
            updateCartUI();
        }
    } catch (error) {
        console.error('خطأ في جلب السلة من Firebase:', error);
    }
}

// ===== دوال Firebase للتقييمات =====
async function saveRatingToFirebase(productId, rating) {
    const userId = localStorage.getItem('zain_user_id');
    if (!userId) return false;
    
    const ratingRef = ref(db, `ratings/${productId}/${userId}`);
    try {
        await set(ratingRef, {
            rating: rating,
            userName: localStorage.getItem('zain_user_name') || 'مستخدم',
            timestamp: Date.now()
        });
        return true;
    } catch (error) {
        console.error('خطأ في حفظ التقييم:', error);
        return false;
    }
}

async function getProductRatingsFromFirebase(productId) {
    const ratingRef = ref(db, `ratings/${productId}`);
    try {
        const snapshot = await get(ratingRef);
        if (!snapshot.exists()) {
            return { average: 0, count: 0, reviewers: [] };
        }
        
        const ratings = snapshot.val();
        let total = 0;
        const reviewers = [];
        
        for (const [userId, data] of Object.entries(ratings)) {
            total += data.rating;
            reviewers.push({
                userId: userId,
                name: data.userName || 'مستخدم',
                rating: data.rating
            });
        }
        
        return {
            average: Math.round(total / reviewers.length),
            count: reviewers.length,
            reviewers: reviewers
        };
    } catch (error) {
        console.error('خطأ في جلب التقييمات:', error);
        return { average: 0, count: 0, reviewers: [] };
    }
}

// ===== دوال Firebase للمفضلة =====
async function saveFavoriteToFirebase(productId) {
    const userId = localStorage.getItem('zain_user_id');
    if (!userId) return false;
    
    const favRef = ref(db, `favorites/${userId}/${productId}`);
    try {
        await set(favRef, {
            productId: productId,
            addedAt: Date.now()
        });
        return true;
    } catch (error) {
        console.error('خطأ في حفظ المفضلة:', error);
        return false;
    }
}

async function removeFavoriteFromFirebase(productId) {
    const userId = localStorage.getItem('zain_user_id');
    if (!userId) return false;
    
    const favRef = ref(db, `favorites/${userId}/${productId}`);
    try {
        await remove(favRef);
        return true;
    } catch (error) {
        console.error('خطأ في حذف المفضلة:', error);
        return false;
    }
}

async function getFavoritesFromFirebase() {
    const userId = localStorage.getItem('zain_user_id');
    if (!userId) return [];
    
    const favRef = ref(db, `favorites/${userId}`);
    try {
        const snapshot = await get(favRef);
        if (!snapshot.exists()) return [];
        
        const favorites = [];
        snapshot.forEach((child) => {
            favorites.push(child.key);
        });
        return favorites;
    } catch (error) {
        console.error('خطأ في جلب المفضلة:', error);
        return [];
    }
}

// ===== قاموس اللغة =====
const translations = {
    ar: {
        modal_btn_ok: 'موافق',
        modal_prompt_location_placeholder: 'أدخل موقعك...',
        modal_btn_confirm_send: 'تأكيد الإرسال',
        visitor_count_error: 'خطأ في تحديث عدد الزوار',
        products_empty_hint: 'لا توجد منتجات حالياً',
        search_no_results: 'لا توجد نتائج مطابقة للبحث',
        product_currency: 'ريال',
        product_currency_yemeni: 'ريال يمني',
        product_label_new: 'جديد',
        product_no_desc: 'لا يوجد وصف',
        product_stock_qty: 'الكمية المتوفرة: ',
        product_unit_carton: '',
        alert_out_of_stock_title: '⚠️ نفذت الكمية',
        alert_out_of_stock_desc: 'المنتج غير متوفر حالياً',
        alert_stock_insufficient_title: '⚠️ كمية غير كافية',
        alert_stock_insufficient_desc: 'الكمية المطلوبة غير متوفرة، المتوفر: ',
        alert_cart_added_title: '✅ تمت الإضافة',
        alert_cart_added_desc_prefix: 'تم إضافة ',
        alert_cart_added_desc_suffix: ' إلى السلة',
        alert_network_error_title: '⚠️ خطأ في الشبكة',
        alert_network_error_desc: 'حدث خطأ في الاتصال: ',
        empty_cart_title: 'عربة تسوقك فارغة',
        empty_cart_desc: 'تصفح الأقسام والمنتجات الآن وأضف ما تحتاجه',
        gateway_loading: 'جاري تحميل طرق الدفع...',
        gateway_no_accounts: 'لا توجد حسابات دفع متاحة',
        gateway_owner_admin: 'المالك',
        warning_deposit: '⚠️ يرجى إيداع المبلغ الصافي',
        alert_copied_title: '✅ تم النسخ',
        alert_copied_desc: 'تم نسخ رقم الحساب',
        alert_acc_number_title: 'رقم الحساب',
        alert_acc_number_desc: 'رقم الحساب: ',
        alert_cart_empty_title: '⚠️ السلة فارغة',
        alert_cart_empty_desc: 'أضف منتجات إلى السلة أولاً',
        alert_order_success_title: '✅ تم إرسال الطلب',
        alert_order_success_desc_prefix: 'تم إرسال طلبك رقم ',
        alert_order_success_desc_suffix: ' بنجاح',
        modal_prompt_location_title: '📍 أدخل موقعك',
        modal_prompt_location_subtitle: 'أدخل المحافظة والمدينة للشحن',
        location_loading_attempt: 'جاري تحميل الموقع...',
        location_geo_text: 'الموقع الجغرافي (طول: ',
        location_geo_lat: '، عرض: ',
        location_denied_text: 'تم رفض الوصول للموقع',
        order_invoice_title: '📋 فاتورة طلب رقم #',
        order_invoice_address: '📍 عنوان التوصيل: ',
        order_invoice_total: '💰 الإجمالي: ',
        order_invoice_status_pending: '⏳ الحالة: قيد المراجعة',
        order_stock_update_error: 'خطأ في تحديث المخزون: ',
        telegram_notification_prefix: '📦 طلب جديد:\n',
        telegram_notification_suffix: '\n\n🔗 للمتابعة: ',
        telegram_send_error: 'خطأ في إرسال التليجرام للـ ',
        chat_default_welcome: 'مرحباً! كيف يمكننا مساعدتك؟',
        chat_time_now: 'الآن',
        chat_support_name: 'الدعم الفني',
        chat_tooltip_pin: 'تثبيت',
        chat_tooltip_delete: 'حذف',
        alert_login_required_title: '⚠️ مطلوب تسجيل الدخول',
        alert_login_required_desc: 'يجب عليك إنشاء حساب أو تسجيل الدخول لإضافة منتجات إلى السلة.',
        alert_cart_deleted_title: '🗑️ تم الحذف',
        alert_cart_deleted_desc: 'تم حذف "',
        alert_cart_deleted_suffix: '" من السلة',
        alert_cart_expired_title: '🕒 انتهاء الصلاحية',
        alert_cart_expired_desc: 'تم إزالة '
    },
    en: {
        modal_btn_ok: 'OK',
        modal_prompt_location_placeholder: 'Enter your location...',
        modal_btn_confirm_send: 'Confirm & Send',
        visitor_count_error: 'Error updating visitor count',
        products_empty_hint: 'No products available',
        search_no_results: 'No results found',
        product_currency: 'YER',
        product_currency_yemeni: 'Yemeni Rial',
        product_label_new: 'New',
        product_no_desc: 'No description',
        product_stock_qty: 'Available: ',
        product_unit_carton: '',
        alert_out_of_stock_title: '⚠️ Out of Stock',
        alert_out_of_stock_desc: 'Product is currently unavailable',
        alert_stock_insufficient_title: '⚠️ Insufficient Stock',
        alert_stock_insufficient_desc: 'Requested quantity not available, available: ',
        alert_cart_added_title: '✅ Added to Cart',
        alert_cart_added_desc_prefix: 'Added ',
        alert_cart_added_desc_suffix: ' to cart',
        alert_network_error_title: '⚠️ Network Error',
        alert_network_error_desc: 'Connection error: ',
        empty_cart_title: 'Your cart is empty',
        empty_cart_desc: 'Browse products and add what you need',
        gateway_loading: 'Loading payment methods...',
        gateway_no_accounts: 'No payment accounts available',
        gateway_owner_admin: 'Owner',
        warning_deposit: '⚠️ Please deposit the exact amount',
        alert_copied_title: '✅ Copied',
        alert_copied_desc: 'Account number copied',
        alert_acc_number_title: 'Account Number',
        alert_acc_number_desc: 'Account number: ',
        alert_cart_empty_title: '⚠️ Cart is empty',
        alert_cart_empty_desc: 'Add products to cart first',
        alert_order_success_title: '✅ Order Sent',
        alert_order_success_desc_prefix: 'Order #',
        alert_order_success_desc_suffix: ' sent successfully',
        modal_prompt_location_title: '📍 Enter Your Location',
        modal_prompt_location_subtitle: 'Enter governorate and city for shipping',
        location_loading_attempt: 'Loading location...',
        location_geo_text: 'Geo location (long: ',
        location_geo_lat: ', lat: ',
        location_denied_text: 'Location access denied',
        order_invoice_title: '📋 Invoice Order #',
        order_invoice_address: '📍 Delivery Address: ',
        order_invoice_total: '💰 Total: ',
        order_invoice_status_pending: '⏳ Status: Pending Review',
        order_stock_update_error: 'Stock update error: ',
        telegram_notification_prefix: '📦 New Order:\n',
        telegram_notification_suffix: '\n\n🔗 Follow up: ',
        telegram_send_error: 'Telegram send error for ',
        chat_default_welcome: 'Welcome! How can we help you?',
        chat_time_now: 'Now',
        chat_support_name: 'Support Team',
        chat_tooltip_pin: 'Pin',
        chat_tooltip_delete: 'Delete',
        alert_login_required_title: '⚠️ Login Required',
        alert_login_required_desc: 'You must create an account or login to add products to the cart.',
        alert_cart_deleted_title: '🗑️ Deleted',
        alert_cart_deleted_desc: 'Removed "',
        alert_cart_deleted_suffix: '" from cart',
        alert_cart_expired_title: '🕒 Expired',
        alert_cart_expired_desc: 'Removed '
    }
};

// دالة مساعدة سريعة لجلب اللغة الحالية في المتصفح فورا لربط النصوص ديناميكياً
function getCurrentLanguage() {
    return localStorage.getItem("app_language") || "ar";
}

// جلب معرف المستخدم من localStorage (إذا كان مسجل دخول)
let myUserId = localStorage.getItem("zain_user_id");
// ❌ لا ننشئ معرف تلقائياً للزوار

// 🛠️ ================= محرك النوافذ المنبثقة المخصصة الفخمة =================
function showCustomAlert(title, message, type = "success") {
    return new Promise((resolve) => {
        const currentLang = getCurrentLanguage();
        const oldOverlay = document.getElementById("globalModalOverlay");
        if (oldOverlay) oldOverlay.remove();

        let iconName = "check_circle";
        if (type === "warning") iconName = "warning";
        if (type === "error") iconName = "error";

        const overlay = document.createElement("div");
        overlay.id = "globalModalOverlay";
        overlay.className = "custom-modal-overlay";
        overlay.innerHTML = `
            <div class="custom-modal-box">
                <div class="modal-icon-wrapper ${type}">
                    <span class="material-symbols-rounded">${iconName}</span>
                </div>
                <h3>${title}</h3>
                <p>${message}</p>
                <div class="modal-buttons-layout">
                    <button id="modalCloseBtn" class="modal-prime-btn confirm">${translations[currentLang].modal_btn_ok || "موافق"}</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        setTimeout(() => overlay.classList.add("active"), 10);

        document.getElementById("modalCloseBtn").addEventListener("click", () => {
            overlay.classList.remove("active");
            setTimeout(() => { overlay.remove(); resolve(); }, 300);
        });
    });
}

function showCustomPrompt(title, subtitle, defaultInputValue = "") {
    return new Promise((resolve) => {
        const currentLang = getCurrentLanguage();
        const oldOverlay = document.getElementById("globalModalOverlay");
        if (oldOverlay) oldOverlay.remove();

        const overlay = document.createElement("div");
        overlay.id = "globalModalOverlay";
        overlay.className = "custom-modal-overlay";
        overlay.innerHTML = `
            <div class="custom-modal-box">
                <div class="modal-icon-wrapper location">
                    <span class="material-symbols-rounded">distance</span>
                </div>
                <h3>${title}</h3>
                <p>${subtitle}</p>
                <input type="text" id="modalPromptInput" class="modal-input-field" value="${defaultInputValue}" placeholder="${translations[currentLang].modal_prompt_location_placeholder}">
                <div class="modal-buttons-layout">
                    <button id="modalConfirmPromptBtn" class="modal-prime-btn confirm">${translations[currentLang].modal_btn_confirm_send || "تأكيد الإرسال"}</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        setTimeout(() => overlay.classList.add("active"), 10);

        const inputField = document.getElementById("modalPromptInput");
        inputField.focus();
        if(defaultInputValue) inputField.select();

        document.getElementById("modalConfirmPromptBtn").addEventListener("click", () => {
            const resultVal = inputField.value.trim();
            overlay.classList.remove("active");
            setTimeout(() => { overlay.remove(); resolve(resultVal); }, 300);
        });
    });
}
// ====================================================================================

// ================= نظام تسجيل وزيادة عدد الزوار تلقائياً =================
function handleVisitorCount() {
    const currentLang = getCurrentLanguage();
    const visitorsRef = ref(db, 'visitors/count');
    get(visitorsRef).then((snapshot) => {
        let currentCount = 0;
        if (snapshot.exists()) {
            currentCount = snapshot.val();
        }
        set(visitorsRef, currentCount + 1);
    }).catch(err => console.log(translations[currentLang].visitor_count_error));
}
handleVisitorCount();

// ================= نظام التنقل الفوري بين الصفحات =================
const buttons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        pages.forEach(p => p.classList.remove("active"));

        btn.classList.add("active");
        const targetPage = document.getElementById(btn.dataset.page);
        if(targetPage) targetPage.classList.add("active");
    });
});

// ================= جلب البيانات الحية والمباشرة من فايربيز =================
const mainProductsContainer = document.getElementById("mainProductsContainer");

const dbProductsRef = ref(db, 'products');
onValue(dbProductsRef, (snapshot) => {
    const currentLang = getCurrentLanguage();
    if (mainProductsContainer) mainProductsContainer.innerHTML = "";
    allProducts = [];
    
    if (!snapshot.exists()) {
        if (mainProductsContainer) mainProductsContainer.innerHTML = `<p style="text-align:center; width:100%; color:#888; padding:40px;">${translations[currentLang].products_empty_hint}</p>`;
        return;
    }
    
    snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();
        item.id = childSnapshot.key;
        allProducts.push(item);
    });
    
    renderProducts(allProducts);
});

// ===== متغيرات التقييم والمفضلة =====
let currentProductForMenu = null;

// ===== نظام الضغط المطول =====
function setupLongPress(element, product) {
    let pressTimer = null;
    
    // بداية الضغط (الفأرة)
    element.addEventListener('mousedown', function(e) {
        if (e.button === 0) {
            pressTimer = setTimeout(() => {
                showProductMenu(e, product);
            }, 600);
        }
    });
    
    // إلغاء الضغط
    element.addEventListener('mouseup', function() {
        clearTimeout(pressTimer);
    });
    element.addEventListener('mouseleave', function() {
        clearTimeout(pressTimer);
    });
    
    // للشاشات اللمسية
    element.addEventListener('touchstart', function(e) {
        pressTimer = setTimeout(() => {
            showProductMenu(e.touches[0], product);
        }, 600);
    });
    element.addEventListener('touchend', function() {
        clearTimeout(pressTimer);
    });
    element.addEventListener('touchmove', function() {
        clearTimeout(pressTimer);
    });
}

// ===== دالة تبديل عرض قائمة المقيمين (تعريف عالمي) =====
window.toggleReviewers = function(header, e) {
    if (e) {
        e.stopPropagation();
        e.preventDefault();
    }
    const section = header.parentElement;
    const list = section ? section.querySelector('.reviewers-list') : null;
    const arrow = header.querySelector('.reviewers-arrow');
    if (list) {
        if (list.style.display === 'none' || list.style.display === '') {
            list.style.display = 'block';
            if (arrow) arrow.textContent = '▲';
        } else {
            list.style.display = 'none';
            if (arrow) arrow.textContent = '▼';
        }
    }
};

// ===== عرض قائمة المنتج المنبثقة (محدثة مع Firebase) =====
async function showProductMenu(event, product) {
    const currentLang = getCurrentLanguage();
    
    // ✅ التحقق من وجود مستخدم مسجل
    const userId = localStorage.getItem('zain_user_id');
    if (!userId) {
        showCustomAlert(
            '⚠️ مطلوب تسجيل الدخول',
            'يجب عليك تسجيل الدخول لتقييم المنتجات أو إضافتها إلى المفضلة.',
            'warning'
        );
        return;
    }
    
    currentProductForMenu = product;
    
    const oldMenu = document.querySelector('.product-context-menu');
    if (oldMenu) oldMenu.remove();
    
    // ✅ جلب التقييمات من Firebase
    const ratingData = await getProductRatingsFromFirebase(product.id);
    // ✅ جلب المفضلة من Firebase
    const favorites = await getFavoritesFromFirebase();
    const isFav = favorites.includes(product.id);
    
    const menu = document.createElement('div');
    menu.className = 'product-context-menu';
    
    let x = event.clientX || event.pageX;
    let y = event.clientY || event.pageY;
    
    if (event.touches) {
        x = event.clientX;
        y = event.clientY;
    }
    
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        starsHTML += `<span class="star ${i <= ratingData.average ? 'active' : ''}" data-rating="${i}">⭐</span>`;
    }
    
    // ✅ جلب قائمة المقيمين من Firebase
    let reviewersHTML = '';
    if (ratingData.reviewers.length > 0) {
        reviewersHTML = `
            <div class="menu-reviewers-section">
                <div class="reviewers-header" onclick="window.toggleReviewers(this, event)">
                    <span>👥 من قيموا المنتج (${ratingData.reviewers.length})</span>
                    <span class="reviewers-arrow">▼</span>
                </div>
                <div class="reviewers-list" style="display: none;">
                    ${ratingData.reviewers.map(r => `
                        <div class="reviewer-item">
                            <span class="reviewer-icon">👤</span>
                            <span class="reviewer-name">${r.name || 'مستخدم'}</span>
                            <span class="reviewer-stars">${'⭐'.repeat(r.rating)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    menu.innerHTML = `
        <div class="menu-header">
            <strong>${product.name}</strong>
        </div>
        <div class="menu-divider"></div>
        <div class="menu-rating-section">
            <span class="rating-label">⭐ تقييم المنتج (${ratingData.average})</span>
            <div class="stars-container">
                ${starsHTML}
            </div>
        </div>
        ${reviewersHTML}
        <div class="menu-divider"></div>
        <button class="menu-fav-btn ${isFav ? 'active' : ''}" data-product-id="${product.id}">
            <span class="material-symbols-rounded">${isFav ? 'favorite' : 'favorite_border'}</span>
            ${isFav ? '❤️ إزالة من المفضلة' : '🤍 إضافة إلى المفضلة'}
        </button>
        <button class="menu-close-btn">✕ إغلاق</button>
    `;
    
    document.body.appendChild(menu);
    
    menu.style.position = 'fixed';
    menu.style.left = Math.min(x, window.innerWidth - 240) + 'px';
    menu.style.top = Math.min(y, window.innerHeight - 320) + 'px';
    
    setTimeout(() => menu.classList.add('show'), 10);
    
    // أحداث القائمة - التقييم
    menu.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', async function() {
            // ✅ التحقق مرة أخرى قبل التقييم
            const userId = localStorage.getItem('zain_user_id');
            if (!userId) {
                showCustomAlert(
                    '⚠️ مطلوب تسجيل الدخول',
                    'يجب عليك تسجيل الدخول لتقييم المنتجات.',
                    'warning'
                );
                return;
            }
            
            const ratingValue = parseInt(this.dataset.rating);
            
            // ✅ حفظ التقييم في Firebase
            const saved = await saveRatingToFirebase(product.id, ratingValue);
            
            if (saved) {
                // تحديث الواجهة
                menu.querySelectorAll('.star').forEach(s => {
                    s.classList.toggle('active', parseInt(s.dataset.rating) <= ratingValue);
                });
                
                // تحديث التقييمات
                const newRating = await getProductRatingsFromFirebase(product.id);
                const label = menu.querySelector('.rating-label');
                if (label) label.textContent = `⭐ تقييم المنتج (${newRating.average})`;
                
                // تحديث قائمة المقيمين
                if (newRating.reviewers.length > 0) {
                    const section = menu.querySelector('.menu-reviewers-section');
                    if (section) {
                        const header = section.querySelector('.reviewers-header');
                        const list = section.querySelector('.reviewers-list');
                        if (header) {
                            header.innerHTML = `
                                <span>👥 من قيموا المنتج (${newRating.reviewers.length})</span>
                                <span class="reviewers-arrow">▲</span>
                            `;
                            header.setAttribute('onclick', 'window.toggleReviewers(this, event)');
                        }
                        if (list) {
                            list.innerHTML = newRating.reviewers.map(r => `
                                <div class="reviewer-item">
                                    <span class="reviewer-icon">👤</span>
                                    <span class="reviewer-name">${r.name || 'مستخدم'}</span>
                                    <span class="reviewer-stars">${'⭐'.repeat(r.rating)}</span>
                                </div>
                            `).join('');
                            list.style.display = 'block';
                        }
                    }
                }
                
                showCustomAlert('⭐ تم التقييم', `قيمت المنتج بـ ${ratingValue} نجوم`, 'success');
            }
        });
    });
    
    // حدث زر المفضلة
    menu.querySelector('.menu-fav-btn').addEventListener('click', async function() {
        // ✅ التحقق من وجود مستخدم مسجل
        const userId = localStorage.getItem('zain_user_id');
        if (!userId) {
            showCustomAlert(
                '⚠️ مطلوب تسجيل الدخول',
                'يجب عليك تسجيل الدخول لإضافة المنتجات إلى المفضلة.',
                'warning'
            );
            return;
        }
        
        const productId = this.dataset.productId;
        const isFavorite = this.classList.contains('active');
        
        if (isFavorite) {
            // ✅ حذف من Firebase
            await removeFavoriteFromFirebase(productId);
            this.classList.remove('active');
            this.innerHTML = `
                <span class="material-symbols-rounded">favorite_border</span>
                🤍 إضافة إلى المفضلة
            `;
            showCustomAlert('🗑️ تم الإزالة', 'تم إزالة المنتج من المفضلة', 'warning');
        } else {
            // ✅ حفظ في Firebase
            await saveFavoriteToFirebase(productId);
            this.classList.add('active');
            this.innerHTML = `
                <span class="material-symbols-rounded">favorite</span>
                ❤️ إزالة من المفضلة
            `;
            showCustomAlert('❤️ تمت الإضافة', 'تم إضافة المنتج إلى المفضلة', 'success');
        }
    });
    
    menu.querySelector('.menu-close-btn').addEventListener('click', function() {
        menu.classList.remove('show');
        setTimeout(() => menu.remove(), 300);
    });
    
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.classList.remove('show');
                setTimeout(() => menu.remove(), 300);
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

// ===== دوال إدارة التقييم (محلياً - احتياطي) =====
function getProductRating(productId) {
    const ratings = JSON.parse(localStorage.getItem('product_ratings') || '{}');
    return ratings[productId] || 0;
}

function saveProductRating(productId, rating) {
    const ratings = JSON.parse(localStorage.getItem('product_ratings') || '{}');
    ratings[productId] = rating;
    localStorage.setItem('product_ratings', JSON.stringify(ratings));
}

// ===== دوال إدارة المقيمين (محلياً - احتياطي) =====
function getProductReviewers(productId) {
    const reviewers = JSON.parse(localStorage.getItem('product_reviewers') || '{}');
    return reviewers[productId] || [];
}

function saveReviewer(productId, name, rating) {
    const reviewers = JSON.parse(localStorage.getItem('product_reviewers') || '{}');
    if (!reviewers[productId]) {
        reviewers[productId] = [];
    }
    const existingIndex = reviewers[productId].findIndex(r => r.name === name);
    if (existingIndex !== -1) {
        reviewers[productId][existingIndex].rating = rating;
    } else {
        reviewers[productId].push({ name, rating });
    }
    localStorage.setItem('product_reviewers', JSON.stringify(reviewers));
}

// ===== دوال إدارة المفضلة (محلياً - احتياطي) =====
function isProductFavorite(productId) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.includes(productId);
}

function addFavorite(productId) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favorites.includes(productId)) {
        favorites.push(productId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

function removeFavorite(productId) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    favorites = favorites.filter(id => id !== productId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
}

// ===== دالة عرض المنتجات (محدثة مع التقييمات من Firebase) =====
// ===== دالة عرض المنتجات (محسنة للأداء) =====
async function renderProducts(array) {
    const currentLang = getCurrentLanguage();
    if (!mainProductsContainer) return;
    
    if (array.length === 0) {
        mainProductsContainer.innerHTML = `<p style="text-align:center; width:100%; color:#888; padding:20px;">${translations[currentLang].search_no_results}</p>`;
        return;
    }
    
    const dbTranslations = {
        "اكسسوارات دراجات": "Motorbike Accessories",
        "اكسسوارات سيارات": "Car Accessories",
        "أخرى": "Others",
        "محرك": "Engine",
        "دعسه": "Pedal",
        "ربل": "Rubber",
        "باب سياره": "Car Door",
        "صدام سياره": "Car Bumper",
        "زجاج": "Glass"
    };
    
    function translateDbText(text) {
        if (currentLang === "en" && dbTranslations[text]) {
            return dbTranslations[text];
        }
        return text;
    }
    
    const categoriesMap = {};
    array.forEach(product => {
        const catName = product.category || "أخرى";
        if (!categoriesMap[catName]) {
            categoriesMap[catName] = [];
        }
        categoriesMap[catName].push(product);
    });
    
    // ✅ جلب التقييمات دفعة واحدة باستخدام Promise.all
    const allProductsList = [];
    for (let catName in categoriesMap) {
        for (let product of categoriesMap[catName]) {
            allProductsList.push(product);
        }
    }
    
    // ✅ جلب جميع التقييمات بالتوازي
    const ratingPromises = allProductsList.map(async (product) => {
        const ratingData = await getProductRatingsFromFirebase(product.id);
        product._rating = ratingData;
    });
    
    await Promise.all(ratingPromises);
    
    // ✅ بناء واجهة المنتجات
    let html = '';
    for (let catName in categoriesMap) {
        const translatedCatName = translateDbText(catName);
        
        html += `
            <div class="category-section-block" style="margin-bottom: 20px;">
                <div class="section-header">
                    <h3>${translatedCatName}</h3>
                </div>
                <div class="products-grid">
        `;
        
        categoriesMap[catName].forEach(product => {
            const bgImg = product.image1 ? product.image1 : "https://placehold.co/150?text=Zain+Online";
            const translatedProductName = translateDbText(product.name);
            
            const rating = product._rating || { average: 0, count: 0 };
            const stars = '⭐'.repeat(Math.min(rating.average, 5));
            
            html += `
                <div class="product" data-id="${product.id}">
                    <div class="img" style="background-image: url('${bgImg}'); background-size: cover; background-position: center;"></div>
                    <p>${translatedProductName}</p>
                    <div class="product-meta">
                        <span>${product.price} ${translations[currentLang].product_currency}</span>
                        <div class="product-label">${translations[currentLang].product_label_new}</div>
                    </div>
                    <div class="product-rating">
                        <span class="stars">${stars}</span>
                        <span class="review-count">(${rating.count})</span>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    mainProductsContainer.innerHTML = html;
    
    // ✅ ربط الأحداث بعد التحميل (باستخدام data-id)
    document.querySelectorAll('.product').forEach((prodDiv) => {
        const productId = prodDiv.dataset.id;
        // البحث عن المنتج في المصفوفة الأصلية
        const product = array.find(p => p.id === productId);
        if (product) {
            prodDiv.addEventListener("click", () => {
                showProductDetails(product);
            });
            setupLongPress(prodDiv, product);
        }
    });
}


// ================= صفحة تفاصيل المنتج وعرض السلايدر =================
let selectedProduct = null;
let currentQty = 1;

function showProductDetails(product) {
    const currentLang = getCurrentLanguage();
    selectedProduct = product;
    currentQty = 1;
    document.getElementById("qtyVal").innerText = currentQty;
    
    const dbTranslations = {
        "محرك": "Engine", "دعسه": "Pedal", "ربل": "Rubber",
        "باب سياره": "Car Door", "صدام سياره": "Car Bumper", "زجاج": "Glass"
    };

    function translateText(text) {
        if (currentLang === "en" && dbTranslations[text]) return dbTranslations[text];
        return text;
    }
    
    pages.forEach(p => p.classList.remove("active"));
    document.getElementById("details").classList.add("active");
    
    document.getElementById("detName").innerText = translateText(product.name);
    document.getElementById("detPrice").innerText = product.price + " " + translations[currentLang].product_currency_yemeni;
    document.getElementById("detDesc").innerText = product.description || translations[currentLang].product_no_desc;
    
    const availableStock = product.quantity !== undefined ? product.quantity : 0;
    document.getElementById("detStock").innerText = `${translations[currentLang].product_stock_qty}${availableStock} ${translations[currentLang].product_unit_carton}`;
    
    document.getElementById("slide1").style.backgroundImage = `url('${product.image1 || 'https://placehold.co/150?text=Image+1'}')`;
    document.getElementById("slide2").style.backgroundImage = `url('${product.image2 || 'https://placehold.co/150?text=Image+2'}')`;
    document.getElementById("slide3").style.backgroundImage = `url('${product.image3 || 'https://placehold.co/150?text=Image+3'}')`;
    
    document.querySelectorAll(".slide").forEach(s => {
        s.style.backgroundSize = "cover";
        s.style.backgroundPosition = "center";
    });
}

document.getElementById("plusQty").addEventListener("click", () => {
    currentQty++;
    document.getElementById("qtyVal").innerText = currentQty;
});

document.getElementById("minusQty").addEventListener("click", () => {
    if(currentQty > 1) {
        currentQty--;
        document.getElementById("qtyVal").innerText = currentQty;
    }
});

// ================= دوال إدارة السلة (حذف + تعديل الكمية) =================

// حذف منتج من السلة
function deleteCartItem(index) {
    const currentLang = getCurrentLanguage();
    if (index >= 0 && index < currentCart.length) {
        const itemName = currentCart[index].name;
        currentCart.splice(index, 1);
        saveCartToStorage();
        updateCartUI();
        
        showCustomAlert(
            translations[currentLang].alert_cart_deleted_title || '🗑️ تم الحذف',
            `${translations[currentLang].alert_cart_deleted_desc || 'تم حذف "'}${itemName}${translations[currentLang].alert_cart_deleted_suffix || '" من السلة'}`,
            "success"
        );
    }
}

// تعديل كمية منتج في السلة
function updateCartQuantity(index, change) {
    if (index >= 0 && index < currentCart.length) {
        currentCart[index].qty += change;
        if (currentCart[index].qty <= 0) {
            deleteCartItem(index);
        } else {
            saveCartToStorage();
            updateCartUI();
        }
    }
}

// ================= نظام السلة مع التحقق الصارم ونوافذ التنبيه المحدثة فخمة =================
document.getElementById("addToCartBtn").addEventListener("click", () => {
    const currentLang = getCurrentLanguage();
    if(!selectedProduct) return;
    
    // ✅ التحقق من وجود مستخدم مسجل
    const userId = localStorage.getItem('zain_user_id');
    if (!userId) {
        showCustomAlert(
            translations[currentLang].alert_login_required_title || '⚠️ مطلوب تسجيل الدخول',
            translations[currentLang].alert_login_required_desc || 'يجب عليك إنشاء حساب أو تسجيل الدخول لإضافة منتجات إلى السلة.',
            "warning"
        );
        return;
    }
    
    const freshProductRef = ref(db, `products/${selectedProduct.id}`);
    
    get(freshProductRef).then(async (snapshot) => {
        let dbQuantity = 0;
        if (snapshot.exists() && snapshot.val().quantity !== undefined) {
            dbQuantity = Number(snapshot.val().quantity);
        }

        if (dbQuantity <= 0) {
            showCustomAlert(translations[currentLang].alert_out_of_stock_title, translations[currentLang].alert_out_of_stock_desc, "error");
            return;
        }
        
        if (currentQty > dbQuantity) {
            showCustomAlert(translations[currentLang].alert_stock_insufficient_title, `${translations[currentLang].alert_stock_insufficient_desc}${dbQuantity} ${translations[currentLang].product_unit_carton}.`, "warning");
            return;
        }

        // ✅ التحقق إذا المنتج موجود مسبقاً في السلة
        const existingIndex = currentCart.findIndex(item => item.id === selectedProduct.id);
        
        if (existingIndex !== -1) {
            currentCart[existingIndex].qty += currentQty;
        } else {
            currentCart.push({
                id: selectedProduct.id,
                name: selectedProduct.name,
                price: Number(selectedProduct.price),
                qty: currentQty,
                addedAt: Date.now()
            });
        }
        
        saveCartToStorage();
        updateCartUI();
        
        await showCustomAlert(translations[currentLang].alert_cart_added_title, `${translations[currentLang].alert_cart_added_desc_prefix}${currentQty} ${translations[currentLang].alert_cart_added_desc_suffix}`, "success");
        
        buttons.forEach(b => b.classList.remove("active"));
        pages.forEach(p => p.classList.remove("active"));
        document.querySelector('[data-page="home"]').classList.add("active");
        document.getElementById("home").classList.add("active");
        
    }).catch(err => {
        showCustomAlert(translations[currentLang].alert_network_error_title, translations[currentLang].alert_network_error_desc + err.message, "error");
    });
});

function updateCartUI() {
    const currentLang = getCurrentLanguage();
    const container = document.getElementById("cartItemsContainer");
    const totalEl = document.getElementById("cartTotal");
    if (!container || !totalEl) return;
    container.innerHTML = "";
    
    if(currentCart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-view">
                <span class="material-symbols-rounded empty-cart-icon">inventory_2</span>
                <h4>${translations[currentLang].empty_cart_title}</h4>
                <p>${translations[currentLang].empty_cart_desc}</p>
            </div>
        `;
        totalEl.innerText = "0";
        globalTotalSum = 0;
        document.getElementById("gatewaysBox").style.display = "none";
        saveCartToStorage();
        return;
    }
    
    let totalSum = 0;
    currentCart.forEach((item, index) => {
        const itemCost = item.price * item.qty;
        totalSum += itemCost;
        
        const div = document.createElement("div");
        div.className = "cart-item";
        div.style.cssText = `
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            margin-bottom: 10px; 
            border-bottom: 1px dashed #ddd; 
            padding: 10px;
            direction: rtl;
            background: #f8f9fa;
            border-radius: 12px;
        `;
        
        div.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
                <div style="display: flex; flex-direction: column;">
                    <p style="margin:0; font-size:14px; font-weight:600;"><strong>${item.name}</strong></p>
                    <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                        <button class="qty-btn minus" data-index="${index}" style="
                            width: 28px; height: 28px; border-radius: 50%; border: 1px solid #ddd;
                            background: white; cursor: pointer; font-size: 16px;
                            display: flex; align-items: center; justify-content: center;
                        ">-</button>
                        <span style="font-weight: 600; min-width: 20px; text-align: center;">${item.qty}</span>
                        <button class="qty-btn plus" data-index="${index}" style="
                            width: 28px; height: 28px; border-radius: 50%; border: 1px solid #ddd;
                            background: white; cursor: pointer; font-size: 16px;
                            display: flex; align-items: center; justify-content: center;
                        ">+</button>
                    </div>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="color:#FF6600; font-weight:bold; font-size:15px;">${itemCost} ${translations[currentLang].product_currency}</span>
                <button class="cart-delete-btn" data-index="${index}" style="
                    background: none; border: none; cursor: pointer; padding: 4px;
                    color: #ff3b30; border-radius: 50%; display: flex; align-items: center; justify-content: center;
                    transition: all 0.2s;
                ">
                    <span class="material-symbols-rounded" style="font-size: 22px;">delete</span>
                </button>
            </div>
        `;
        container.appendChild(div);
    });
    
    globalTotalSum = totalSum;
    totalEl.innerText = totalSum;
    saveCartToStorage();
    
    // ربط أحداث الأزرار بعد التحديث
    document.querySelectorAll('.cart-delete-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const index = parseInt(this.dataset.index);
            deleteCartItem(index);
        });
    });
    
    document.querySelectorAll('.qty-btn.minus').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const index = parseInt(this.dataset.index);
            updateCartQuantity(index, -1);
        });
    });
    
    document.querySelectorAll('.qty-btn.plus').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const index = parseInt(this.dataset.index);
            updateCartQuantity(index, 1);
        });
    });
}

// ================= نظام معالجة وعرض بوابات الدفع المحلية للزبائن =================
const checkoutBtn = document.getElementById("checkoutBtn");
const gatewaysBox = document.getElementById("gatewaysBox");
const paymentOptionsContainer = document.getElementById("paymentOptionsContainer");

if(checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        const currentLang = getCurrentLanguage();
        
        // ✅ التحقق من وجود مستخدم
        const userId = localStorage.getItem('zain_user_id');
        if (!userId) {
            showCustomAlert(
                translations[currentLang].alert_login_required_title || '⚠️ مطلوب تسجيل الدخول',
                'يجب عليك تسجيل الدخول لإتمام عملية الشراء.',
                "warning"
            );
            return;
        }
        
        if(currentCart.length === 0) {
            showCustomAlert(translations[currentLang].alert_cart_empty_title, translations[currentLang].alert_cart_empty_desc, "warning");
            return;
        }
        gatewaysBox.style.display = "block";
        fetchGatewaysData();
    });
}

function fetchGatewaysData() {
    const currentLang = getCurrentLanguage();
    if (!paymentOptionsContainer) return;
    paymentOptionsContainer.innerHTML = `<p style="font-size:12px; color:#888; padding: 10px;">${translations[currentLang].gateway_loading}</p>`;
    
    const dbPaymentsRef = ref(db, 'payments');
    get(dbPaymentsRef).then((snapshot) => {
        paymentOptionsContainer.innerHTML = "";
        if(!snapshot.exists()) {
            paymentOptionsContainer.innerHTML = `<p style="font-size:12px; color:red; padding: 10px;">${translations[currentLang].gateway_no_accounts}</p>`;
            return;
        }
        
        snapshot.forEach((childSnapshot) => {
            const gateway = childSnapshot.val();
            const btn = document.createElement("button");
            btn.className = "gateway-btn";
            btn.style.cssText = "display:block; width:100%; padding:10px; margin-bottom:5px; background:#fff; border:1px solid #ddd; border-radius:6px; cursor:pointer; font-family:'Cairo'; font-size:13px; text-align:right;";
            
const logoUrl = gateway.logo || "https://placehold.co/50x50?text=💰";
btn.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px; direction: rtl;">
        <img src="${logoUrl}" alt="${gateway.name}" 
             style="width: 40px; height: 40px; object-fit: contain; border-radius: 8px; background: #f5f5f5; border: 1px solid #eee;"
             onerror="this.src='https://placehold.co/40x40?text=🔄'">
        <div style="display: flex; flex-direction: column; align-items: flex-start; flex: 1;">
            <strong style="font-size: 14px;">${gateway.name}</strong>
            <span style="font-size: 12px; color: #666;">${translations[currentLang].gateway_owner_admin}: ${gateway.owner || 'المتجر'}</span>
            <span style="font-size: 11px; color: #999;">رقم: ${gateway.number}</span>
        </div>
    </div>
`;
            
            btn.addEventListener("click", () => {
                showPaymentActionArea(gateway);
            });
            paymentOptionsContainer.appendChild(btn);
        });
    }).catch(() => {
        paymentOptionsContainer.innerHTML = '<p style="font-size:12px; color:red;">حدث خطأ أثناء تحميل الحسابات.</p>';
    });
}

const paymentActionArea = document.getElementById("paymentActionArea");
const displayAccNum = document.getElementById("displayAccNum");
const depositNotice = document.getElementById("depositNotice");
let activeAccountNumber = "";

function showPaymentActionArea(gateway) {
    const currentLang = getCurrentLanguage();
    if (paymentActionArea) paymentActionArea.style.display = "block";
    if (displayAccNum) displayAccNum.innerText = gateway.number;
    activeAccountNumber = gateway.number;
    if (depositNotice) depositNotice.innerText = `${translations[currentLang].warning_deposit} ( المبلغ الصافي المطلوب: ${globalTotalSum} )`;
}

const copyAccBtn = document.getElementById("copyAccBtn");
if(copyAccBtn) {
    copyAccBtn.addEventListener("click", () => {
        const currentLang = getCurrentLanguage();
        if(!activeAccountNumber) return;
        navigator.clipboard.writeText(activeAccountNumber).then(() => {
            showCustomAlert(translations[currentLang].alert_copied_title, translations[currentLang].alert_copied_desc, "success");
        }).catch(() => {
            showCustomAlert(translations[currentLang].alert_acc_number_title, translations[currentLang].alert_acc_number_desc + activeAccountNumber, "success");
        });
    });
}

// إرسال تفاصيل الطلب مع النوافذ المنبثقة الفخمة البديلة بالكامل للـ Prompt والـ Alert الافتراضية
const sendInvoiceBtn = document.getElementById("sendInvoiceBtn");
if(sendInvoiceBtn) {
    sendInvoiceBtn.addEventListener("click", async () => {
        const currentLang = getCurrentLanguage();
        if (currentCart.length === 0) {
            showCustomAlert(translations[currentLang].alert_cart_empty_title, translations[currentLang].alert_cart_empty_desc, "warning");
            return;
        }

        const orderNumber = "99" + Math.floor(1000000 + Math.random() * 9000000);

        let userLocation = await showCustomPrompt(translations[currentLang].modal_prompt_location_title, translations[currentLang].modal_prompt_location_subtitle, "شحن المحافظة - مدينة...");
        
        if (!userLocation || userLocation === translations[currentLang].location_loading_attempt) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                userLocation = `${translations[currentLang].location_geo_text}${position.coords.longitude}${translations[currentLang].location_geo_lat}${position.coords.latitude})`;
            } catch (err) {
                userLocation = translations[currentLang].location_denied_text;
            }
        }

        let orderDetailsMessage = `${translations[currentLang].order_invoice_title}${orderNumber}\n`;
        orderDetailsMessage += `${translations[currentLang].order_invoice_address}${userLocation}\n`;
        orderDetailsMessage += "-------------------------\n";
        currentCart.forEach((item, index) => {
            orderDetailsMessage += `${index + 1}. ${item.name} (x${item.qty}) - ${item.price * item.qty} ${translations[currentLang].product_currency}\n`;
        });
        orderDetailsMessage += `-------------------------\n${translations[currentLang].order_invoice_total}${globalTotalSum} ${translations[currentLang].product_currency_yemeni}.\n${translations[currentLang].order_invoice_status_pending}`;

        // تحديث كميات المخزن
        for (const item of currentCart) {
            const prodStockRef = ref(db, `products/${item.id}/quantity`);
            try {
                const stockSnapshot = await get(prodStockRef);
                if (stockSnapshot.exists()) {
                    let currentStock = Number(stockSnapshot.val());
                    let newStock = currentStock - item.qty;
                    if (newStock < 0) newStock = 0;
                    await set(prodStockRef, newStock);
                }
            } catch (stockErr) {
                console.log(translations[currentLang].order_stock_update_error + item.name, stockErr);
            }
        }

        const orderRef = ref(db, `orders/${myUserId}`);
        const clientChatRef = ref(db, `chats/${myUserId}`); 
        const newMessageRef = push(clientChatRef);
        const chatMsgKey = newMessageRef.key;

        await set(orderRef, {
            orderNumber: orderNumber,
            status: "pending",
            chatKey: chatMsgKey,
            timestamp: Date.now(),
            orderDetails: orderDetailsMessage
        });

        await set(newMessageRef, {
            sender: "client",                      
            message: orderDetailsMessage,          
            timestamp: Date.now(),
            status: "sent",
            isOrder: true,
            orderNumber: orderNumber
        });

        // 🚀 نظام إرسال الإشعارات التلقائية لبوت تليجرام الشخصي والشريك
        const TELEGRAM_BOT_TOKEN = "8747928905:AAFLOdricrqu1l2g6is7xxVpJpfhju6UZbA"; 
        const TELEGRAM_CHAT_IDS = ["8516702571", "1652651450"]; 
        
        let telegramText = `${translations[currentLang].telegram_notification_prefix}${orderDetailsMessage}${translations[currentLang].telegram_notification_suffix}https://zain-online-938c5.firebaseapp.com/admin/chat.html?userId=${myUserId}`;

        TELEGRAM_CHAT_IDS.forEach(chatId => {
            fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: telegramText })
            }).catch(err => console.log(`${translations[currentLang].telegram_send_error}${chatId}: `, err));
        });

        currentCart = [];
        localStorage.removeItem('zain_cart');
        updateCartUI();

        await showCustomAlert(translations[currentLang].alert_order_success_title, `${translations[currentLang].alert_order_success_desc_prefix}${orderNumber}${translations[currentLang].alert_order_success_desc_suffix}`, "success");
        window.location.href = `index2.html?tab=chat`; 
    });
}

// التصفية بحسب التصنيفات والأصناف
const categories = document.querySelectorAll(".category-row .cat");
categories.forEach(cat => {
    cat.addEventListener("click", function() {
        categories.forEach(c => c.classList.remove("active"));
        this.classList.add("active");
        
        const targetCat = this.getAttribute("data-cat");
        
        if(targetCat === "الكل" || targetCat === "All") {
            renderProducts(allProducts);
        } else {
            const filtered = allProducts.filter(p => p.category === targetCat);
            renderProducts(filtered);
        }
    });
});

// ميزة البحث العلوي للزبون
const searchInp = document.getElementById("searchInp");
if(searchInp) {
    searchInp.addEventListener("input", function() {
        const text = searchInp.value.toLowerCase().trim();
        const filtered = allProducts.filter(p => p.name.toLowerCase().includes(text));
        renderProducts(filtered);
    });
}

// ================= نظام مراقبة وعرض صندوق الرسائل الفخم والحي للزبون =================
const customerChatListContainer = document.getElementById("customerChatListContainer");
if (customerChatListContainer) {
    const myLiveChatRef = ref(db, `chats/${myUserId}`);

    onValue(myLiveChatRef, (snapshot) => {
        const currentLang = getCurrentLanguage();
        customerChatListContainer.innerHTML = "";
        
        let unreadCount = 0;
        let lastMessageText = translations[currentLang].chat_default_welcome;
        let timeStampText = translations[currentLang].chat_time_now;

        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const msgData = childSnapshot.val();
                if (msgData.sender === "admin" && msgData.status === "unread") {
                    unreadCount++;
                }
                if (msgData.timestamp) {
                    const msgDate = new Date(msgData.timestamp);
                    timeStampText = msgDate.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
                }
                lastMessageText = msgData.message || translations[currentLang].chat_default_welcome;
            });
        }

        // ✅ بناء واجهة المحادثة
        const chatCard = document.createElement("div");
        chatCard.className = "premium-chat-card";
        chatCard.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            background: #fff;
            padding: 12px 16px;
            border-radius: 16px;
            margin-bottom: 8px;
            border: 1px solid #f1f2f4;
            cursor: pointer;
            transition: all 0.2s ease;
        `;
        
        chatCard.innerHTML = `
            <div class="chat-avatar-box" style="
                width: 48px; height: 48px; border-radius: 50%;
                background: linear-gradient(135deg, #FF6600, #ff822e);
                display: flex; align-items: center; justify-content: center; color: #fff;
                font-size: 20px; flex-shrink: 0;
            ">
                <span class="material-symbols-rounded">support_agent</span>
                ${unreadCount > 0 ? `<span class="online-badge" style="
                    position: absolute; bottom: 2px; right: 2px;
                    width: 12px; height: 12px; background: #10b981;
                    border-radius: 50%; border: 2px solid #fff;
                "></span>` : ''}
            </div>
            <div style="flex: 1; min-width: 0;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="font-size: 14px; color: #1a1a1a;">${translations[currentLang].chat_support_name}</strong>
                    <span style="font-size: 10px; color: #9aa0a6;">${timeStampText}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
                    <p style="margin: 0; font-size: 12px; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${lastMessageText}
                    </p>
                    ${unreadCount > 0 ? `
                        <span style="
                            background: #FF6600; color: #fff;
                            font-size: 10px; font-weight: 700;
                            min-width: 18px; height: 18px;
                            border-radius: 50%;
                            display: flex; align-items: center; justify-content: center;
                            padding: 0 4px;
                        ">${unreadCount}</span>
                    ` : ''}
                </div>
            </div>
        `;
        
        chatCard.addEventListener("click", () => {
            window.location.href = `index6.html`;
        });
        
        customerChatListContainer.appendChild(chatCard);
    });
}

// ===== تحميل السلة من Firebase عند بدء التشغيل =====
loadCartFromFirebase();

console.log('✅ تم تحميل script.js بنجاح مع ربط Firebase للتقييمات والمفضلة والسلة');