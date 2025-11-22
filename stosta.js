// jQuery  (   ,     jQuery  )
if (typeof jQuery === 'undefined') {
    console.error('jQuery ! <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>  ');
} else {
    //    (  )
    var fakeUsers = ['Rahul Kumar', 'Priya Singh', 'Amit Verma', 'Sonali Das', 'Rajesh Khan', 'Mita Roy', 'Sumon Ahmed', 'Riya Sharma'];
    var fakeAmounts = [500.00, 1200.50, 750.00, 2000.00, 300.75, 1500.00, 800.25, 950.00];
    var fakeBanks = [' SBI Account', ' HDFC Bank', ' ICICI Account', ' Axis Bank', ' PNB Account', ' BOB Bank', ' Kotak Bank'];

    var currentIndex = 0; //  
    var autoCloseTimer; // - 

    // CSS  (  ,   )
    function injectStyles() {
        var style = document.createElement('style');
        style.textContent = `
            body {
                margin: 0;
                padding: 0;
                font-family: 'Arial', sans-serif;
                background: transparent;
            }

            /* 3D       ( ) */
            .toast-notification {
                position: fixed;
                top: 50%; /*   */
                left: 50%; /*   */
                transform: translate(-50%, -50%); /*   */
                width: 250px;
                background: red; /*    */
                border-radius: 25px; /*   */
                padding: 12px;
                text-align: center;
                box-shadow: 
                    0 8px 20px rgba(0, 0, 0, 0.12), /*      */
                    0 4px 8px rgba(0, 0, 0, 0.08),  /*   */
                    0 2px 4px rgba(0, 0, 0, 0.04),  /*   */
                    inset 0 1px 0 rgba(255, 255, 255, 0.8), /*   3D-  */
                    inset 0 -1px 0 rgba(0, 0, 0, 0.05); /*    */
                border: 1px solid #ff5252; /*    */
                display: none;
                z-index: 10000;
                animation: toastSlideIn 0.5s ease-out;
                overflow: hidden;
                pointer-events: auto;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
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
                background: linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent); /*   */
                transform: rotate(45deg);
                animation: shinePulse 2s infinite;
                border-radius: 25px; /*    */
            }

            .money-icon-toast {
                font-size: 16px;
                color: aqua; 
                margin-bottom: 5px;
                animation: bounceMoney 1.5s infinite;
                text-shadow: 0 1px 2px rgba(0,0,0,0.3); /*    */
                z-index: 1;
            }

            .toast-message {
                font-size: 12px;
                color: #000; /*   */
                font-weight: bold; /*     */
                line-height: 1.3;
                background: #ffffff; /*     */
                padding: 8px;
                border-radius: 15px; /*   */
                box-shadow: inset 0 1px 2px rgba(0,0,0,0.05); /*   3D */
                margin: 0;
                max-width: 220px; /*     */
                word-wrap: break-word;
                z-index: 1;
            }

            @keyframes toastSlideIn {
                from {
                    transform: translate(-50%, -50%) translateY(20px) scale(0.95); /*      */
                    opacity: 0;
                    border-radius: 55px;
                }
                to {
                    transform: translate(-50%, -50%) scale(1); /*    */
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
                    padding: 10px;
                    border-radius: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // HTML  (  )
    function injectHTML() {
        var toastDiv = document.createElement('div');
        toastDiv.id = 'toast-notification';
        toastDiv.className = 'toast-notification';
        
        var contentDiv = document.createElement('div');
        contentDiv.className = 'toast-content';
        
        var iconDiv = document.createElement('div');
        iconDiv.id = 'toast-icon';
        iconDiv.className = 'money-icon-toast';
        iconDiv.innerHTML = '<b>RECENT WITHDRALL</b>'; //   
        
        var messageDiv = document.createElement('div');
        messageDiv.id = 'toast-message';
        messageDiv.className = 'toast-message';
        
        contentDiv.appendChild(iconDiv);
        contentDiv.appendChild(messageDiv);
        toastDiv.appendChild(contentDiv);
        
        document.body.appendChild(toastDiv);
    }

    //   ( )
    function generateRandomNotification() {
        var userName = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
        var amount = fakeAmounts[Math.floor(Math.random() * fakeAmounts.length)];
        var bank = fakeBanks[Math.floor(Math.random() * fakeBanks.length)];

        return 'User ' + userName + ' ' + amount + ' Taka withdraw in ' + bank + '-';
    }

    function showToast() {
        var message = generateRandomNotification();
        $('#toast-message').text(message);
        $('#toast-notification').fadeIn(300);

        // -   
        autoCloseTimer = setTimeout(function() {
            closeAndNextToast();
        }, 5000);
    }

    function closeAndNextToast() {
        clearTimeout(autoCloseTimer);
        $('#toast-notification').fadeOut(300, function() {
            currentIndex++;
            //    (infinite  if )
            if (currentIndex < 10) {
                setTimeout(showToast, 500); // .   
            }
        });
    }

    //  (  )
    $(document).ready(function() {
        injectStyles();
        injectHTML();
        //   
        setTimeout(showToast, 1000); //    
    });
}
