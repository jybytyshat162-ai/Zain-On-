// 1. استيراد دوال الفايربيز الأساسية للمتجر
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, get, set, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 2. إعدادات ومفاتيح الربط الخاصة بقاعدتك المفتوحة لـ "زين أون لاين"
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
let loadedPayments = []; // تخزين طرق الدفع المجلوبة

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
handleVisitorCount(); // تشغيل الدالة فور دخول الزبون

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
const productsGrid = document.getElementById("productsGrid");

const dbProductsRef = ref(db, 'products');
onValue(dbProductsRef, (snapshot) => {
    productsGrid.innerHTML = "";
    allProducts = [];
    
    if (!snapshot.exists()) {
        productsGrid.innerHTML = '<p style="text-align:center; width:100%; color:#888;">انتظرونا، سيتم توفير المنتجات قريباً جداً في المتجر! 🛒</p>';
        return;
    }
    
    snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();
        item.id = childSnapshot.key;
        allProducts.push(item);
    });
    
    renderProducts(allProducts); // عرض كل المنتجات عند الففتح
});

// دالة رسم كروت المنتجات على الشاشة للزبون
function renderProducts(array) {
    productsGrid.innerHTML = "";
    if(array.length === 0) {
        productsGrid.innerHTML = '<p style="text-align:center; width:100%; color:#888;">عذراً، لم نجد نتائج تطابق بحثك.</p>';
        return;
    }
    
    array.forEach(product => {
        const prodDiv = document.createElement("div");
        prodDiv.className = "product";
        
        // استخدام الصورة الأولى المرفوعة أو صورة نصوص افتراضية أنيقة
        const bgImg = product.image1 ? product.image1 : "https://placehold.co/150?text=Zain+Online";
        
        prodDiv.innerHTML = `
            <div class="img" style="background-image: url('${bgImg}'); background-size: cover; background-position: center;"></div>
            <p>${product.name}</p>
            <span>${product.price} ريال</span>
        `;
        
        // عند ضغط الزبون على الكرت ينقلنا فوراً لصفحة تفاصيل المنتج
        prodDiv.addEventListener("click", () => {
            showProductDetails(product);
        });
        
        productsGrid.appendChild(prodDiv);
    });
}

// ================= صفحة تفاصيل المنتج وعرض السلايدر =================
let selectedProduct = null;
let currentQty = 1;

function showProductDetails(product) {
    selectedProduct = product;
    currentQty = 1;
    document.getElementById("qtyVal").innerText = currentQty;
    
    // إخفاء كل الصفحات وتفعيل صفحة الـ details
    pages.forEach(p => p.classList.remove("active"));
    document.getElementById("details").classList.add("active");
    
    // تعبئة نصوص المنتج
    document.getElementById("detName").innerText = product.name;
    document.getElementById("detPrice").innerText = product.price + " ريال يمني";
    document.getElementById("detDesc").innerText = product.description || "لا يوجد وصف متوفر لهذا المنتج حالياً.";
    
    // إدخال الصور الثلاث للسلايدر
    document.getElementById("slide1").style.backgroundImage = `url('${product.image1 || 'https://placehold.co/150?text=Image+1'}')`;
    document.getElementById("slide2").style.backgroundImage = `url('${product.image2 || 'https://placehold.co/150?text=Image+2'}')`;
    document.getElementById("slide3").style.backgroundImage = `url('${product.image3 || 'https://placehold.co/150?text=Image+3'}')`;
    
    // إعدادات الخلفية لتظهر بشكل ممتاز
    document.querySelectorAll(".slide").forEach(s => {
        s.style.backgroundSize = "cover";
        s.style.backgroundPosition = "center";
    });
}

// التحكم بالكمية (+ / -) داخل صفحة التفاصيل
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

// ================= نظام السلة التلقائي (Cart System) =================
document.getElementById("addToCartBtn").addEventListener("click", () => {
    if(!selectedProduct) return;
    
    const cartItem = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: Number(selectedProduct.price),
        qty: currentQty
    };
    
    // إضافة المنتج للسلة وتحديث الواجهة
    currentCart.push(cartItem);
    updateCartUI();
    
    alert(`تم إضافة ${currentQty} من [${selectedProduct.name}] بنجاح إلى العربة! 🛒`);
    
    // العودة للرئيسية بعد الإضافة
    buttons.forEach(b => b.classList.remove("active"));
    pages.forEach(p => p.classList.remove("active"));
    document.querySelector('[data-page="home"]').classList.add("active");
    document.getElementById("home").classList.add("active");
});

