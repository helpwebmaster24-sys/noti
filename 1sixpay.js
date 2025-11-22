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
    top: 1px;    /* বা 0px, প্রয়োজনে সামঞ্জস্য করুন */
    right: 1px;  /* বা 0px, প্রয়োজনে সামঞ্জস্য করুন */
    font-size: 18px;
    color: #fff;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 2;
    line-height: 0.9;
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

    // Toast HTML inject
    var toastHtml = `
<div id="toast-notification" class="toast-notification">
    <div class="toast-content">
        <button class="toast-close" title="বন্ধ করুন">&times;</button>
        <div id="toast-icon" class="money-icon-toast"><b>RECENT WITHDRALL</b></div>
        <div id="toast-message" class="toast-message"></div>
    </div>
</div>`;
    if(!document.getElementById('toast-notification')) {
        var div = document.createElement('div');
        div.innerHTML = toastHtml.trim();
        document.body.appendChild(div.firstChild);
    }

    var fakeUsers = ['Rahul Kumar', 'Priya Singh', 'Amit Verma', 'Sonali Das', 'Rajesh Khan', 'Mita Roy', 'Sumon Ahmed', 'Riya Sharma'];
    var fakeAmounts = [2034.00, 3821, 4567, 2478, 4999, 2190, 3021, 4245, 3876, 2133, 4321, 3955, 2784, 4832, 2651, 4175, 3322, 4719, 2598, 4640, 2987, 3045, 4399, 2172, 4252, 3819, 2254, 4945, 3601, 2691, 4522, 3704, 2487, 4603, 2910, 4350, 3370, 2832, 4372, 2509, 4870, 3218, 2975, 4921, 3055, 3487, 4699, 2798, 4420, 3190, 2560, 4205, 3928, 2195, 4899, 3567, 2718, 4109, 3789, 2301, 4815, 2999, 4599, 3427, 2897, 4750, 2630, 4098, 3120, 2519, 4275, 3850, 2237, 4975, 3688, 2829, 4315, 3475, 2902, 4780, 2687, 4122, 3201, 2471, 4300, 3999, 2155, 4839, 3768, 2769, 4255, 3590, 2990, 4765, 3237, 2740, 4390, 3175, 2590, 4111, 3833, 2299, 4900.];
    var fakeBanks = ['UPI', '🌈 SBI অ্যাকাউন্ট', '💎 HDFC ব্যাংক', '🔥 ICICI অ্যাকাউন্ট', '⭐ Axis Bank', '💰 PNB অ্যাকাউন্ট', '✨ BOB ব্যাংক', '🌟 Kotak ব্যাংক'];

    var currentIndex = 0;
    var autoCloseTimer = null;

    function generateRandomNotification() {
        var userName = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
        var amount = fakeAmounts[Math.floor(Math.random() * fakeAmounts.length)];
        var bank = fakeBanks[Math.floor(Math.random() * fakeBanks.length)];
        return 'ইউজার ' + userName + ' ' + amount + ' টাকা তুলেছে ' + bank + '-এ।';
    }

    function showToast() {
        var message = generateRandomNotification();
        $('#toast-message').text(message);
        $('#toast-notification').fadeIn(300);

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

    // Cross-BTN Event
    $(document).on('click', '.toast-close', function() {
        clearTimeout(autoCloseTimer);
        $('#toast-notification').fadeOut(200);
    });

    // Public - restart method if needed
    global.ToastNotification = {
        start: function() {
            currentIndex = 0;
            setTimeout(showToast, 1000);
        }
    };

    $(document).ready(function() {
        // শুরু স্বয়ংক্রিয়ভাবে
        global.ToastNotification.start();
    });
})(window, jQuery);
