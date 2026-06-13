import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, get, set, push, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

// توليد أو جلب معرف فريد وثابت لمتصفح الزبون الحالي
let myUserId = localStorage.getItem("zain_user_id");
if (!myUserId) {
    myUserId = "user_" + Math.random().toString(36).substring(2, 11);
    localStorage.setItem("zain_user_id", myUserId);
}

// 🛠️ ================= محرك النوافذ المنبثقة المخصصة الفخمة لمتجر زين أون لاين =================
function showCustomAlert(title, message, type = "success") {
    return new Promise((resolve) => {
        // إزالة أي نافذة سابقة متبقية بالصفحة لمنع تكرار الهياكل
        const oldOverlay = document.getElementById("globalModalOverlay");
        if (oldOverlay) oldOverlay.remove();

        // تحديد الأيقونة بحسب نوع التنبيه المطلوبة
        let iconName = "check_circle";
        if (type === "warning") iconName = "warning";
        if (type === "error") iconName = "error";

        // بناء هيكل الـ HTML ديناميكياً وحقنه بـ Body
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
                    <button id="modalCloseBtn" class="modal-prime-btn confirm">موافق</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // إحداث أنيميشن الظهور السلس لبج كود الفايرفوكس والأجهزة المتنوعة
        setTimeout(() => overlay.classList.add("active"), 10);

        document.getElementById("modalCloseBtn").addEventListener("click", () => {
            overlay.classList.remove("active");
            setTimeout(() => { overlay.remove(); resolve(); }, 300);
        });
    });
}

function showCustomPrompt(title, subtitle, defaultInputValue = "") {
    return new Promise((resolve) => {
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
                <input type="text" id="modalPromptInput" class="modal-input-field" value="${defaultInputValue}" placeholder="اكتب تفاصيل العنوان هنا...">
                <div class="modal-buttons-layout">
                    <button id="modalConfirmPromptBtn" class="modal-prime-btn confirm">تأكيد الإرسال</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        setTimeout(() => overlay.classList.add("active"), 10);

        // وضع التركيز الفوري على الحقل تلقائياً لتسهيل تجربة الكتابة
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
    const visitorsRef = ref(db, 'visitors/count');
    get(visitorsRef).then((snapshot) => {
        let currentCount = 0;
        if (snapshot.exists()) {
            currentCount = snapshot.val();
        }
        set(visitorsRef, currentCount + 1);
    }).catch(err => console.log("خطأ في عداد الزوار"));
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
    if (mainProductsContainer) mainProductsContainer.innerHTML = "";
    allProducts = [];
    
    if (!snapshot.exists()) {
        if (mainProductsContainer) mainProductsContainer.innerHTML = '<p style="text-align:center; width:100%; color:#888; padding:40px;">انتظرونا، سيتم توفير المنتجات قريباً جداً في المتجر! 🛒</p>';
        return;
    }
    
    snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();
        item.id = childSnapshot.key;
        allProducts.push(item);
    });
    
    renderProducts(allProducts);
});

// ===== دالة رسم المنتجات مقسمة بحسب التصنيف والزيوت في صفوف أفقية فخمة =====
function renderProducts(array) {
    if (!mainProductsContainer) return;
    mainProductsContainer.innerHTML = "";
    
    if (array.length === 0) {
        mainProductsContainer.innerHTML = '<p style="text-align:center; width:100%; color:#888; padding:20px;">عذراً، لم نجد نتائج تطابق بحثك.</p>';
        return;
    }

    const categoriesMap = {};
    array.forEach(product => {
        const catName = product.category || "أخرى";
        if (!categoriesMap[catName]) {
            categoriesMap[catName] = [];
        }
        categoriesMap[catName].push(product);
    });

    for (let catName in categoriesMap) {
        const sectionBlock = document.createElement("div");
        sectionBlock.className = "category-section-block";
        sectionBlock.style.marginBottom = "20px";

        const sectionHeader = document.createElement("div");
        sectionHeader.className = "section-header";
        sectionHeader.innerHTML = `<h3>${catName}</h3>`;

        const productsGrid = document.createElement("div");
        productsGrid.className = "products-grid";

        categoriesMap[catName].forEach(product => {
            const prodDiv = document.createElement("div");
            prodDiv.className = "product";
            
            const bgImg = product.image1 ? product.image1 : "https://placehold.co/150?text=Zain+Online";
            
            prodDiv.innerHTML = `
                <div class="img" style="background-image: url('${bgImg}'); background-size: cover; background-position: center;"></div>
                <p>${product.name}</p>
                <div class="product-meta">
                    <span>${product.price} ريال</span>
                    <div class="product-label">جديد</div>
                </div>
            `;
            
            prodDiv.addEventListener("click", () => {
                showProductDetails(product);
            });
            
            productsGrid.appendChild(prodDiv);
        });

        sectionBlock.appendChild(sectionHeader);
        sectionBlock.appendChild(productsGrid);
        mainProductsContainer.appendChild(sectionBlock);
    }
}