function updateCartUI() {
    const container = document.getElementById("cartItemsContainer");
    const totalEl = document.getElementById("cartTotal");
    container.innerHTML = "";
    
    if(currentCart.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#888;">العربة فارغة حالياً</p>';
        totalEl.innerText = "الإجمالي: 0 ريال";
        globalTotalSum = 0;
        document.getElementById("gatewaysBox").style.display = "none";
        return;
    }
    
    let totalSum = 0;
    currentCart.forEach((item, index) => {
        const itemCost = item.price * item.qty;
        totalSum += itemCost;
        
        const div = document.createElement("div");
        div.className = "cart-item";
        div.style.display = "flex";
        div.style.justifyContent = "space-between";
        div.style.marginBottom = "10px";
        div.style.borderBottom = "1px dashed #ddd";
        div.style.paddingBottom = "5px";
        
        div.innerHTML = `
            <p><strong>${item.name}</strong> (×${item.qty})</p>
            <span>${itemCost} ريال</span>
        `;
        container.appendChild(div);
    });
    
    globalTotalSum = totalSum;
    totalEl.innerText = `الإجمالي: ${totalSum} ريال يمني`;
}

// ================= نظام معالجة وعرض بوابات الدفع المحلية للزبائن =================
const checkoutBtn = document.getElementById("checkoutBtn");
const gatewaysBox = document.getElementById("gatewaysBox");
const paymentOptionsContainer = document.getElementById("paymentOptionsContainer");

if(checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        if(currentCart.length === 0) {
            alert("سلتك فارغة! يرجى إضافة منتجات أولاً قبل إتمام الدفع.");
            return;
        }
        // إظهار صندوق بوابات الدفع وجلب البيانات حياً من السيرفر
        gatewaysBox.style.display = "block";
        fetchGatewaysData();
    });
}

function fetchGatewaysData() {
    paymentOptionsContainer.innerHTML = '<p style="font-size:12px; color:#888;">جاري جلب طرق الدفع المتاحة...</p>';
    const dbPaymentsRef = ref(db, 'payments');
    
    onValue(dbPaymentsRef, (snapshot) => {
        paymentOptionsContainer.innerHTML = "";
        loadedPayments = [];
        
        if (!snapshot.exists()) {
            paymentOptionsContainer.innerHTML = '<p style="font-size:12px; color:#dc3545;">عذراً، لم يقم الإدمن بتفعيل طرق دفع محلية حالياً.</p>';
            return;
        }
        
        snapshot.forEach((childSnapshot) => {
            const payId = childSnapshot.key;
            const payData = childSnapshot.val();
            payData.id = payId;
            loadedPayments.push(payData);
            
            const optDiv = document.createElement("div");
            optDiv.className = "pay-opt";
            optDiv.innerHTML = `
                <img src="${payData.logo}" alt="logo">
                <h4>${payData.name}</h4>
            `;
            
            // عند الضغط على أي طريقة دفع معينة
            optDiv.addEventListener("click", () => {
                showPaymentActionArea(payData);
            });
            
            paymentOptionsContainer.appendChild(optDiv);
        });
    });
}

// إظهار بيانات الحساب المختار مع كود النسخ وزر الإرسال والتعميم المالي
const paymentActionArea = document.getElementById("paymentActionArea");
const displayAccNum = document.getElementById("displayAccNum");
const depositNotice = document.getElementById("depositNotice");
let activeAccountNumber = "";

function showPaymentActionArea(gateway) {
    paymentActionArea.style.display = "block";
    displayAccNum.innerText = gateway.number;
    activeAccountNumber = gateway.number;
    
    // إدراج وحساب التعميم الديناميكي لقيمة السلة الإجمالية الحالية صافي
    depositNotice.innerText = `يرجى إيداع المبلغ وقدره ${globalTotalSum} ريال يمني صافي وإلا سيتم رفض الطلب.`;
}

