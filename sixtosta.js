// jQuery Check (jQuery load if not loaded, then run jQuery code)
if (typeof jQuery === 'undefined') {
    console.error('jQuery not loaded! <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script> please load');
} else {
    // Fake data arrays (Indian names, amounts in Taka; customize as needed)
    var fakeUsers = ['Rahul Kumar', 'Priya Singh', 'Amit Verma', 'Sonali Das', 'Rajesh Khan', 'Mita Roy', 'Sumon Ahmed', 'Riya Sharma'];
    var fakeAmounts = [500.00, 1200.50, 750.00, 2000.00, 300.75, 1500.00, 800.25, 950.00];
    var fakeBanks = [' SBI Account', ' HDFC Bank', ' ICICI Account', ' Axis Bank', ' PNB Account', ' BOB Bank', ' Kotak Bank'];

    var currentIndex = 0; // Current index for cycle
    var autoCloseTimer; // Auto-close timer
    var toastsEnabled = true; // Flag to control if toasts should continue showing (resets on page reload)

    // CSS Styles (3D raised toast notification)
    function injectStyles() {
        var style = document.createElement('style');
        style.textContent = `
            body {
                margin: 0;
                padding: 0;
                font-family: 'Arial', sans-serif;
                background: transparent;
            }

            /* 3D raised toast notification */
            .toast-notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 250px;
                background: red; /* Red color theme */
                border-radius: 25px; /* Rounded corners */
                padding: 12px;
                text-align: center;
                box-shadow: 
                    0 8px 20px rgba(0, 0, 0, 0.12), /* Outer shadow for depth */
                    0 4px 8px rgba(0, 0, 0, 0.08),  /* Medium shadow */
                    0 2px 4px rgba(0, 0, 0, 0.04),  /* Inner shadow */
                    inset 0 1px 0 rgba(255, 255, 255, 0.8), /* Inner highlight for 3D */
                    inset 0 -1px 0 rgba(0, 0, 0, 0.05); /* Inner bottom shadow */
                border: 1px solid #ff5252; /* Border matching theme */
                display: none;
                z-index: 10000;
                animation: toastSlideIn 0.5s ease-out;
                overflow: hidden;
                pointer-events: auto;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                position: relative; /* For positioning close button */
            }

            .toast-content {
                position: relative;
                width: 100%;
                height: 100%;
            }

            .toast-content::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent); /* Shine effect */
                transform: rotate(45deg);
                animation: shinePulse 2s infinite;
                border-radius: 25px; /* Rounded shine */
            }

            .money-icon-toast {
                font-size: 16px;
                color: aqua; 
                margin-bottom: 5px;
                animation: bounceMoney 1.5s infinite;
                text-shadow: 0 1px 2px rgba(0,0,0,0.3); /* Text shadow for visibility */
                z-index: 1;
            }

            .toast-message {
                font-size: 12px;
                color: #000; /* Black text */
                font-weight: bold; /* Bold text */
                line-height: 1.3;
                background: #ffffff; /* White background for message */
                padding: 8px;
                border-radius: 15px; /* Rounded message box */
                box-shadow: inset 0 1px 2px rgba(0,0,0,0.05); /* Inner 3D for message */
                margin: 0;
                max-width: 220px; /* Limit width */
                word-wrap: break-word;
                z-index: 1;
            }

            /* Close button styles */
            .close-btn {
                position: absolute;
                top: 5px;
                right: 8px;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 16px;
                color: white;
                cursor: pointer;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2;
                transition: background 0.3s ease;
            }

            .close-btn:hover {
                background: rgba(255, 255, 255, 0.4);
                transform: scale(1.1);
            }

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
                0%, 100% { opacity: 0; transform: translateX(-100%) translateY(-100%) rotate(45deg); }
                50% { opacity: 1; transform: translateX(100%) translateY(100%) rotate(45deg); }
            }

            @keyframes bounceMoney {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-3px); }
                60% { transform: translateY(-2px); }
            }

            @media (max-width: 480px) {
                .toast-notification {
                    width: 220px;
                    right: 10px;
                    bottom: 10px;
                    padding: 10px;
                    border-radius: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // HTML Structure (with close button added)
    function injectHTML() {
        var toastDiv = document.createElement('div');
        toastDiv.id = 'toast-notification';
        toastDiv.className = 'toast-notification';
        
        // Close button
        var closeBtn = document.createElement('button');
        closeBtn.innerHTML = '';
        closeBtn.className = 'close-btn';
        
        var contentDiv = document.createElement('div');
        contentDiv.className = 'toast-content';
        
        var iconDiv = document.createElement('div');
        iconDiv.id = 'toast-icon';
        iconDiv.className = 'money-icon-toast';
        iconDiv.innerHTML = '<b>RECENT WITHDRAWAL</b>'; // Fixed spelling
        
        var messageDiv = document.createElement('div');
        messageDiv.id = 'toast-message';
        messageDiv.className = 'toast-message';
        
        contentDiv.appendChild(iconDiv);
        contentDiv.appendChild(messageDiv);
        toastDiv.appendChild(closeBtn); // Add close button to toast
        toastDiv.appendChild(contentDiv);
        
        document.body.appendChild(toastDiv);
    }

    // Generate random notification message (amounts in Taka; customize currency/banks)
    function generateRandomNotification() {
        var userName = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
        var amount = fakeAmounts[Math.floor(Math.random() * fakeAmounts.length)];
        var bank = fakeBanks[Math.floor(Math.random() * fakeBanks.length)];

        return 'User ' + userName + ' ' + amount + ' Taka withdraw in ' + bank + ' !'; // Added ! for excitement; Taka/INR as needed
    }

    function showToast() {
        if (!toastsEnabled) return; // Stop if disabled

        var message = generateRandomNotification();
        $('#toast-message').text(message);
        $('#toast-notification').fadeIn(300);

        // Auto-close after 5 seconds
        autoCloseTimer = setTimeout(function() {
            closeAndNextToast();
        }, 5000);
    }

    function closeAndNextToast() {
        clearTimeout(autoCloseTimer);
        $('#toast-notification').fadeOut(300, function() {
            currentIndex++;
            // Cycle 10 times if enabled (infinite loop if needed, but limited here)
            if (currentIndex < 10 && toastsEnabled) {
                setTimeout(showToast, 500); // 0.5 sec delay between toasts
            }
        });
    }

    // Close button click handler (closes current and disables all future toasts for current session only)
    $(document).on('click', '.close-btn', function() {
        clearTimeout(autoCloseTimer);
        $('#toast-notification').fadeOut(300);
        toastsEnabled = false; // Disable all future toasts (resets on page reload)
        currentIndex = 10; // Stop cycle
        console.log('Notifications disabled by user close.'); // Optional log
    });

    // Optional: Report button logic (if added later; for now, close stops everything)
    // If you want a report button to reset and allow future toasts, add similar structure.
    // For example, add a report button and on click: toastsEnabled = true; currentIndex = 0; setTimeout(showToast, 10000); // Resume after 10s

    // Initialize on document ready
    $(document).ready(function() {
        injectStyles();
        injectHTML();
        // Start first toast after 1 second delay
        setTimeout(showToast, 1000);
    });
}
