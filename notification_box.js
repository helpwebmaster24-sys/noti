// notification_box.js - ব্যাকএন্ড-কন্ট্রোলড নোটিফিকেশন বক্স
document.addEventListener('DOMContentLoaded', function() {
    const serverUrl = 'https://ptc.indianehub.store/get_notifications.php'; // আপনার get_notifications.php URL দিন
    let unreadCount = 0;

    // স্টাইল ইনজেক্ট করুন
    const style = document.createElement('style');
    style.textContent = `
        #notificationBell { position: fixed; top: 20px; right: 20px; z-index: 1000; cursor: pointer; }
        #notificationBell span { font-size: 24px; color: #333; }
        #unreadDot { position: absolute; top: -5px; right: -5px; background: red; color: white; border-radius: 50%; width: 18px; height: 18px; text-align: center; font-size: 12px; display: none; }
        #notificationBox { display: none; position: fixed; top: 60px; right: 20px; width: 300px; max-height: 400px; overflow-y: auto; background: white; border: 1px solid #ddd; box-shadow: 0 4px 8px rgba(0,0,0,0.1); z-index: 999; border-radius: 8px; font-family: Arial, sans-serif; }
        #notificationBox::before { content: ''; position: absolute; top: -10px; right: 20px; border: 10px solid transparent; border-bottom-color: white; }
        #notificationBox > div:first-child { padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; }
        .notif-item { padding: 10px; border-bottom: 1px solid #f0f0f0; cursor: pointer; }
        .notif-item:hover { background: #f8f9fa; }
        .notif-item.unread { background: #f8f9fa; }
        .notif-title { font-weight: bold; color: #007bff; margin-bottom: 5px; }
        .notif-message { margin-bottom: 5px; }
        .notif-amount { color: green; font-weight: bold; margin-bottom: 5px; }
        .notif-time { font-size: 12px; color: #999; }
    `;
    document.head.appendChild(style);

    // বেল আইকন তৈরি করুন
    const bell = document.createElement('div');
    bell.id = 'notificationBell';
    bell.innerHTML = `
        <span>🔔</span>
        <span id="unreadDot">0</span>
    `;
    document.body.appendChild(bell);

    // নোটিফিকেশন বক্স তৈরি করুন
    const box = document.createElement('div');
    box.id = 'notificationBox';
    box.innerHTML = '<div>নোটিফিকেশন</div><div id="notificationList"></div>';
    document.body.appendChild(box);

    function loadNotifications() {
        fetch(serverUrl)
            .then(response => response.json())
            .then(data => {
                const list = document.getElementById('notificationList');
                list.innerHTML = '';
                unreadCount = 0;
                data.forEach(notif => {
                    const item = document.createElement('div');
                    item.className = `notif-item ${!notif.is_read ? 'unread' : ''}`;
                    item.innerHTML = `
                        <div class="notif-title">${notif.title || 'নতুন নোটিফিকেশন'}</div>
                        <div class="notif-message">${notif.message}</div>
                        ${notif.amount > 0 ? `<div class="notif-amount">₹${notif.amount}</div>` : ''}
                        <div class="notif-time">${new Date(notif.created_at).toLocaleString('bn-BD')}</div>
                    `;
                    item.addEventListener('click', () => {
                        if (!notif.is_read) {
                            unreadCount--;
                            updateDot();
                            // রিড মার্ক করুন (অপশনাল: ব্যাকএন্ড কল)
                            fetch(`https://yourdomain.com/mark_read.php?id=${notif.id}`, { method: 'POST' }).catch(console.error);
                        }
                        box.style.display = 'none';
                    });
                    list.appendChild(item);
                    if (!notif.is_read) unreadCount++;
                });
                updateDot();
            })
            .catch(error => console.error('নোটিফিকেশন লোড এরর:', error));
    }

    function updateDot() {
        const dot = document.getElementById('unreadDot');
        if (unreadCount > 0) {
            dot.style.display = 'inline';
            dot.textContent = unreadCount > 99 ? '99+' : unreadCount;
        } else {
            dot.style.display = 'none';
        }
    }

    // বেল ক্লিক ইভেন্ট
    bell.addEventListener('click', () => {
        const isVisible = box.style.display === 'block';
        box.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) loadNotifications();
    });

    // বাইরে ক্লিক করে বক্স বন্ধ করুন
    document.addEventListener('click', (e) => {
        if (!bell.contains(e.target) && !box.contains(e.target)) {
            box.style.display = 'none';
        }
    });

    // প্রথম লোড এবং আপডেট
    loadNotifications();
    setInterval(loadNotifications, 30000); // 30 সেকেন্ডে আপডেট
});
