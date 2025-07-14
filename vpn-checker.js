(function() {
    // 1. Проверка VPN
    function checkVPN() {
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                if (data.country && data.country !== 'RU') {
                    showHardenedBanner(data.country, data.ip);
                }
            })
            .catch(e => console.log('VPN check error:', e));
    }

    // 2. Баннер с "бронебойным" управлением
    function showHardenedBanner(country, ip) {
        // Создаём контейнер-тюрьму
        const prison = document.createElement('div');
        prison.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 99999;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        // Внутренний баннер
        prison.innerHTML = `
            <div id="vpn-banner" style="
                background: #222;
                padding: 25px;
                border-radius: 12px;
                text-align: center;
                max-width: 80%;
            ">
                <h2 style="color: #ff4444; margin-top: 0;">⚠️ VPN Обнаружен</h2>
                <p style="font-size: 16px;">IP: <b>${ip}</b><br>Страна: <b>${country}</b></p>
                <p>Отключите VPN для работы Lampa</p>
                <button id="vpn-ok-btn" 
                    tabindex="0"
                    style="
                        background: #ff3333;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        font-size: 18px;
                        border-radius: 6px;
                        margin-top: 15px;
                    ">OK</button>
            </div>
        `;

        document.body.appendChild(prison);
        const btn = document.getElementById('vpn-ok-btn');

        // 3. Фокусировка с "полировкой" для TV
        const focusButton = () => {
            btn.focus();
            btn.style.outline = '3px solid white'; // Яркий индикатор фокуса
        };

        // Первый фокус с задержкой
        setTimeout(focusButton, 300);

        // Постоянный контроль фокуса
        const focusKeeper = setInterval(focusButton, 200);

        // 4. Умное закрытие (только по OK/Enter)
        const closeBanner = () => {
            clearInterval(focusKeeper);
            prison.remove();
        };

        btn.onclick = closeBanner;
        btn.onkeydown = (e) => {
            if (e.key === 'Enter' || e.keyCode === 13) {
                closeBanner();
            }
            e.stopPropagation(); // Стопорим всплытие
        };

        // 5. Блокируем ВСЕ другие клавиши
        prison.onkeydown = (e) => {
            if (e.keyCode !== 13) { // Разрешаем только Enter
                e.preventDefault();
                e.stopPropagation();
                focusButton();
            }
        };
    }

    // Запуск после загрузки Lampa
    if (window.Lampa) {
        setTimeout(checkVPN, 1500);
    }
})();
