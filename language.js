// 1️⃣ قاموس الترجمة الكامل والمستخرج حرفياً من الـ HTML الخاص بك
const translations = {
    
    
    

    
    
    
    ar: {
        nav_title: "زين أون لاين",
        search_placeholder: "ابحث عن منتج...",
        cat_all: "الكل",
        cat_cars: "سيارات",
        cat_bikes: "دراجات",
        cat_lighting: "إضاءة",
        cat_oils: "زيوت",
        det_name: "اسم المنتج",
        det_price: "0 ريال يمني",
        det_stock: "الكمية المتوفرة: جاري الفحص...",
        det_desc: "وصف المنتج يظهر هنا بشكل احترافي",
        btn_add_to_cart: "إضافة إلى العربة",
        shipping_ticker: "شحن سريع وآمن لجميع المحافظات اليمنية وبأقل الأسعار الممكنة!",
        empty_cart_title: "عربة تسوقك فارغة",
        empty_cart_desc: "تصفح الأقسام والمنتجات الآن وأضف ما تحتاجه إلى سلتك",
        protection_title: "حماية الطلبات والمعاملات من Zain Online",
        protection_subtitle: "الطلبات والدفعات التي تتم داخل المنصة تحظى بحماية وأمان فائق لضمان حقوقك.",
        feature_secure_pay: "مدفوعات آمنة",
        feature_guaranteed_delivery: "توصيل مضمون",
        feature_return_protection: "حماية واسترداد",
        feature_support: "دعم 24/7",
        gateway_header: "اختر طريقة الدفع المحلية المناسبة:",
        acc_info_text: "رقم الحساب المعتمد للأداة:",
        warning_deposit: "يرجى إيداع المبلغ الصافي وإلا سيتم رفض الطلب تلقائياً من النظام.",
        btn_send_invoice: "تأكيد إرسال الإشعار وبدء المحادثة",
        select_all: "الكل",
        btn_checkout: "الانتقال للدفع",
        chat_title: "صندوق الرسائل والدردشة",
        btn_mark_all_read: "قراءة الكل",
        btn_mark_all_read_title: "تحديد الكل كمقروء",
        settings_title: "إعدادات التطبيق",
        setting_item_notifications: "ربط الإشعارات والبريد",
        setting_item_language: "تغيير لغة التطبيق",
        setting_item_about: "عنا وحول المنصة",
        setting_item_v2: "نسخة الواجهة الثانية",
        setting_item_updates: "إصدار الموقع والتحديثات",
        email_modal_title: "ربط البريد للإشعارات",
        email_modal_desc: "أدخل بريدك الإلكتروني لتلقي إشعارات فورية ومباشرة عند قبول طلباتك أو رفضها من النظام.",
        email_label: "البريد الإلكتروني للعميل:",
        email_placeholder: "example@gmail.com",
        btn_save_email: "حفظ والربط الفوري",
        nav_home: "الرئيسية",
        nav_chat: "الدردشة",
        nav_cart: "العربة",
        nav_settings: "الإعدادات",
        install_title: "تحميل تطبيق المتجر",
        install_desc: "هل تود تثبيت تطبيق \"زين أون لاين\" المباشر على شاشة هاتفك الرئيسية لتصفح أسرع وأسهل",
        btn_install_now: "تثبيت الآن",
        btn_install_later: "لاحقاً",
        alert_email_error: "⚠️ الرجاء إدخال بريد إلكتروني صحيح ومكتمل!",
        alert_email_success: "🟢 تم ربط بريدك الإلكتروني بنجاح! ستصلك إشعارات الاعتماد أو الرفض فوراً.",
        alert_lang_success: "🌐 تم تحويل لغة التطبيق بنجاح إلى: العربية", 
        
        chat_room_title: "محادثة الدعم الفني",
        btn_back: "رجوع",
        timer_checking: "⏳ جاري فحص حالة الطلب المباشر...",
        btn_cancel_order: "❌ إلغاء الطلب",
        chat_loading_messages: "جاري فتح صندوق الرسائل والطلبات الحية...",
        chat_input_placeholder: "اكتب رسالتك أو ردك هنا...",
        chat_init_hint: "أرسل رسالة لبدء المحادثة الفورية...",
        chat_image_loading: "⏳ جاري إرسال الصورة المباشرة...",
        chat_upload_tooltip: "إرسال صورة",

        // --- تنبيهات ونوافذ صفحة الشات الفخمة ---
        modal_confirm_cancel_title: "تأكيد إلغاء الطلب",
        modal_confirm_cancel_desc: "هل أنت متأكد من إلغاء طلبك الحالي والتراجع عن الشراء؟",
        modal_btn_yes_cancel: "نعم، إلغاء",
        modal_btn_no_keep: "تراجع",
        modal_btn_ok: "موافق",

        alert_order_cancelled_title: "تم الإلغاء",
        alert_order_cancelled_desc: "تم إلغاء طلبك الحالي وتحديث المحادثة بنجاح.",
        alert_timeout_title: "انتهت المهلة",
        alert_timeout_desc: "⏰ انتهت المهلة! تم إلغاء الطلب تلقائياً لعدم استجابة الإدارة، وتجد منتجاتك محفوظه بالسلة.",
        alert_file_type_error_title: "نوع الملف غير مدعوم",
        alert_file_type_error_desc: "يرجى اختيار ملفات الصور فقط (PNG, JPG, JPEG).",
        alert_upload_error_title: "فشل رفع الصورة",
        alert_upload_error_desc: "حدث خطأ أثناء رفع الصورة، تأكد من اتصالك بالإنترنت.",

        // --- نصوص حالات الطلب والعداد ---
        status_pending_text: "⚠️ طلبك قيد المراجعة الفورية! الوقت المتبقي: ",
        status_approved_text: "✅ تم اعتماد وقبول طلبك بنجاح وجاري تجهيز الشحن الفوري!",

        // --- نصوص رسائل الشات التلقائية والبريد الإلكتروني ---
        chat_msg_cancelled_by_client: "❌ تم إلغاء الطلب من قبل العميل.",
        chat_msg_auto_cancelled: "❌ تم إلغاء هذا الطلب تلقائياً لعدم استجابة الإدارة خلال دقيقتين.",

        email_subject_cancelled: "تم إلغاء عملية الشراء ❌ (بطلب العميل)",
        email_body_cancelled: "نحيطك علماً بأنه قد تم إلغاء طلب الشراء الخاص بك بنجاح بناءً على طلبك المباشر من واجهة المحادثة.",
        email_subject_approved: "تم قبول واعتماد طلبك 🎉",
        email_body_approved: "أخبار رائعة! وافقت الإدارة على طلبك المباشر، وجاري الآن تجهيز شحنتك لتوصيلها إليك بأسرع وقت.\n\nبيان الطلب المعتمد:\n",
        email_subject_auto_cancelled: "تم إلغاء عملية الشراء ⏰ (تلقائياً)",
        email_body_auto_cancelled: "نحيطك علماً بأنه قد تم إلغاء طلب الشراء الخاص بك تلقائياً لانتهاء مهلة الاستجابة الفورية من الإدارة المقدرة بدقيقتين.", 
        
        // --- نصوص تنبيهات ونوافذ السلة والطلب (كود JS) ---
        visitor_count_error: "خطأ في عداد الزوار",
        products_empty_hint: "انتظرونا، سيتم توفير المنتجات قريباً جداً في المتجر! 🛒",
        search_no_results: "عذراً، لم نجد نتائج تطابق بحثك.",
        product_label_new: "جديد",
        product_currency: "ريال",
        product_currency_yemeni: "ريال يمني",
        product_no_desc: "لا يوجد وصف متوفر لهذا المنتج حالياً.",
        product_stock_qty: "الكمية المتبقية في المخزن: ",
        product_unit_carton: "كرتون",

        // --- تنبيهات السلة الصارمة والمودال الفخم ---
        alert_out_of_stock_title: "نفذت الكمية",
        alert_out_of_stock_desc: "عذراً، هذا المنتج نفذ تماماً من المخزن حالياً! ❌",
        alert_stock_insufficient_title: "المخزن لا يكفي",
        alert_stock_insufficient_desc: "عذراً! الكمية المتبقية في المخزن فقط هي: ",
        alert_cart_added_title: "تمت الإضافة",
        alert_cart_added_desc_prefix: "تم إضافة ",
        alert_cart_added_desc_suffix: " بنجاح إلى العربة! 🛒",
        alert_network_error_title: "خطأ بالشبكة",
        alert_network_error_desc: "خطأ في الاتصال بالشبكة للتحقق من الكمية: ",

        // --- بوابات الدفع وإرسال الإشعار ---
        alert_cart_empty_title: "العربة فارغة",
        alert_cart_empty_desc: "سلتك فارغة! يرجى إضافة منتجات أولاً قبل إتمام الدفع.",
        gateway_loading: "جاري جلب طرق الدفع المتاحة...",
        gateway_no_accounts: "لا تتوفر حسابات دفع حالياً، تواصل مع الدعم.",
        gateway_owner_admin: "الإدارة",
        alert_copied_title: "تم النسخ",
        alert_copied_desc: "تم نسخ رقم الحساب بنجاح! 📋",
        alert_acc_number_title: "الحساب",
        alert_acc_number_desc: "رقم الحساب هو: ",

        // --- نافذة تحديد العنوان والطلب الفخمة ---
        modal_prompt_location_title: "تحديد موقع التوصيل",
        modal_prompt_location_subtitle: "يرجى كتابة عنوانك بالتفصيل لتسهيل تسليم الشحنة إليك فوراً:",
        modal_prompt_location_placeholder: "شحن المحافظة - مدينة...",
        location_loading_attempt: "جاري محاولة تحديد الموقع...",
        location_geo_text: "موقع جغرافي (خط طول: ",
        location_geo_lat: ", خط عرض: ",
        location_denied_text: "لم يتم تحديد الموقع (العميل لم يسمح بالوصول والتوثيق المباشر)",

        // --- تفاصيل الفاتورة وبوت تليجرام ---
        order_invoice_title: "🛍️ طلب جديد #",
        order_invoice_address: "📍 العنوان: ",
        order_invoice_total: "💰 الإجمالي الصافي: ",
        order_invoice_status_pending: "⚠️ حالة الطلب: قيد الانتظار...",
        order_stock_update_error: "خطأ أثناء تحديث كمية المنتج: ",
        telegram_notification_prefix: "🔔 إشعار طلب جديد من متجر زين أون لاين!\n\n",
        telegram_notification_suffix: "\n\n🔗 لمتابعة المحادثة مع العميل سرياً:\n",
        telegram_send_error: "فشل الإرسال للمعرف ",
        alert_order_success_title: "تم إرسال طلبك!",
        alert_order_success_desc_prefix: "نجح إرسال طلبك برقم (",
        alert_order_success_desc_suffix: "). جاري توجيهك الآن لقسم المحادثات الحية لتأكيد الاستلام... ✨",

        // --- صندوق رسائل شات العميل ---
        chat_default_welcome: "مرحباً بك في متجرنا! راسلنا هنا في حال وجود أي استفسار لبدء المحادثة الفورية... ✨",
        chat_time_now: "الآن",
        chat_support_name: "الدعم الفني - زين أون لاين",
        chat_tooltip_pin: "تثبيت المحادثة",   
        chat_tooltip_delete: "حذف المحادثة",
        modal_btn_confirm_send: "تأكيد الإرسال "
    },
    en: {
        nav_title: "Zain Online",
        search_placeholder: "Search for a product...",
        cat_all: "All",
        cat_cars: "Cars",
        cat_bikes: "Bikes",
        cat_lighting: "Lighting",
        cat_oils: "Oils",
        det_name: "Product Name",
        det_price: "0 YER",
        det_stock: "Available Quantity: Checking...",
        det_desc: "Product description appears here professionally",
        btn_add_to_cart: "Add to Cart",
        shipping_ticker: "Fast and secure shipping to all Yemeni governorates at the lowest possible prices!",
        empty_cart_title: "Your shopping cart is empty",
        empty_cart_desc: "Browse sections and products now and add what you need to your cart",
        protection_title: "Order & Transaction Protection from Zain Online",
        protection_subtitle: "Orders and payments made inside the platform are highly protected to ensure your rights.",
        feature_secure_pay: "Secure Payments",
        feature_guaranteed_delivery: "Guaranteed Delivery",
        feature_return_protection: "Return Protection",
        feature_support: "24/7 Support",
        gateway_header: "Choose the appropriate local payment method:",
        acc_info_text: "Approved account number for the tool:",
        warning_deposit: "Please deposit the net amount, otherwise the order will be automatically rejected by the system.",
        btn_send_invoice: "Confirm notification sending & start chat",
        select_all: "All",
        btn_checkout: "Proceed to Payment",
        chat_title: "Inbox and Chat",
        btn_mark_all_read: "Read All",
        btn_mark_all_read_title: "Mark all as read",
        settings_title: "App Settings",
        setting_item_notifications: "Link Notifications & Email",
        setting_item_language: "Change App Language",
        setting_item_about: "About Us & Platform",
        setting_item_v2: "Second Interface Version",
        setting_item_updates: "Site Version & Updates",
        email_modal_title: "Link Email for Notifications",
        email_modal_desc: "Enter your email to receive instant and direct notifications when your orders are accepted or rejected by the system.",
        email_label: "Customer Email:",
        email_placeholder: "example@gmail.com",
        btn_save_email: "Save & Link Instantly",
        nav_home: "Home",
        nav_chat: "Chat",
        nav_cart: "Cart",
        nav_settings: "Settings",
        install_title: "Download Store App",
        install_desc: "Would you like to install the \"Zain Online\" app directly on your phone's home screen for faster and easier browsing?",
        btn_install_now: "Install Now",
        btn_install_later: "Later",
        alert_email_error: "⚠️ Please enter a valid and complete email address!",
        alert_email_success: "🟢 Your email has been successfully linked! You will receive approval or rejection notifications instantly.",
        alert_lang_success: "🌐 Application language has been successfully changed to: English", 
        
        // --- New Client Chat & Room Page ---
        chat_room_title: "Technical Support Chat",
        btn_back: "Back",
        timer_checking: "⏳ Checking live order status...",
        btn_cancel_order: "❌ Cancel Order",
        chat_loading_messages: "Opening inbox and live orders...",
        chat_input_placeholder: "Type your message or reply here...",
        chat_init_hint: "Send a message to start an instant conversation...",
        chat_image_loading: "⏳ Sending live image...",
        chat_upload_tooltip: "Send Image",

        // --- Chat Page Luxury Modals & Alerts ---
        modal_confirm_cancel_title: "Confirm Order Cancellation",
        modal_confirm_cancel_desc: "Are you sure you want to cancel your current order and back out of the purchase?",
        modal_btn_yes_cancel: "Yes, Cancel",
        modal_btn_no_keep: "Go Back",
        modal_btn_ok: "OK",

        alert_order_cancelled_title: "Cancelled",
        alert_order_cancelled_desc: "Your current order has been cancelled and the chat updated successfully.",
        alert_timeout_title: "Timeout",
        alert_timeout_desc: "⏰ Timeout! The order was automatically cancelled due to no response from management, your items are saved in the cart.",
        alert_file_type_error_title: "Unsupported File Type",
        alert_file_type_error_desc: "Please select image files only (PNG, JPG, JPEG).",
        alert_upload_error_title: "Image Upload Failed",
        alert_upload_error_desc: "An error occurred while uploading the image. Please check your internet connection.",

        // --- Order Statuses & Timer Texts ---
        status_pending_text: "⚠️ Your order is under immediate review! Time remaining: ",
        status_approved_text: "✅ Your order has been successfully approved, and immediate shipping is being prepared!",

        // --- Auto Chat Messages & Email Templates ---
        chat_msg_cancelled_by_client: "❌ The order has been cancelled by the customer.",
        chat_msg_auto_cancelled: "❌ This order was automatically cancelled due to no response from management within two minutes.",

        email_subject_cancelled: "Purchase Cancelled ❌ (By Customer Request)",
        email_body_cancelled: "Please be informed that your purchase order has been successfully cancelled based on your direct request from the chat interface.",
        email_subject_approved: "Your Order Approved 🎉",
        email_body_approved: "Great news! Management has approved your direct order, and your shipment is now being prepared for delivery as soon as possible.\n\nApproved Order Details:\n",
        email_subject_auto_cancelled: "Purchase Cancelled ⏰ (Automatically)",
        email_body_auto_cancelled: "Please be informed that your purchase order has been automatically cancelled due to the expiration of the 2-minute immediate response window from management.", 
        
        // --- Cart & Order Alerts Texts (JS Code) ---
        visitor_count_error: "Error in visitor counter",
        products_empty_hint: "Stay tuned, products will be available in the store very soon! 🛒",
        search_no_results: "Sorry, no results matched your search.",
        product_label_new: "New",
        product_currency: "YER",
        product_currency_yemeni: "Yemeni Rial",
        product_no_desc: "No description available for this product at the moment.",
        product_stock_qty: "Remaining quantity in stock: ",
        product_unit_carton: "Carton",

        // --- Strict Cart Validation & Premium Modals ---
        alert_out_of_stock_title: "Out of Stock",
        alert_out_of_stock_desc: "Sorry, this product is completely out of stock at the moment! ❌",
        alert_stock_insufficient_title: "Insufficient Stock",
        alert_stock_insufficient_desc: "Sorry! The remaining quantity in stock is only: ",
        alert_cart_added_title: "Added Successfully",
        alert_cart_added_desc_prefix: "Successfully added ",
        alert_cart_added_desc_suffix: " to the cart! 🛒",
        alert_network_error_title: "Network Error",
        alert_network_error_desc: "Network connection error while checking stock: ",

        // --- Payment Gateways & Notice Confirmation ---
        alert_cart_empty_title: "Empty Cart",
        alert_cart_empty_desc: "Your cart is empty! Please add products first before proceeding to payment.",
        gateway_loading: "Fetching available payment methods...",
        gateway_no_accounts: "No payment accounts available right now, please contact support.",
        gateway_owner_admin: "Management",
        alert_copied_title: "Copied",
        alert_copied_desc: "Account number copied successfully! 📋",
        alert_acc_number_title: "Account",
        alert_acc_number_desc: "Account number is: ",

        // --- Premium Location Prompt Modal ---
        modal_prompt_location_title: "Specify Delivery Location",
        modal_prompt_location_subtitle: "Please write your detailed address to facilitate immediate shipment delivery:",
        modal_prompt_location_placeholder: "Governorate Shipping - City...",
        location_loading_attempt: "Attempting to determine location...",
        location_geo_text: "Geographical location (Longitude: ",
        location_geo_lat: ", Latitude: ",
        location_denied_text: "Location not determined (Customer did not allow direct access and documentation)",

        // --- Invoice Details & Telegram Bot Notifications ---
        order_invoice_title: "🛍️ New Order #",
        order_invoice_address: "📍 Address: ",
        order_invoice_total: "💰 Net Total: ",
        order_invoice_status_pending: "⚠️ Order Status: Pending...",
        order_stock_update_error: "Error updating stock quantity for product: ",
        telegram_notification_prefix: "🔔 New order notification from Zain Online Store!\n\n",
        telegram_notification_suffix: "\n\n🔗 To follow the conversation with the customer privately:\n",
        telegram_send_error: "Failed to send to ID ",
        alert_order_success_title: "Your order has been sent!",
        alert_order_success_desc_prefix: "Your order was successfully sent with number (",
        alert_order_success_desc_suffix: "). Redirecting you now to the live chat section to confirm receipt... ✨",

        // --- Customer Chat List Box ---
        chat_default_welcome: "Welcome to our store! Message us here if you have any inquiries to start an instant conversation... ✨",
        chat_time_now: "Now",
        chat_support_name: "Technical Support - Zain Online",
        chat_tooltip_pin: "Pin Chat",
        chat_tooltip_delete: "Delete Chat",
        modal_btn_confirm_send: "Confirm Send"
    }
};

