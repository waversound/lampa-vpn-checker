(function () {
    function checkVPN() {
        fetch('http://ip-api.com/json/?fields=status,country,countryCode,query')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    if (data.countryCode !== 'RU') {
                        showVPNBanner(data.country, data.query);
                    }
                }
            })
            .catch(error => {
                console.log('[VPN Plugin] Ошибка получения IP-информации:', error);
            });
    }

    function showVPNBanner(country, ip) {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, -40%); }
                to { opacity: 1; transform: translate(-50%, -50%); }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: translate(-50%, -50%); }
                to { opacity: 0; transform: translate(-50%, -40%); }
            }
            .vpn-warning-banner {
                position: fixed;
                top: 50%;
                left: 50%;
                background: rgba(30,30,30,0.95);
                padding: 20px 25px;
                border-radius: 16px;
                z-index: 9999;
                text-align: center;
                color: #fff;
                box-shadow: 0 0 20px rgba(0,0,0,0.5);
                max-width: 90%;
                opacity: 0;
                animation: fadeIn 0.4s forwards;
                font-family: Arial, sans-serif;
            }
            .vpn-banner-close {
                padding: 10px 20px;
                background: #ff4444;
                color: #fff;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            .vpn-banner-close:hover {
                background-color: #cc3333;
            }
        `;
        document.head.appendChild(style);

        const html = `
            <div class="vpn-warning-banner">
                <div style="font-size: 24px; margin-bottom: 10px;">
                    ⚠️ VPN Обнаружен
                </div>
                <div style="font-size: 16px; margin-bottom: 20px;">
                    🛡️ Ваш IP: <b>${ip}</b><br>
                    Страна: <b>${country}</b><br>
                    Отключите VPN для стабильной работы Lampa.
                </div>
                <button class="vpn-banner-close">Ок</button>
            </div>
        `;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        document.body.appendChild(wrapper);

        const banner = wrapper.querySelector('.vpn-warning-banner');
        const btn = wrapper.querySelector('.vpn-banner-close');

        // Фокус на кнопке «Ок»
        btn.focus();

        btn.addEventListener('click', () => {
            banner.style.animation = 'fadeOut 0.4s forwards';
            banner.addEventListener('animationend', () => {
                wrapper.remove();
                style.remove();
            });
        });
    }

    if (window.Lampa) {
        checkVPN();
    } else {
        console.log('[VPN Plugin] Lampa не загружена');
    }
})();