// برمجة زر نسخ الحساب بضغطة واحدة
const copyAccBtn = document.getElementById("copyAccBtn");
if(copyAccBtn) {
    copyAccBtn.addEventListener("click", () => {
        if(!activeAccountNumber) return;
        navigator.clipboard.writeText(activeAccountNumber).then(() => {
            alert("تم نسخ رقم الحساب بنجاح! 📋");
        }).catch(() => {
            alert("رقم الحساب هو: " + activeAccountNumber);
        });
    });
}

// ================= تم التعديل هنا: الفتح المباشر والديناميكي الفوري وتخطي فحص الصورة نهائياً =================
// ================= إرسال تفاصيل الطلب تلقائياً إلى المحادثة وبدء الدردشة =================
// ================= إرسال تفاصيل الطلب تلقائياً إلى المحادثة وبدء الدردشة =================
// توليد أو جلب معرف فريد وثابت لمتصفح الزبون الحالي للحفاظ على غرفته الإخبارية
let myUserId = localStorage.getItem("zain_user_id");
if (!myUserId) {
    myUserId = "user_" + Math.random().toString(36).substring(2, 11);
    localStorage.setItem("zain_user_id", myUserId);
}

const sendInvoiceBtn = document.getElementById("sendInvoiceBtn");
if(sendInvoiceBtn) {
    sendInvoiceBtn.addEventListener("click", () => {
        // 1. التحقق من وجود منتجات في السلة أولاً
        if (currentCart.length === 0) {
            alert("عذراً، السلة فارغة حالياً ولا يوجد طلب لإرساله.");
            return;
        }

        // 2. تجميع وتنسيق نص الطلب بشكل مرتب ومفهوم للإدارة
        let orderDetailsMessage = "طلب جديد من المتجر 🛒:\n";
        orderDetailsMessage += "-------------------------\n";
        
        currentCart.forEach((item, index) => {
            orderDetailsMessage += `${index + 1}. المنتج: ${item.name}\n`;
            orderDetailsMessage += `   الكمية: ${item.qty}\n`;
            orderDetailsMessage += `   السعر الفردي: ${item.price} ريال\n`;
            orderDetailsMessage += "-------------------------\n";
        });
        
        orderDetailsMessage += `💰 إجمالي الحساب الصافي: ${globalTotalSum} ريال يمني.`;

        // 3. إرسال الرسالة إلى مسار العميل الفرعي لكي تفهمه لوحة التحكم
        const clientChatRef = ref(db, `chats/${myUserId}`); 
        const newMessageRef = push(clientChatRef); // إنشاء معرف فريد للرسالة بداخل غرفة العميل
        
        set(newMessageRef, {
            sender: "client",                      
            message: orderDetailsMessage,          
            timestamp: Date.now(),
            status: "sent"
        }).then(() => {
            // 4. التنبيه والتحويل لصفحة الدردشة مع تمرير الـ userId الخاص بالزبون لفتح نفس الغرفة
            alert("تم إرسال تفاصيل طلبك تلقائياً إلى الدعم الفني! جاري فتح المحادثة... 🚀");
            window.location.href = `index2.html?userId=${myUserId}`;
        }).catch((error) => {
            console.error("خطأ أثناء إرسال الطلب للمحادثة:", error);
            window.location.href = `index2.html?userId=${myUserId}`;
        });
    });
}



// ================= التصفية بحسب التصنيفات والأصناف =================
const categories = document.querySelectorAll(".category-row .cat");
categories.forEach(cat => {
    cat.addEventListener("click", function() {
        categories.forEach(c => c.classList.remove("active"));
        this.classList.add("active");
        
        const targetCat = this.getAttribute("data-cat");
        document.getElementById("sectionTitle").innerText = targetCat === "الكل" ? "أحدث المنتجات المتاحة" : targetCat;
        
        if(targetCat === "الكل") {
            renderProducts(allProducts);
        } else {
            const filtered = allProducts.filter(p => p.category === targetCat);
            renderProducts(filtered);
        }
    });
});

// ================= ميزة البحث العلوي للزبون =================
const searchInp = document.getElementById("searchInp");
if(searchInp) {
    searchInp.addEventListener("input", function() {
        const text = searchInp.value.toLowerCase().trim();
        const filtered = allProducts.filter(p => p.name.toLowerCase().includes(text));
        renderProducts(filtered);
    });
}