// 2️⃣ دالة لتغيير وتبديل النصوص في الواجهة
function applyLanguage(lang) {
    // ضبط اتجاه الصفحة واللغة الأساسية للمتصفح
    if (lang === "en") {
        document.documentElement.dir = "ltr";
        document.documentElement.lang = "en";
    } else {
        document.documentElement.dir = "rtl";
        document.documentElement.lang = "ar";
    }

    // [1] عناوين المتصفح
    const titleElement = document.querySelector("title");
    if (titleElement) titleElement.textContent = translations[lang].nav_title;

    // [2] شريط البحث
    const searchInp = document.getElementById("searchInp");
    if (searchInp) searchInp.placeholder = translations[lang].search_placeholder;

    // [3] الأقسام والتصنيفات (بناءً على الـ data-cat الأصلي)
    const catElements = document.querySelectorAll(".category-row .cat");
    catElements.forEach(cat => {
        const catType = cat.getAttribute("data-cat");
        if (catType === "الكل") cat.textContent = translations[lang].cat_all;
        if (catType === "اكسسوارات سيارات") cat.textContent = translations[lang].cat_cars;
        if (catType === "اكسسوارات دراجات") cat.textContent = translations[lang].cat_bikes;
        if (catType === "إضاءة") cat.textContent = translations[lang].cat_lighting;
        if (catType === "زيوت") cat.textContent = translations[lang].cat_oils;
    });

    // [4] صفحة التفاصيل
    const detName = document.getElementById("detName");
    if (detName && detName.textContent === translations[lang === "en" ? "ar" : "en"].det_name) detName.textContent = translations[lang].det_name;
    
    const detStock = document.getElementById("detStock");
    if (detStock) detStock.textContent = translations[lang].det_stock;
    
    const detDesc = document.getElementById("detDesc");
    if (detDesc && detDesc.textContent === translations[lang === "en" ? "ar" : "en"].det_desc) detDesc.textContent = translations[lang].det_desc;
    
    const addToCartBtn = document.getElementById("addToCartBtn");
    if (addToCartBtn) addToCartBtn.textContent = translations[lang].btn_add_to_cart;

    // [5] صفحة العربة والتوصيل والحماية
    const tickerText = document.querySelector(".alibaba-shipping-ticker p");
    if (tickerText) tickerText.textContent = translations[lang].shipping_ticker;

    const emptyCartTitle = document.querySelector(".empty-cart-view h4");
    if (emptyCartTitle) emptyCartTitle.textContent = translations[lang].empty_cart_title;

    const emptyCartDesc = document.querySelector(".empty-cart-view p");
    if (emptyCartDesc) emptyCartDesc.textContent = translations[lang].empty_cart_desc;

    const protectionTitle = document.querySelector(".alibaba-protection-card .protection-title strong");
    if (protectionTitle) protectionTitle.textContent = translations[lang].protection_title;

    const protectionSubtitle = document.querySelector(".alibaba-protection-card .protection-subtitle");
    if (protectionSubtitle) protectionSubtitle.textContent = translations[lang].protection_subtitle;

    // ميزات الحماية الأربعة
    const features = document.querySelectorAll(".p-feature-item");
    if (features.length >= 4) {
        features[0].querySelector("h6").textContent = translations[lang].feature_secure_pay;
        features[1].querySelector("h6").textContent = translations[lang].feature_guaranteed_delivery;
        features[2].querySelector("h6").textContent = translations[lang].feature_return_protection;
        features[3].querySelector("h6").textContent = translations[lang].feature_support;
    }

    // بوابات الدفع والـ Checkout
    const gatewayHeader = document.querySelector(".gateway-header h4");
    if (gatewayHeader) gatewayHeader.textContent = translations[lang].gateway_header;

    const accInfoRow = document.querySelector(".acc-info-row p");
    if (accInfoRow) accInfoRow.textContent = translations[lang].acc_info_text;

    const depositNotice = document.getElementById("depositNotice");
    if (depositNotice) depositNotice.textContent = translations[lang].warning_deposit;

    const sendInvoiceBtn = document.getElementById("sendInvoiceBtn");
    if (sendInvoiceBtn) {
        sendInvoiceBtn.innerHTML = `<span class="material-symbols-rounded">chat</span> ${translations[lang].btn_send_invoice}`;
    }

    const selectAllSpan = document.querySelector(".select-all-area span");
    if (selectAllSpan) selectAllSpan.textContent = translations[lang].select_all;

    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
        checkoutBtn.innerHTML = `<span>${translations[lang].btn_checkout}</span> <span class="material-symbols-rounded">arrow_forward</span>`;
    }

    // [6] صفحة الدردشة الرئيسية
    const chatTitle = document.querySelector(".chat-title-area h3");
    if (chatTitle) chatTitle.textContent = translations[lang].chat_title;

    const markAllReadBtn = document.getElementById("markAllReadBtn");
    if (markAllReadBtn) {
        markAllReadBtn.title = translations[lang].btn_mark_all_read_title;
        markAllReadBtn.querySelector("span:not(.material-symbols-rounded)").textContent = translations[lang].btn_mark_all_read;
    }

    // [7] شاشة الإعدادات والنوافذ الفرعية
    const settingsHeader = document.querySelector(".settings-modal-box .settings-header h3");
    if (settingsHeader) {
        settingsHeader.innerHTML = `<span class="material-symbols-rounded">settings</span> ${translations[lang].settings_title}`;
    }

    const settingLinks = document.querySelectorAll(".settings-options-list .settings-item-link");
    if (settingLinks.length >= 5) {
        settingLinks[0].querySelector(".settings-item-left span:not(.material-symbols-rounded)").textContent = translations[lang].setting_item_notifications;
        settingLinks[1].querySelector(".settings-item-left span:not(.material-symbols-rounded)").textContent = translations[lang].setting_item_language;
        settingLinks[2].querySelector(".settings-item-left span:not(.material-symbols-rounded)").textContent = translations[lang].setting_item_about;
        settingLinks[3].querySelector(".settings-item-left span:not(.material-symbols-rounded)").textContent = translations[lang].setting_item_v2;
        settingLinks[4].querySelector(".settings-item-left span:not(.material-symbols-rounded)").textContent = translations[lang].setting_item_updates;
    }

    const emailModalHeader = document.querySelector("#notificationEmailModal .settings-header h3");
    if (emailModalHeader) {
        emailModalHeader.innerHTML = `<span class="material-symbols-rounded">mail</span> ${translations[lang].email_modal_title}`;
    }

    const emailModalDesc = document.querySelector("#notificationEmailModal p");
    if (emailModalDesc) emailModalDesc.textContent = translations[lang].email_modal_desc;

    const emailLabel = document.querySelector(".input-neon-group label");
    if (emailLabel) emailLabel.textContent = translations[lang].email_label;

    const saveEmailBtn = document.getElementById("saveEmailBtn");
    if (saveEmailBtn) saveEmailBtn.textContent = translations[lang].btn_save_email;

    // [8] شريط النواتج والتنقل السفلي (Bottom Nav)
    const navButtons = document.querySelectorAll(".bottom-nav .nav-btn");
    if (navButtons.length >= 4) {
        navButtons[0].querySelector("span:not(.material-symbols-rounded)").textContent = translations[lang].nav_home;
        navButtons[1].querySelector("span:not(.material-symbols-rounded)").textContent = translations[lang].nav_chat;
        navButtons[2].querySelector("span:not(.material-symbols-rounded)").textContent = translations[lang].nav_cart;
        navButtons[3].querySelector("span:not(.material-symbols-rounded)").textContent = translations[lang].nav_settings;
    }

    // [9] ربط وتحديث عناصر صفحة الشات الفرعية الجديدة (إن وُجدت في الصفحة الحالية)
    const chatRoomTitle = document.querySelector("header h3");
    if (chatRoomTitle && chatRoomTitle.textContent !== translations[lang === "en" ? "ar" : "en"].chat_title) {
        chatRoomTitle.textContent = translations[lang].chat_room_title;
    }

    const backBtnSpan = document.querySelector(".back-btn span:not(.material-symbols-rounded)");
    if (backBtnSpan) backBtnSpan.textContent = translations[lang].btn_back;

    const chatLoadingText = document.querySelector("#roomMessagesContainer p");
    if (chatLoadingText && chatLoadingText.textContent === translations[lang === "en" ? "ar" : "en"].chat_loading_messages) {
        chatLoadingText.textContent = translations[lang].chat_loading_messages;
    }

    const roomReplyInp = document.getElementById("roomReplyInp");
    if (roomReplyInp) roomReplyInp.placeholder = translations[lang].chat_input_placeholder;

    const chatImageLabel = document.querySelector(".image-upload-label");
    if (chatImageLabel) chatImageLabel.title = translations[lang].chat_upload_tooltip;

    const clientCancelBtn = document.getElementById("clientCancelBtn");
    if (clientCancelBtn) clientCancelBtn.textContent = translations[lang].btn_cancel_order;
}

    // ربط زر "تغيير لغة التطبيق" ليعمل بالتبديل المباشر
 // 3️⃣ التحكم الرئيسي عند تحميل الصفحة والضغط على زر التغيير الفوري
document.addEventListener("DOMContentLoaded", () => {
    let currentLang = localStorage.getItem("app_language") || "ar";
    applyLanguage(currentLang);

    // هذا الزر هو الذي يتبدل بين اللغتين بضغطة واحدة فورية
    const triggerLanguageModal = document.getElementById("triggerLanguageModal");
    if (triggerLanguageModal) {
        triggerLanguageModal.addEventListener("click", () => {
            // 1. تبديل اللغة
            currentLang = (currentLang === "ar") ? "en" : "ar";
            localStorage.setItem("app_language", currentLang);
            
            // 2. تطبيق الترجمة على نصوص الصفحة
            applyLanguage(currentLang);
            
            // 3. إعادة رسم المنتجات (ليترجم أسماء المنتجات والأقسام القادمة من الفايربيز)
            if (typeof renderProducts === 'function' && typeof allProducts !== 'undefined') {
                renderProducts(allProducts);
            }

            // 4. إغلاق قائمة الإعدادات (إذا كانت مفتوحة)
            const settingsOverlay = document.getElementById("customSettingsOverlay");
            if (settingsOverlay) settingsOverlay.classList.remove("active");
            
            // قمنا بحذف كود الـ alert الذي كان يظهر النافذة المنبثقة
        });
    }
});
