(function() {
    // 1. VPN Check with Fallback
    function checkVPN() {
        const fallback = () => {
            console.warn('IP API failed, using fallback');
            return { country: 'Unknown', ip: '127.0.0.1' };
        };

        Promise.race([
            fetch('https://ipapi.co/json/').then(r => r.json()),
            new Promise(resolve => setTimeout(() => resolve(fallback()), 3000))
        ])
        .then(data => {
            if (data.country !== 'RU') {
                createFortressBanner(data.country, data.ip);
            }
        })
        .catch(fallback);
    }

    // 2. Bulletproof Banner Implementation
    function createFortressBanner(country, ip) {
        // Create atomic container
        const fortress = document.createElement('div');
        fortress.id = 'vpn-fortress';
        fortress.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0,0,0,0.97) !important;
            z-index: 2147483647 !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            flex-direction: column !important;
        `;

        // Create shadow DOM for isolation
        const shadow = fortress.attachShadow({ mode: 'closed' });
        shadow.innerHTML = `
            <style>
                .banner-core {
                    background: linear-gradient(135deg, #222, #111) !important;
                    padding: 30px !important;
                    border-radius: 15px !important;
                    text-align: center !important;
                    max-width: 85% !important;
                    box-shadow: 0 0 30px black !important;
                    border: 2px solid #ff4444 !important;
                }
                .vpn-btn {
                    background: linear-gradient(to bottom, #ff3333, #dd2222) !important;
                    color: white !important;
                    border: none !important;
                    padding: 15px 30px !important;
                    font-size: 20px !important;
                    border-radius: 8px !important;
                    margin-top: 25px !important;
                    cursor: pointer !important;
                    min-width: 120px !important;
                }
                .vpn-btn:focus {
                    outline: 4px solid white !important;
                    animation: pulse 1.5s infinite !important;
                }
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.7); }
                    70% { box-shadow: 0 0 0 15px rgba(255,255,255,0); }
                    100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
                }
            </style>
            <div class="banner-core">
                <h2 style="color:#ff4444;margin-top:0;font-size:28px;">⚠️ VPN DETECTED</h2>
                <div style="font-size:18px;line-height:1.5;">
                    <p>Your IP: <b>${ip}</b></p>
                    <p>Country: <b>${country}</b></p>
                    <p style="margin-bottom:0;">Please disable VPN to continue</p>
                </div>
                <button class="vpn-btn" tabindex="0">UNDERSTOOD</button>
            </div>
        `;

        // Add to document
        document.documentElement.appendChild(fortress);

        // Focus management
        const btn = shadow.querySelector('.vpn-btn');
        let focusLock = true;

        const enforceFocus = () => {
            if (focusLock) btn.focus();
        };

        // Initial focus
        setTimeout(enforceFocus, 500);

        // Focus keeper
        const focusInterval = setInterval(enforceFocus, 300);

        // Event handlers
        btn.addEventListener('click', () => {
            focusLock = false;
            clearInterval(focusInterval);
            fortress.remove();
        });

        // TV remote control handling
        const handleKey = (e) => {
            if ([13, 415].includes(e.keyCode)) {
                e.preventDefault();
                e.stopImmediatePropagation();
                btn.click();
            }
            enforceFocus();
        };

        btn.addEventListener('keydown', handleKey);
        fortress.addEventListener('keydown', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            enforceFocus();
        });

        // System-level protection
        document.addEventListener('keydown', (e) => {
            if (document.getElementById('vpn-fortress')) {
                e.preventDefault();
                e.stopImmediatePropagation();
                enforceFocus();
            }
        }, true);

        // Visual focus indicator
        btn.addEventListener('focus', () => {
            btn.style.transform = 'scale(1.05)';
        });

        btn.addEventListener('blur', () => {
            btn.style.transform = '';
            if (focusLock) setTimeout(() => btn.focus(), 50);
        });
    }

    // 3. Init with protection
    function init() {
        if (typeof Lampa !== 'undefined') {
            setTimeout(checkVPN, 2000);
        } else {
            const observer = new MutationObserver(() => {
                if (typeof Lampa !== 'undefined') {
                    observer.disconnect();
                    setTimeout(checkVPN, 1500);
                }
            });
            observer.observe(window, { attributes: true, childList: true, subtree: true });
        }
    }

    // Start
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