// ================= صفحة تفاصيل المنتج وعرض السلايدر =================
let selectedProduct = null;
let currentQty = 1;

function showProductDetails(product) {
    selectedProduct = product;
    currentQty = 1;
    document.getElementById("qtyVal").innerText = currentQty;
    
    pages.forEach(p => p.classList.remove("active"));
    document.getElementById("details").classList.add("active");
    
    document.getElementById("detName").innerText = product.name;
    document.getElementById("detPrice").innerText = product.price + " ريال يمني";
    document.getElementById("detDesc").innerText = product.description || "لا يوجد وصف متوفر لهذا المنتج حالياً.";
    
    const availableStock = product.quantity !== undefined ? product.quantity : 0;
    document.getElementById("detStock").innerText = `الكمية المتبقية في المخزن: ${availableStock} كرتون`;
    
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

// ================= نظام السلة مع التحقق الصارم ونوافذ التنبيه المحدثة فخمة =================
document.getElementById("addToCartBtn").addEventListener("click", () => {
    if(!selectedProduct) return;
    
    const freshProductRef = ref(db, `products/${selectedProduct.id}`);
    
    get(freshProductRef).then(async (snapshot) => {
        let dbQuantity = 0;
        if (snapshot.exists() && snapshot.val().quantity !== undefined) {
            dbQuantity = Number(snapshot.val().quantity);
        }

        if (dbQuantity <= 0) {
            showCustomAlert("نفذت الكمية", "عذراً، هذا المنتج نفذ تماماً من المخزن حالياً! ❌", "error");
            return;
        }
        
        if (currentQty > dbQuantity) {
            showCustomAlert("المخزن لا يكفي", `عذراً! الكمية المتبقية في المخزن فقط هي: ${dbQuantity} كرتون.`, "warning");
            return;
        }

        const cartItem = {
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: Number(selectedProduct.price),
            qty: currentQty
        };
        
        currentCart.push(cartItem);
        updateCartUI();
        
        await showCustomAlert("تمت الإضافة", `تم إضافة ${currentQty} من [${selectedProduct.name}] بنجاح إلى العربة! 🛒`, "success");
        
        buttons.forEach(b => b.classList.remove("active"));
        pages.forEach(p => p.classList.remove("active"));
        document.querySelector('[data-page="home"]').classList.add("active");
        document.getElementById("home").classList.add("active");
        
    }).catch(err => {
        showCustomAlert("خطأ بالشبكة", "خطأ في الاتصال بالشبكة للتحقق من الكمية: " + err.message, "error");
    });
});

function updateCartUI() {
    const container = document.getElementById("cartItemsContainer");
    const totalEl = document.getElementById("cartTotal");
    if (!container || !totalEl) return;
    container.innerHTML = "";
    
    if(currentCart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-view">
                <span class="material-symbols-rounded empty-cart-icon">inventory_2</span>
                <h4>عربة تسوقك فارغة</h4>
                <p>تصفح الأقسام والمنتجات الآن وأضف ما تحتاجه إلى سلتك</p>
            </div>
        `;
        totalEl.innerText = "0";
        globalTotalSum = 0;
        document.getElementById("gatewaysBox").style.display = "none";
        return;
    }
    
    let totalSum = 0;
    currentCart.forEach((item) => {
        const itemCost = item.price * item.qty;
        totalSum += itemCost;
        
        const div = document.createElement("div");
        div.className = "cart-item";
        div.style.cssText = "display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed #ddd; padding-bottom: 8px; direction: rtl; padding: 10px;";
        
        div.innerHTML = `
            <p style="margin:0; font-size:14px;"><strong>${item.name}</strong> (×${item.qty})</p>
            <span style="color:#FF6600; font-weight:bold;">${itemCost} ريال</span>
        `;
        container.appendChild(div);
    });
    
    globalTotalSum = totalSum;
    totalEl.innerText = totalSum;
}

// ================= نظام معالجة وعرض بوابات الدفع المحلية للزبائن =================
const checkoutBtn = document.getElementById("checkoutBtn");
const gatewaysBox = document.getElementById("gatewaysBox");
const paymentOptionsContainer = document.getElementById("paymentOptionsContainer");

if(checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        if(currentCart.length === 0) {
            showCustomAlert("العربة فارغة", "سلتك فارغة! يرجى إضافة منتجات أولاً قبل إتمام الدفع.", "warning");
            return;
        }
        gatewaysBox.style.display = "block";
        fetchGatewaysData();
    });
}

function fetchGatewaysData() {
    if (!paymentOptionsContainer) return;
    paymentOptionsContainer.innerHTML = '<p style="font-size:12px; color:#888; padding: 10px;">جاري جلب طرق الدفع المتاحة...</p>';
    
    const dbPaymentsRef = ref(db, 'payments');
    get(dbPaymentsRef).then((snapshot) => {
        paymentOptionsContainer.innerHTML = "";
        if(!snapshot.exists()) {
            paymentOptionsContainer.innerHTML = '<p style="font-size:12px; color:red; padding: 10px;">لا تتوفر حسابات دفع حالياً، تواصل مع الدعم.</p>';
            return;
        }
        
        snapshot.forEach((childSnapshot) => {
            const gateway = childSnapshot.val();
            const btn = document.createElement("button");
            btn.className = "gateway-btn";
            btn.style.cssText = "display:block; width:100%; padding:10px; margin-bottom:5px; background:#fff; border:1px solid #ddd; border-radius:6px; cursor:pointer; font-family:'Cairo'; font-size:13px; text-align:right;";
            btn.innerText = `${gateway.name} - (لحساب: ${gateway.owner || 'الإدارة'})`;
            
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
    if (paymentActionArea) paymentActionArea.style.display = "block";
    if (displayAccNum) displayAccNum.innerText = gateway.number;
    activeAccountNumber = gateway.number;
    if (depositNotice) depositNotice.innerText = `يرجى إيداع المبلغ وقدره ${globalTotalSum} ريال يمني صافي وإلا سيتم رفض الطلب تلقائياً من النظام.`;
}

const copyAccBtn = document.getElementById("copyAccBtn");
if(copyAccBtn) {
    copyAccBtn.addEventListener("click", () => {
        if(!activeAccountNumber) return;
        navigator.clipboard.writeText(activeAccountNumber).then(() => {
            showCustomAlert("تم النسخ", "تم نسخ رقم الحساب بنجاح! 📋", "success");
        }).catch(() => {
            showCustomAlert("الحساب", "رقم الحساب هو: " + activeAccountNumber, "success");
        });
    });
}

// إرسال تفاصيل الطلب مع النوافذ المنبثقة الفخمة البديلة بالكامل للـ Prompt والـ Alert الافتراضية
const sendInvoiceBtn = document.getElementById("sendInvoiceBtn");
if(sendInvoiceBtn) {
    sendInvoiceBtn.addEventListener("click", async () => {
        if (currentCart.length === 0) {
            showCustomAlert("العربة فارغة", "عذراً، السلة فارغة حالياً.", "warning");
            return;
        }

        const orderNumber = "99" + Math.floor(1000000 + Math.random() * 9000000);

        // استخدام نافذة الإدخال الفخمة والمخصصة الجديدة بدلاً من prompt المزعج
        let userLocation = await showCustomPrompt("تحديد موقع التوصيل", "يرجى كتابة عنوانك بالتفصيل لتسهيل تسليم الشحنة إليك فوراً:", "شحن المحافظة - مدينة...");
        
        if (!userLocation || userLocation === "جاري محاولة تحديد الموقع...") {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                userLocation = `موقع جغرافي (خط طول: ${position.coords.longitude}, خط عرض: ${position.coords.latitude})`;
            } catch (err) {
                userLocation = "لم يتم تحديد الموقع (العميل لم يسمح بالوصول والتوثيق المباشر)";
            }
        }

        let orderDetailsMessage = `🛍️ طلب جديد #${orderNumber}\n`;
        orderDetailsMessage += `📍 العنوان: ${userLocation}\n`;
        orderDetailsMessage += "-------------------------\n";
        currentCart.forEach((item, index) => {
            orderDetailsMessage += `${index + 1}. ${item.name} (x${item.qty}) - ${item.price * item.qty} ريال\n`;
        });
        orderDetailsMessage += `-------------------------\n💰 الإجمالي الصافي: ${globalTotalSum} ريال يمني.\n⚠️ حالة الطلب: قيد الانتظار...`;

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
                console.log("خطأ أثناء تحديث كمية المنتج: " + item.name, stockErr);
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
        
        let telegramText = `🔔 إشعار طلب جديد من متجر زين أون لاين!\n\n${orderDetailsMessage}\n\n🔗 لمتابعة المحادثة مع العميل سرياً:\nhttps://zain-online-938c5.firebaseapp.com/admin/chat.html?userId=${myUserId}`;

        TELEGRAM_CHAT_IDS.forEach(chatId => {
            fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: telegramText })
            }).catch(err => console.log(`فشل الإرسال للمعرف ${chatId}: `, err));
        });

        currentCart = [];
        updateCartUI();

        // عرض رسالة النجاح النهائية بالنافذة المودال المتناسقة والمبتكرة
        await showCustomAlert("تم إرسال طلبك!", `نجح إرسال طلبك برقم (${orderNumber}). جاري توجيهك الآن لقسم المحادثات الحية لتأكيد الاستلام... ✨`, "success");
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
        
        if(targetCat === "الكل") {
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
        customerChatListContainer.innerHTML = "";
        
        let unreadCount = 0;
        let lastMessageText = "مرحباً بك في متجرنا! راسلنا هنا في حال وجود أي استفسار لبدء المحادثة الفورية... ✨";
        let timeStampText = "الآن";

        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const msgData = childSnapshot.val();
                if (msgData.sender === "admin" && msgData.status !== "read") {
                    unreadCount++;
                }
                if (msgData.message) {
                    lastMessageText = msgData.message;
                }
            });
        }

        let shortMessage = lastMessageText.length > 50 ? lastMessageText.substring(0, 50) + "..." : lastMessageText;

        const chatCard = document.createElement("div");
        chatCard.className = "premium-chat-card pinned"; 
        
        chatCard.innerHTML = `
            <div class="chat-avatar-box">
                <span class="material-symbols-rounded">support_agent</span>
                <div class="online-badge"></div>
            </div>
            <div class="chat-info-content">
                <div class="chat-info-top">
                    <h4 class="chat-sender-name">الدعم الفني - زين أون لاين</h4>
                    <span class="chat-time-stamp">${timeStampText}</span>
                </div>
                <div class="chat-info-bottom">
                    <p class="chat-last-message">${shortMessage}</p>
                    <div class="chat-meta-status">
                        <span class="material-symbols-rounded pin-icon active">push_pin</span>
                        ${unreadCount > 0 ? `<span class="unread-count-badge">${unreadCount}</span>` : ''}
                    </div>
                </div>
            </div>
            <div class="chat-hover-actions">
                <button class="hover-act-btn pin" title="تثبيت المحادثة"><span class="material-symbols-rounded">push_pin</span></button>
                <button class="hover-act-btn delete" title="حذف المحادثة"><span class="material-symbols-rounded">delete</span></button>
            </div>
        `;

        chatCard.addEventListener('click', (e) => {
            if (e.target.closest('.chat-hover-actions') || e.target.closest('.hover-act-btn')) {
                return; 
            }
            window.location.href = `index2.html?userId=${myUserId}`;
        });

        const hoverActions = chatCard.querySelector('.chat-hover-actions');
        if(hoverActions) {
            hoverActions.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        customerChatListContainer.appendChild(chatCard);
    });
}

// تفعيل قسم الدردشة تلقائياً عند الرجوع من صفحة المحادثة
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const targetTab = urlParams.get('tab');

    if (targetTab === 'chat') {
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        
        const chatSection = document.getElementById('chat');
        if (chatSection) chatSection.classList.add('active');

        document.querySelectorAll('.bottom-nav .nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-page') === 'chat') {
                btn.classList.add('active');
            }
        });
    }
});