// ================= نظام مراقبة وقراءة التنبيهات في صندوق رسائل الزبون =================
const customerChatListContainer = document.getElementById("customerChatListContainer");

if (customerChatListContainer) {
    // تحديد مسار دردشة العميل الحالي بداخل الفايربيز
    const myLiveChatRef = ref(db, `chats/${myUserId}`);

    // الاستماع الحي والمباشر للتغيرات والرسائل القادمة من الإدارة
    onValue(myLiveChatRef, (snapshot) => {
        customerChatListContainer.innerHTML = "";
        
        let unreadCount = 0;
        let lastMessageText = "لا توجد رسائل سابقة بينك وبين الدعم الفني.";
        let hasChat = false;

        if (snapshot.exists()) {
            hasChat = true;
            snapshot.forEach((childSnapshot) => {
                const msgData = childSnapshot.val();
                
                // إذا كانت الرسالة قادمة من الإدارة (admin) ولم يتم قراءتها (مثلاً status ليس read)
                if (msgData.sender === "admin" && msgData.status !== "read") {
                    unreadCount++;
                }
                
                // جلب نص آخر رسالة لعرضها كمظهر احترافي
                if (msgData.message) {
                    lastMessageText = msgData.message;
                }
            });
        }

        // إنشاء كرت المحادثة الخاص بالشركة والدعم الفني ليظهر بداخل القائمة
        const chatItemDiv = document.createElement("div");
        chatItemDiv.className = "user-chat-item"; // يمكنك التحكم بتصميمه في ملف الـ CSS
        
        // تجهيز ستايل أنيق وفخم للكرت متناسق مع هوية متجرك بلون خلفية برتقالي وأبيض
        chatItemDiv.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px;
            background: #fff;
            border: 1px solid #eee;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.02);
            margin-top: 10px;
        `;

        // إضافة تأثير الحوم بداخل المؤشر
        chatItemDiv.addEventListener("mouseover", () => chatItemDiv.style.background = "#fff6f0");
        chatItemDiv.addEventListener("mouseout", () => chatItemDiv.style.background = "#fff");

        // بناء محتوى الكرت وعرض عدد الرسائل غير المقروءة بجانب الأيقونة إن وجدت
        let badgeHTML = `<span style="color: #888; font-size: 12px;">مقرؤة ✅</span>`;
        if (unreadCount > 0) {
            badgeHTML = `
                <span style="
                    background: #ff3333; 
                    color: #fff; 
                    padding: 3px 9px; 
                    border-radius: 20px; 
                    font-size: 11px; 
                    font-weight: bold;
                    box-shadow: 0 2px 5px rgba(255,51,51,0.3);
                ">
                    ${unreadCount} رسائل جديدة 🚨
                </span>`;
        } else if (!hasChat) {
            badgeHTML = `<span style="color: #bbb; font-size: 12px;">مابش رسائل</span>`;
        }

        // اختصار نص الرسالة الأخيرة إذا كان طويلاً جداً (مثل الفواتير) ليظهر بشكل منسق
        let shortMessage = lastMessageText.length > 40 ? lastMessageText.substring(0, 40) + "..." : lastMessageText;

        chatItemDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="
                    width: 45px; 
                    height: 45px; 
                    background: #FF6600; 
                    color: #fff; 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                ">
                    <span class="material-symbols-rounded">support_agent</span>
                </div>
                <div style="text-align: right;">
                    <h4 style="margin: 0 0 5px 0; color: #333; font-size: 15px;">الدعم الفني - زين أون لاين</h4>
                    <p style="margin: 0; color: #777; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;">${shortMessage}</p>
                </div>
            </div>
            <div>
                ${badgeHTML}
            </div>
        `;

        // بمجرد الضغط الفوري على كرت الشركة يتم الانتقال الفوري لصفحة الدردشة الثانية (الكود الثاني)
        chatItemDiv.addEventListener("click", () => {
            window.location.href = `index2.html?userId=${myUserId}`;
        });

        customerChatListContainer.appendChild(chatItemDiv);
    });
}
