(function () {
    function checkVPN() {
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                if (data.country && data.country !== 'RU') {
                    showVPNBanner(data.country_name || data.country, data.ip);
                }
            })
            .catch(console.error);
    }

    function showVPNBanner(country, ip) {
        // Создаём "затемнение" под баннером (блокирует клики под ним)
        const overlay = document.createElement('div');
        overlay.style = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 9998;
        `;

        // Генерация уникальных ID
        const bannerId = 'vpn-banner-' + Date.now();
        const btnId = bannerId + '-btn';

        // Стили (добавляем !important для приоритета)
        const style = document.createElement('style');
        style.textContent = `
            #${bannerId} {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #222;
                padding: 25px;
                border-radius: 12px;
                z-index: 9999;
                color: white;
                text-align: center;
                min-width: 300px;
                box-shadow: 0 0 30px black;
            }
            #${btnId} {
                background: #f33;
                color: white;
                border: none;
                padding: 12px 24px;
                margin-top: 20px;
                border-radius: 6px;
                font-size: 18px;
                cursor: pointer;
            }
            #${btnId}:focus {
                outline: 3px solid white !important;
                background: #d22 !important;
            }
        `;

        // HTML баннера
        const bannerHTML = `
            <div id="${bannerId}">
                <h2 style="margin-top:0">⚠️ VPN Обнаружен</h2>
                <p><b>IP:</b> ${ip}<br><b>Страна:</b> ${country}</p>
                <p>Отключите VPN для работы Lampa</p>
                <button id="${btnId}">OK</button>
            </div>
        `;

        // Вставляем в DOM
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        overlay.insertAdjacentHTML('afterend', bannerHTML);

        // Фокусируем кнопку с задержкой
        setTimeout(() => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.focus();

                // Жёсткий перехват всех событий
                const handleAction = () => {
                    overlay.remove();
                    document.getElementById(bannerId).remove();
                    style.remove();
                };

                // Все возможные способы нажатия
                btn.onclick = handleAction;
                btn.onkeydown = (e) => [13, 415].includes(e.keyCode) && handleAction(); // Enter и OK
            }
        }, 300);

        // Ловушка фокуса (не даёт уйти фокусу с баннера)
        document.addEventListener('keydown', (e) => {
            if ([37, 38, 39, 40].includes(e.keyCode)) { // Стрелки
                const btn = document.getElementById(btnId);
                btn && btn.focus();
            }
        });
    }

    // Запуск после загрузки Lampa
    if (window.Lampa) {
        setTimeout(checkVPN, 1500);
    }
})();
