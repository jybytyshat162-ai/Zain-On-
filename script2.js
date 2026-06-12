import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// الحصول على المعرف الثابت للمستخدم أو جلب الممرر بالرابط
const urlParams = new URLSearchParams(window.location.search);
let myUserId = urlParams.get('userId') || localStorage.getItem("zain_user_id");

if (!myUserId) {
    myUserId = "user_" + Math.random().toString(36).substring(2, 11);
    localStorage.setItem("zain_user_id", myUserId);
}

const chatContainer = document.getElementById("chatContainer");
const messageInput = document.getElementById("messageInput");
const sendMsgBtn = document.getElementById("sendMsgBtn");

// دالة رسم الفقاعات على الشاشة
function appendMessageStructure(text, sender) {
    const msgDiv = document.createElement("div");
    // التحويل للتصميم المتوافق لديك (sent للمستخدم الحالي و received للإدارة)
    msgDiv.className = `message ${sender === 'client' ? 'sent' : 'received'}`;
    msgDiv.innerHTML = `<p>${text}</p>`;
    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// الاستماع للرسائل القادمة والذهاب حياً مع السيرفر
const userChatRef = ref(db, `chats/${myUserId}`);
onValue(userChatRef, (snapshot) => {
    if (!chatContainer) return;
    chatContainer.innerHTML = "";
    if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            appendMessageStructure(data.message, data.sender);
        });
    } else {
        chatContainer.innerHTML = '<p style="text-align:center; color:#888; padding-top:20px;">ابدأ المحادثة الفورية مع الدعم الفني لمتجرنا...</p>';
    }
});

// دالة تنفيذ عملية إرسال الرسالة من العميل للسيرفر
function handleSendMessage() {
    const text = messageInput.value.trim();
    if (text === "") return;
    
    const newMessageRef = push(ref(db, `chats/${myUserId}`));
    set(newMessageRef, {
        sender: "client",
        message: text,
        timestamp: Date.now(),
        status: "sent"
    }).then(() => {
        messageInput.value = ""; 
    }).catch(err => alert("خطأ في الشبكة: " + err.message));
}

if (sendMsgBtn) sendMsgBtn.addEventListener("click", handleSendMessage);
if (messageInput) {
    messageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSendMessage();
    });
}
