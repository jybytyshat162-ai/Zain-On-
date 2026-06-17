الان اشتي هاذه الزر



 اذا كان في اشعار جديد في الصفحه هاذه 


<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>تحديثات وإعلانات زين أون لاين</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" />
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Cairo', sans-serif;
            background: #ffffff;  /* ← تم التعديل إلى الأبيض */
            padding: 20px;
            min-height: 100vh;
        }
        
        /* أنميشن للصفحة */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .notifications-container {
            max-width: 600px;
            margin: 0 auto;
        }
        
        /* عنوان الصفحة الفخم */
        .page-header {
            text-align: center;
            margin-bottom: 30px;
            animation: fadeInUp 0.6s ease;
        }
        
        .page-header h1 {
            color: #FF6600;
            font-size: 28px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .page-header p {
            color: #666;
            font-size: 14px;
            margin-top: 8px;
        }
        
        /* البطاقة الفخمة */
        .notification-card {
            background: white;
            border-radius: 28px;
            padding: 22px;
            margin-bottom: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            border: 1px solid #f0f0f0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            position: relative;
            overflow: hidden;
            animation: fadeInUp 0.5s ease;
            animation-fill-mode: both;
        }
        
        /* تأثير التوقف عند المرور */
        .notification-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
            border-color: #FF660020;
        }
        
        /* خط زمني جميل على الجنب */
        .notification-card::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 6px;
            height: 100%;
            background: linear-gradient(135deg, #FF6600, #FF9933);
            border-radius: 3px 0 0 3px;
        }
        
        /* رأس الإشعار */
        .notification-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 15px;
        }
        
        /* أيقونة فخمة */
        .notification-icon {
            background: linear-gradient(135deg, #FF6600, #FF9933);
            width: 55px;
            height: 55px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 5px 15px rgba(255, 102, 0, 0.2);
        }
        
        .notification-icon span {
            font-size: 28px;
            color: white;
        }
        
        /* عنوان الإشعار */
        .notification-title {
            flex: 1;
        }
        
        .notification-title h3 {
            font-size: 18px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 5px;
        }
        
        .notification-title .date {
            font-size: 11px;
            color: #999;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        /* معاينة الرسالة */
        .message-preview {
            font-size: 14px;
            color: #666;
            line-height: 1.5;
            padding-right: 70px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .message-preview span {
            font-size: 16px;
            color: #FF6600;
        }
        
        /* علامة قراءة/غير مقروء */
        .unread-badge {
            position: absolute;
            top: 20px;
            left: 20px;
            background: #FF6600;
            color: white;
            font-size: 10px;
            padding: 3px 8px;
            border-radius: 20px;
            font-weight: bold;
        }
        
        /* ========== النافذة المنبثقة الفخمة ========== */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .modal-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        
        .modal-content {
            background: white;
            max-width: 400px;
            width: 90%;
            border-radius: 32px;
            padding: 28px;
            transform: scale(0.8);
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            text-align: center;
            position: relative;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
        }
        
        .modal-overlay.active .modal-content {
            transform: scale(1);
        }
        
        .modal-icon {
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, #FF6600, #FF9933);
            border-radius: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: -48px auto 20px auto;
            box-shadow: 0 10px 25px rgba(255, 102, 0, 0.3);
        }
        
        .modal-icon span {
            font-size: 36px;
            color: white;
        }
        
        .modal-content h3 {
            font-size: 22px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 10px;
        }
        
        .modal-date {
            color: #999;
            font-size: 12px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
        }
        
        .modal-message {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 20px;
            margin: 20px 0;
            font-size: 15px;
            line-height: 1.7;
            color: #333;
            text-align: right;
        }
        
        .modal-close {
            background: linear-gradient(135deg, #FF6600, #FF9933);
            border: none;
            padding: 12px 24px;
            border-radius: 40px;
            color: white;
            font-weight: bold;
            font-family: 'Cairo', sans-serif;
            cursor: pointer;
            width: 100%;
            font-size: 14px;
            transition: transform 0.2s;
        }
        
        .modal-close:active {
            transform: scale(0.96);
        }
        
        /* زر العودة */
        .back-home {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #FF6600;
            color: white;
            border: none;
            padding: 14px 28px;
            border-radius: 50px;
            font-family: 'Cairo', sans-serif;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 5px 20px rgba(255, 102, 0, 0.3);
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s;
            z-index: 100;
        }
        
        .back-home:active {
            transform: translateX(-50%) scale(0.96);
        }
        
        /* رسالة فارغة */
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            background: #fafafa;
            border-radius: 32px;
            animation: fadeInUp 0.5s ease;
            border: 1px solid #eee;
        }
        
        .empty-state span {
            font-size: 64px;
            color: #ccc;
        }
        
        .empty-state h3 {
            color: #333;
            margin: 10px 0;
        }
        
        .empty-state p {
            color: #888;
        }
        
        /* تأخير ظهور البطاقات */
        .notification-card:nth-child(1) { animation-delay: 0.1s; }
        .notification-card:nth-child(2) { animation-delay: 0.2s; }
        .notification-card:nth-child(3) { animation-delay: 0.3s; }
    </style>
</head>
<body>

<div class="page-header">
    <h1>
        <span class="material-symbols-rounded">campaign</span>
         الإعلانات
    </h1>
    <p>آخر الأخبار والعروض الحصرية</p>
</div>

<div class="notifications-container" id="updatesContainer">
    <div class="empty-state" id="emptyState">
        <span class="material-symbols-rounded">notifications_none</span>
        <h3>لا توجد إعلانات حالياً</h3>
        <p></p>
    </div>
</div>

<button class="back-home" onclick="window.location.href='index.html'">
    <span class="material-symbols-rounded">home</span>
    العودة للرئيسية
</button>

<!-- النافذة المنبثقة -->
<div id="modalOverlay" class="modal-overlay" onclick="closeModalOnClickOutside(event)">
    <div class="modal-content">
        <div class="modal-icon">
            <span class="material-symbols-rounded">celebration</span>
        </div>
        <h3 id="modalTitle">عنوان الإعلان</h3>
        <div class="modal-date">
            <span class="material-symbols-rounded">calendar_today</span>
            <span id="modalDate"></span>
        </div>
        <div class="modal-message" id="modalMessage">
            نص الإعلان الكامل
        </div>
        <button class="modal-close" onclick="closeModal()">
            <span class="material-symbols-rounded" style="font-size: 18px;">close</span>
            إغلاق
        </button>
    </div>
</div>

<script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
    import { getDatabase, ref, onValue, set, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

    const firebaseConfig = {
        apiKey: "AIzaSyAUmiSv1NdOWCZhJCGab6in028MPhNjFgE",
        databaseURL: "https://zain-online-938c5-default-rtdb.firebaseio.com",
        projectId: "zain-online-938c5"
    };
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    const container = document.getElementById('updatesContainer');
    const emptyState = document.getElementById('emptyState');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalDate = document.getElementById('modalDate');
    const modalMessage = document.getElementById('modalMessage');

    // معرف المستخدم
    const userId = localStorage.getItem("zain_user_id") || "guest_" + Date.now();
    
    // دالة فتح النافذة المنبثقة
    window.openModal = function(title, message, date, updateId) {
        modalTitle.innerText = title;
        modalMessage.innerText = message;
        modalDate.innerText = date;
        modalOverlay.classList.add('active');
        
        // تسجيل أن المستخدم قرأ هذا الإعلان
        markAsRead(updateId);
        
        // إزالة علامة "جديد" إذا وجدت
        const card = document.querySelector(`.notification-card[data-id="${updateId}"]`);
        if(card) {
            const badge = card.querySelector('.unread-badge');
            if(badge) badge.remove();
        }
    };
    
    window.closeModal = function() {
        modalOverlay.classList.remove('active');
    };
    
    window.closeModalOnClickOutside = function(event) {
        if(event.target === modalOverlay) {
            closeModal();
        }
    };
    
    // دالة تسجيل القراءة في Firebase
    async function markAsRead(updateId) {
        const readRef = ref(db, `users/${userId}/read_updates/${updateId}`);
        const snapshot = await get(readRef);
        if(!snapshot.exists()) {
            set(readRef, { readAt: Date.now() });
        }
    }
    
    // دالة التحقق إذا كان الإعلان مقروءاً
    async function isRead(updateId) {
        const readRef = ref(db, `users/${userId}/read_updates/${updateId}`);
        const snapshot = await get(readRef);
        return snapshot.exists();
    }

    // قراءة التحديثات العامة من القاعدة
    onValue(ref(db, 'global_updates'), async (snapshot) => {
        const data = snapshot.val();
        
        if (!data || Object.keys(data).length === 0) {
            emptyState.style.display = 'block';
            container.innerHTML = '';
            container.appendChild(emptyState);
            return;
        }
        
        emptyState.style.display = 'none';
        container.innerHTML = '';
        
        const updates = Object.entries(data).map(([key, val]) => ({id: key, ...val}));
        updates.sort((a, b) => b.timestamp - a.timestamp);
        
        for (const upd of updates) {
            const read = await isRead(upd.id);
            const card = document.createElement('div');
            card.className = 'notification-card';
            card.setAttribute('data-id', upd.id);
            
            // تنسيق التاريخ
            const dateObj = new Date(upd.timestamp);
            const formattedDate = dateObj.toLocaleDateString('ar-SA', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            // معاينة الرسالة (أول 60 حرف)
            const preview = upd.message.length > 60 ? upd.message.substring(0, 60) + '...' : upd.message;
            
            card.innerHTML = `
                ${!read ? '<div class="unread-badge">جديد</div>' : ''}
                <div class="notification-header">
                    <div class="notification-icon">
                        <span class="material-symbols-rounded">${upd.icon || 'campaign'}</span>
                    </div>
                    <div class="notification-title">
                        <h3>${upd.title}</h3>
                        <div class="date">
                            <span class="material-symbols-rounded" style="font-size: 12px;">schedule</span>
                            ${formattedDate}
                        </div>
                    </div>
                </div>
                <div class="message-preview">
                    <span class="material-symbols-rounded">description</span>
                    ${preview}
                </div>
            `;
            
            // إضافة حدث الضغط لفتح النافذة
            card.addEventListener('click', () => {
                openModal(upd.title, upd.message, formattedDate, upd.id);
            });
            
            container.appendChild(card);
        }
    });
</script>

</body>
</html>


تضهر علمه عمر على الزر  بمجرد المشاهده تختفي ايش افعل...؟ 