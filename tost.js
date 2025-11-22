(function(global, $) {
    // CSS Inject
    var css = `
.toast-notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 250px;
    background: red;
    border-radius: 25px;
    padding: 12px;
    text-align: center;
    box-shadow: 0 8px 20px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.05);
    border: 1px solid #ff5252;
    display: none;
    z-index: 10000;
    animation: toastSlideIn 0.5s ease-out;
    overflow: hidden;
    pointer-events: auto;
}
.toast-content {
    position: relative;
}
.toast-content::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent);
    transform: rotate(45deg);
    animation: shinePulse 2s infinite;
    border-radius: 25px;
    pointer-events:none;
}
.money-icon-toast {
    font-size: 16px;
    color: aqua;
    margin-bottom: 5px;
    animation: bounceMoney 1.5s infinite;
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}
.toast-message {
    font-size: 12px;
    color: #000;
    font-weight: bold;
    line-height: 1.3;
    background: #fff;
    padding: 8px;
    border-radius: 15px;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
    margin: 0;
}
.toast-close {
    position: absolute;
    top: 0;      /* একদম উপরের */
    right: 0;    /* একদম ডানদিকের কোণে */
    padding: 4px 8px;
    font-size: 18px;
    color: #fff;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 10;
    line-height: 1;
    font-weight: bold;
    transition: color 0.2s;
}
.toast-close:hover { color: #f8bbbb; }
@keyframes toastSlideIn {
    from {
        transform: translateX(100%) translateY(20px) scale(0.95);
        opacity: 0;
        border-radius: 55px;
    }
    to {
        transform: translateX(0) translateY(0) scale(1);
        opacity: 1;
        border-radius: 25px;
    }
}
@keyframes shinePulse {
    0%,100% { opacity: 0; transform: translateX(-100%) translateY(-100%) rotate(45deg);}
    50% { opacity: 1; transform: translateX(100%) translateY(100%) rotate(45deg);}
}
@keyframes bounceMoney {
    0%,20%,50%,80%,100% { transform: translateY(0);}
    40% { transform: translateY(-3px);}
    60% { transform: translateY(-2px);}
}
@media (max-width: 480px) {
    .toast-notification { width: 220px; right: 10px; bottom: 10px; padding: 10px; border-radius: 20px;}
}`;
    if(!document.getElementById('toast-style')) {
        var style = document.createElement('style');
        style.id = 'toast-style';
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    // অডিও লোড (free cash register sound)
    var toastAudio = new Audio('https://indianehub.store/song/bumba.mp3');

    // Toast HTML inject
    var toastHtml = `
<div id="toast-notification" class="toast-notification">
    <div class="toast-content">
        <button class="toast-close" title="[translate:বন্ধ করুন]">&times;</button>
        <div id="toast-icon" class="money-icon-toast"><b>RECENT WITHDRALL</b></div>
        <div id="toast-message" class="toast-message"></div>
    </div>
</div>`;
    if(!document.getElementById('toast-notification')) {
        var div = document.createElement('div');
        div.innerHTML = toastHtml.trim();
        document.body.appendChild(div.firstChild);
    }

        var fakeUsers = ['রাহুল কুমার', 'প্রিয়া সিং', 'অমিত বর্মা', 'সোনালী দাস', 'রাজেশ খান', 'মিতা রায়', 'সুমন আহমেদ', 'রিয়া শর্মা'];
    var fakeAmounts = [500.00, 1200.50, 750.00, 2000.00, 300.75, 1500.00, 800.25, 950.00];
    var fakeBanks = ['🌈 SBI অ্যাকাউন্ট', '💎 HDFC ব্যাংক', '🔥 ICICI অ্যাকাউন্ট', '⭐ Axis Bank', '💰 PNB অ্যাকাউন্ট', '✨ BOB ব্যাংক', '🌟 Kotak ব্যাংক'];
    var currentIndex = 0;
    var autoCloseTimer = null;

    function generateRandomNotification() {
        var userName = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
        var amount = fakeAmounts[Math.floor(Math.random() * fakeAmounts.length)];
        var bank = fakeBanks[Math.floor(Math.random() * fakeBanks.length)];
        return [translate:'ইউজার '] + userName + ' ' + amount + [translate:' টাকা তুলেছে '] + bank + '-এ।';
    }

    function showToast() {
        var message = generateRandomNotification();
        $('#toast-message').text(message);
        $('#toast-notification').fadeIn(300);

        // প্লে সাউন্ড
        toastAudio.currentTime = 0;
        toastAudio.play();

        autoCloseTimer = setTimeout(function() {
            closeAndNextToast();
        }, 5000);
    }

    function closeAndNextToast() {
        clearTimeout(autoCloseTimer);
        $('#toast-notification').fadeOut(300, function() {
            currentIndex++;
            if (currentIndex < 10) {
                setTimeout(showToast, 500);
            }
        });
    }

    // ক্লোজ বাটন ইভেন্ট
    $(document).on('click', '.toast-close', function() {
        clearTimeout(autoCloseTimer);
        $('#toast-notification').fadeOut(200);
    });

    // পাবলিক সিলেক্টেবল স্টার্ট ফাংশন
    global.ToastNotification = {
        start: function() {
            currentIndex = 0;
            setTimeout(showToast, 1000);
        }
    };

    $(document).ready(function() {
        // স্বয়ংক্রিয় শুরু
        global.ToastNotification.start();
    });
})(window, jQuery);
