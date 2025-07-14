(function() {
    // Проверяем VPN через самый стабильный API
    function checkVPN() {
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                if (data.country && data.country !== 'RU') {
                    showBlockingBanner(data.country, data.ip);
                }
            })
            .catch(e => console.error('VPN check failed:', e));
    }

    function showBlockingBanner(country, ip) {
        // 1. Создаём "тюремный" контейнер, который перехватит ВСЁ
        const prison = document.createElement('div');
        prison.style = `
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

        // 2. Баннер с единственной кнопкой
        prison.innerHTML = `
            <div style="
                background: #222;
                padding: 25px;
                border-radius: 12px;
                text-align: center;
                max-width: 80%;
            ">
                <h2 style="color: #ff4444; margin-top: 0;">⚠️ Обнаружен VPN</h2>
                <p style="font-size: 16px;">Ваш IP: <b>${ip}</b><br>Страна: <b>${country}</b></p>
                <p>Для работы Lampa требуется отключить VPN</p>
                <button id="vpn-ok-btn" style="
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

        // 3. Жёсткий контроль фокуса и событий
        const btn = document.getElementById('vpn-ok-btn');
        
        // Принудительный фокус каждые 100 мс (на случай перехвата Lampa)
        const focusKeeper = setInterval(() => btn.focus(), 100);

        // Обработчик закрытия
        const closeBanner = () => {
            clearInterval(focusKeeper);
            prison.remove();
        };

        // Все возможные способы нажатия
        btn.onclick = closeBanner;
        btn.onkeydown = (e) => {
            if ([13, 415, 37, 38, 39, 40].includes(e.keyCode)) {
                e.stopPropagation(); // Блокируем всплытие
                closeBanner();
            }
        };

        // 4. Блокируем ВСЕ клавиши вне кнопки
        prison.onkeydown = (e) => {
            e.preventDefault();
            e.stopPropagation();
            btn.focus();
        };
    }

    // Запуск после полной загрузки
    if (window.Lampa) {
        setTimeout(checkVPN, 2000);
    } else {
        document.addEventListener('DOMContentLoaded', checkVPN);
    }
})();
