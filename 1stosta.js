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
    top: 0px;
    right: 0px;
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
        <div id="toast-icon" class="money-icon-toast"><b>LIVE CASH WITHDRAWAL</b></div>
        <div id="toast-message" class="toast-message"></div>
    </div>
</div>`;
    if(!document.getElementById('toast-notification')) {
        var div = document.createElement('div');
        div.innerHTML = toastHtml.trim();
        document.body.appendChild(div.firstChild);
    }

    var fakeUsers = ['অরিজিত', 'রাহুল', 'অমিত', 'সমীর', 'অনুজ', 'দীপক', 'তুষার', 'বিক্রম', 'শুভ', 'অর্জুন', 'রাহুল কুমার', 'প্রিয়া সিং', 'অমিত বর্মা', 'সোনালী দাস', 'রাজেশ খান', 'মিতা রায়', 'সুমন আহমেদ', 'রিয়া শর্মা', 'অভিরূপা', 'অদ্রিজা', 'অহিরি', 'অন্বেষা', 'অরাত্রিকা', 'অগ্নিজা', 'আলোকিকা', 'অমৃতেশ্বরী', 'আর্চিশ্মিতা', 'অর্পিতা', 'ভাস্বতী', 'ভাবিনী', 'বিদিশা', 'বিষ্বাখা', 'বোধিসত্তিকা', 'চারুলতা', 'চন্দ্রবলি', 'চিন্ময়ী', 'চিতর্ক্ষী', 'দেবজানী', 'দীপাঞ্জলি', 'দুর্গেশ্বরী', 'একপর্ণা', 'ঈশা', 'হরিপ্রিয়া', 'হেমলিকা', 'হেমপ্রভা', 'ইন্দ্রাণী', 'ঈশিকা', 'জাহ্নবী', 'জয়শ্রী', 'জয়তী', 'কমলিকা', 'কৌশিকী', 'কেয়া', 'কৃত্তিকা', 'লাবণিকা', 'লোহিতা', 'মহাদেবী', 'মহাশ্বেতা', 'মৈত্রেয়ী', 'মালবীকা', 'মানিমালা', 'মীনাক্ষী', 'মিথিলা', 'মৃন্ময়ী', 'নম্রতা', 'নন্দিনী', 'নিহারিকা', 'পদ্মাপ্রিয়া', 'পরিণীতা', 'পার্বতী', 'পিয়াল', 'প্রভাবতী', 'প্রজ্ঞাপারমিতা', 'প্রণতি', 'রাধিকা', 'রঞ্জিনী', 'রসিকা', 'রীত্বিকা', 'রূপাঞ্জনা', 'রূপশ্রী', 'সাহেলী', 'সার্বাণী', 'শার্বাণী', 'শরিণী', 'সত্যভামা', 'সায়ন্তিকা', 'শৈলী', 'শত্রুপা', 'শোভনা', 'শুক্তিনী', 'শ্যামলী', 'শ্রীলতা', 'শ্রিজনী', 'সুচরিতা', 'সুদেশনা', 'সুকন্যা', 'সুন্দরী', 'স্বর্ণলতা', 'তামালিকা', 'তনিরিকা', 'তপতী', 'তিলোত্তমা', 'ত্রিনয়নী', 'তৃষা', 'ত্রিপর্ণা', 'উদীপ্তি', 'উমিকা', 'উৎপলা', 'বৈদেহী', 'বাসুন্ধরা', 'বেদাবতী', 'বিভা', 'বিদুলা', 'বিশালাক্ষী', 'যমিনী', 'যশোধারা', 'যশিকা', 'জারিনী'];
    var fakeAmounts = [2500.00, 2200.50, 2750.00, 2000.00, 2800.75, 2500.70, 1800.25, 1950.00, 2500.00, 4200.50, 3550.00, 6700.00, 5800.75, 7500.70, 7900.25, 4950.00, 2800.70, 3800.25, 2000.45, 2401.90, 2832.75, 2150.10, 3650.55, 2900.40, 3122.85, 4987.60, 3540.25, 2701.80, 3100.50, 2255.95, 2950.75, 4233.20, 4800.35, 4502.10, 3980.65, 2635.20, 2777.85, 3220.90, 4111.40, 3702.75, 3455.30, 3655.55, 2800.95, 2955.60, 3822.40, 3120.25, 3400.75, 3677.85, 2922.10, 3310.65, 3730.55, 2975.90, 4080.25, 4190.15, 3333.70, 2700.40, 2905.45, 4500.20, 4377.80, 2555.15, 3100.95, 3322.50, 2800.35, 2985.45, 3450.25, 3202.80, 3277.90, 2855.15, 2901.75, 3000.60, 4000.45, 3880.95, 2333.80, 2775.10, 2950.55, 3650.70, 3800.25, 3540.15, 3200.80, 4300.35, 4100.55, 3750.45, 2990.25, 2675.40, 2530.15, 3120.45, 2840.95, 2630.55, 2980.35, 3350.10, 3477.80, 3122.50, 2633.40, 2800.95, 2950.75, 4001.35, 3700.25, 3600.40, 3800.85, 3422.10, 2950.35, 3300.75, 3102.60, 3450.10, 2850.45, 3000.85, 2587.75, 2750.40, 3750.55, 3600.35, 3280.15, 4000.25, 4500.90, 2600.35, 2750.40, 2900.90, 3100.85];
    var fakeBanks = ['​💲​ UPI', '🏛️​ Airtel Payment Bank', '💰 SBI অ্যাকাউন্ট', '💎 HDFC ব্যাংক', '🔥 ICICI অ্যাকাউন্ট', '⭐ Axis Bank', '💰 PNB অ্যাকাউন্ট', '✨ BOB ব্যাংক', '🌟 Kotak ব্যাংক'];

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
        }, 9000);
    }

    function closeAndNextToast() {
        clearTimeout(autoCloseTimer);
        $('#toast-notification').fadeOut(300, function() {
            currentIndex++;
            if (currentIndex < 100) {
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
