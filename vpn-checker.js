(function () {
    // Проверяем IP через максимально простой и надежный API
    function checkVPN() {
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                if (data.country && data.country !== 'RU') {
                    showVPNBanner(data.country_name || data.country, data.ip);
                }
            })
            .catch(error => {
                console.log('[VPN Plugin] Ошибка при проверке IP:', error);
            });
    }

    // Показываем баннер с TV-совместимым управлением
    function showVPNBanner(country, ip) {
        const bannerId = 'vpn-warning-banner-' + Date.now();
        const style = document.createElement('style');
        style.textContent = `
            #${bannerId} {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.9);
                padding: 20px;
                border-radius: 10px;
                z-index: 99999;
                color: white;
                text-align: center;
                max-width: 80%;
                box-shadow: 0 0 15px rgba(0,0,0,0.5);
            }
            #${bannerId} button {
                background: #ff3333;
                color: white;
                border: none;
                padding: 10px 20px;
                margin-top: 15px;
                border-radius: 5px;
                font-size: 16px;
            }
            #${bannerId} button:focus {
                outline: 2px solid white;
            }
        `;
        document.head.appendChild(style);

        const bannerHTML = `
            <div id="${bannerId}">
                <h3>⚠️ Обнаружен VPN</h3>
                <p>Ваш IP: ${ip}<br>Страна: ${country}</p>
                <p>Для работы Lampa требуется отключить VPN</p>
                <button id="${bannerId}-btn">OK</button>
            </div>
        `;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = bannerHTML;
        document.body.appendChild(wrapper);

        // Фокусируем кнопку с задержкой (важно для TV)
        setTimeout(() => {
            const btn = document.getElementById(`${bannerId}-btn`);
            if (btn) {
                btn.focus();
                
                // Обработчики для клика и нажатия Enter
                btn.addEventListener('click', () => removeBanner());
                btn.addEventListener('keydown', (e) => {
                    if (e.keyCode === 13 || e.key === 'Enter') removeBanner();
                });
            }
        }, 300);

        function removeBanner() {
            wrapper.remove();
            style.remove();
        }
    }

    // Запускаем проверку после загрузки Lampa
    if (window.Lampa) {
        setTimeout(checkVPN, 2000); // Даем Lampa полностью загрузиться
    } else {
        console.log('[VPN Plugin] Lampa не обнаружена');
    }
})();
